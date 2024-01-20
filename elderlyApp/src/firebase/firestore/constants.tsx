const elderlyCollectionName = 'Elderly'
const credencialsCollectionName = 'Credencials'

const keyParameter = 'key'

const defaultCredencials = (data: string) => ({
    data: data,
    readCaregivers: [],
    writeCaregivers: []
})

const updateDataCredencial = (data: string) => ({
    data: data,
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