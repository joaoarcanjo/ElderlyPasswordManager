const elderlyCollectionName = 'Elderly'
const credencialsCollectionName = 'Credencials'

const keyParameter = 'key'

const defaultCredencials = (data: string, nonce: string) => ({
    data: data,
    readCaregivers: [],
    writeCaregivers: [],
    iv: nonce
})

const updateDataCredencial = (data: string, nonce: string) => ({
    data: data,
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
    updateDataCredencial,
    defaultElderly,
}