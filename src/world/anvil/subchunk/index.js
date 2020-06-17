const BlockStorage = require("./blockStorage/")
const ChunkBase = require("../chunkbase")
module.exports = class SubChunk extends ChunkBase {
  constructor(key, val) {
    super(key)
    //Offset when reading value in bytes (8 bits)
    let vOff = 0
    //this.buffer = val
    this.version = val.readUInt8(vOff++)
    this.storage = {
      count: 1,
      blocks: []
    }
    if (this.version !== 1)
      this.storage.count = val.readUInt8(vOff++)

    for (let i = 0; i < this.storage.count; i++) {
      const blockStorage = new BlockStorage(val.slice(vOff))

      vOff += blockStorage.totalSize
      this.storage.blocks.push(blockStorage)
    }
    if (vOff !== val.length)
      throw new Error("Not all bytes were consumed")
  }

}