"use strict";

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iClass = void 0;

var _base = require("./base");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const noop = () => null;

class iClass extends _base.Interface {
  constructor(data) {
    let updatedCB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    super();

    _defineProperty(this, "_definition", void 0);

    _defineProperty(this, "_initData", {});

    this._updatedCB = updatedCB;
    this._definition = {};
    this._originalData = {};
    this._initData = data;
    this._proxy = new Proxy(this, this);
    return this._proxy;
  }

  keyUpdated(key) {
    this._updatedData[key] = this._proxy[key].$diff;

    this._updatedCB();
  }

  getHandlers(key) {
    const handler = this._definition[key];
    const Handler = this._definition[key];

    const isInstance = _base.Interface.isPrototypeOf(Handler);

    return {
      handler,
      Handler,
      isInstance
    };
  }

  deserialize(key, data) {
    const {
      handler,
      Handler,
      isInstance
    } = this.getHandlers(key);

    if (isInstance) {
      return new Handler(data, () => this.keyUpdated(key));
    } else {
      return handler(key, data);
    }
  }

  serialize(key, data) {
    const {
      handler,
      Handler,
      isInstance
    } = this.getHandlers(key);

    if (isInstance || (data === null || data === void 0 ? void 0 : data.$isInterface)) {
      return data.$json;
    } else {
      return handler.serialize(key, data);
    }
  }

  get(target, key) {
    var _this$_originalData$k;

    const isInstance = (_this$_originalData$k = this._originalData[key]) === null || _this$_originalData$k === void 0 ? void 0 : _this$_originalData$k.$isInterface;

    if (Object.keys(_base.publicClassMethods).includes(key)) {
      return this[key]();
    }

    return isInstance || this._updatedData[key] === undefined ? this._originalData[key] : this._updatedData[key];
  }

  set(target, key, value) {
    try {
      const isInstance = _base.Interface.isPrototypeOf(value);

      const isFunction = typeof value === 'function';

      if (isInstance || isFunction) {
        this._definition[key] = value;
        this._originalData[key] = this.deserialize(key, this._initData[key]);
      } else {
        this._updatedData[key] = this.deserialize(key, value);

        this._updatedCB(key, value);
      }

      return true;
    } catch (_unused) {
      throw new Error("\"".concat(key, "\" not found in definitions"));
    }
  }

  $diff() {
    const originalData = this._originalData;
    const updatedData = this._updatedData;
    const data = {};
    return Object.keys(updatedData).reduce((acc, key) => {
      if (originalData[key] !== updatedData[key]) {
        if (updatedData[key].$isInterface) {
          acc[key] = updatedData[key].$json;
        } else {
          acc[key] = updatedData[key];
        }
      }

      return acc;
    }, data);
  }

  $json() {
    const definition = this._definition;
    const data = this._proxy;
    return Object.keys(definition).reduce((acc, key) => {
      acc[key] = this.serialize(key, data[key]);
      return acc;
    }, {});
  }

}

exports.iClass = iClass;
//# sourceMappingURL=iclass.js.map