// @flow
import Immutable from 'immutable';
import type {RecordFactory, RecordOf} from 'immutable';
import {enumerate} from './utils';

const pattern = /(\?|:|\|\||&&|==|!=|>=|>|<=|<|%|\d+|n)/g;

export type PluralForm = (number) => number;
type Test = (number) => boolean;
type Tokens = Immutable.List<string>;

export default function compile(pluralform: string): PluralForm {
  if (pluralform === '0') {
    return n => 0;
  } else if (pluralform.indexOf('?') === -1) {
    pluralform += '?1:0';
  }
  return compile_expression(pluralform);
}

function compile_expression(s: string): PluralForm {
  const tokens = tokenize(s);
  if (tokens.contains('?')) {
    return ternary_expression(tokens);
  } else {
    return const_expression(tokens);
  }
}

function const_expression(tokens: Tokens): PluralForm {
  if (tokens.size === 0) {
    throw new Error('Got nothing instead of constant');
  } else if (tokens.size !== 1) {
    throw new Error(`Invalid constant: ${tokens.join('')}`)
  }
  const num = int(tokens.get(0));
  return n => num;
}

function ternary_expression(tokens: Tokens): PluralForm {
  const [left, right]: [Tokens, Tokens] = split_tokens(tokens, '?');
  const test = compile_test(left.join(''));
  const expressions = tokenize(right.join(''));
  const [left2, right2] = split_tokens(expressions, ':');
  const true_action = compile_expression(left2.join(''));
  const false_action = compile_expression(right2.join(''));
  return n => test(n) ? true_action(n) : false_action(n);
}

type TokenDefinitionProps = {
  op: string,
  builder: (Tokens) => Test
};
const makeTokenDefinition: RecordFactory<TokenDefinitionProps> = Immutable.Record({
  op: '',
  builder: (tokens: Tokens) => (n: number) => false
});
type TokenDefinition = RecordOf<TokenDefinitionProps>;

type EqTestBuilder = (num: number, flipped: boolean) => Test

function or_test(tokens: Tokens): Test {
  return _logic_test(tokens, '||', (left: Test, right: Test) => (n: number) => left(n) || right(n));
}

function and_test(tokens: Tokens): Test {
  return _logic_test(tokens, '&&', (left: Test, right: Test) => (n: number) => left(n) && right(n));
}

function eq_test(tokens: Tokens): Test {
  return _equality(tokens, '==', (num: number, flipped: boolean) => {
    return n => n === num;
  });
}

function neq_test(tokens: Tokens): Test {
  return _equality(tokens, '!=', (num: number, flipped: boolean) => {
    return n => n !== num;
  });
}

function gte_test(tokens: Tokens): Test {
  return _equality(tokens, '>=', (num: number, flipped: boolean) => {
    return flipped ? n => num >= n : n => n >= num;
  });
}

function gt_test(tokens: Tokens): Test {
  return _equality(tokens, '>', (num: number, flipped: boolean) => {
    return flipped ? n => num > n : n => n > num;
  });
}

function lte_test(tokens: Tokens): Test {
  return _equality(tokens, '<=', (num: number, flipped: boolean) => {
    return flipped ? n => num <= n : n => n <= num;
  });
}

function lt_test(tokens: Tokens): Test {
  return _equality(tokens, '<', (num: number, flipped: boolean) => {
    return flipped ? n => num < n : n => n < num;
  });
}


function _equality(tokens: Tokens, sep: string, builder: EqTestBuilder): Test {
  let [left, right] = split_tokens(tokens, sep);
  if (left.size === 1 && left.get(0) === 'n') {
    if(right.size !== 1) {
      throw new Error(`test can only compare n to integers, not ${right.join('')}`);
    }
    const num = int(right.get(0));
    return builder(num, false);
  } else if (right.size === 1 && right.get(0) === 'n') {
    if (left.size !== 1) {
      throw new Error(`test can only compare n to integers, not ${left.join('')}`);
    }
    const num = int(left.get(0));
    return builder(num, true);
  } else if (left.contains('n') && left.contains('%')) {
    return _pipe(left, right, builder, false);
  } else {
    throw new Error('equality test must have \'n\'n as one of the two tests');
  }
}

