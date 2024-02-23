import { BehaviorSubject } from "rxjs";

export const caregiverListUpdated = new BehaviorSubject<Boolean>(false)
export const caregiversRequested = new BehaviorSubject<string[]>([])

export const setCaregiverListUpdated = () => {
    caregiverListUpdated.next(caregiverListUpdated.value)
}

export const addCaregiverRequested = (caregiver: string) => { 
    const caregiverList = [...caregiversRequested.value]
    caregiverList.unshift(caregiver)
    caregiversRequested.next(caregiverList)
}

export const removeCaregiverRequested = (caregiver: string) => {
    const caregiverList = [...caregiversRequested.value]
    caregiverList.splice(caregiverList.indexOf(caregiver), 1)
    caregiversRequested.next(caregiverList)
}

export function findCaregiverRequest(caregiver: string): boolean {
    return caregiversRequested.value.find((caregiverEmail) => caregiverEmail === caregiver) != undefined
}