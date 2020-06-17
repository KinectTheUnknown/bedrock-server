const path = require("path")
const LUp = require("levelup")
const LDn = require("leveldb-mcpe")
module.exports = class LevelDB {
  constructor(dir, folder) {
    this.dir = path.join(dir, folder)
  }
  init() {
    return new Promise((res, rej) => {
      LUp(new LDn(this.dir), (err, db) => (err ? rej(err) : res(db)))
    }).then(db => {
      this.db = db.on("error", err => {
        console.error(err)
        db.close()
      })

      return db
    })
  }
  async *entries() {
    const iter = this.db.iterator()

    while (true) {
      const ent = await new Promise((res, rej) => {
        iter.next((e, k, v) => (e ? rej(e) : res([k, v])))
      })

      if (!ent[0])
        break
      
      yield ent
    }
    await new Promise((res, rej) => iter.end(e => (e ? rej(e) : res)))
  }
  static parseEnt() {
    throw new Error("LevelDB.parseEnt needs to be overridden")
  }
}