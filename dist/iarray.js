"use strict";

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iArray = iArray;

var _base = require("./base");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const noop = () => undefined;

function iArray(_elementHandler) {
  const handler = _elementHandler;
  const Handler = _elementHandler;

  const isInstance = _base.Interface.isPrototypeOf(Handler);

  class ArrayInterface extends _base.Interface {
    constructor() {
      let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let updatedCB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      super();

      _defineProperty(this, "data", void 0);

      _defineProperty(this, "isDirty", false);

      this._updatedCB = updatedCB;
      this.data = data.map(d => this.deserialize(d));
      this._proxy = new Proxy(this.data, this);
      return this._proxy;
    }

    getHandlers() {
      return {
        handler,
        Handler,
        isInstance
      };
    }

    deserialize(value) {
      const {
        handler,
        Handler,
        isInstance
      } = this.getHandlers();

      if (isInstance) {
        return new Handler(value, () => {
          this.isDirty = true;

          this._updatedCB();
        });
      } else {
        return handler("iArray", value);
      }
    }

    serialize(value) {
      const {
        handler,
        Handler,
        isInstance
      } = this.getHandlers();

      if (isInstance) {
        return value === null || value === void 0 ? void 0 : value.$json;
      } else {
        return handler.serialize("iArray", value);
      }
    }

    $json() {
      return this.data.map(d => this.serialize(d));
    }

    $diff() {
      return this.isDirty ? this.$json() : [];
    }

    get(target, property) {
      if (Object.keys(_base.publicClassMethods).includes(property)) {
        return this[property]();
      }

      return target[property];
    }

    set(target, property, value) {
      const index = Number(property);
      this.isDirty = true;

      if (isNaN(index)) {
        target[property] = value;
      } else {
        target[index] = this.deserialize(value);

        this._updatedCB();
      }

      return true;
    }

  }

  return ArrayInterface;
}
//# sourceMappingURL=iarray.js.map