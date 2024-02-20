interface Password {
    id: string,
    password: string,
    timestamp: number
}

interface Caregiver {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
}

export { Password, Caregiver }