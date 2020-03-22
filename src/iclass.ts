import { Interface, InterfaceLike, InterfaceClass, Dictionary, Deserializer, publicClassMethods } from './base'

const noop = () => null

export abstract class iClass extends Interface {
    protected _definition: Dictionary<Deserializer|Interface|InterfaceClass|InterfaceLike>
    protected _initData:Dictionary<any> = {} 
    constructor (data:Dictionary<any>, updatedCB:Function = noop) {
      super()
      this._updatedCB = updatedCB
      this._definition =  {}
      this._originalData = {}
      this._initData = data
      this._proxy = new Proxy(this, <ProxyHandler<any>><unknown>this)
      return this._proxy
    }
  
    private keyUpdated(key:string) {
      this._updatedData[key] = this._proxy[key].$diff
      this._updatedCB()
    }
  
    protected getHandlers(key:string) {
      const handler = <Deserializer>this._definition[key]
      const Handler = <InterfaceLike><unknown>this._definition[key]
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

    get (target:iClass, key:string|number):Dictionary<any>{
      const isInstance:boolean = this._originalData[key]?.$isInterface
      if (Object.keys(publicClassMethods).includes(<string>key)) {
          return (<Function>this[<publicClassMethods>key])()
      }
      return (isInstance || this._updatedData[key] === undefined) ? this._originalData[key] : this._updatedData[key]
    }
    set (target:iClass, key:string, value:any) {
    try {
        const isInstance = Interface.isPrototypeOf(value)
        const isFunction = typeof value === 'function'
        if (isInstance || isFunction) {
          this._definition[key] = value
          this._originalData[key] = this.deserialize(key, this._initData[key])
        } else {
          this._updatedData[key] = this.deserialize(key, value)
          this._updatedCB(key, value)  
        }
        return true
    } catch {
        throw new Error(`"${key}" not found in definitions`)
    }
    }
  
    public $diff ():Dictionary<any> {
      const originalData:Dictionary<any> = <Dictionary<any>>this._originalData
      const updatedData:Dictionary<any> = this._updatedData
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
  
    public $json ():Dictionary<any> {
      const definition:Dictionary<Deserializer|Interface|InterfaceClass|InterfaceLike> = this._definition
      const data:Dictionary<any> = this._proxy
      return Object.keys(definition).reduce((acc:Dictionary<any>, key) => {
        acc[key] = this.serialize(key, data[key])
        return acc
      }, {})
    }
  }