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
    let item = this._data[key]

    return item ? item.value : null
  }
  has(key) {
    return key in this._data
  }
  set(key, val) {
    if (!this.has(key))
      throw new Error("Key does not exist: " + key)

    this._data[key].value = val
  }
  toBuffer() {
    return nbt.writeUncompressed(this._data, this.le)
  }
  keys() {
    return Object.keys(this._data).values()
  }
  *values() {
    for (let key of this.keys()) {
      yield this._data[key].value
    }
  }
  *entries() {
    for (let key of this.keys()) {
      let item = this._data[key]
      yield [key, item.value, item.type]
    }
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}