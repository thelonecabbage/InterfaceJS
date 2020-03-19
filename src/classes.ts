const noop = () => null

// type Deserializer = (key:string, data:any) => any
export interface Deserializer {
  (key:string, data:any): any
  serialize(key:string, data:any): any
}
export interface Dictionary<T> {
  [key: string]: T;
}
export class Interface {
  definition ():Dictionary<Deserializer|Interface> { return {} }
  protected originalData: Dictionary<any>
  protected updatedData: Dictionary<any>
  protected updatedCB: Function
  protected _definition: Dictionary<Deserializer|Interface>
  protected _proxy: any

  constructor (data:Dictionary<any>|null={}, updatedCB:Function = noop) {

    this.updatedCB = updatedCB
    this.updatedData = {}
    this._definition = this.definition()
    this.originalData = {}
    if (data !== null) {
      this.originalData = this.parseObj(data)
      this._proxy = new Proxy(this, this.proxyHandler)
    }
    return this._proxy
  }

  private keyUpdated(key:string) {
    this.updatedData[key] = this._proxy[key].$diff
    this.updatedCB()
  }

  protected getHandlers(key:string) {
    const handler = <Deserializer>this._definition[key]
    const Handler = <typeof Interface><unknown>this._definition[key]
    const isInstance = Interface.isPrototypeOf(Handler)
    return {handler, Handler, isInstance}
  }

  protected deserialize(key:string, data:any) {
    const {handler, Handler, isInstance} = this.getHandlers(key)
    if (isInstance) {
      return new Handler(data, () => this.keyUpdated(key))
    } else {
      return handler(key, data)
    } 
  }

  protected serialize(key:string, data:any) {
    const {handler, Handler, isInstance} = this.getHandlers(key)
    if (isInstance || data?.$isInterface) {
      return data.$json
    } else {
      return handler.serialize(key, data)
    } 
  }
  protected parseObj (data:Dictionary<any>):Dictionary<any> {
    Object.keys(this._definition).reduce((acc, key:string) => {
      acc[key] = this.deserialize(key, data[key])
      return acc
    },  <Dictionary<any>>this.originalData)
    return this.originalData
  }

  protected proxyHandler = {
    get (target:Interface, key:string|number) {
      const isInstance:boolean = target.originalData[key] && target.originalData[key].$isInterface
      var value:Dictionary<any>
      switch (key) {
        case '$isInterface':
          return true
        case '$diff':
          value = target.diff()
          break
        case '$json':
          value = target.serializeObj()
          break
        default:
          value = (isInstance || target.updatedData[key] === undefined) ? target.originalData[key] : target.updatedData[key]
      }
      return value
    },
    set (target:Interface, key:string, value:any) {
      try {
        target.updatedData[key] = target.deserialize(key, value)
        target.updatedCB(key, value)
        return true
      } catch {
        throw new Error(`"${key}" not found in definitions`)
      }
    }
  }

  protected diff ():Dictionary<any> {
    const originalData:Dictionary<any> = this.originalData
    const updatedData:Dictionary<any> = this.updatedData
    const data:Dictionary<any> = {}
    return Object.keys(updatedData).reduce((acc, key) => {
      if (originalData[key] !== updatedData[key]) {
        if (updatedData[key].$isInterface) {
          acc[key] = updatedData[key].$json
        } else {
          acc[key] = updatedData[key]
        }
      }
      return acc
    }, data)
  }

  protected serializeObj ():Dictionary<any> {
    const definition:Dictionary<Deserializer|Interface> = this._definition
    const data:Dictionary<any> = this._proxy
    return Object.keys(definition).reduce((acc:Dictionary<any>, key) => {
      acc[key] = this.serialize(key, data[key])
      return acc
    }, {})
  }
}



  
