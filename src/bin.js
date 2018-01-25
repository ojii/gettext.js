// @flow
import process from 'process';
import fs from 'fs';
import {b2ab} from './utils';
import transpile from './transpiler';
import parser from './parser';

if (process.argv.length !== 4) {
  console.error('Usage: gettextjs <input> <output>');
  process.exit(1);
}

const [input, output] = process.argv.slice(2);
fs.writeFileSync(output, transpile(...parser(b2ab(fs.readFileSync(input)))));
