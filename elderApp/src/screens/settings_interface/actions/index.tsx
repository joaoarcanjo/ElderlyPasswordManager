import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Image, Linking, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { accountInfo, appInfo, logout } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { FIREBASE_AUTH } from '../../../firebase/FirebaseConfig'
import { elderlyId, elderlyName, elderlyPhone, elderlyPwd } from '../../../keychain/constants'
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { FlashMessage, editCanceledFlash, editCompletedFlash, editValueFlash } from '../../../components/UserMessages'
import { options } from '../../credential_interface/styles/styles'
import { YesOrNoSpinnerModal } from '../../../components/Modal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Algorithm from '../../password_generator/actions/algorithm'
import { updatePasswordOperation } from '../../../firebase/authentication/funcionalities'
import { sendCaregiversNewInfo } from './functions'
import { closeWebsocket } from '../../../e2e/network/webSockets'
import { usernameSubject } from '../../../e2e/identity/state'

const gitHubUrl = 'https://github.com/joaoarcanjo/ThesisApps'

function AccountInfo() {
  
  const { userId, userEmail, userPhone, userName, setUserName, setUserPhone } = useSessionInfo()

  const [username, setUsername] = useState(userName)
  const [userpassword, setUserpassword] = useState('')
  const [userphone, setUserphone] = useState(userPhone)
  //const [password, setPassword] = useState(pw)

  const [usernameEdited, setUsernameEdited] = useState(userName)
  const [userpasswordEdited, setUserpasswordEdited] = useState('')
  const [userphoneEdited, setUserphoneEdited] = useState(userphone)

  const [showPassword, setShowPassword] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editFlag, setEditFlag] = useState(true)

  const toggleEditFlag = () => {setEditFlag(!editFlag)}
  const toggleShowPassword = () => {setShowPassword(!showPassword)}

  const inputStyle = editFlag ? accountInfo.accountInputContainer : accountInfo.accountInputContainerV2
  const infoModified = (userphone != userphoneEdited || userpassword != userpasswordEdited || username != usernameEdited)

  const updateElderlyPassword = async () => { 
    const password = await getKeychainValueFor(elderlyPwd)
    setUserpassword(password)
    setUserpasswordEdited(password)
   }

  const regeneratePassword = () => {
    const newPassword = Algorithm({length: 15, strict: true, symbols: true, uppercase: true, lowercase: true, numbers: true})
    setUserpasswordEdited(newPassword)
  }

  useEffect(() => {updateElderlyPassword()}, [])

  const updateInfo = async () => {
    if(username != usernameEdited) {
      await saveKeychainValue(elderlyName(userId), usernameEdited).then(() => {
        setUserName(usernameEdited)
        setUsername(usernameEdited)
      })
    }
    if(userphone != userphoneEdited) {
      await saveKeychainValue(elderlyPhone(userId), userphoneEdited).then(() => {
        setUserPhone(userphoneEdited)
        setUserphone(userphoneEdited)
      })
    }      
    if(userpassword != userpasswordEdited) {
      await updatePasswordOperation(userEmail, userpassword, userpasswordEdited).then(async result => {
        if(result) {
          saveKeychainValue(elderlyPwd, userpasswordEdited).then(() => {
            setUserpassword(userpasswordEdited)
          })
        }
      })
    }
    return true
  }

  /**
   * Função despoletada quando o utilizador decide guardar as alterações.
   * -> Manipula o estado de loading, atualiza a informação pessoal e manipula 
   * os estados de edição e normais.
   */
  async function saveCredentialUpdate() {

    if(infoModified) {
      setLoading(true)
      updateInfo().then((updated) => {
        if(updated) {
          editCompletedFlash(FlashMessage.editPersonalInfoCompleted)
          setLoading(false)
          setModalVisible(false)
          toggleEditFlag()
          sendCaregiversNewInfo(userId, usernameEdited, userEmail, userphoneEdited)
        } else {
          setUserphoneEdited(userphone)
          setUserpasswordEdited(userpassword)
          setUsernameEdited(username)
        }
      })
    }
  }

  function dontSaveCredentialsUpdate() {
    setModalVisible(false)
    setUserpasswordEdited(userpassword)
    setUsernameEdited(username)
    setUserphoneEdited(userphone)
    toggleEditFlag()
  }

  /**
   * Função despoletada quando o botão de cancelar é selecionado.
   * -> Vai abrir a flash message, desliga o modo edição, e coloca
   * os valores dos estados de edição com os valores default.
   */
  function cancelUpdate() {
    toggleEditFlag()
    editCanceledFlash(FlashMessage.editModeCanceled)
    setUsernameEdited(username)
    setUserpasswordEdited(userpassword)
    setUserphoneEdited(userphone)
  }
  
  return (
    <View style={{ flex: 0.55, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'2%', marginHorizontal: '4%'}, accountInfo.accountInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Informação da conta:</Text>
        <View style={[{flex: 0.17, marginTop:'1%', justifyContent: 'center',  alignItems: 'center', flexDirection: 'row'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[accountInfo.emailInfoText]}>{userEmail}</Text>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            value={editFlag ? username : usernameEdited}
            style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUsername(text): setUsernameEdited(text)}
          />
          <Image source={require('../../../assets/images/user.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            value={editFlag ? userphone : userphoneEdited}
            style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUserphone(text): setUserphoneEdited(text)}
          />
          <Image source={require('../../../assets/images/telephone.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            secureTextEntry={!(!showPassword || !editFlag)}
            value={editFlag ? userpassword : userpasswordEdited}
            style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUserpassword(text): setUserpasswordEdited(text)}
          />
          <Image source={require('../../../assets/images/lock.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        {editFlag ?
          <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%' }}>
            <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={!showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
          :
          <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-end', marginTop: '1%' }}>
            <TouchableOpacity style={[{flex: 0.35, marginRight: '5%'}, stylesButtons.mainConfig, stylesButtons.regenerateButton]} onPress={() => {regeneratePassword()} }>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '5%' }]}>Regenerar</Text>
            </TouchableOpacity>
          </View>}
        <YesOrNoSpinnerModal question={'Guardar as alterações?'} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
        <Options />
      </View>
    </View> 
  )

  /**
   * Componente que apresenta as ações que o utilizador pode efetuar sobre as credenciais.
   * -> Ações relativamente a editar, selecionar as permissões, 
   * @returns 
   */
  function Options() {
    return (
      <View style= { { flex: 0.25, marginHorizontal: '10%', marginTop: '3%', flexDirection: 'row'} }>
        {editFlag ?
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>Editar</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {infoModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => setModalVisible(true)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Guardar</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={cancelUpdate}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
}

const onGitHub = () => Linking.canOpenURL(gitHubUrl).then(() => {
  Linking.openURL(gitHubUrl);
});

function AppInfo() {
  return (
    <View style={{ flex: 0.10, flexDirection: 'row', marginVertical:'5%', justifyContent: 'space-around'}}>
      <TouchableOpacity style={[{ flex: 1, flexDirection: 'row', marginHorizontal: '4%'}, appInfo.appInfoButton, stylesButtons.mainConfig]} onPress={() => onGitHub()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 1, marginLeft: '15%'}, appInfo.appInfoText]}>Mais sobre a aplicação</Text>
        </TouchableOpacity>
    </View>
  )
}

function Logout() {

  const { setUserId, setUserName, setUserPhone } = useSessionInfo()

  const signOut = () => {
    //saveKeychainValue(elderlyEmail, '')
    setUserId('')
    setUserName('')
    setUserPhone('')
    saveKeychainValue(elderlyPwd, '')
    saveKeychainValue(elderlyId, '')
    closeWebsocket()
    usernameSubject.next('')
    FIREBASE_AUTH.signOut()
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={signOut}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>SAIR DA CONTA</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={'Definições'}/>
      <AccountInfo/>
      <AppInfo/>
      <Logout/>
      <Navbar/>
    </View>
  )
}