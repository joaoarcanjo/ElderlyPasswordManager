import { BehaviorSubject } from "rxjs";

export const elderlyListUpdated = new BehaviorSubject<Boolean>(false)

export const setElderlyListUpdated = () => {
    console.log(" ===> setElderlyListUpdatedCalled")
    elderlyListUpdated.next(!elderlyListUpdated.value)
}