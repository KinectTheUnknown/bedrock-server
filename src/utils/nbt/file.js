const {promisify} = require("util")
const path = require("path")
const fs = require("fs").promises
const nbt = require("prismarine-nbt")
const parse = promisify(nbt.parse)
const NBTBase = require("./base")
module.exports = class NBTFile extends NBTBase {
  constructor(dir, fName, le) {
    super(le)
    this.file = path.join(dir, fName)
  }
  async init() {
    if (this._data)
      throw new Error("Already initiated")

    const res = await this.readFile()
      .then(d => this.constructor.parseData(d, this.le))

    this._data = res.data

    return res
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
  static async parseData(data, le = true) {
    return {
      data: await parse(data, le)
    }
  }
}