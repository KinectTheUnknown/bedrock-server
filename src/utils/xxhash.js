const {rotateLeft} = require("./math")[64]

class BigInt64 {
  constructor(n = "0") {
    this.num = BigInt(n)
  }
  get num() {
    return this._num
  }
  set num(n) {
    this._num = BigInt.asUintN(64, n)
  }
  add(...n) {
    for (let num of n) {
      this.num += num
    }

    return this
  }
  clone() {
    return new BigInt64(this.num)
  }
  mul(...n) {
    for (let num of n) {
      this.num *= num
    }

    return this
  }
  rtL(n) {
    this.num = rotateLeft(this.num, n)

    return this
  }
  shR(n) {
    this._num >>= n

    return this
  }
  sub(n) {
    this.num -= n
    
    return this
  }
  xor(n) {
    this._num ^= BigInt.asUintN(64, n)

    return this
  }
  [Symbol.toPrimitive]() {
    return this.num
  }
}
const PRIME64_1 = BigInt("0x9E3779B185EBCA87")
const PRIME64_2 = BigInt("0xC2B2AE3D27D4EB4F")
const PRIME64_3 = BigInt("0x165667B19E3779F9")
const PRIME64_4 = BigInt("0x85EBCA77C2B2AE63")
const PRIME64_5 = BigInt("0x27D4EB2F165667C5")
exports[64] =
 function hash(buf, seed = BigInt(0)) {
   const input = new DataView(Uint8Array.from(buf).buffer)
   let acc
   if (input.byteLength < 32)
     acc = new BigInt64(seed).add(PRIME64_5)
   else {
     acc = new BigInt64()
     const accN = [
       new BigInt64(seed).add(PRIME64_1, PRIME64_2),
       new BigInt64(seed).add(PRIME64_2),
       new BigInt64(seed),
       new BigInt64(seed).sub(PRIME64_1)
     ]
     const iMax = Math.floor(input.byteLength / 32)

     for (let i = 0; i < iMax; i++) {
       //const stripe = input.getUint32(i, true)
       for (let j = 4; j--;) {
         let lane = BigInt(input.getBigUint64((i * 4 + j) * 8, true))
         round64(accN[j], lane)
       }
     }
     acc.add(
       rotateLeft(accN[0].num, 1),
       rotateLeft(accN[1].num, 7),
       rotateLeft(accN[2].num, 12),
       rotateLeft(accN[3].num, 18)
     )
     accN.reduce((a, b) => mergeAcc64(a, b.num), acc)
   }
   acc.add(BigInt(input.byteLength))
   let remainLen = input.byteLength % 32
   while (remainLen > 7) {
     const lane = input.getBigUint64(input.byteLength - remainLen, true)

     acc.xor(round64(new BigInt64(), lane).num)
       .rtL(27).mul(PRIME64_1)
       .add(PRIME64_4)
     remainLen -= 8
   }
   while (remainLen > 3) {
     const lane = new BigInt64(
       input.getUint32(input.byteLength - remainLen, true)
     )

     acc.xor(lane.mul(PRIME64_1).num)
       .rtL(23).mul(PRIME64_2)
       .add(PRIME64_3)
     remainLen -= 4
   }
   while (remainLen) {
     const lane = BigInt(input.getUint8(input.byteLength - remainLen))

     acc.xor(lane * PRIME64_5)
       .rtL(11).mul(PRIME64_1)
     remainLen--
   }
   acc.xor(acc.num >> BigInt(33))
     .mul(PRIME64_2)
     .xor(acc.num >> BigInt(29))
     .mul(PRIME64_3)
     .xor(acc.num >> BigInt(32))

   return acc.num
 }
function round64(accN, laneN) {
  return accN.add(laneN * PRIME64_2)
    .rtL(31)
    .mul(PRIME64_1)
}
function mergeAcc64(acc, accN) {
  return acc.xor(round64(new BigInt64(), accN).num)
    .mul(PRIME64_1)
    .add(PRIME64_4)
}