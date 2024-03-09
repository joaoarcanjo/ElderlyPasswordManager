import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { Alert } from "react-native";

interface SignError extends FirebaseAuthTypes.NativeFirebaseAuthError {
  code: any;
}

function signinErrorResult(error: any) {
    
    const firebaseError = error as SignError;
    //console.log("-> Firebase signin error code: "+firebaseError.code)
    
    switch (firebaseError.code) {
        case 'auth/user-not-found':
          Alert.alert('Erro', 'Email não encontrado. Verifique suas credenciais.')
          break
        case 'auth/invalid-email':
          Alert.alert('Erro', 'O email fornecido é inválido.')
          break
        case 'auth/missing-password':
          Alert.alert('Erro', 'É necessário inserir a password.')
          break
        case 'auth/wrong-password':
          Alert.alert('Erro', 'Senha incorreta. Verifique suas credenciais.')
          break
        case 'auth/network-request-failed':
          Alert.alert('Erro', 'Não se encontra contectado à sua internet. Tente mais tarde.')
          break
        default:
          Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.')
          break
    }
}

function signupErrorResult(error: any) {

    const firebaseError = error as SignError
    //console.log("-> Firebase signup error code: "+firebaseError.code)

    switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Erro', 'O email fornecido já está em uso.')
          break
        case 'auth/invalid-email':
          Alert.alert('Erro', 'O email fornecido é inválido.')
          break
        case 'auth/missing-password':
          Alert.alert('Erro', 'É necessário inserir a password.')
          break
        case 'auth/weak-password':
          Alert.alert('Erro', 'A password necessita de pelo menos 6 caracteres.')
          break
        default:
          Alert.alert('Erro', 'Ocorreu um erro na operação. Tente novamente.')
          break
    }
}

export { signinErrorResult, signupErrorResult }