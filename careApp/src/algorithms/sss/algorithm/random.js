import * as Crypto from 'expo-crypto';

function random(size) {
  const r = Crypto.getRandomBytes(32 + size)
  return r.slice(32)
}

module.exports = {
  random
}
