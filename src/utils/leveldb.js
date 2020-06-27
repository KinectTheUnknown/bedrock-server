const path = require("path")
const LUp = require("levelup")
const LDn = require("leveldb-mcpe")
module.exports = class LevelDB {
  constructor(dir, folder) {
    this.dir = path.join(dir, folder)
  }
  get(key) {
    return this.db.get(key)
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
  async *keys() {
    for await (let [key] of this)
      yield key
  }
  async *entries() {
    const iter = this.db.iterator()
    const next = () => new Promise((res, rej) => {
      iter.next((e, k, v) => (e ? rej(e) : res([k, v])))
    })

    try {
      while (true) {
        const ent = await next()

        if (!ent[0])
          break
        
        yield ent
      }
    } finally {
      await new Promise((res, rej) => iter.end(e => (e ? rej(e) : res())))
    }
  }
  async *values() {
    for await (let [, val] of this)
      yield val
  }
  [Symbol.asyncIterator]() {
    return this.entries()
  }
}