import React from "react";
import { View, TouchableOpacity } from "react-native";
import navigationStyle from '../style/style';
import { stylesButtons } from "../../assets/styles/main_style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Entypo, FontAwesome5 } from '@expo/vector-icons'; 
import { pageMainMenu } from "../../assets/constants";

export function Navbar() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const goBack = () => navigation.goBack()

    const goToFirstPage = () => navigation.push(pageMainMenu)

    return (
        <View style={[{flex: 0.12, backgroundColor: 'red', flexDirection: 'row'}, navigationStyle.pageInfoContainer]}>
            <TouchableOpacity style={[{flex: 0.5, marginLeft: '5%', marginRight: '2%', marginTop: '2%', marginBottom: '2%'}, navigationStyle.backButton, stylesButtons.mainConfig]} onPress={() => goBack()}>
                {/*<Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Anterior</Text> */}
                <Entypo name="back" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, marginLeft: '2%', marginRight: '5%', marginTop: '2%', marginBottom: '2%'}, navigationStyle.initialButton, stylesButtons.mainConfig]} onPress={() => goToFirstPage()}>
                {/*<Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Página Inicial</Text> */}
                <FontAwesome5 name="home" size={35} color="black" />
            </TouchableOpacity>
        </View>
    )
}


export function NavbarJustBack() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const goBack = () => navigation.goBack()

    return (
        <View style={[{flex: 0.12, backgroundColor: 'red', flexDirection: 'row', justifyContent: 'center'}, navigationStyle.pageInfoContainer]}>
            <TouchableOpacity style={[{flex: 0.5, marginLeft: '5%', marginRight: '2%', marginTop: '2%', marginBottom: '2%'}, navigationStyle.backButton, stylesButtons.mainConfig]} onPress={() => goBack()}>
                {/*<Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Anterior</Text> */}
                <Entypo name="back" size={40} color="black" />
            </TouchableOpacity>
        </View>
    )
}