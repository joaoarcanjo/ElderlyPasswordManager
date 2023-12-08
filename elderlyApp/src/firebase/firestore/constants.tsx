import { WordArray } from "crypto-es/lib/core"

const elderlyCollectionName = 'Elderly'
const credencialsCollectionName = 'Credencials'

const keyParameter = 'key'

const defaultCredencials = (data: string, nonce: string) => ({
    data: data,
    readCaregivers: [],
    writeCaregivers: [],
    iv: nonce
})

const defaultElderly = {
    key: '',
    caregivers: []
}

export { 
    elderlyCollectionName, 
    credencialsCollectionName, 
    keyParameter,
    defaultCredencials, 
    defaultElderly,
}