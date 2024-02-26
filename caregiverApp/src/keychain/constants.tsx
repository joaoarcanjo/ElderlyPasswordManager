export const elderlyId = 'userId'
export const elderlyEmail = 'userEmail'
export const elderlyPwd = 'userPwd'

export const elderlyPhone = (elderlyId: string) => `${elderlyId}-userPhone`
export const elderlyName = (elderlyId: string) => `${elderlyId}-userName`
export const elderlySSSKey = (elderlyId: string) => `${elderlyId}-elderlySSSKey`
export const firestoreSSSKey = (elderlyId: string) => `${elderlyId}-firestoreSSSKey`
export const localDBKey = (elderlyId: string) => `${elderlyId}-localDBKey`