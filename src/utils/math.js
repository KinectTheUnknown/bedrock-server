exports[64] = {
  MAX: BigInt("0xffffffffffffffff"),
  rotateLeft(num, amount = 0) {
    if (typeof num !== "bigint")
      throw new TypeError("Number must be a BigInt")

    if (num > exports[64].MAX)
      throw new RangeError("Number exceeds 64 bits")

    if (!Number.isInteger(amount))
      throw new Error("Amount must be an integer")

    if (amount < 0)
      throw new RangeError("Amount must be greater than 0")

    if (amount >= 64)
      amount %= 64

    if (amount === 0)
      return num

    return num << BigInt(amount) | num >> BigInt(64 - amount)
  }
}