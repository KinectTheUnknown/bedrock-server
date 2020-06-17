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
}