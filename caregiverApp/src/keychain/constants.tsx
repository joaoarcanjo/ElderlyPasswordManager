export const caregiverId = 'userId'
export const caregiverEmail = 'userEmail'
export const caregiverPwd = 'userPwd'

export const caregiverPhone = (elderlyId: string) => `${elderlyId}-userPhone`
export const caregiverName = (elderlyId: string) => `${elderlyId}-userName`
export const elderlySSSKey = (elderlyId: string) => `${elderlyId}-elderlySSSKey`
export const localDBKey = (caregiverId: string) => `${caregiverId}-localDBKey`