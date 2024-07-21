import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Image, TextInput, Alert} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { accountInfo, logout } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { FIREBASE_AUTH } from '../../../firebase/FirebaseConfig'
import { elderlyId, elderlyName, elderlyPhone, elderlyPwd } from '../../../keychain/constants'
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain'
import { useSessionInfo } from '../../../context/session'
import { options } from '../../credential_interface/styles/styles'
import { YesOrNoSpinnerModal } from '../../../components/Modal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { updatePasswordOperation } from '../../../firebase/authentication/funcionalities'
import { sendCaregiversNewInfo } from './functions'
import { closeWebsocket } from '../../../e2e/network/webSockets'
import { directorySubject, usernameSubject } from '../../../e2e/identity/state'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { accountInfoLabel, cancelLabel, editLabel, emptyValue, gitHubUrl, leaveAccountLabel, logoutAlertLabel, pageTitleSettings, saveChangesLabel, saveLabel, visibilityOffLabel, visibilityOnLabel } from '../../../assets/constants/constants'
import { executeKeyExchange } from '../../../algorithms/shamirSecretSharing/sssOperations'
import { editCanceledFlash, editValueFlash, elderlyPersonalInfoUpdatedFlash } from '../../../notifications/UserMessages'
import { darkGrey, dividerLineColorLight } from '../../../assets/styles/colors'
import { settingsAccountInfoLabelTextSize } from '../../../assets/styles/text'

function AccountInfo() {
  
  const { userId, userEmail, userPhone, userName, setUserName, setUserPhone } = useSessionInfo()

  const [username, setUsername] = useState(userName)
  const [userpassword, setUserpassword] = useState(emptyValue)
  const [userphone, setUserphone] = useState(userPhone)
  //const [password, setPassword] = useState(pw)

  const [usernameEdited, setUsernameEdited] = useState(userName)
  const [userpasswordEdited, setUserpasswordEdited] = useState(emptyValue)
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
          .then(() => executeKeyExchange(userId))
          .then(() => directorySubject.value.updateServerPublicKey(userEmail, userId))
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
          elderlyPersonalInfoUpdatedFlash()
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
    editCanceledFlash()
    setUsernameEdited(username)
    setUserpasswordEdited(userpassword)
    setUserphoneEdited(userphone)
  }
  
  return (
    <View style={[{flex: 1, width: '100%'}]}>
        <View style={[{ marginTop:'4%', marginHorizontal: '2%'}, accountInfo.accountInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: settingsAccountInfoLabelTextSize, color: darkGrey}]}>{accountInfoLabel}</Text>
        <View style={{ height: 2, margin: '2%', backgroundColor: dividerLineColorLight }} />
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
            secureTextEntry={!(!showPassword || !editFlag)}
            value={editFlag ? userpassword : userpasswordEdited}
            style={[{flex: 0.8, marginLeft: '7%', marginVertical: '3%'}, accountInfo.accountInfoText]}
            onChangeText={text => editFlag ? setUserpassword(text): setUserpasswordEdited(text)}
          />
          <Image source={require('../../../assets/images/lock.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        {editFlag ?
          <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', marginVertical: '3%' }}>
            {showPassword ?
              <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye'} size={34} color={darkGrey}/> 
                <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOnLabel}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye-off'} size={34} color={darkGrey}/> 
                <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOffLabel}</Text>
              </TouchableOpacity>  
            }
          </View>
          :
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%' }}></View>}   
        <YesOrNoSpinnerModal question={saveChangesLabel} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
      </View>    
      <Options />
      {editFlag &&  <Logout/>}
    </View> 
  )

  /**
   * Componente que apresenta as ações que o utilizador pode efetuar sobre as credenciais.
   * -> Ações relativamente a editar, selecionar as permissões, 
   * @returns 
   */
  function Options() {
    return (
      <View style= { { flex: 0.25, marginHorizontal: '10%', flexDirection: 'row'} }>
        {editFlag ?
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.editButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '3%'}}>
            <View style={{flex: 0.5, marginRight: '1%'}}>
              {infoModified && 
              <TouchableOpacity style={[{flex: 1, marginVertical: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => setModalVisible(true)}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[options.saveAcceptLabelText]}>{saveLabel}</Text>
              </TouchableOpacity>}
            </View> 
            <View style={{flex: 0.5, marginLeft: '1%'}}>
              <TouchableOpacity style={[{marginVertical: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={cancelUpdate}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.cancelLabelText]}>{cancelLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }
}

function Logout() {

  const { setUserId, setUserName, setUserPhone } = useSessionInfo()
  const [modalVisible, setModalVisible] = useState(false)
  const [decision, setDecision] = useState(false)

  const signOut = async () => {
    if(decision) {
      const startTime = Date.now()    
      setUserId(emptyValue)
      setUserName(emptyValue)
      setUserPhone(emptyValue)
      saveKeychainValue(elderlyPwd, emptyValue)
      saveKeychainValue(elderlyId, emptyValue)
      closeWebsocket()
      usernameSubject.next(emptyValue)
      await FIREBASE_AUTH.signOut()
      const endTime = Date.now()
      const duration = endTime - startTime;
      //Alert.alert('Tempo de execução de sair de uma conta:', `${duration}ms`)
    }
  }
  useEffect(() => {
    signOut()
  }, [decision])

  const yesFunction = () => { setModalVisible(false); setDecision(true) }
  const noFunction = () => { setModalVisible(false) }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%', marginTop: '5%'} }>
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
        </View>
      </KeyboardAvoidingWrapper>
     <Navbar/>
     </>
  )
}