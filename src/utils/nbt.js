const {promisify} = require("util")
const path = require("path")
const fs = require("fs").promises
const nbt = require("prismarine-nbt")
const parse = promisify(nbt.parse)
module.exports = class NBT {
  constructor(dir, fName) {
    this.file = path.join(dir, fName)
  }
  async init() {
    if (this._data)
      throw new Error("Already initiated")

    this._data = await this.readFile()
      .then(NBT.parseData)
  }
  get data() {
    return nbt.simplify(this._data)
  }
  get rawData() {
    return nbt.writeUncompressed(this._data)
  }
  get(key) {
    let item = this._data[key]

    return item ? item.value : null
  }
  has(key) {
    return key in this._data
  }
  readFile() {
    return this.readFile(this.file)
  }
  save() {
    return fs.writeFile(this.file, this.rawData)
  }
  set(key, val) {
    if (!this.has(key))
      throw new Error("Key does not exist: " + key)

    this._data[key].value = val

    return this.save()
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
  static parseData(data) {
    return parse(data, true)
  }
  [Symbol.iterator]() {
    return this.entries()
  }
}