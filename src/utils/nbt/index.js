const nbt = require("prismarine-nbt")
const NBTBase = require("./base")
module.exports = class NBT extends NBTBase {
  constructor(buf, le = true) {
    super(le)
    this._data = nbt.parseUncompressed(buf, le)
  }
}