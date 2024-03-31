import { BehaviorSubject } from "rxjs";
import { CaregiverPermission, getCaregiversPermissions } from "../../list_credentials/actions/functions";

export const caregiverListUpdated = new BehaviorSubject<CaregiverPermission[]>([])
export const caregiversRequested = new BehaviorSubject<string[]>([])

export const setCaregiverListUpdated = async (userId: string) => {
    console.log('===> setCaregiverListUpdated')
    caregiverListUpdated.next(await getCaregiversPermissions(userId))
}