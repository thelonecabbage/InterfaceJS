"use strict";

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iString = iString;
exports.iNumber = iNumber;
exports.iDate = iDate;

function assertType() {
  let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const defined = data !== undefined;
  const notNull = data !== null;

  if (defined && notNull && !types.includes(typeof data)) {
    throw Error("Type \"".concat(key, "\" = \"").concat(JSON.stringify(data), "\" is not typeof \"").concat(types, "\""));
  }

  return true;
}

function isEmpty(val) {
  return [undefined, null, ''].includes(val);
}

function iString() {
  let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  assertType(key, data, ['string']);
  return isEmpty(data) ? '' : String(data);
}

iString.serialize = iString;

function iNumber() {
  let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  assertType(key, data, ['string', 'number']);
  const val = Number(data);

  if (isNaN(val)) {
    if (isEmpty(data)) {
      return undefined;
    }

    throw Error("Type \"".concat(key, "\" = \"").concat(JSON.stringify(data), "\" is not typeof type Number"));
  }

  return val;
}

iNumber.serialize = iNumber;

function iDate() {
  let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let data = arguments.length > 1 ? arguments[1] : undefined;
  assertType(key, data, ['string', 'object', 'undefined']);
  const date = new Date(data);

  if (isNaN(date.getDate())) {
    if (isEmpty(data)) {
      return undefined;
    }

    throw Error("Type \"".concat(key, "\" = \"").concat(JSON.stringify(data), "\" is not a valid Date"));
  }

  return date;
}

iDate.serialize = function () {
  let key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let data = arguments.length > 1 ? arguments[1] : undefined;
  const date = iDate(key, data);
  return date ? date.toISOString() : undefined;
};
//# sourceMappingURL=serializers.js.map