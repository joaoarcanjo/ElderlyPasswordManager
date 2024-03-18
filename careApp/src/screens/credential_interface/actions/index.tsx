import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { credentials, logout, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { FlashMessage, copyValue, editCanceledFlash, editCompletedFlash, editValueFlash } from '../../../components/UserMessages'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { deleteCredential, updateCredential, verifyIfCanManipulateCredentials } from '../../../firebase/firestore/functionalities'
import { YesOrNoModal, YesOrNoSpinnerModal } from '../../../components/Modal'
import Algorithm from '../../password_generator/actions/algorithm'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { sendElderlyCredentialInfoAction } from './functions'
import { ChatMessageType } from '../../../e2e/messages/types'

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */
function AppInfo({ownerId, id, platform, uri, un, pw, auxKey, isElderlyCredential}: Readonly<{ownerId: string, id: string, platform: string, uri: string, un: string, pw: string, auxKey: string, isElderlyCredential: boolean}>) {

  const [username, setUsername] = useState(un)
  const [currUri, setCurrUri] = useState(uri)
  const [password, setPassword] = useState(pw)
  const [usernameEdited, setUsernameEdited] = useState(un)
  const [passwordEdited, setPasswordEdited] = useState(pw)
  const [uriEditted, setUriEditted] = useState(uri)

  const [avaliation, setAvaliation] = useState<number>(0)

  const { userId } = useSessionInfo()
  
  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editFlag, setEditFlag] = useState(true)

  useEffect(() => setAvaliation(getScore(passwordEdited)), [passwordEdited])

  const toggleShowPassword = () => {setShowPassword(!showPassword);}

  const toggleEditFlag = async () => {
    const canEdit = ( await verifyIfCanManipulateCredentials(userId, ownerId) && isElderlyCredential ) || !isElderlyCredential
    if(canEdit) {
      editValueFlash()
      setEditFlag(!editFlag)
    } else {
      alert('Você não tem permissão para editar credenciais.')
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
      updateCredential(ownerId, id, auxKey, JSON.stringify({platform: platform, uri: uriEditted, username: usernameEdited, password: passwordEdited}), isElderlyCredential)
      .then(async (updated) => {
        setEditFlag(!editFlag)
        if(updated) {
          editCompletedFlash(FlashMessage.editCredentialCompleted)
          await sendElderlyCredentialInfoAction(userId, ownerId, id, platform, ChatMessageType.CREDENTIALS_UPDATED)
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
    toggleEditFlag()
    editCanceledFlash(FlashMessage.editCredentialCanceled)
    setUsernameEdited(username)
    setPasswordEdited(password)
  }

  const regeneratePassword = () => {
    const newPassword = Algorithm({length: 15, strict: true, symbols: true, uppercase: true, lowercase: true, numbers: true})
    setPasswordEdited(newPassword)
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
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.editButton]} onPress={toggleEditFlag}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>Editar</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {credentialsModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => setModalVisible(true)}>
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

  return (
    <>
    <View style={{ flex: 0.85, width: '100%', marginTop: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
          <View style={{flex: 0.40}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>URI</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(uri, FlashMessage.uriCopied)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
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
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>UTILIZADOR</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(username, FlashMessage.usernameCopied)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
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
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>PASSWORD</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password, FlashMessage.passwordCopied)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{marginHorizontal: '4%', marginVertical: '1%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? password : passwordEdited}
                  secureTextEntry={!(!showPassword || !editFlag)}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setPassword(text): setPasswordEdited(text)}
                />
                <AvaliationEmoji avaliation={avaliation}/>
              </View>
            </View>   
          </View>
          {editFlag ?
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
            <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={!showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
          :
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '5%' }}>
            <TouchableOpacity style={[{flex: 0.50, marginRight: '5%'}, credentials.regenerateButton, stylesButtons.mainConfig]} onPress={() => {regeneratePassword()} }>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
            </TouchableOpacity>
          </View>}
          <Text style={[{marginLeft: '6%', marginBottom: '2%',fontSize: 13}, {opacity: editFlag ? 100 : 0}]}>Editado por: Elisabeth, 19/11/2021</Text> 
      </View>
    </View>
    <Options/>
    <YesOrNoSpinnerModal question={'Guardar as alterações?'} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
    {editFlag && <DeleteCredential ownerId={ownerId} id={id} platform={platform} isElderlyCredential={isElderlyCredential} />}
    </>
  )
}

/**
 * Componente que representa o botão para apagar a credencial
 * @returns 
 */
function DeleteCredential({ownerId, id, platform, isElderlyCredential}: Readonly<{ownerId: string, id: string, platform: string, isElderlyCredential: boolean}>) {
  
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [modalVisible, setModalVisible] = useState(false)
  const { userId } = useSessionInfo()

  const setModalVisibleAux = async () => {
    const canDelete = ( await verifyIfCanManipulateCredentials(userId, ownerId) && isElderlyCredential ) || !isElderlyCredential
    if(canDelete) {
      setModalVisible(true)
    } else {
      alert('Você não tem permissão para apagar credenciais.')
    }
  }

  const deleteCredentialAction = async () => {
    await deleteCredential(ownerId, id, isElderlyCredential)
    .then(async () => {
      if(ownerId != userId) await sendElderlyCredentialInfoAction(userId, ownerId, '', platform, ChatMessageType.CREDENTIALS_DELETED)
    })
    .then(() => navigation.goBack())
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={setModalVisibleAux}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>Apagar credencial</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CredencialPage({ route }: Readonly<{route: any}>) {

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
            auxKey={route.params.key} 
            isElderlyCredential={route.params.isElderlyCredential} />
        </View>
      </KeyboardAvoidingWrapper>
      <Navbar/>
    </>
  )
}