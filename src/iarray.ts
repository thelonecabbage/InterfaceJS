import { Interface, Dictionary, Deserializer } from './classes'

const noop = () => undefined

interface StateInterface  {
  isInterface: boolean,
  isDirty: boolean,
  updatedCB: Function,
  handler: Deserializer | Interface,
  target: Array<any>
}
export function iArray (handler:Interface|Deserializer):Interface {
  class ArrayInterface extends Interface {
    protected originalData: Array<any>
    protected updatedData: Array<any>
    // protected updatedCB: Function

    constructor (data:Dictionary<any> = [], updatedCB = noop) {
      super()
      const state:StateInterface = {
        isInterface: Interface.isPrototypeOf(handler),
        isDirty: false,
        updatedCB,
        handler,
        target: []
      }
      state.target = data.map(d => deserialize(d, state))
      var proxy = new Proxy(state.target, {
        ...arrayProxyHandler,
        state
      })
      return proxy
    }
    
  }

  return <Interface><unknown>ArrayInterface
}

function deserialize (value:any, state:StateInterface):any {
  const { isInterface, updatedCB } = state
  const handler:Deserializer = <Deserializer>state.handler
  const Handler = <typeof Interface><unknown>state.handler
  return isInterface ? new Handler(value, () => {
    state.isDirty = true
    updatedCB()
  }) : handler(`iArray`, value)
}

const arrayProxyHandler = {
  get: function (target:Array<any>, property:number|string) {
    const state:StateInterface = this.state
    const { isInterface, handler } = state
    var value = target[<number>property]
    const $json = () => isInterface ? target.map(item => item.$json) : target.map((item, index) => handler.serialize(`iArray[${index}]`, item))
    switch (property) {
      case '$isInterface':
        return true
      case '$diff':
        value = state.isDirty ? $json() : []
        break
      case '$json':
        value = $json()
        break
    }
    return value
  },
  set: function (target:Dictionary<any>, property:number|string, value:any) {
    const state = this.state
    const { updatedCB } = state
    const index = Number(property)
    state.isDirty = true
    if (isNaN(index)) {
      target[property] = value
    } else {
      target[index] = deserialize(value, state)
      updatedCB()
    }
    return true
  }
}
