const noop = () => null

class Interface {
  definition () { return {} }

  constructor (data = {}, updatedCB = noop) {
    const state = {
      originalData: {},
      updatedData: {},
      updatedCB,
      definition: this.definition(),
      proxy: null
    }
    state.originalData = parseObj(state, data)

    var proxy = new Proxy(this, {
      ...proxyGetterSetter,
      state
    })
    state.proxy = proxy
    return proxy
  }
}

function parseObj (state, data) {
  const { definition, updatedCB } = state
  let original = {}
  Object.entries(definition).reduce((acc, [key, handler]) => {
    const htype = typeof handler
    if (htype === 'function') {
      if (Interface.isPrototypeOf(handler)) {
        acc[key] = new handler(data[key], () => {
          const diff = state.proxy[key].$diff
          state.updatedData[key] = diff
          updatedCB(key, state.updatedData[key])
        })
      } else {
        acc[key] = handler(key, data[key])
      }
    }
    return acc
  }, original)
  return original
}
function diff (originalData, updatedData) {
  return Object.keys(updatedData).reduce((acc, key) => {
    if (originalData[key] !== updatedData[key]) {
      if (updatedData[key].$isInterface) {
        acc[key] = updatedData[key].$json
      } else {
        acc[key] = updatedData[key]
      }
    }
    return acc
  }, {})
}
function serialize (definition, data) {
  return Object.entries(definition).reduce((acc, [key, handler]) => {
    const htype = typeof handler
    if (htype === 'function') {
      if ((data[key] && data[key].$isInterface) || Interface.isPrototypeOf(handler)) {
        acc[key] = data[key].$json
      } else {
        acc[key] = handler.serialize(key, data[key])
      }
    }
    return acc
  }, {})
}
const proxyGetterSetter = {
  get (target, key) {
    const state = this.state
    const isInstance = state.originalData[key] && state.originalData[key].$isInterface
    var value
    switch (key) {
      case '$isInterface':
        return true
      case '$diff':
        value = diff(state.originalData, state.updatedData)
        break
      case '$json':
        value = serialize(state.definition, state.proxy)
        break
      default:
        value = (isInstance || state.updatedData[key] === undefined) ? state.originalData[key] : state.updatedData[key]
    }
    return value
  },
  set (target, key, value) {
    const state = this.state
    try {
      state.updatedData[key] = state.definition[key](key, value)
      state.updatedCB(key, value)
      return true
    } catch {
      throw new Error(`"${key}" not found in definitions`)
    }
  }
}

module.exports = {
  Interface
}