interface Password {
    id: string,
    password: string,
    timestamp: number
}

interface Elderly {
    userId: string,
    name: string,
    email: string,
    phoneNumber: string,
    accepted: number
}

export { Password, Elderly }