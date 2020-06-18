module.exports = class ChunkBase {
  constructor(key, data) {
    this.type = data.type
    this.coords = {
      dim: data.dim,
      x: data.x,
      z: data.z
    }
  }
}