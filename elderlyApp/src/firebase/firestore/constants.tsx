const elderlyCollectionName = 'Elderly'
const credencialsCollectionName = 'Credencials'

const defaultCredencials = (data: string) => ({
    data: data,
    readCaregivers: [],
    writeCaregivers: []
})

const defaultElderly = {
    key: 'randomKey',
    caregivers: []
}

export { 
    elderlyCollectionName, 
    credencialsCollectionName, 
    defaultCredencials, 
    defaultElderly 
}