export interface Password {
    id: string,
    password: string,
    timestamp: number
}

export interface Elderly {
    userId: string,
    name: string,
    email: string,
    phoneNumber: string,
    accepted: number
}

export interface SessionSignal {
    record: string,
}