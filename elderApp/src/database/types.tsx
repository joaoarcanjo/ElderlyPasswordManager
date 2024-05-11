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
    ACCEPTED = 1, //Relação aceite
    RECEIVED = 2, //Pedido recebido
    WAITING = 3 //À espera de resposta
}

export enum TimeoutType {
    SSS = 1,
    SPLASH = 2
}