import {execFileSync} from 'child_process';
import path from 'path';

import test from 'tape';
import tmp from 'tmp';
import which from 'which';

import * as gettext from './gettext';

const test_data_dir = path.join(__dirname, '..', 'test_data');
const gettextjspy = path.join(__dirname, '..', 'py', 'gettextjs.py');
const python = which.sync('python3');

function with_compiled(json, cb) {
    const tempdir = tmp.dirSync({unsafeCleanup: true});
    try {
        const args = [gettextjspy];
        if (json) {
            args.push('--json');
        }
        args.push(test_data_dir);
        args.push(tempdir.name);
        execFileSync(python, args);
        cb(tempdir.name);
    } finally {
        tempdir.removeCallback();
    }
}

test('test null catalog', t => {
    t.plan(3);
    t.equal(gettext.gettext('test'), 'test');
    t.equal(gettext.ngettext('test', 'tests', 1), 'test');
    t.equal(gettext.ngettext('test', 'tests', 2), 'tests');
});

test('test en json catalog', t => {
    t.plan(3);
    with_compiled(true, workspace => {
        const catalog = require(path.join(workspace, 'en', 'LC_MESSAGES', 'messages.mo.json'));
        const g = new gettext.Gettext(catalog);
        t.equal(g.gettext('simple-string'), 'A simple string');
        t.equal(g.ngettext('singular-string', 'plural-string', 1), 'Singular form!');
        t.equal(g.ngettext('singular-string', 'plural-string', 2), 'Plural form!');
    });
});

test('test ja json catalog', t => {
    t.plan(3);
    with_compiled(true, workspace => {
        const catalog = require(path.join(workspace, 'ja', 'LC_MESSAGES', 'messages.mo.json'));
        const g = new gettext.Gettext(catalog);
        t.equal(g.gettext('simple-string'), '簡単なストリング');
        t.equal(g.ngettext('singular-string', 'plural-string', 1), '日本語には複数形がありません。');
        t.equal(g.ngettext('singular-string', 'plural-string', 2), '日本語には複数形がありません。');
    });
});

test('test en js catalog', t => {
    t.plan(3);
    with_compiled(false, workspace => {
        const catalog = require(path.join(workspace, 'en', 'LC_MESSAGES', 'messages.mo.js')).EN_MESSAGES;
        const g = new gettext.Gettext(catalog);
        t.equal(g.gettext('simple-string'), 'A simple string');
        t.equal(g.ngettext('singular-string', 'plural-string', 1), 'Singular form!');
        t.equal(g.ngettext('singular-string', 'plural-string', 2), 'Plural form!');
    });
});

test('test ja js catalog', t => {
    t.plan(3);
    with_compiled(false, workspace => {
        const catalog = require(path.join(workspace, 'ja', 'LC_MESSAGES', 'messages.mo.js')).JA_MESSAGES;
        const g = new gettext.Gettext(catalog);
        t.equal(g.gettext('simple-string'), '簡単なストリング');
        t.equal(g.ngettext('singular-string', 'plural-string', 1), '日本語には複数形がありません。');
        t.equal(g.ngettext('singular-string', 'plural-string', 2), '日本語には複数形がありません。');
    });
});
