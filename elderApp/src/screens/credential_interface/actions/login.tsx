import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import  { Navbar } from "../../../navigation/actions"
import { credentials, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { updateCredentialFromFiretore } from '../../../firebase/firestore/functionalities'
import { PasswordOptionsModal, YesOrNoSpinnerModal } from '../../../components/Modal'
import { useSessionInfo } from '../../../context/session'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { ChatMessageType } from '../../../e2e/messages/types'
import { buildEditMessage, sendCaregiversCredentialInfoAction } from './functions'
import { cancelLabel, copyLabel, editLabel, emptyValue, optionsLabel, passwordDefaultLengthGenerator, passwordLabel, passwordLabelNotRequired, regenerateLabel, saveChangesLabel, saveLabel, uriLabel, usernameLabel, visibilityOffLabel, visibilityOnLabel } from '../../../assets/constants/constants'
import { FlashMessage, copyURIDescription, copyUsernameDescription } from '../../../assets/constants/messages'
import { regeneratePassword } from '../../../components/passwordGenerator/functions'
import { DeleteCredential } from './components'
import { encrypt } from '../../../algorithms/tweetNacl/crypto'
import { updateCredentialOnLocalDB } from '../../../database/credentials'
import { Platform } from '../../../assets/json/interfaces'
import { getSpecificUsernameAndPassword } from '../../../components/SpecificUsername&Password'
import { usernameToPresentColor, passwordToPresentColor, optionsTextColor, darkGrey } from '../../../assets/styles/colors'
import { credentialUpdatedFlash, editCanceledFlash, editValueFlash, copyValue } from '../../../notifications/UserMessages'
import { getKeychainValueFor } from '../../../keychain'
import { elderlyFireKey } from '../../../keychain/constants'
import { buttonNormalTextSize, credencialCardDescriptionTextSize, credencialCardInputTextSize, credentialToPresent, whoEdittedTextSize } from '../../../assets/styles/text'

const jsonData = require('../../../assets/json/platforms.json')

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */
function AppInfo({id, platform, uri, un, pw, edited }: Readonly<{id: string, platform: string, uri: string, un: string, pw: string, edited: any}>) {

  const [username, setUsername] = useState(un)
  const [currUri, setURI] = useState(uri)
  const [password, setPassword] = useState(pw)
  const [usernameEdited, setUsernameEdited] = useState(un)
  const [passwordEdited, setPasswordEdited] = useState(pw)
  const [uriEditted, setUriEditted] = useState(uri)
  const [requirements, setRequirements] = useState<Object>({length: passwordDefaultLengthGenerator, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
  const [avaliation, setAvaliation] = useState<number>(0)
  
  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [passwordOptionsModalVisible, setPasswordOptionsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [usernameLabelToPresent, setUsernameLabelToPresent] = useState(emptyValue)
  const [passwordLabelToPresent, setPasswordLabelToPresent] = useState(emptyValue)

  const { userId, userEmail, localDBKey } = useSessionInfo()
  const [editFlag, setEditFlag] = useState(true)

  useEffect(() => setAvaliation(getScore(passwordEdited)), [passwordEdited])

  useEffect(() => {
    const usenameAndPasswordLabel: Platform = getSpecificUsernameAndPassword(platform, jsonData)
    if(usenameAndPasswordLabel != null) {
      setUsernameLabelToPresent(usenameAndPasswordLabel.platformUsernameLabel)
      setPasswordLabelToPresent(usenameAndPasswordLabel.platformPasswordLabel)
    } else {
      setUsernameLabelToPresent(emptyValue)
      setPasswordLabelToPresent(emptyValue)
    }
  }, [])

  const toggleShowPassword = () => {setShowPassword(!showPassword)}

  const toggleEditFlag = () => {setEditFlag(!editFlag)}

  const inputStyle = editFlag ? credentials.credentialInputContainer : credentials.credentialInputContainerV2
  const credentialsModified = (password != passwordEdited || username != usernameEdited || currUri != uriEditted)

  /**
   * Função despoletada quando o utilizador decide guardar as alterações.
   * -> Manipula o estado de loading, atualiza as credenciais e manipula 
   * os estados de edição e normais.
   */
  async function saveCredentialUpdate() {
    const startTime = Date.now()    
    if(credentialsModified) {
      setLoading(true)

      const data = JSON.stringify({
        id: id,
        type: 'login',
        platform: platform, 
        uri: uriEditted, 
        username: usernameEdited, 
        password: passwordEdited, 
        edited: {
          updatedBy: userEmail,
          updatedAt: Date.now()
        }
      })
      const userKey = await getKeychainValueFor(elderlyFireKey(userId))
      await updateCredentialFromFiretore(userId, userKey, id, data)
      .then(async (updated) => {
        toggleEditFlag()
        if(updated) {
          await updateCredentialOnLocalDB(userId, id, encrypt(data, localDBKey))
          setURI(uriEditted)
          setUsername(usernameEdited)
          setPassword(passwordEdited)
          await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_UPDATED)
          credentialUpdatedFlash(emptyValue, platform, true)
        } else {
          setUriEditted(currUri)
          setUsernameEdited(username)
          setPasswordEdited(password)
        }
        setLoading(false)
        setModalVisible(false)
      })
      .catch((erro) => {
        setLoading(false)
        console.log(erro)
        console.log('#1 Error updating credential')
      })
    }
    const endTime = Date.now()
    const duration = endTime - startTime;
    //Alert.alert('Tempo de execução da atualização de uma credencial:', `${duration}ms`)
  }

  function dontSaveCredentialsUpdate() {
    setModalVisible(false)
    setUriEditted(currUri)
    setUsernameEdited(username)
    setPasswordEdited(password)
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
    setPasswordEdited(password)
  }

  /**
   * Componente que apresenta as ações que o utilizador pode efetuar sobre as credenciais.
   * -> Ações relativamente a editar, selecionar as permissões, 
   * @returns 
   */
  function Options() {
    return (
      <View style= { { flex: 0.13, marginHorizontal: '7%', flexDirection: 'row'} }>
        {editFlag ?
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '3%'}}>
            <DeleteCredential id={id} platform={platform}/>
            <TouchableOpacity style={[{flex: 0.5, marginLeft: '1%'}, stylesButtons.mainConfig, stylesButtons.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.editButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{flex: 0.5, marginRight: '1%'}}>
              {credentialsModified && 
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

  return (
    <>
    <View style={{ flex: 0.85, width: '100%', marginTop: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{uriLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(uri, FlashMessage.uriCopied, copyURIDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{  margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? currUri : uriEditted}
                  style={[{ flex: 1 }, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setURI(text): setUriEditted(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <View style={{flex: 0.5}}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{usernameLabel}</Text>
                {usernameLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{fontSize: credentialToPresent, color: usernameToPresentColor}]}>{usernameLabelToPresent}</Text>}
              </View>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(username, FlashMessage.usernameCopied, copyUsernameDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? username : usernameEdited}
                  style={[{ flex: 1 }, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setUsername(text): setUsernameEdited(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <View style={{flex: 0.5}}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{passwordLabelNotRequired}</Text>
                {passwordLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{fontSize: credentialToPresent, color: passwordToPresentColor}]}>{passwordLabelToPresent}</Text>}
              </View>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password, FlashMessage.passwordCopied, copyUsernameDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{marginHorizontal: '4%', alignItems: 'center', justifyContent: 'center', marginVertical: '1%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? password : passwordEdited}
                  secureTextEntry={!(!showPassword || !editFlag)}
                  style={[{ flex: 1, fontSize: credencialCardInputTextSize, color: darkGrey}]}
                  onChangeText={text => editFlag ? setPassword(text): setPasswordEdited(text)}
                />
                <AvaliationEmoji avaliation={avaliation}/>
              </View>
            </View>   
          </View>
          {editFlag ?
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
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
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '5%', marginHorizontal: '5%' }}>
            <TouchableOpacity style={[{flex: 0.50}, stylesButtons.optionsButton, stylesButtons.mainConfig]} onPress={() => {setPasswordOptionsModalVisible(true)}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, margin: '5%' }, options.optionsLabelText]}>{optionsLabel}</Text>
            </TouchableOpacity>
            <View style={{margin: '1%'}}/>
            <TouchableOpacity style={[{flex: 0.50}, credentials.regenerateButton, stylesButtons.mainConfig]} onPress={() => {regeneratePassword(requirements, setPasswordEdited)} }>
              <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, margin: '5%', textAlign: 'center' }, options.generateLabelText]}>{regenerateLabel}</Text>
            </TouchableOpacity>
          </View>} 
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '6%', marginBottom: '2%',fontSize: whoEdittedTextSize, color: darkGrey}, {opacity: editFlag ? 100 : 0}]}>{buildEditMessage(edited.updatedBy, edited.updatedAt)}</Text> 
      </View>
      </View>
    <Options/>
    <PasswordOptionsModal saveFunction={setRequirements} closeFunction={() => {setPasswordOptionsModalVisible(false)}} visibleFlag={passwordOptionsModalVisible} loading={false}/>
    <YesOrNoSpinnerModal question={saveChangesLabel} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
    </>
  )
}

export default function CredencialLoginPage({ route }: Readonly<{route: any}>) {
  return (
    <>
      <KeyboardAvoidingWrapper>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MainBox text={route.params.platform}/>
          <AppInfo 
            id={route.params.id}
            un={route.params.username}
            pw={route.params.password}
            platform={route.params.platform}
            uri={route.params.uri} 
            edited={route.params.edited}
          />
        </View>
      </KeyboardAvoidingWrapper>
      <Navbar/>
    </>
  )
}