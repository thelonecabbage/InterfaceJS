import { Interface, Dictionary, Deserializer } from './classes'

const noop = () => undefined

export function iArray (elementHandler:Interface|Deserializer):Interface {
  class ArrayInterface extends Interface {
    definition () {
      return {}
    }
    protected data: Array<any>
    // protected updatedCB: Function
    protected isDirty: boolean = false
    constructor (data:Dictionary<any> = [], updatedCB = noop) {
      super(null, updatedCB)
      this.data = data.map((d:any) => this.deserialize(d))
      this._proxy = new Proxy(this.data, <ProxyHandler<any>><unknown>this)
      return this._proxy
    }

    protected getHandlers() {
      const handler = <Deserializer>elementHandler
      const Handler = <typeof Interface><unknown>elementHandler
      const isInstance = Interface.isPrototypeOf(Handler)
      return {handler, Handler, isInstance}
    }

    protected deserialize (value:any):any {
      const {handler, Handler, isInstance} = this.getHandlers()
      if (isInstance) {
        return new Handler(value, () => {
          this.isDirty = true
          this.updatedCB()
        })
      } else {
        return handler(`iArray`, value)
      }
    }

    protected serialize (value:any):any {
      const {handler, Handler, isInstance} = this.getHandlers()
      if (isInstance) {
        return value?.$json
      } else {
        return handler.serialize(`iArray`, value)
      }
    }
    
    protected serializeObj():Array<any> {
      return this.data.map((d:any) => this.serialize(d))
    }
    protected diff():Array<any> {
      return this.isDirty ? this.serializeObj() : []
    }

    protected get(target:Array<any>, property:number|string) {
      switch (property) {
        case '$isInterface':
          return true
        case '$diff':
          return this.diff()
        case '$json':
          return this.serializeObj()
      }
      return target[<number>property]
    }
    protected set(target:Dictionary<any>, property:number|string, value:any) {
      const index = Number(property)
      this.isDirty = true
      if (isNaN(index)) {
        target[property] = value
      } else {
        target[index] = this.deserialize(value)
        this.updatedCB()
      }
      return true
    }
}

  return <Interface><unknown>ArrayInterface
}
