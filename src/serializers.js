function assertType (key = '', data = undefined, types = []) {
  const defined = data !== undefined
  const notNull = data !== null
  if (defined && notNull && !types.includes(typeof data)) {
    throw Error(`Type "${key}" = "${JSON.stringify(data)}" is not typeof "${types}"`)
  }
  return true
}
function isEmpty (val) {
  return [undefined, null, ''].includes(val)
}
function iString (key = '', data = '') {
  assertType(key, data, ['string'])
  return isEmpty(data) ? '' : String(data)
}
iString.serialize = iString

function iNumber (key = '', data = '') {
  assertType(key, data, ['string', 'number'])
  const val = Number(data)
  if (isNaN(val)) {
    if (isEmpty(data)) {
      return undefined
    }
    throw Error(`Type "${key}" = "${JSON.stringify(data)}" is not typeof type Number`)
  }
  return val
}
iNumber.serialize = iNumber

function iDate (key = '', data = undefined) {
  assertType(key, data, ['string', 'object', 'undefined'])
  const date = new Date(data)
  if (isNaN(date.getDate())) {
    if (isEmpty(data)) {
      return undefined
    }
    throw Error(`Type "${key}" = "${JSON.stringify(data)}" is not a valid Date`)
  }
  return date
}
iDate.serialize = function (key = '', data = undefined) {
  const date = iDate(key, data)
  return date ? date.toISOString() : undefined
}


module.exports = {
  iDate,
  iString,
  iNumber
}