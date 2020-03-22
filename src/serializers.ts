import { Deserializer } from './base'
function assertType (key:string = '', data:any = undefined, types:Array<string> = []):boolean {
  const defined = data !== undefined
  const notNull = data !== null
  if (defined && notNull && !types.includes(typeof data)) {
    throw Error(`Type "${key}" = "${JSON.stringify(data)}" is not typeof "${types}"`)
  }
  return true
}
function isEmpty (val:any) {
  return [undefined, null, ''].includes(val)
}
export function iString<Deserializer>(key:string = '', data:string = ''):string {
  assertType(key, data, ['string'])
  return isEmpty(data) ? '' : String(data)
}
iString.serialize = iString

export function iNumber<Deserializer>(key:string = '', data:string|number = ''):number|undefined {
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

export function iDate<Deserializer>(key:string = '', data:string|number|Date):Date|undefined {
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
iDate.serialize = function (key = '', data:Date):string | undefined {
  const date = iDate(key, data)
  return date ? date.toISOString() : undefined
}


