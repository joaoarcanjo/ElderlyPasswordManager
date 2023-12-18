export const elderlyId = 'userId'
export const elderlyEmail = 'userEmail'
export const elderlyPwd = 'userPwd'
export const elderlyPhone = 'userPhone'

export const elderlySSSKey = (elderlyId: string) => `${elderlyId}-elderlySSSKey`
export const caregiver1SSSKey = (elderlyId: string) => `${elderlyId}-caregiver1SSSKey`
export const caregiver2SSSKey = (elderlyId: string) => `${elderlyId}-caregiver2SSSKey`
export const firestoreSSSKey = (elderlyId: string) => `${elderlyId}-firestoreSSSKey`
export const localDBKey = (elderlyId: string) => `${elderlyId}-localDBKey`