import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import navigationStyle from '../style/style';
import { stylesButtons } from "../../assets/styles/main_style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Navbar() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const goBack = () => navigation.goBack()

    const goToFirstPage = () => navigation.push('Home')

    return (
        <View style={[{flex: 0.12, backgroundColor: 'red', flexDirection: 'row'}, navigationStyle.pageInfoContainer]}>
            <TouchableOpacity style={[{flex: 0.4, marginLeft: '5%', marginRight: '2%', marginTop: '2%', marginBottom: '6%'}, navigationStyle.backButton, stylesButtons.mainConfig]} onPress={() => goBack()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.6, marginLeft: '2%', marginRight: '5%', marginTop: '2%', marginBottom: '6%'}, navigationStyle.initialButton, stylesButtons.mainConfig]} onPress={() => goToFirstPage()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Página Inicial</Text>
            </TouchableOpacity>
        </View>
    )
}