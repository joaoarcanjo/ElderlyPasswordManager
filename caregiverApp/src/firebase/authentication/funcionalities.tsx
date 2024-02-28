import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { saveKeychainValue } from "../../keychain"
import { caregiverEmail, caregiverPwd } from "../../keychain/constants"
import { FIREBASE_AUTH } from "../FirebaseConfig"
import { signinErrorResult, signupErrorResult } from "../FirebaseErrors"

async function signInOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await signInWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        saveKeychainValue(caregiverPwd, pwd)
        saveKeychainValue(caregiverEmail, email)
        return true
    } catch (error) {
        signinErrorResult(error)
        return false
    } 
}

async function signUpOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        saveKeychainValue(caregiverPwd, pwd)
        saveKeychainValue(caregiverEmail, email)
        return true
    } catch (error) {
        signupErrorResult(error)
        return false
    } 
}

export { signInOperation, signUpOperation }