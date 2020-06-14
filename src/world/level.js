const NBT = require("../utils/nbtFile")
//The characters removed to avoid having to parse nbt twice
//(the useful nbt data is nested in the nbt stored in level.dat)
const prefix = Buffer.from("\b\u0000\u0000\u0000\b\b\u0000\u0000")
module.exports = class Level extends NBT {
  constructor(dir, fName = "level.dat") {
    super(dir, fName)
  }
  get rawData() {
    return Buffer.concat([prefix, super.rawData])
  }
  static parseData(data) {
    return super.parseData(data.slice(prefix.length))
  }
}