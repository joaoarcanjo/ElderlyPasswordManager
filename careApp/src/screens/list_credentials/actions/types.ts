export interface CredentialLoginData {
    id: string,
    type: string,
    platform: string,
    uri: string,
    username: string,
    password: string,
    edited: {
        updatedBy: string,
        updatedAt: number
    }
}

export interface CredentialCardData {
    id: string,
    type: string,
    platform: string,
    ownerName: string,
    cardNumber: string,
    securityCode: string,
    verificationCode: string,
    edited: {
        updatedBy: string,
        updatedAt: number
    }
}

export interface CredentialType {
    id: string,
    data: CredentialCardData | CredentialLoginData
}