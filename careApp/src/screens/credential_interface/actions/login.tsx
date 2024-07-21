import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { credentials, logout, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { deleteCredentialFromFirestore, updateCredentialFromFirestore, verifyIfCanManipulateCredentials } from '../../../firebase/firestore/functionalities'
import { PasswordOptionsModal, YesOrNoModal, YesOrNoSpinnerModal } from '../../../components/Modal'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { useSessionInfo } from '../../../context/session'
import { buildEditMessage, sendElderlyCredentialInfoAction } from './functions'
import { ChatMessageType } from '../../../e2e/messages/types'
import { deleteCredentialFromLocalDB, updateCredentialFromLocalDB } from '../../../database/credentials'
import { regeneratePassword } from '../../../components/passwordGenerator/functions'
import { cancelLabel, copyLabel, deleteCredentialLabel, editLabel, emptyValue, optionsLabel, passwordLabel, regenerateLabel, saveChangesLabel, saveLabel, uriLabel, usernameLabel } from '../../../assets/constants/constants'
import { encrypt } from '../../../algorithms/tweetNacl/crypto'
import { Platform } from '../../../assets/json/interfaces'
import { getSpecificUsernameAndPassword } from '../../../components/SpecificUsername&Password'
import { platformLabelToPresent } from '../../../assets/styles/colors'
import { copyValue, credentialUpdatedFlash, editCanceledFlash, editValueFlash } from '../../../notifications/userMessages/UserMessages'
import { FlashMessage, copyPasswordDescription, copyUsernameDescription } from '../../../notifications/userMessages/messages'

const jsonData = require('../../../assets/json/platforms.json')

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */
function AppInfo({ownerId, id, platform, uri, un, pw, edited, auxKey, isElderlyCredential}
  : Readonly<{ownerId: string, id: string, platform: string, uri: string, un: string, pw: string, edited: any, auxKey: string, isElderlyCredential: boolean}>) {

  const [username, setUsername] = useState(un)
  const [currUri, setCurrUri] = useState(uri)
  const [password, setPassword] = useState(pw)
  const [usernameEdited, setUsernameEdited] = useState(un)
  const [passwordEdited, setPasswordEdited] = useState(pw)
  const [uriEditted, setUriEditted] = useState(uri)
  const [passwordOptionsModalVisible, setPasswordOptionsModalVisible] = useState(false)
  const [requirements, setRequirements] = useState<Object>({length: 15, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
  const [avaliation, setAvaliation] = useState<number>(0)  
  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editFlag, setEditFlag] = useState(true)
  const { userId, userEmail, localDBKey } = useSessionInfo()

  const [usernameLabelToPresent, setUsernameLabelToPresent] = useState(emptyValue)
  const [passwordLabelToPresent, setPasswordLabelToPresent] = useState(emptyValue)

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
  
  const toggleShowPassword = () => {setShowPassword(!showPassword);}

  const toggleEditFlag = async () => {
    const canEdit = ( await verifyIfCanManipulateCredentials(userId, ownerId) && isElderlyCredential ) || !isElderlyCredential
    if(canEdit) {
      editValueFlash()
      setEditFlag(!editFlag)
    } else {
      Alert.alert('Informação', 'Você não tem permissão para editar credenciais.')
    }
  }

  const inputStyle = editFlag ? credentials.credentialInputContainer : credentials.credentialInputContainerV2
  const credentialsModified = (password != passwordEdited || username != usernameEdited || currUri != uriEditted)

  /**
   * Função despoletada quando o utilizador decide guardar as alterações.
   * -> Manipula o estado de loading, atualiza as credenciais e manipula 
   * os estados de edição e normais.
   */
  async function saveCredentialUpdate() {
    if(credentialsModified) { 
      setLoading(true)

      const data = JSON.stringify({
        type: 'login',
        id: id,
        platform: platform, 
        uri: uriEditted, 
        username: usernameEdited, 
        password: passwordEdited, 
        edited: {
          updatedBy: userEmail,
          updatedAt: Date.now()
        }
      })
      updateCredentialFromFirestore(ownerId, id, auxKey, data, isElderlyCredential)
      .then(async (updated) => {
        setEditFlag(!editFlag)
        if(updated) {
          credentialUpdatedFlash(emptyValue, platform, true)      
          if(ownerId != userId) {
            await sendElderlyCredentialInfoAction(userId, ownerId, id, platform, ChatMessageType.CREDENTIALS_UPDATED)
          } else {
            await updateCredentialFromLocalDB(userId, id, encrypt(data, localDBKey))
          }
          setCurrUri(uriEditted)
          setUsername(usernameEdited)
          setPassword(passwordEdited)
        } else {
          setUriEditted(currUri)
          setUsernameEdited(username)
          setPasswordEdited(password)
        }
        setLoading(false)
        setModalVisible(false)
      })
    }
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
    setEditFlag(!editFlag)
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
      <View style= { { flex: 0.13, marginHorizontal: '10%', flexDirection: 'row'} }>
        {editFlag ?
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.editButton]} onPress={toggleEditFlag}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {credentialsModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => setModalVisible(true)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>{saveLabel}</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={cancelUpdate}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>{cancelLabel}</Text>
            </TouchableOpacity>
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
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{uriLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(uri, FlashMessage.uriCopied)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? currUri : uriEditted}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setCurrUri(text): setUriEditted(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <View style={{flex: 0.5}}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{usernameLabel}</Text>
                {usernameLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{fontSize: 15, color: platformLabelToPresent}]}>{usernameLabelToPresent}</Text>}
              </View>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(username, FlashMessage.usernameCopied, copyUsernameDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? username : usernameEdited}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setUsername(text): setUsernameEdited(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <View style={{flex: 0.5}}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{passwordLabel}</Text>
                {passwordLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{fontSize: 15, color: platformLabelToPresent}]}>{passwordLabelToPresent}</Text>}
              </View>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password, FlashMessage.passwordCopied, copyPasswordDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{marginHorizontal: '4%', alignItems: 'center', justifyContent: 'center', marginVertical: '1%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? password : passwordEdited}
                  secureTextEntry={!(!showPassword || !editFlag)}
                  style={[{ flex: 1, fontSize: 17}]}
                  onChangeText={text => editFlag ? setPassword(text): setPasswordEdited(text)}
                />
                <AvaliationEmoji avaliation={avaliation}/>
              </View>
            </View>   
          </View>
          {editFlag ?
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
            <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
          :
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '5%', marginHorizontal: '5%' }}>
            <TouchableOpacity style={[{flex: 0.50}, stylesButtons.optionsButton, stylesButtons.mainConfig]} onPress={() => {setPasswordOptionsModalVisible(true)}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 24, margin: '5%' }]}>{optionsLabel}</Text>
            </TouchableOpacity>
            <View style={{margin: '1%'}}/>
            <TouchableOpacity style={[{flex: 0.50}, credentials.regenerateButton, stylesButtons.mainConfig]} onPress={() => {regeneratePassword(requirements, setPasswordEdited)} }>
              <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 24, margin: '5%', textAlign: 'center' }]}>{regenerateLabel}</Text>
            </TouchableOpacity>
          </View>}
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '6%', marginBottom: '2%',fontSize: 13}, {opacity: editFlag ? 100 : 0}]}>{buildEditMessage(edited.updatedBy, edited.updatedAt)}</Text> 
      </View>
    </View>
    <Options/>
    <PasswordOptionsModal saveFunction={setRequirements} closeFunction={() => {setPasswordOptionsModalVisible(false)}} visibleFlag={passwordOptionsModalVisible} loading={false}/>
    <YesOrNoSpinnerModal question={saveChangesLabel} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
    {editFlag && <DeleteCredential ownerId={ownerId} id={id} platform={platform} isElderlyCredential={isElderlyCredential} auxKey={auxKey} />}
    </>
  )
}

