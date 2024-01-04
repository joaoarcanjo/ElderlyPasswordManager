import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { save } from "../../keychain"
import { elderlyEmail, elderlyPwd } from "../../keychain/constants"
import { FIREBASE_AUTH } from "../FirebaseConfig"
import { signinErrorResult, signupErrorResult } from "../FirebaseErrors"

async function signInOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await signInWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        save(elderlyPwd, pwd)
        save(elderlyEmail, email)
        return true
    } catch (error) {
        signinErrorResult(error)
        return false
    } 
}

async function signUpOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        save(elderlyPwd, pwd)
        save(elderlyEmail, email)
        return true
    } catch (error) {
        signupErrorResult(error)
        return false
    } 
}

export { signInOperation, signUpOperation }