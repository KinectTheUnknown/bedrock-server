const LevelDB = require("../../utils/leveldb")
const SubChunk = require("./subchunk")
module.exports = class Anvil extends LevelDB {
  constructor(dir, folder = "db") {
    super(dir, folder)
  }
  static parseEnt(key, val) {
    switch (Anvil.getKeyTag(key)) {
      case 45:
      case 46:
        break
      case 47:
      case 48:
      case 49:
      case 50:
      case 51:
      case 53:
      case 56:
      case 57:
      case 58:
      case 59:
      case 119:
        return val
      //Deprecated tags
      case 52:
      case 55:
        throw new Error("Unhandled Deprecated tag " + key.readInt8(8))
      default:
        throw new Error("Unrecognized tag " + key.readInt8(8))
    }
  }
  static getKeyTag(key) {
    switch (key.length) {
      case 9:  //Not SubChunk, Overworld
      case 10: //SubChunk, OverWorld
        return key.readInt8(9)
      case 13: //Not SubChunk, Not OverWorld
      case 14: //SubChunk, Not Overworld
        return key.readInt8(13)
      default:
        throw new Error("Unable to resolve type of key")
    }
  }
}