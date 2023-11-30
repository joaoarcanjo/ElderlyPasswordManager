import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { credentials, logout, options, modal } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { copyValue, editValueFlash } from '../../../components/ShowFlashMessage'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { deleteCredential } from '../../../firebase/firestore/funcionalities'
import ModalBox from '../../../components/Modal'

function AppInfo({un, pw}: Readonly<{un: string, pw: string}>) {

  const [username, setUsername] = useState(un)
  const [password, setPassword] = useState(pw)
  const [avaliation, setAvaliation] = useState<number>(0)
  
  useEffect(() => setAvaliation(getScore(password)), [password])
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = () => {setShowPassword(!showPassword);};

  const [editFlag, setEditFlag] = useState(true); 
  const toggleEditFlag = () => {setEditFlag(!editFlag);};

  function Options() {
    return (
      <View style= { { flex: 0.13, marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-around'} }>
        {editFlag ?
          <>
            <TouchableOpacity style={[{flex: 0.35, margin: '3%', marginVertical: '5%'}, stylesButtons.mainConfig, options.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.65, margin: '3%', marginVertical: '5%'}, logout.logoutButton, stylesButtons.mainConfig, options.permissionButton]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Permissões</Text>
            </TouchableOpacity>
          </> :
          <>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%', marginVertical: '5%'}, stylesButtons.mainConfig, options.saveButton]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%', marginVertical: '5%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => toggleEditFlag()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          </>
        }
      </View>
    )
  }

  return (
    <>
    <View style={{ flex: 0.52, width: '100%', marginBottom: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
        <View style={{flex: 0.45}}>
          <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '8%', justifyContent: 'center', fontSize: 20}]}>UTILIZADOR</Text>
            <TouchableOpacity style={[{flex: 0.5, marginTop:'10%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
            </TouchableOpacity>
          </View>
          <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, credentials.credentialInfoContainer]}>
            <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
              <TextInput 
                editable={editFlag} 
                value={username}
                style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                onChangeText={text => setUsername(text)}
              />
            </View>
          </View>
          <Text style={{marginLeft: '6%',fontSize: 13}}>Editado por: Elisabeth, 19/11/2021</Text>   
        </View>
        <View style={{flex: 0.40}}>
          <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '8%', justifyContent: 'center', fontSize: 20}]}>PASSWORD</Text>
            <TouchableOpacity style={[{flex: 0.5, marginTop:'10%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
            </TouchableOpacity>
          </View>
          <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, credentials.credentialInfoContainer]}>
            <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
              <TextInput 
                editable={editFlag} 
                value={password}
                secureTextEntry={!(!showPassword || !editFlag)}
                style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                onChangeText={text => setPassword(text)}
              />
              <AvaliationEmoji avaliation={avaliation}/>
            </View>
          </View>   
        </View>
        <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
          <View style={{marginLeft: '6%', marginTop: '0%', height: '100%'}}>
            <Text style={{fontSize: 13}}>Editado por: Elisabeth, 19/11/2021</Text>   
          </View>
          <TouchableOpacity style={[{marginRight:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
            <MaterialCommunityIcons style={{marginHorizontal: '5%'}} disabled={editFlag} name={!(!showPassword || !editFlag) ? 'eye' : 'eye-off'} size={40} color="black"/> 
          </TouchableOpacity>   
        </View>
      </View>
    </View>
    {/* TODO: aparecer uma flash message a dizer que a edição foi ativada*/}
    <Options/>
    </>
  )
}

function DeleteCredential({id}: Readonly<{id: string}>) {
  
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);

  const deleteCredentialAction = () => {
    navigation.goBack()
    deleteCredential(id)
  }

  function ModalBody() {
    return (
      <>
      <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>Deseja mesmo apagar a credencial?</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => deleteCredentialAction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => setModalVisible(false)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Não</Text>
        </TouchableOpacity>
      </View>
      </>
    )
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <ModalBox visibleFlag={modalVisible} setModalVisibility={() => setModalVisible(false)}>
          <ModalBody/>
      </ModalBox>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>Apagar</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CredencialPage({ route }: Readonly<{route: any}>) {

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={route.params.platform}/>
      <AppInfo un={route.params.username} pw={route.params.password}/>
      <DeleteCredential id={route.params.id} />
      <Navbar/>
    </View>
  )
}