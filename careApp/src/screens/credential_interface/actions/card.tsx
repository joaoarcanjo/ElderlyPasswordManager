import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { credentials, logout, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { deleteCredential, updateCredentialFromFirestore, verifyIfCanManipulateCredentials } from '../../../firebase/firestore/functionalities'
import { PasswordOptionsModal, YesOrNoModal, YesOrNoSpinnerModal } from '../../../components/Modal'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { buildEditMessage, sendElderlyCredentialInfoAction } from './functions'
import { ChatMessageType } from '../../../e2e/messages/types'
import { deleteCredentialFromLocalDB, updateCredentialFromLocalDB } from '../../../database/credentials'
import { encrypt } from '../../../algorithms/0thers/crypto'
import { regeneratePassword } from '../../../components/passwordGenerator/functions'
import { cancelLabel, cardNumberLabel, copyLabel, deleteCredentialCardLabel, editLabel, optionsLabel, ownerNameLabel, regenerateLabel, saveChangesLabel, saveLabel, securityCodeLabel, uriLabel, userLabel, verificationCodeLabel } from '../../../assets/constants'
import { copyValue, credentialUpdatedFlash, editCanceledFlash, editValueFlash } from '../../../components/userMessages/UserMessages'
import { FlashMessage, copyCardNumberDescription, copyOwnerNameDescription, copyPasswordDescription, copySecurityCodeDescription, copyURIDescription, copyUsernameDescription, copyVerificationCodeDescription } from '../../../components/userMessages/messages'

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */
function CardInfo({ownerId, id, platform, cn, on, sc, vc, edited, auxKey, isElderlyCredential}
  : Readonly<{ownerId: string, id: string, platform: string, cn: string, on: string, sc: string, vc: string, edited: any, auxKey: string, isElderlyCredential: boolean}>) {

  const [cardNumber, setCardNumber] = useState(cn)
  const [ownerName, setOwnerName] = useState(on)
  const [securityCode, setSecurityCode] = useState(sc)
  const [verificationCode, setVerificationCode] = useState(vc)
  const [cardNumberEdited, setCardNumberEdited] = useState(cn)
  const [ownerNameEdited, setOwnerNameEdited] = useState(on)
  const [securityCodeEditted, setSecurityCodeEditted] = useState(sc)
  const [verificationCodeEdited, setVerificationCodeEdited] = useState(vc)
  
  const [showSecurityCode, setShowSecurityCode] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editFlag, setEditFlag] = useState(true)
  const { userId, userEmail, localDBKey } = useSessionInfo()

  const toggleShowSecurityCode = () => {setShowSecurityCode(!showSecurityCode)}

  const toggleEditFlag = async () => {
    const canEdit = ( !isElderlyCredential || await verifyIfCanManipulateCredentials(userId, ownerId) && isElderlyCredential )
    if(canEdit) {
      editValueFlash()
      setEditFlag(!editFlag)
    } else {
      alert('Você não tem permissão para editar credenciais.')
    }
  }

  const inputStyle = editFlag ? credentials.credentialInputContainer : credentials.credentialInputContainerV2
  const credentialsModified = (ownerName != ownerNameEdited || cardNumber != cardNumberEdited || securityCode != securityCodeEditted || verificationCode != verificationCodeEdited)

  /**
   * Função despoletada quando o utilizador decide guardar as alterações.
   * -> Manipula o estado de loading, atualiza as credenciais e manipula 
   * os estados de edição e normais.
   */
  async function saveCredentialUpdate() {
    if(credentialsModified) { 
      setLoading(true)

      const data = JSON.stringify({
        id: id,
        type: 'card',
        platform: platform, 
        ownerName: ownerNameEdited, 
        cardNumber: cardNumberEdited, 
        securityCode: securityCodeEditted,
        verificationCode: verificationCodeEdited, 
        edited: {
          updatedBy: userEmail,
          updatedAt: Date.now()
        }
      })

      updateCredentialFromFirestore(ownerId, id, auxKey, data, isElderlyCredential)
      .then(async (updated) => {
        setEditFlag(!editFlag)
        if(updated) {
          credentialUpdatedFlash('', platform, true)      
          if(ownerId != userId) {
            await sendElderlyCredentialInfoAction(userId, ownerId, id, platform, ChatMessageType.CREDENTIALS_UPDATED)
          } else {
            await updateCredentialFromLocalDB(userId, id, encrypt(data, localDBKey))
          }
          setCardNumber(cardNumberEdited)
          setOwnerName(ownerNameEdited)
          setSecurityCode(securityCodeEditted)
          setVerificationCode(verificationCodeEdited)
        } else {
          setCardNumberEdited(cardNumber)
          setOwnerNameEdited(ownerName)
          setSecurityCodeEditted(securityCode)
          setVerificationCodeEdited(verificationCode)
        }
        setLoading(false)
        setModalVisible(false)
      })
    }
  }

  function dontSaveCredentialsUpdate() {
    setModalVisible(false)
    setCardNumberEdited(cardNumber)
    setOwnerNameEdited(ownerName)
    setSecurityCodeEditted(securityCode)
    setVerificationCodeEdited(verificationCode)
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
    setCardNumberEdited(cardNumber)
    setOwnerNameEdited(ownerName)
    setSecurityCodeEditted(securityCode)
    setVerificationCodeEdited(verificationCode)
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
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.permissionsButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {credentialsModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => setModalVisible(true)}>
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

  return (
    <>
    <View style={{ flex: 0.85, width: '100%', marginTop: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
            <View style={{flex: 0.30}}>
                <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{ownerNameLabel}</Text>
                {editFlag && 
                <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(ownerName, FlashMessage.ownerNameCopied, copyOwnerNameDescription)}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
                </TouchableOpacity>}
                </View>
                <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
                <View style={{margin: '2%', flexDirection: 'row'}}>
                    <TextInput 
                    editable={!editFlag} 
                    value={editFlag ? ownerName : ownerNameEdited}
                    style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                    onChangeText={text => editFlag ? setOwnerName(text): setOwnerNameEdited(text)}
                    />
                </View>
                </View>
            </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{cardNumberLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(cardNumber, FlashMessage.cardNumberCopied, copyCardNumberDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? cardNumber : cardNumberEdited}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setCardNumber(text): setCardNumberEdited(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{securityCodeLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(securityCode, FlashMessage.securityCodeCopied, copySecurityCodeDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? securityCode : securityCodeEditted}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setSecurityCode(text): setSecurityCodeEditted(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: 20}]}>{verificationCodeLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(securityCode, FlashMessage.verificationCodeCopied, copyVerificationCodeDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? verificationCode : verificationCodeEdited}
                  style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setVerificationCode(text): setVerificationCodeEdited(text)}
                />
              </View>
            </View>
          </View>
          {editFlag ?
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
            <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowSecurityCode} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={!showSecurityCode ? 'eye' : 'eye-off'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
          : <></>}
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '6%', marginBottom: '2%',fontSize: 13}, {opacity: editFlag ? 100 : 0}]}>{buildEditMessage(edited.updatedBy, edited.updatedAt)}</Text> 
      </View>
      </View>
    <Options/>
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
      alert('Você não tem permissão para apagar credenciais.')
    }
  }

  const deleteCredentialAction = async () => {

    if(ownerId != userId) {
      const data = JSON.stringify({
        id: id,
        type: 'card',
        platform: platform, 
        ownerName: '', 
        cardNumber: '', 
        securityCode: '',
        verificationCode: '', 
        edited: {
          updatedBy: userEmail,
          updatedAt: Date.now()
        }
      })
      await updateCredentialFromFirestore(ownerId, id, auxKey, data, isElderlyCredential)
        .then(() => sendElderlyCredentialInfoAction(userId, ownerId, '', platform, ChatMessageType.CREDENTIALS_DELETED))
        .then(() => navigation.goBack())
    } else {
      await deleteCredential(ownerId, id)
      .then(() => deleteCredentialFromLocalDB(userId, id))
      .then(() => navigation.goBack())
    }
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={setModalVisibleAux}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>{deleteCredentialCardLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CredencialCardPage({ route }: Readonly<{route: any}>) {

  return (
    <>
      <KeyboardAvoidingWrapper>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MainBox text={route.params.platform}/>
          <CardInfo 
            ownerId={route.params.userId}
            id={route.params.id}
            cn={route.params.cardNumber}
            on={route.params.ownerName}
            platform={route.params.platform}
            sc={route.params.securityCode} 
            vc={route.params.verificationCode}
            edited={route.params.edited}
            auxKey={route.params.key} 
            isElderlyCredential={route.params.isElderlyCredential} />
        </View>
      </KeyboardAvoidingWrapper>
      <Navbar/>
    </>
  )
}