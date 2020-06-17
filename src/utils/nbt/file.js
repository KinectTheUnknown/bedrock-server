const {promisify} = require("util")
const path = require("path")
const fs = require("fs").promises
const nbt = require("prismarine-nbt")
const parse = promisify(nbt.parse)
const NBTBase = require("./base")
module.exports = class NBTFile extends NBTBase {
  constructor(dir, fName) {
    super()
    this.file = path.join(dir, fName)
  }
  async init() {
    if (this._data)
      throw new Error("Already initiated")

    this._data = await this.readFile()
      .then(NBTFile.parseData)
  }
  get data() {
    return nbt.simplify(this._data)
  }
  readFile() {
    return fs.readFile(this.file)
  }
  save() {
    return fs.writeFile(this.file, this.toBuffer())
  }
  set(key, val) {
    super.set(key, val)

    return this.save()
  }
  toBuffer() {
    return nbt.writeUncompressed(this._data)
  }
  static parseData(data) {
    return parse(data, true)
  }
}