const { combine } = require('./algorithm/combine')

global.Buffer = require('buffer').Buffer;

/**
 * Esta função, ao receber um array de shares, vai retornar o segredo que é possível
 * obter a partir dos mesmos.
 * @param shares 
 * @returns 
 */
function deriveSecret(shares: string[]): string {
    const recovered = combine(shares)
    return String.fromCharCode.apply(null, Array.from(recovered))
}

export { deriveSecret }