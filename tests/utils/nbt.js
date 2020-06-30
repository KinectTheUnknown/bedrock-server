const test = require("ava")
const fs = require("fs").promises
const path = require("path")
const helloWorld = require("./hello_world.json")
/* eslint-disable global-require */

{
  const NBT = require("../../src/utils/nbt/")

  test("NBT reading, setting, and creating keys", async t => {
    const buf = await fs.readFile(path.join(__dirname, "./hello_world.nbt"))
    const nbt = new NBT(buf, false)

    t.deepEqual(
      nbt._data, helloWorld.raw,
      "Should be exactly the same structure"
    )
    t.deepEqual(
      nbt.data,
      helloWorld.simplified,
      "Should simplify to the same structure"
    )
    t.deepEqual(
      nbt._get("name"),
      helloWorld.raw.value.name,
      "Should return the raw object"
    )
    t.true(
      nbt.get("name") === helloWorld.simplified.name,
      "Should return the value"
    )
    t.false(
      nbt.set("name", "KinectTheUnknown"),
      "Should set value, but not create a new key"
    )
    t.throws(
      () => nbt.set("food", "Pizza"),
      {message: "Tried to create new key, but type was not specified"},
      "Should not create a new key without a type"
    )
    t.true(
      nbt.set("food", "Pizza", "string"),
      "Should create a new key with value"
    )
  })
}
