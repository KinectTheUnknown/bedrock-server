const nbt = require("prismarine-nbt")
module.exports = class NBTBase {
  constructor(le = false) {
    this._data = null
    this.le = le
  }
  get data() {
    return format(this._data.type, this._data.value)
  }
  _get(key) {
    const keys = key.split(".")
    let item = this._data
    for (let [i, k] of keys.entries()) {
      if (!item) {
        throw new TypeError(
          `Can't read property '${keys[i - 1]}' (${i - 1}) of undefined`
        )
      }
      switch (item.type) {
        case "list":
          item = item.value
          //falls through
        case "compound":
          item = item.value[k]
          break
        default:
          throw new Error(
            "Key is not a list nor compound " + keys.slice(0, i + 1)
          )
      }
    }

    return item
  }
  get(key) {
    let pKey = key.split(".")
    const cKey = pKey.pop()

    pKey = pKey.join(".")
    const parent = pKey ? this._get(pKey) : this._data

    if (!parent)
      throw new TypeError(`Can't read property ${cKey} of undefined`)

    let cType, cVal
    switch (parent.type) {
      case "compound":
        if (!(cKey in parent.value))
          return undefined

        cVal = parent.value[cKey]
        cType = cVal.type
        cVal = cVal.value
        break
      case "list":
        if (!Number.isInteger(+cKey))
          throw new TypeError("Index is not a number")
        
        if (parseInt(cKey) < 0)
          throw new RangeError("Index is out of range")

        cVal = parent.value
        cType = cVal.type
        cVal = cVal.value[cKey]
        break
      default:
        throw new TypeError("Parent is neither a list nor a compound")
    }

    return format(cType, cVal)
  }
  has(key) {
    let curr = this._data.value
    for (let k of key.split(".")) {
      if (!(k in curr))
        return false

      curr = curr[k].value
    }

    return true
  }
  set(key, value, type = null) {
    let pKey = key.split(".")
    const name = pKey.pop()

    pKey = pKey.join(".")
    const parent = pKey ? this._get(pKey) : this._data
    let created = false
    if (!parent)
      throw new Error("Key does not exist " + pKey)

    switch (parent.type) {
      case "compound":
        if (name in parent.value)
          parent.value[name].value = value
        else {
          if (!type) {
            throw new Error(
              "Tried to create new key, but type was not specified"
            )
          }
          created = true
          parent.value[name] = {
            type,
            value
          }
        }
        break
      case "list":
        if (!Number.isInteger(name) || parseInt(name) < 0)
          throw new RangeError("Index is not a positive integer")

        parent.value.value[name] = value
    }

    return created
  }
  toBuffer() {
    return nbt.writeUncompressed(this._data, this.le)
  }
  keys() {
    return Object.keys(this._data.value).values()
  }
  *values() {
    for (let key of this.keys()) {
      yield this._data.value[key].value
    }
  }
  *entries() {
    for (let key of this.keys()) {
      let item = this._data.value[key]
      yield [key, item.value, item.type]
    }
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}
function format(type, value) {
  switch (type) {
    case "compound": {
      const obj = {}

      for (let [key, item] of Object.entries(value))
        obj[key] = format(item.type, item.value)

      return obj
    }
    case "list":
      return value.value.map(item => format(value.type, item))
    case "byteArray":
      return Int8Array.from(value/*, item => format("byte", item)*/)
    case "long": {
      let [a, b] = value
      if (a < 0)
        a += 2 ** 32

      if (b < 0)
        b += 2 ** 32

      return BigInt(a) * BigInt(2 ** 32) | BigInt(b)
    }
    case "byte":
    case "short":
    case "int":
    case "float":
    case "double":
    case "string":
      return value
    default:
      throw new TypeError("Unknown tag type " + type)
  }
}