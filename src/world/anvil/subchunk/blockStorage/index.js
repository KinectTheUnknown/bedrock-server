const Palette = require("./palette")
module.exports = class BlockStorage {
  constructor(buf) {
    this.totalSize = 0
    let version = buf.readInt8(this.totalSize++)
    this.version = version & 1
    this.bitsPerBlock = version >> 1
    //Block per 32-bit int
    this.blocksPerWord = ~~(32 / this.bitsPerBlock)
    this.blockStates = {
      size: Math.ceil(4096 / this.blocksPerWord),
      states: []
    }
    const mask = 2 ** this.bitsPerBlock - 1

    for (let i = 0; i < this.blockStates.size; i++) {
      let n = buf.readUInt32LE(this.totalSize)
      this.totalSize += 4
      for (let j = 0; j < this.blocksPerWord; j++) {
        this.blockStates.states.push(n & mask)
        n >>= this.bitsPerBlock
      }
    }
    this.palette = new Palette(buf.slice(this.totalSize))
    this.totalSize += this.palette.totalSize
  }
  get(x, y, z) {
    const key = BlockStorage.coordToKey(x,y,z)
    const i = 
  }
  static coordToKey(x, y, z) {
    if (Math.max(x, y, z) > 15 || Math.min(x, y, z) < 0)
      throw new RangeError("Coordinates are out of range")

    return x << 8 | z << 4 | y
  }
}