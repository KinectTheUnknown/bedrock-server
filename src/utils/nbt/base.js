const nbt = require("prismarine-nbt")
module.exports = class NBTBase {
  constructor(le = false) {
    this._data = null
    this.le = le
  }
  get data() {
    return nbt.simplify(this._data)
  }
  get rawData() {
    return nbt.writeUncompressed(this._data, this.le)
  }
  get(key) {
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
  has(key) {
    let curr = this._data.value
    for (let k of key.split(".")) {
      if (!(k in curr))
        return false

      curr = curr[k].value
    }

    return true
  }
  set(key, val) {
    if (!this.has(key))
      throw new Error("Key does not exist: " + key)

    const keys = key.split(".")
    let curr = this._data.value
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]

      if (!(k in curr)) {
        throw new TypeError(
          `The property '${keys[i]}' (${i}) doesn't exist`
        )
      }
      curr = curr[k].value
    }
    curr.value = val
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