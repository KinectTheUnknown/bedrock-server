const nbt = require("prismarine-nbt")
module.exports = class Palette {
  constructor(buf) {
    this.totalSize = 0
    //Number of BlockStates
    this.size = buf.readUInt32LE()
    this.totalSize += 4
    this.states = []
    for (let i = 0; i < this.size; i++) {
      const blockState = nbt.parseUncompressed(buf.slice(this.totalSize), true)

      this.states.push(blockState)
      this.totalSize += nbtSize(blockState)
    }
  }
}
function nbtSize(obj) {
  //Try to make nbt.proto.sizeOf work
  return nbt.writeUncompressed(obj).length
}