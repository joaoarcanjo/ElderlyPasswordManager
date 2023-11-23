import * as Crypto from 'expo-crypto';

export function getNewId() {
    //RandomUUID que vai ser futuramente apagado e substituido pelo ID do idoso.
    return Crypto.randomUUID()
}