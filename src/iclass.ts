import { Interface, InterfaceLike, InterfaceClass, Dictionary, Deserializer, publicClassMethods } from './base'

const noop = () => null

export abstract class iClass extends Interface {
    protected abstract definition ():Dictionary<Deserializer|Interface|InterfaceClass|InterfaceLike>
    protected _definition: Dictionary<Deserializer|Interface>
  
    constructor (data:Dictionary<any>, updatedCB:Function = noop) {
      super()
      this.updatedCB = updatedCB
      this._definition = this.definition()
      this.originalData = this.parseObj(data)
      this._proxy = new Proxy(this, <ProxyHandler<any>><unknown>this)
      return this._proxy
    }
  
    private keyUpdated(key:string) {
      this.updatedData[key] = this._proxy[key].$diff
      this.updatedCB()
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
    protected parseObj (data:Dictionary<any>):Dictionary<any> {
      Object.keys(this._definition).reduce((acc, key:string) => {
        acc[key] = this.deserialize(key, data[key])
        return acc
      },  <Dictionary<any>>this.originalData)
      return this.originalData
    }
  
    get (target:iClass, key:string|number):Dictionary<any>{
    const isInstance:boolean = this.originalData[key]?.$isInterface
    if (Object.keys(publicClassMethods).includes(<string>key)) {
        return (<Function>this[<publicClassMethods>key])()
    }
    return (isInstance || this.updatedData[key] === undefined) ? this.originalData[key] : this.updatedData[key]
    }
    set (target:iClass, key:string, value:any) {
    try {
        this.updatedData[key] = this.deserialize(key, value)
        this.updatedCB(key, value)
        return true
    } catch {
        throw new Error(`"${key}" not found in definitions`)
    }
    }
  
    public $diff ():Dictionary<any> {
      const originalData:Dictionary<any> = <Dictionary<any>>this.originalData
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
  
    public $json ():Dictionary<any> {
      const definition:Dictionary<Deserializer|Interface> = this._definition
      const data:Dictionary<any> = this._proxy
      return Object.keys(definition).reduce((acc:Dictionary<any>, key) => {
        acc[key] = this.serialize(key, data[key])
        return acc
      }, {})
    }
  }