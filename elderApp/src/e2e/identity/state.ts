import { SignalProtocolStore } from '../signal/signal-store'
import { BehaviorSubject } from 'rxjs'
import { SignalDirectory } from '../signal/signal-directory'
import { emptyValue } from '../../assets/constants/constants'

export const directorySubject = new BehaviorSubject<SignalDirectory | null>(null)
export const signalStore = new SignalProtocolStore()
export const usernameSubject = new BehaviorSubject<string>(emptyValue)
