import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Image, Linking, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { accountInfo, appInfo, logout } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { FIREBASE_AUTH } from '../../../firebase/FirebaseConfig'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { options } from '../../credential_interface/styles/styles'
import { YesOrNoSpinnerModal } from '../../../components/Modal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { updatePasswordOperation } from '../../../firebase/authentication/funcionalities'
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain'
import { caregiverId, caregiverName, caregiverPhone, caregiverPwd } from '../../../keychain/constants'
import { sendElderlyNewInfo } from './functions'
import { closeWebsocket } from '../../../e2e/network/webSockets'
import { usernameSubject } from '../../../e2e/identity/state'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { accountInfoLabel, cancelLabel, editLabel, emptyValue, gitHubUrl, leaveAccountLabel, logoutAlertLabel, moreAboutTheApp, pageTitleSettings, saveChangesLabel, saveLabel } from '../../../assets/constants/constants'
import { caregiverPersonalInfoUpdatedFlash, editCanceledFlash, editValueFlash } from '../../../components/userMessages/UserMessages'

function AccountInfo() {
  
  const { userId, userEmail, userPhone, userName, setUserName, setUserPhone } = useSessionInfo()

  const [username, setUsername] = useState(userName)
  const [userpassword, setUserpassword] = useState(emptyValue)
  const [userphone, setUserphone] = useState(userPhone)
  //const [password, setPassword] = useState(pw)

  const [usernameEdited, setUsernameEdited] = useState(userName)
  const [userpasswordEdited, setUserpasswordEdited] = useState(emptyValue)
  const [userphoneEdited, setUserphoneEdited] = useState(userphone)

  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editFlag, setEditFlag] = useState(true)

  const toggleEditFlag = () => {setEditFlag(!editFlag)}
  const toggleShowPassword = () => {setShowPassword(!showPassword)}

  const inputStyle = editFlag ? accountInfo.accountInputContainer : accountInfo.accountInputContainerV2
  const infoModified = (userphone != userphoneEdited || userpassword != userpasswordEdited || username != usernameEdited)

  const updateCaregiverPassword = async () => { 
    const password = await getKeychainValueFor(caregiverPwd)
    setUserpassword(password)
    setUserpasswordEdited(password)
  }

  useEffect(() => {updateCaregiverPassword()}, [])

  const updateInfo = async () => {
    if(username != usernameEdited) {
      await saveKeychainValue(caregiverName(userId), usernameEdited).then(() => {
        setUserName(usernameEdited)
        setUsername(usernameEdited)
      })
    }
    if(userphone != userphoneEdited) {
      await saveKeychainValue(caregiverPhone(userId), userphoneEdited).then(() => {
        setUserPhone(userphoneEdited)
        setUserphone(userphoneEdited)
      })
    }      
    if(userpassword != userpasswordEdited) {
      await updatePasswordOperation(userEmail, userpassword, userpasswordEdited).then(async result => {
        if(result) {
          saveKeychainValue(caregiverPwd, userpasswordEdited).then(() => {
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
          caregiverPersonalInfoUpdatedFlash()
          setLoading(false)
          setModalVisible(false)
          toggleEditFlag()
          sendElderlyNewInfo(userId, usernameEdited, userEmail, userphoneEdited)
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
    editCanceledFlash()
    setUsernameEdited(username)
    setUserpasswordEdited(userpassword)
    setUserphoneEdited(userphone)
  }
  
  return (
    <View style={[{flex: 1, width: '100%'}]}>
        <View style={[{ marginTop:'4%', marginHorizontal: '2%'}, accountInfo.accountInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{accountInfoLabel}</Text>
        <View style={[{flex: 0.17, marginVertical:'1%', marginHorizontal: '2%', justifyContent: 'center',  alignItems: 'center', flexDirection: 'row'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[accountInfo.emailInfoText]}>{userEmail}</Text>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            value={editFlag ? username : usernameEdited}
            style={[{flex: 0.8, marginLeft: '7%', marginVertical: '3%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUsername(text): setUsernameEdited(text)}
          />
          <Image source={require('../../../assets/images/user.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            value={editFlag ? userphone : userphoneEdited}
            style={[{flex: 0.8, marginLeft: '7%', marginVertical: '3%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUserphone(text): setUserphoneEdited(text)}
          />
          <Image source={require('../../../assets/images/telephone.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, inputStyle]}>
          <TextInput 
            editable={!editFlag} 
            secureTextEntry={!(showPassword || !editFlag)}
            value={editFlag ? userpassword : userpasswordEdited}
            style={[{flex: 0.8, marginLeft: '7%', marginVertical: '3%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUserpassword(text): setUserpasswordEdited(text)}
          />
          <Image source={require('../../../assets/images/lock.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        {editFlag ?
          <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%' }}>
            <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
          :
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%' }}></View>}       
          <Options />
        <YesOrNoSpinnerModal question={saveChangesLabel} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
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
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.editButton]} onPress={() => {toggleEditFlag(); editValueFlash(); }}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {infoModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => setModalVisible(true)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>{saveLabel}</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={cancelUpdate}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
}

const onGitHub = () => Linking.canOpenURL(gitHubUrl).then(() => Linking.openURL(gitHubUrl))

function AppInfo() {
  return (
    <View style={{ flex: 0.10, flexDirection: 'row', marginVertical:'5%', justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity style={[{ flex: 0.9, flexDirection: 'row', marginHorizontal: '4%'}, appInfo.appInfoButton, stylesButtons.mainConfig]} onPress={() => onGitHub()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 1, margin: '2%', textAlign: 'center'}, appInfo.appInfoText]}>{moreAboutTheApp}</Text>
        </TouchableOpacity>
    </View>
  )
}

  function Logout() {

    const { setUserId, setUserName, setUserPhone } = useSessionInfo()
    const [modalVisible, setModalVisible] = useState(false)
    const [decision, setDecision] = useState(false)
  
    useEffect(() => {
      if(decision) {
        setUserId(emptyValue)
        setUserName(emptyValue)
        setUserPhone(emptyValue)
        saveKeychainValue(caregiverPwd, emptyValue)
        saveKeychainValue(caregiverId, emptyValue)
        closeWebsocket()
        usernameSubject.next(emptyValue)
        FIREBASE_AUTH.signOut()
      }
  
    }, [decision])
  
    const yesFunction = () => { setModalVisible(false); setDecision(true) }
    const noFunction = () => { setModalVisible(false) }
  
    return (
      <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
        <YesOrNoSpinnerModal question={logoutAlertLabel} yesFunction={() => yesFunction()} noFunction={() => noFunction()} visibleFlag={modalVisible} loading={false}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>{leaveAccountLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }

export default function Settings() {
  return (
     <>
      <KeyboardAvoidingWrapper>
        <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
          <MainBox text={pageTitleSettings}/>
          <AccountInfo/>
          <AppInfo/>
          <Logout/>
        </View>
      </KeyboardAvoidingWrapper>
     <Navbar/>
     </>
  )
}