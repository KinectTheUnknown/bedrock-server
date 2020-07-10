const test = require("ava")
const {64: hash64} = require("../../src/utils/xxhash")

test("xxhash64 1 byte", t => {
  t.true(
    hash64(Buffer.from("M")).toString(16) === "75450393ed147192",
    "Hash of 1 byte string should be equal"
  )
})
test("xxhash64 4 byte", t => {
  t.true(
    hash64(Buffer.from("My t")).toString(16) === "da07b4f415685610",
    "Hash of 4 byte string should be equal"
  )
})
test("xxhash64 8 byte", t => {
  t.true(
    hash64(Buffer.from("My text ")).toString(16) === "8377e12eb3ff5e79",
    "Hash of 8 byte string should be equal"
  )
})
test("xxhash64 32 byte", t => {
  t.true(
    hash64(
      Buffer.from("My 32 byte long text to hash rn-")
    ).toString(16) === "cb6df19ecf70399d",
    "Hash of 32 byte string should be equal"
  )
})
test("xxhash64 45 byte", t => {
  t.true(
    hash64(
      Buffer.from("This string of text created is 45 bytes long.")
    ).toString(16) === "d195224b554a3417",
    "Hash of 45 byte string should be equal"
  )
})
test("xxhash64 64 byte", t => {
  t.true(
    hash64(
      Buffer.from(
        "This is random 64 byte long text that I've made up for this test"
      )
    ).toString(16) === "2289d269fc5bdc6a",
    "Hash of 64 byte string should be equal"
  )
})
test("xxhash64 90 byte", t => {
  t.true(
    hash64(
      Buffer.from(
        "Here I have a very long string. "
        + "It's so long, that it's 90 bytes long. Filling up string u"
      )
    ).toString(16) === "20ff811631f90334",
    "Hash of 90 byte string should be equal"
  )
    
})