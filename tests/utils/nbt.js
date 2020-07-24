const test = require("ava")
const fs = require("fs").promises
const path = require("path")
const pNbt = require("prismarine-nbt")
const helloWorld = require("../files/hello_world.json")
const bigTest = require("../files/bigtest")
/* eslint-disable global-require */

{
  const NBT = require("../../src/utils/nbt/")

  test("NBT reading, setting, and creating keys", async t => {
    const buf = await fs.readFile(
      path.join(__dirname, "../files/hello_world.nbt")
    )
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
{
  const NBTBase = require("../../src/utils/nbt/base")

  test("NBT nested keys", async t => {
    const nbt = new NBTBase(false)

    nbt._data = await fs.readFile(path.join(__dirname, "../files/bigtest.nbt"))
      .then(d => new Promise((res, rej) => {
        pNbt.parse(d, nbt.le, (e, v) => (e ? rej(e) : res(v)))
      }))
    t.deepEqual(nbt._data, bigTest.raw, "Should be exactly the same structure")
    t.deepEqual(nbt.data, bigTest.simplified)
    t.true(
      nbt.get("longTest") === bigTest.simplified.longTest,
      "Should return correct item as BigInt"
    )
    const nct = bigTest.simplified["nested compound test"]

    t.true(
      nbt.get("nested compound test.ham.name") === nct.ham.name,
      "Should return correct item"
    )
    t.true(
      nbt.get("nested compound test.ham.value") === nct.ham.value,
      "Should return correct item"
    )
    const ltc = bigTest.simplified["listTest (compound)"][0]
    const nbtLtc = nbt.get("listTest (compound).0")
    
    //Ensures correct item is selected for following test
    t.true(
      nbtLtc.name === ltc.name,
      "Should return correct item"
    )
    t.true(
      nbtLtc["created-on"][1] === ltc["created-on"][1],
      "Should return correct item"
    )
    t.true(nbt.get("foo") === undefined)
    t.throws(() => nbt.get("foo.bar"), {
      message: "Can't read property bar of undefined"
    })
    t.true(nbt.set("foo", {}, "compound"), "Should create new prop")
    t.true(nbt.set("foo.bar", 90, "int"), "Should create new prop")
    t.deepEqual(nbt._get("foo"), {
      name: "foo",
      type: "compound",
      value: {
        bar: {
          type: "int",
          value: 90
        }
      }
    }.nam,)
    t.true(nbt.get("foo.bar") === 90)
  })
}
{
  const NBTFile = require("../../src/utils/nbt/file")

  test("NBTFile reading keys", async t => {
    const nbt = new NBTFile(__dirname, "../files/hello_world.nbt", false)
    
    await nbt.init()
    t.deepEqual(nbt._data, helloWorld.raw)
  })
}