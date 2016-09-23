(function (exports) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Gettext = function () {
    function Gettext(catalog) {
        classCallCheck(this, Gettext);

        if (!catalog) {
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

    createClass(Gettext, [{
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
}();

var CATALOG = new Gettext();

function set_catalog(catalog) {
    if (!(catalog instanceof Gettext)) {
        catalog = new Gettext(catalog);
    }
    CATALOG = catalog;
}

function gettext(msgid) {
    return CATALOG.gettext(msgid);
}

function ngettext(singular, plural, count) {
    return CATALOG.ngettext(singular, plural, count);
}

exports.Gettext = Gettext;
exports.set_catalog = set_catalog;
exports.gettext = gettext;
exports.ngettext = ngettext;

}((this.gettext = this.gettext || {})));
//# sourceMappingURL=gettext.js.map
