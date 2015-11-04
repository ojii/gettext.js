/* globals QUnit: false, Gettext: false, EN_MESSAGES: false, JA_MESSAGES: false */
'use strict';

QUnit.test('test_en_js', function (assert) {
    var g = new Gettext(EN_MESSAGES);
    assert.equal(g.gettext('simple-string'), 'A simple string');
    assert.equal(g.ngettext('singular-string', 'plural-string', 1), 'Singular form!');
    assert.equal(g.ngettext('singular-string', 'plural-string', 2), 'Plural form!');
});

QUnit.test('test_ja_js', function (assert) {
    var g = new Gettext(JA_MESSAGES);
    assert.equal(g.gettext('simple-string'), '簡単なストリング');
    assert.equal(g.ngettext('singular-string', 'plural-string', 1), '日本語には複数形がありません。');
    assert.equal(g.ngettext('singular-string', 'plural-string', 2), '日本語には複数形がありません。');
});

QUnit.test('test_null_js', function (assert) {
    var g = new Gettext();
    assert.equal(g.gettext('simple-string'), 'simple-string');
    assert.equal(g.ngettext('singular-string', 'plural-string', 1), 'singular-string');
    assert.equal(g.ngettext('singular-string', 'plural-string', 2), 'plural-string');
});

QUnit.test('test_en_json', function (assert) {
    var done = assert.async();
    Gettext.load('/locale/', 'en', 'messages').then(function (g) {
        assert.equal(g.gettext('simple-string'), 'A simple string');
        assert.equal(g.ngettext('singular-string', 'plural-string', 1), 'Singular form!');
        assert.equal(g.ngettext('singular-string', 'plural-string', 2), 'Plural form!');
        done();
    }, function (err) {
        assert.ok(false, err);
        done();
    });
});

QUnit.test('test_ja_json', function (assert) {
    var done = assert.async();
    Gettext.load('/locale/', 'ja', 'messages').then(function (g) {
        assert.equal(g.gettext('simple-string'), '簡単なストリング');
        assert.equal(g.ngettext('singular-string', 'plural-string', 1), '日本語には複数形がありません。');
        assert.equal(g.ngettext('singular-string', 'plural-string', 2), '日本語には複数形がありません。');
        done();
    }, function (err) {
        assert.ok(false, err);
        done();
    });
});

//# sourceMappingURL=tests-compiled.js.map