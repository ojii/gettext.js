import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import tmp from 'tmp';

const TIMEOUT = 99 * 1000;

const p = (...parts) => path.resolve(__dirname, ...parts);

function compiler(fixture) {
  const compiler = webpack({
    context: __dirname,
    entry: p('data', fixture),
    output: {
      path: p(),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.mo/,
          use: [
            {
              loader: p('..', 'src', 'loader.js')
            },
          ]
        },
        {
          test: /\.js$/,
          use: [

            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", {targets: {browsers: ["ie >= 11", "last 2 versions"], node: "current"}}],
                  "@babel/preset-flow",
                  "@babel/preset-react"
                ],
                plugins: [
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-transform-runtime",
                  "@babel/plugin-syntax-dynamic-import"
                ]
              }
            }

          ]
        }
      ]
    },
    resolve: {
      alias: {
        gettextjs: p("..", "src", "runtime.js")
      }
    }
  });

  compiler.outputFileSystem = new MemoryFS();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
}

test('Compiles en.mo file to js module', async () => {
  const stats = await compiler('en.mo');
  const output = stats.toJson().modules[0].source;
  expect(stats.toJson().errors).toBe([]);
  expect(output).toBe(`import gettext from 'gettextjs';
import Immutable from 'immutable';

const headers = Immutable.fromJS({"project-id-version":"gettextjs","po-revision-date":"2015-10-26 09","last-translator":"Jonas Obrist <ojiidotch@gmail.com>","language":"en","mime-version":"1.0","content-type":"text/plain; charset=UTF-8","content-transfer-encoding":"8bit","plural-forms":"nplurals=2; plural=(n != 1);"});
const messages = Immutable.fromJS({"":["Project-Id-Version: gettextjs\\nPO-Revision-Date: 2015-10-26 09:11+0000\\nLast-Translator: Jonas Obrist <ojiidotch@gmail.com>\\nLanguage: en\\nMIME-Version: 1.0\\nContent-Type: text/plain; charset=UTF-8\\nContent-Transfer-Encoding: 8bit\\nPlural-Forms: nplurals=2; plural=(n != 1);\\n"],"simple-string":["A simple string"],"singular-string":["Singular form!","Plural form!"]});
const plural = n => ((n != 1)) * 1;

export default new gettext.Translations(headers, messages, plural);`);
}, TIMEOUT);

test('Compiles ja.mo file to js module', async () => {
  const stats = await compiler('ja.mo');
  const output = stats.toJson().modules[0].source;
  expect(stats.toJson().errors).toBe([]);
  expect(output).toBe(`import gettext from 'gettextjs';
import Immutable from 'immutable';

const headers = Immutable.fromJS({"project-id-version":"gettextjs","po-revision-date":"2015-10-26 09","last-translator":"Jonas Obrist <ojiidotch@gmail.com>","language":"ja","mime-version":"1.0","content-type":"text/plain; charset=UTF-8","content-transfer-encoding":"8bit","plural-forms":"nplurals=1; plural=0;"});
const messages = Immutable.fromJS({"":["Project-Id-Version: gettextjs\\nPO-Revision-Date: 2015-10-26 09:11+0000\\nLast-Translator: Jonas Obrist <ojiidotch@gmail.com>\\nLanguage: ja\\nMIME-Version: 1.0\\nContent-Type: text/plain; charset=UTF-8\\nContent-Transfer-Encoding: 8bit\\nPlural-Forms: nplurals=1; plural=0;\\n"],"simple-string":["簡単なストリング"],"singular-string":["日本語には複数形がありません。"]});
const plural = n => (0) * 1;

export default new gettext.Translations(headers, messages, plural);`);
}, TIMEOUT);


test('Compiled file actually works', async () => {
  const stats = await compiler('en.mo');
  const output = stats.toJson().modules[0].source;
  console.log(output);
  // FIXME - shows the error
  // expect(stats.toJson().errors).toBe([]);
  return new Promise((resolve, reject) => {
    try {
      tmp.dir((err, path) => {
        if (err) throw err;
        const module = `${path}/bundle.js`;
        fs.symlinkSync(p('..', 'node_modules'), `${path}/node_modules`);
        fs.writeFileSync(module, output);
        const locale = require(module).default;
        expect(locale.gettext('simple-string')).toEqual('A simple string');
        resolve();
      });
    } catch(err) {
      reject(err);
    }
  })
}, TIMEOUT);
