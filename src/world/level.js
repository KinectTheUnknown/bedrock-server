const NBTFile = require("../utils/nbt/file")
module.exports = class Level extends NBTFile {
  constructor(dir, fName = "level.dat", le = true) {
    super(dir, fName, le)
  }
  get prefix() {
    const buf = new Buffer(8)

    buf.writeInt32LE(this.version, 0)
    buf.writeInt32LE(this.size, 4)

    return buf
  }
  async init() {
    const res = await super.init()

    this.version = res.version
    this.size = res.size

    return res
  }
  toBuffer() {
    return Buffer.concat([this.prefix, super.toBuffer()])
  }
  static async parseData(data, le) {
    return {
      version: data.readUInt32LE(0),
      size: data.readUInt32LE(4),
      data: await super.parseData(data.slice(8), le)
    }
  }
}