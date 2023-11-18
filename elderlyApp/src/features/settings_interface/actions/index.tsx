import React from 'react'
import {View, Text, TouchableOpacity, Image, Linking} from 'react-native'
import { stylesMainBox } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { accountInfo, appInfo, logout } from '../styles/styles'

const gitHubUrl = 'https://github.com/joaoarcanjo/ThesisApps'

import { firebase } from '../../../../FirebaseConfig';

async function a() {
    const firestore = firebase.firestore()
  
    const a = firestore.collection("Elderly").doc("Elderly1").get()
    const querySnapshot = await firebase.firestore()
              .collection('Elderly')
              .get() //error with this
  
  
    firestore.collection('Elderly').add({name: 'ola'})
  
    console.log(firestore.collection('Elderly'))
  
  
    const collectionRef = firestore.collection('Elderly');
  
    collectionRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    }).catch((error) => {
      console.error('Error getting documents: ', error);
    });
  
  }

function MainBox() {

  return (
    <View style= { { flex: 0.15, flexDirection: 'row', justifyContent: 'space-around'} }>
        <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>Definições</Text>
        </View>
    </View>
  )
}

function AccountInfo() {
  return (
    <View style={{ flex: 0.45, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'2%', marginHorizontal: '4%'}, accountInfo.accountInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Informação da conta</Text>
        <View style={[{ flex: 0.32, marginTop:'2%', width: '25%', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Image source={require('../../../assets/images/elderly.png')} style={[{height: '80%', margin: '2%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}>+351 965537775</Text>
          <Image source={require('../images/telephone.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}>joaopedro.arcanjo@hotmail.com</Text>
          <Image source={require('../images/email.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <TouchableOpacity style={[{flex: 0.17, margin: '2%', width: '45%', justifyContent: 'center',  alignItems: 'center'}, accountInfo.editButton]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 25 }]}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const onGitHub = () => Linking.canOpenURL(gitHubUrl).then(() => {
  Linking.openURL(gitHubUrl);
});

function AppInfo() {
  return (
    <View style={{ flex: 0.20, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%'}, appInfo.appInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.3, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>APP</Text>
        <TouchableOpacity style={[{ flex: 0.6, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, appInfo.appInfo]} onPress={() => onGitHub()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 1, marginLeft: '7%'}, appInfo.appInfoText]}>Mais sobre a aplicação</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function Logout() {
  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, logout.logoutButton]} onPress={() => a()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>SAIR DA CONTA</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Settings({ navigation }: {readonly navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <AccountInfo/>
      <AppInfo/>
      <Logout/>
      <Navbar navigation={navigation}/>
    </View>
  )
}