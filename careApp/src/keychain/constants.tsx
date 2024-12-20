export const caregiverId = 'userId'
export const caregiverEmail = 'userEmail'
export const caregiverPwd = 'userPwd'

export const caregiverPhone = (caregiverId: string) => 
    `${caregiverId}-userPhone`

export const caregiverName = (caregiverId: string) => 
    `${caregiverId}-userName`

export const elderlySSSKey = (caregiverId: string, elderlyId: string) => `${caregiverId}-${elderlyId}-elderlySSSKey`
export const localDBKey = (caregiverId: string) => `${caregiverId}-localDBKey`
export const caregiverFireKey = (caregiverId: string) => `${caregiverId}-firestoreKey`
export const signalPublicKey = (caregiverId: string) => `${caregiverId}-signalPublicKey`
export const signalPrivateKey = (caregiverId: string) => `${caregiverId}-signalPrivateKey`

//Signal protocol
export const registrationId = (elderlyId: string) => `${elderlyId}-registrationId`
export const keySignedPub25519 = (elderlyId: string, keyId: string | number) => `${elderlyId}-keySignedPub25519-${keyId}`
export const keySignedPriv25519 = (elderlyId: string, keyId: string | number) => `${elderlyId}-keySignedPriv25519-${keyId}`
export const signedKeySignature25519 = (elderlyId: string, keyId: string | number) => `${elderlyId}-signedKeySignature25519-${keyId}`
export const signedPreKeyId = (elderlyId: string) => `${elderlyId}-signedPreKeyId`
export const identityIdPubKey = (elderlyId: string) => `${elderlyId}-identityIdPubKey`
export const identityIdPrivKey = (elderlyId: string) => `${elderlyId}-identityIdPrivKey`
export const identityKeyK = (elderlyId: string, identifier: string) => `${elderlyId}-identityKey-${identifier}`
export const keypreKeyPub25519 = (elderlyId: string, keyId: string | number) => `${elderlyId}-keypreKeyPub25519-${keyId}`
export const keypreKeyPriv25519 = (elderlyId: string, keyId: string | number) => `${elderlyId}-keypreKeyPriv25519-${keyId}`
export const baseKeyIdK = (elderlyId: string) => `${elderlyId}-baseKeyId`