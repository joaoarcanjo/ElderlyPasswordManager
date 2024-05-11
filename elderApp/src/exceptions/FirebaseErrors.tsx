import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { Alert } from "react-native";
import { Errors } from "./types";

interface SignError extends FirebaseAuthTypes.NativeFirebaseAuthError {
  code: any;
}

function signinErrorResult(error: any) {
    
    const firebaseError = error as SignError;
    //console.log("-> Firebase signin error code: "+firebaseError.code)
    
    switch (firebaseError.code) {
        case 'auth/user-not-found':
          Alert.alert('Erro', Errors.ERROR_EMAIL_NOT_FOUND)
          break
        case 'auth/invalid-email':
          Alert.alert('Erro', Errors.ERROR_EMAIL_INVALID)
          break
        case 'auth/missing-password':
          Alert.alert('Erro', Errors.ERROR_PASSWORD_MISSING)
          break
        case 'auth/wrong-password':
          Alert.alert('Erro', Errors.ERROR_WRONG_PASSWORD)
          break
        case 'auth/network-request-failed':
          Alert.alert('Erro', Errors.ERROR_NETWORK_REQUEST_FAILED)
          break
        default:
          Alert.alert('Erro', Errors.ERROR_LOGIN)
          break
    }
}

function signupErrorResult(error: any) {
    const firebaseError = error as SignError
    switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Erro', Errors.ERROR_EMAIL_ALREADY_IN_USE)
          break
        case 'auth/invalid-email':
          Alert.alert('Erro', Errors.ERROR_EMAIL_INVALID)
          break
        case 'auth/missing-password':
          Alert.alert('Erro', Errors.ERROR_PASSWORD_MISSING)
          break
        case 'auth/weak-password':
          Alert.alert('Erro', Errors.ERROR_PASSWORD_WEAK)
          break
        default:
          Alert.alert('Erro', Errors.ERROR_SIGNUP)
          break
    }
}

export { signinErrorResult, signupErrorResult }