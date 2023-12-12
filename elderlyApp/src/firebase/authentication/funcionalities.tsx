import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getValueFor, save } from "../../keychain"
import { elderlyEmail, elderlyPwd } from "../../keychain/constants"
import { FIREBASE_AUTH } from "../FirebaseConfig"

async function signInOperation(email: string, pwd: string): Promise<boolean> {
    try {
        const emailAux = await getValueFor(elderlyEmail)
        if(email != emailAux && emailAux != '') {
            alert('Registation failed: invalid user.')
            return false
        } else {
            //await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, pwd)
            save(elderlyPwd, pwd)
            save(elderlyEmail, email)
            return true
        }
    } catch (error) {
        alert('Registation failed: ' + error)
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
        alert('Registation failed: ' + error)
        return false
    } 
}



export { signInOperation, signUpOperation }