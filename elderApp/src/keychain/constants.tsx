export const elderlyId = 'userId'
export const elderlyEmail = 'userEmail'
export const elderlyPwd = 'userPwd'

export const elderlyPhone = (elderlyId: string) => `${elderlyId}-userPhone`
export const elderlyName = (elderlyId: string) => `${elderlyId}-userName`
export const elderlySSSKey = (elderlyId: string) => `${elderlyId}-elderly`
export const caregiver1SSSKey = (elderlyId: string) => `${elderlyId}-caregiver1`
export const caregiver2SSSKey = (elderlyId: string) => `${elderlyId}-caregiver2`
export const firestoreSSSKey = (elderlyId: string) => `${elderlyId}-firestoreSSSKey`
export const localDBKey = (elderlyId: string) => `${elderlyId}-localDBKey`