function _pipe(mod_tokens: Tokens, action_tokens: Tokens, builder: EqTestBuilder, flipped: boolean): Test {
  const modifier = compile_mod(mod_tokens);
  if (action_tokens.size !== 1) {
    throw new Error('Can only get modulus of integer');
  }
  const num = int(action_tokens.get(0));
  const action = builder(num, flipped);
  return n => action(modifier(n));
}

function compile_mod(tokens: Tokens): (number) => number {
  let [left, right] = split_tokens(tokens, '%');
  if (left.size !== 1 || left.get(0) !== 'n') {
    throw new Error('Modulus operation requires \'n\' as left operand');
  }
  if (right.size !== 1) {
    throw new Error('Modulus operation requires simple integer as right operand');
  }
  const num = int(right.get(0));
  return n => n % num;
}

function _logic_test(tokens: Tokens, sep: string, builder: (left: Test, right: Test) => Test): Test {
  let [left, right] = split_tokens(tokens, sep);
  return builder(compile_test(left.join('')), compile_test(right.join('')));
}

const precedence: Immutable.List<TokenDefinition> = Immutable.List([
	makeTokenDefinition({op: "||", builder: or_test}),
	makeTokenDefinition({op: "&&", builder: and_test}),
	makeTokenDefinition({op: "==", builder: eq_test}),
	makeTokenDefinition({op: "!=", builder: neq_test}),
	makeTokenDefinition({op: ">=", builder: gte_test}),
	makeTokenDefinition({op: ">", builder: gt_test}),
	makeTokenDefinition({op: "<=", builder: lte_test}),
	makeTokenDefinition({op: "<", builder: lt_test})
]);

function compile_test(s: string): Test {
  const tokens = tokenize(s);
  for (let token_definition of precedence) {
    if (tokens.contains(token_definition.op)) {
      return token_definition.builder(tokens);
    }
  }
  throw new Error(`Cannot compile test for ${s} (${tokens.toJS().toString()})`);
}

function split_tokens(tokens: Tokens, splitter: string): [Tokens, Tokens] {
  const index = tokens.indexOf(splitter);
  if (index === -1) {
    throw new Error(`'${splitter} not found in ['${tokens.join("','")}']`);
  }
  return [tokens.slice(0, index), tokens.slice(index + 1)];
}

function tokenize(s: string): Tokens {
  if (inParens(s)){
    s = s.slice(1, -1);
  }
  return Immutable.List().concat(...Immutable.List(split(s)).map(
    chunk => {
      if (chunk.length !== 0) {
        if (inParens(chunk)) {
          return Immutable.List([chunk]);
        } else {
          return Immutable.List(chunk.split(pattern)).filter(token => token.length);
        }
      } else {
        return Immutable.List()
      }
    }
  ));
}

function inParens(s: string): boolean {
  return s.substr(0, 1) === '(' && s.substr(-1, 1) === ')';
}

type InfoProps = {
  open: number,
  close: number
};
const makeInfo: RecordFactory<InfoProps> = Immutable.Record({
  open: 0,
  close: 0
});
type Info = RecordOf<InfoProps>;

function *split(s: string): Iterable<string> {
  s = s.replace(/ /g, '');
  if (s.indexOf('(') === -1) {
    yield s;
  } else {
    let last = 0;
    let end = s.length;
    for (let info of scan(s)) {
      if (last !== info.open) {
        yield s.slice(last, info.open);
      }
      yield s.slice(info.open, info.close);
      last = info.close;
    }
    if (last !== end) {
      yield s.slice(last, end);
    }
  }
}

function *scan(s: string): Iterable<Info> {
  let depth = 0;
  let opener = 0;
  for (let [index, char] of enumerate(s)) {
    switch (char) {
      case '(':
        if (depth === 0) {
          opener = index;
        }
        depth++;
        if (depth >= 20) {
          throw new Error('Parenthesis nested too deep');
        }
        break;
      case ')':
        depth--;
        if (depth === 0) {
          yield makeInfo({open: opener, close: index + 1});
        }
    }
  }
}

function int(s: ?string): number {
  if (typeof s !== 'string') {
    throw new Error('Invalid input');
  }
  const num = parseInt(s, 10);
  if (num !== num) {
    throw new Error(`${s} is not an integer`);
  }
  return num;
}
