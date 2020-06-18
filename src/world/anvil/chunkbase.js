module.exports = class ChunkBase {
  constructor(key, type) {
    this.type = type
    this.coords = {
      dim: key.length >= 13 ? key.readUInt32LE(8) : null,
      x: key.readInt32LE(0),
      z: key.readInt32LE(4)
    }
  }
}