/**
 * Componente que representa o botão para apagar a credencial
 * @returns 
 */
function DeleteCredential({ownerId, id, platform, auxKey, isElderlyCredential}: Readonly<{ownerId: string, id: string, platform: string, auxKey: string, isElderlyCredential: boolean}>) {
  
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [modalVisible, setModalVisible] = useState(false)
  const { userId, userEmail } = useSessionInfo()

  const setModalVisibleAux = async () => {
    const canDelete = ( await verifyIfCanManipulateCredentials(userId, ownerId) && isElderlyCredential ) || !isElderlyCredential
    if(canDelete) {
      setModalVisible(true)
    } else {
      Alert.alert('Informação', 'Você não tem permissão para apagar credenciais.')
    }
  }

  const deleteCredentialAction = async () => {

    if(ownerId != userId) {
      const data = JSON.stringify({
        type: 'login',
        id: id,
        platform: platform, 
        uri: emptyValue, 
        username: emptyValue, 
        password: emptyValue, 
        edited: {
          updatedBy: userEmail,
          updatedAt: Date.now()
        }
      })
      await updateCredentialFromFirestore(ownerId, id, auxKey, data, isElderlyCredential)
        .then(() => sendElderlyCredentialInfoAction(userId, ownerId, emptyValue, platform, ChatMessageType.CREDENTIALS_DELETED))
        .then(() => navigation.goBack())
    } else {
      await deleteCredentialFromFirestore(ownerId, id)
      .then(() => deleteCredentialFromLocalDB(userId, id))
      .then(() => navigation.goBack())
    }
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, credentials.deleteCredentialButton, stylesButtons.mainConfig]} onPress={setModalVisibleAux}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>{deleteCredentialLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CredencialLoginPage({ route }: Readonly<{route: any}>) {

  return (
    <>
      <KeyboardAvoidingWrapper>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MainBox text={route.params.platform}/>
          <AppInfo 
            ownerId={route.params.userId}
            id={route.params.id}
            un={route.params.username}
            pw={route.params.password}
            platform={route.params.platform}
            uri={route.params.uri}
            edited={route.params.edited}
            auxKey={route.params.key} 
            isElderlyCredential={route.params.isElderlyCredential} />
        </View>
      </KeyboardAvoidingWrapper>
      <Navbar/>
    </>
  )
}