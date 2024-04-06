import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, updatePassword } from "firebase/auth"
import { saveKeychainValue } from "../../keychain"
import { elderlyEmail, elderlyPwd } from "../../keychain/constants"
import { FIREBASE_AUTH } from "../FirebaseConfig"
import { signinErrorResult, signupErrorResult } from "../FirebaseErrors"
const auth = getAuth();

export async function signInOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await signInWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        await saveKeychainValue(elderlyPwd, pwd)
        await saveKeychainValue(elderlyEmail, email)
        return true
    } catch (error) {
        signinErrorResult(error)
        return false
    } 
}

export async function signUpOperation(email: string, pwd: string): Promise<boolean> {
    try {
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
        await saveKeychainValue(elderlyPwd, pwd)
        await saveKeychainValue(elderlyEmail, email)
        return true
    } catch (error) {
        signupErrorResult(error)
        return false
    } 
}

export async function updatePasswordOperation(userEmail: string, oldPwd: string, newPwd: string): Promise<boolean> {
    return await signInOperation(userEmail, oldPwd).then(async () => {
        if(!auth.currentUser) {
            alert('Nenhum utilizador com login realizado')
            return false
        }
    
        return await updatePassword(auth.currentUser, newPwd).then(() => {
            return true
        }).catch(error => {
            alert('Erro ao atualizar a password, tente novamente!')
            return false
        })
    }).catch(error => {
        return false
    })
}