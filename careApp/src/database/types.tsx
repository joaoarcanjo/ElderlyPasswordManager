export interface Password {
    id: string,
    password: string,
    timestamp: number
}

export interface Elderly {
    elderlyId: string,
    name: string,
    email: string,
    phoneNumber: string,
    status: number
}

export interface SessionSignal {
    record: string,
}

export enum ElderlyRequestStatus {
    ACCEPTED = 1,
    RECEIVED = 2,
    WAITING = 3
}