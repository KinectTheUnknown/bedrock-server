module.exports = class ChunkBase {
  constructor(key) {
    this.index = key.readUInt8(key.length - 1)
    this.type = key.readUInt8(key.length - 2)
    this.coords = {
      dim: key.length >= 13 ? key.readUInt32LE(8) : null,
      x: key.readInt32LE(0),
      z: key.readInt32LE(4)
    }
  }
}