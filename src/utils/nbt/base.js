const nbt = require("prismarine-nbt")
module.exports = class NBTBase {
  constructor(le = false) {
    this._data = null
    this.le = le
  }
  get data() {
    return nbt.simplify(this._data)
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
    const res = this._get(key)
    
    return res instanceof Array ? res : nbt.simplify(res)
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