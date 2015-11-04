/*jshint strict:true, latedef:true, noempty:true, noarg:true, unused:vars, evil:true, esnext:true, indent:4, eqeqeq:true, nocomma:true, quotmark:single, nonbsp:true, browser:true, bitwise:true, curly:true, undef:true, globalstrict:true, nonew:true, forin:true */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Gettext = (function () {
    function Gettext(catalog) {
        _classCallCheck(this, Gettext);

        if (catalog === undefined) {
            catalog = {
                'catalog': {},
                'plural': null
            };
        }
        if (!catalog.hasOwnProperty('catalog')) {
            catalog.catalog = {};
        }
        this.catalog = catalog.catalog;
        if (catalog.plural) {
            this.pluralidx = function (n) {
                return eval(catalog.plural) * 1;
            };
        } else {
            this.pluralidx = function (n) {
                return n === 1 ? 0 : 1;
            };
        }
    }

    _createClass(Gettext, [{
        key: 'gettext',
        value: function gettext(msgid) {
            var value = this.catalog[msgid];
            if (typeof value === 'undefined') {
                return msgid;
            } else {
                return typeof value === 'string' ? value : value[0];
            }
        }
    }, {
        key: 'ngettext',
        value: function ngettext(singular, plural, count) {
            var value = this.catalog[singular];
            var type = typeof value;
            if (type === 'undefined') {
                return [singular, plural][this.pluralidx(count)];
            } else if (type === 'string') {
                return value;
            } else {
                return value[this.pluralidx(count)];
            }
        }
    }]);

    return Gettext;
})();

Gettext.load = function (locale_path, locale, domain) {
    if (locale_path.endsWith('/')) {
        locale_path = locale_path.substr(0, locale_path.length - 1);
    }
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            resolve(new Gettext(JSON.parse(xhr.response)));
        });
        xhr.addEventListener('error', function () {
            reject(xhr.statusText);
        });
        xhr.open('GET', locale_path + '/' + locale + '/LC_MESSAGES/' + domain + '.mo.json');
        xhr.send();
    });
};

//# sourceMappingURL=gettext-compiled.js.map