import React, { useState } from "react"
import { View, Button, StyleSheet, TextInput, ActivityIndicator } from "react-native"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FIREBASE_AUTH } from '../../../firebase/FirebaseConfig';
import { getValueFor } from "../../../keychain";
import { elderlyEmail } from "../../../keychain/constants";

const LoginPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const signIn = async () => {
        setLoading(true)

        try {
            const emailAux = await getValueFor(elderlyEmail)
            if(email != emailAux && emailAux != '') {
                alert('Registation failed: invalid user.')
            } else {
                await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
                navigation.push('Home')
            }
        } catch (error) {
            alert('Registation failed: ' + error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)

        try {
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        } catch (error) {
            alert('Registation failed: ' + error)
        } finally {
            setLoading(false)
            navigation.push('Home')
        }
    }

    return (
        <View style={styles.container}>
            <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail}>
            </TextInput>
            <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={setPassword}>
            </TextInput>

        { loading ? <ActivityIndicator size="large" color="#0000ff"/> : 
            <>
            <Button title="Login" onPress={signIn}></Button>
            <Button title="SignUp" onPress={signUp}></Button>
            </>
        }
        </View>
    )
}

export default LoginPage

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1, 
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})