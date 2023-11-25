const elderlyCollectionName = 'Elderly'
const credencialsCollectionName = 'Credencials'

const keyParameter = 'key'

const defaultCredencials = (data: string) => ({
    data: data,
    readCaregivers: [],
    writeCaregivers: []
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