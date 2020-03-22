"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Interface = exports.publicClassMethods = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const noop = () => null; // type Deserializer = (key:string, data:any) => any


let publicClassMethods;
exports.publicClassMethods = publicClassMethods;

(function (publicClassMethods) {
  publicClassMethods["$isInterface"] = "$isInterface";
  publicClassMethods["$diff"] = "$diff";
  publicClassMethods["$json"] = "$json";
})(publicClassMethods || (exports.publicClassMethods = publicClassMethods = {}));

class Interface {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let updatedCB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

    _defineProperty(this, "_updatedCB", void 0);

    _defineProperty(this, "_originalData", void 0);

    _defineProperty(this, "_updatedData", void 0);

    _defineProperty(this, "_proxy", void 0);

    this._updatedCB = updatedCB;
    this._updatedData = {};
    this._originalData = {};
  }

  $isInterface() {
    return true;
  }

}

exports.Interface = Interface;
//# sourceMappingURL=base.js.map