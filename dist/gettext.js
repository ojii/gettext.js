/*jshint strict:true, latedef:true, noempty:true, noarg:true, unused:vars, evil:true, esnext:true, indent:4, eqeqeq:true, nocomma:true, quotmark:single, nonbsp:true, browser:true, bitwise:true, curly:true, undef:true, globalstrict:true, nonew:true, forin:true */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
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
//# sourceMappingURL=data:application/json;base64,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QyxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxQixDQUFDLENBQUM7QUFDSCxXQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBSyxXQUFXLFNBQUksTUFBTSxxQkFBZ0IsTUFBTSxjQUFXLENBQUM7QUFDMUUsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2QsQ0FBQyxDQUFDO0NBQ04sQ0FBQyIsImZpbGUiOiJnZXR0ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypqc2hpbnQgc3RyaWN0OnRydWUsIGxhdGVkZWY6dHJ1ZSwgbm9lbXB0eTp0cnVlLCBub2FyZzp0cnVlLCB1bnVzZWQ6dmFycywgZXZpbDp0cnVlLCBlc25leHQ6dHJ1ZSwgaW5kZW50OjQsIGVxZXFlcTp0cnVlLCBub2NvbW1hOnRydWUsIHF1b3RtYXJrOnNpbmdsZSwgbm9uYnNwOnRydWUsIGJyb3dzZXI6dHJ1ZSwgYml0d2lzZTp0cnVlLCBjdXJseTp0cnVlLCB1bmRlZjp0cnVlLCBnbG9iYWxzdHJpY3Q6dHJ1ZSwgbm9uZXc6dHJ1ZSwgZm9yaW46dHJ1ZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHZXR0ZXh0IHtcbiAgICBjb25zdHJ1Y3RvcihjYXRhbG9nKSB7XG4gICAgICAgIGlmIChjYXRhbG9nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNhdGFsb2cgPSB7XG4gICAgICAgICAgICAgICAgJ2NhdGFsb2cnOiB7fSxcbiAgICAgICAgICAgICAgICAncGx1cmFsJzogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhdGFsb2cuaGFzT3duUHJvcGVydHkoJ2NhdGFsb2cnKSkge1xuICAgICAgICAgICAgY2F0YWxvZy5jYXRhbG9nID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYXRhbG9nID0gY2F0YWxvZy5jYXRhbG9nO1xuICAgICAgICBpZiAoY2F0YWxvZy5wbHVyYWwpIHtcbiAgICAgICAgICAgIHRoaXMucGx1cmFsaWR4ID0gKG4pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGV2YWwoY2F0YWxvZy5wbHVyYWwpKSAqIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbHVyYWxpZHggPSAobikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAobiA9PT0gMSkgPyAwIDogMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXR0ZXh0KG1zZ2lkKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuY2F0YWxvZ1ttc2dpZF07XG4gICAgICAgIGlmICh0eXBlb2YodmFsdWUpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIG1zZ2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YodmFsdWUpID09PSAnc3RyaW5nJykgPyB2YWx1ZSA6IHZhbHVlWzBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdldHRleHQoc2luZ3VsYXIsIHBsdXJhbCwgY291bnQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5jYXRhbG9nW3Npbmd1bGFyXTtcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YodmFsdWUpO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBbc2luZ3VsYXIsIHBsdXJhbF1bdGhpcy5wbHVyYWxpZHgoY291bnQpXTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlW3RoaXMucGx1cmFsaWR4KGNvdW50KV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkdldHRleHQubG9hZCA9IGZ1bmN0aW9uIChsb2NhbGVfcGF0aCwgbG9jYWxlLCBkb21haW4pIHtcbiAgICBpZiAobG9jYWxlX3BhdGguZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICBsb2NhbGVfcGF0aCA9IGxvY2FsZV9wYXRoLnN1YnN0cigwLCBsb2NhbGVfcGF0aC5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUobmV3IEdldHRleHQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGAke2xvY2FsZV9wYXRofS8ke2xvY2FsZX0vTENfTUVTU0FHRVMvJHtkb21haW59Lm1vLmpzb25gKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
