const LevelDB = require("../../utils/leveldb")
const NBT = require("../../utils/nbt")
const SubChunk = require("./subchunk")
module.exports = class Anvil extends LevelDB {
  constructor(dir, folder = "db") {
    super(dir, folder)
  }
  get(key) {
    return super.get(key)
      .then(ent => Anvil.parseEnt(ent))
  }
  static decomposeKey(key) {
    const type = this.getKeyTag(key)

    if (type === "SPECIAL") {
      return {
        type: "SPECIAL",
        name: key.toString("ascii")
      }
    }
    const res = {
      type,
      dim: this.getKeyDim(key),
      x: key.readInt32LE(),
      z: key.readInt32LE(4)
    }

    if (res.type === 47)
      res.index = key.readUInt8(key.length - 1)

    return res
  }
  //eslint-disable-next-line complexity
  static parseEnt(key, val) {
    const data = this.decomposeKey(key)

    switch (data.type) {
      case 45:
      case 46:
        break
      case 47:
        return new SubChunk(key, data, val)
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
      case "SPECIAL":
        return new NBT(val, true)
      default:
        throw new Error("Unrecognized tag " + key.readInt8(8))
    }
  }
  static getChunkCoordFromWorldCoord(x, z) {
    return {
      x: Math.floor(x / 16),
      z: Math.floor(z / 16)
    }
  }
  static getKeyDim(key) {
    switch (key.length) {
      case 9:  //Not SubChunk, Overworld
      case 10: //SubChunk, Overworld
        return null
      case 13: //Not SubChunk, Not Overworld
      case 14: //SubChunk, Not Overworld
        return key.readInt8(8)
      default:
        throw new Error("Unable to resolve dimension of key")
    }
  }
  static getKeyTag(key) {
    if (/^[a-z0-9_~\\-]+$/gi.test(key.toString("ascii")))
      return "SPECIAL"
    
    switch (key.length) {
      case 9:  //Not SubChunk, Overworld
      case 10: //SubChunk, Overworld
        return key.readInt8(8)
      case 13: //Not SubChunk, Not Overworld
      case 14: //SubChunk, Not Overworld
        return key.readInt8(12)
      default:
        throw new Error("Unable to resolve type of key " + key.toString("hex"))
    }
  }
  static generateKey({
    x = 0,
    z = 0,
    type = undefined,
    name = null,
    dim = null,
    ind = 0
  } = {}) {
    if (type === "SPECIAL")
      return Buffer.from(name, "ascii")

    const key = Buffer.alloc(this.getNeededSize(type, dim))

    key.writeInt32LE(x)
    key.writeInt32LE(z, 4)
    if (dim) {
      if (dim !== 1 && dim !== 2)
        throw new RangeError("Invalid Dimension value " + dim)

      key.writeUInt32LE(dim, 8)
    }
    key.writeUInt8(type, key.length)
    if (type === 47)
      key.writeUInt8(ind, key.length)

    return key
  }
  static getNeededSize(type, dim) {
    let size = 9
    if (dim)
      size += 4

    if (type === 47)
      size += 1

    return size
  }
}