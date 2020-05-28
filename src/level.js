const {promisify} = require("util")
const path = require("path")
const fs = require("fs").promises
const nbt = require("prismarine-nbt")
const parse = promisify(nbt.parse)
module.exports = class Level {
  constructor(dir, fName = "level.dat") {
    this.file = path.join(dir, fName)
  }
  async init() {
    this._data = await fs.readFile(this.path)
      .then(d => parse(d.slice(8), true))
  }
  get data() {
    return nbt.simplify(this._data)
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
  has(key) {
    return key in this._data
  }
  save() {
    let data = nbt.writeUncompressed(this._data)

    return fs.writeFile(this.file, data)
  }
  set(key, val) {
    if (!this.has(key))
      throw new Error("Key does not exist: " + key)

    this._data[key].value = val

    return this.save()
  }
}