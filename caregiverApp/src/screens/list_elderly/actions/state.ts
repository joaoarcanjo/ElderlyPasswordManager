import { BehaviorSubject } from "rxjs";

export const elderlyListUpdated = new BehaviorSubject<Boolean>(false)

export const setElderlyListUpdated = () => {
    elderlyListUpdated.next(elderlyListUpdated.value)
}