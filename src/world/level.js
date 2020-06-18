const NBTFile = require("../utils/nbt/file")
//The characters removed to avoid having to parse nbt twice
//(the useful nbt data is nested in the nbt stored in level.dat)
const prefix = Buffer.from("\b\u0000\u0000\u0000\b\b\u0000\u0000")
module.exports = class Level extends NBTFile {
  constructor(dir, fName = "level.dat", le = true) {
    super(dir, fName, le)
  }
  parseData(data) {
    return super.parseData(data.slice(prefix.length))
  }
  toBuffer() {
    return Buffer.concat([prefix, super.toBuffer()])
  }
}