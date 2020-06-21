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
    let item = this._data.value
    for (let [i, k] of keys.entries()) {
      if (!item) {
        throw new TypeError(
          `Can't read property '${keys[i - 1]}' (${i - 1}) of undefined`
        )
      }
      item = k in item ? item[k].value : undefined
    }

    return item
  }
  get(key) {
    return nbt.simplify(this._get(key))
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
  set(key, val, {create = false}) {
    const curr = this._get(key)
    let created = false
    if (!curr) {
      if (!create)
        throw new Error("Key does not exist: " + key)

      created = true
    }
    curr.value = val

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