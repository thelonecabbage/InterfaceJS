import { Interface } from './classes'

const noop = () => undefined
export function iArray (handler) {
  class ArrayInterface extends Interface {
    constructor (data = [], updatedCB = noop) {
      super()
      const state = {
        isInterface: Interface.isPrototypeOf(handler),
        isDirty: false,
        updatedCB,
        handler
      }
      state.target = data.map(d => deserialize(d, state))
      var proxy = new Proxy(state.target, {
        ...arrayProxyHandler,
        state
      })
      return proxy
    }
  }

  return ArrayInterface
}

function deserialize (value, state) {
  const { isInterface, handler, updatedCB } = state
  return isInterface ? new handler(value, () => {
    state.isDirty = true
    updatedCB()
  }) : handler(`iArray`, value)
}

const arrayProxyHandler = {
  get: function (target, property = '') {
    const state = this.state
    const { isInterface, handler } = state
    var value = target[property]
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
  set: function (target, property, value, receiver) {
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
