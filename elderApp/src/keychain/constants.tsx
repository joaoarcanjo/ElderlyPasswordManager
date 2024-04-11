export const elderlyId = 'userId'
export const elderlyEmail = 'userEmail'
export const elderlyPwd = 'userPwd'

export const elderlyPhone = (elderlyId: string) => `${elderlyId}-userPhone`
export const elderlyName = (elderlyId: string) => `${elderlyId}-userName`
export const elderlyFireKey = (elderlyId: string) => `${elderlyId}-elderly`
export const caregiver1SSSKey = (elderlyId: string) => `${elderlyId}-caregiver1`
export const caregiver2SSSKey = (elderlyId: string) => `${elderlyId}-caregiver2`
export const firestoreSSSKey = (elderlyId: string) => `${elderlyId}-firestoreSSSKey`
export const localDBKey = (elderlyId: string) => `${elderlyId}-localDBKey`
export const signalPublicKey = (elderlyId: string) => `${elderlyId}-signalPublicKey`
export const signalPrivateKey = (elderlyId: string) => `${elderlyId}-signalPrivateKey`

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