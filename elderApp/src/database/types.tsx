export interface Password {
    id: string,
    password: string,
    timestamp: number
}

export interface Caregiver {
    caregiverId: string,
    name: string,
    email: string,
    phoneNumber: string,
    requestStatus: CaregiverRequestStatus
}

export interface SessionSignal {
    record: string,
}

export enum CaregiverRequestStatus {
    ACCEPTED = 1,
    RECEIVED = 2,
    WAITING = 3,
    DECOUPLING = 4
}