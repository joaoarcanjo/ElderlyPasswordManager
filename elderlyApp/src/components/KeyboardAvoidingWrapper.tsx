import React, { ReactNode } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native"

const KeyboardAvoidingWrapper = ({children}: {children: ReactNode})  => {
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{flex: 1}} >
                <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default KeyboardAvoidingWrapper