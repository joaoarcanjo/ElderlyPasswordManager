const { BIN_ENCODING } = require('./constants')
const { split } = require('./split')
const { combine } = require('./combine')
global.Buffer = require('buffer').Buffer;

function generateShares(secret, numberOfShares, threshold) {
    let shares = split(Buffer.from(secret), { shares: numberOfShares, threshold: threshold })
    shares = shares.map(share => Buffer.from(share).toString(HEX_ENCODING))
    //console.log("Buffers:")
    //shares.map(share => console.log(share))
    return shares
}

function deriveSecret(shares) {
    const recovered = combine(shares)
    return recovered.toString()
}

module.exports = {
    generateShares, deriveSecret
}

/*

const { generateShares, deriveSecret } = require('../../../algorithms/sss/sss')

HOW TO USE IT:
    const shares = generateShares("OASDM1231 31J3221O3 C231231233",3,2)
    const share = deriveSecret([shares[0], shares[1]])
    console.log(share)
*/