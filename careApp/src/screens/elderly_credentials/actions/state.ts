import { BehaviorSubject } from "rxjs";

export const credentialsListUpdated = new BehaviorSubject<boolean>(false)

export const setCredentialsListUpdated = () => {
    credentialsListUpdated.next(!credentialsListUpdated.value)
}