export const caregiverId = 'userId'
export const caregiverEmail = 'userEmail'
export const caregiverPwd = 'userPwd'

export const caregiverPhone = (caregiverId: string) => `${caregiverId}-userPhone`
export const caregiverName = (caregiverId: string) => `${caregiverId}-userName`
export const elderlySSSKey = (elderlyId: string) => `${elderlyId}-elderlySSSKey`
export const localDBKey = (caregiverId: string) => `${caregiverId}-localDBKey`