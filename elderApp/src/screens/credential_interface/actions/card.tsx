import React, { useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import  { Navbar } from "../../../navigation/actions"
import { credentials, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { updateCredentialFromFiretore } from '../../../firebase/firestore/functionalities'
import { YesOrNoSpinnerModal } from '../../../components/Modal'
import { useSessionInfo } from '../../../context/session'
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper'
import { ChatMessageType } from '../../../e2e/messages/types'
import { buildEditMessage, sendCaregiversCredentialInfoAction } from './functions'
import { cancelLabel, cardNumberLabel, copyLabel, editLabel, emptyValue, ownerNameLabel, saveChangesLabel, saveLabel, securityCodeLabel, verificationCodeLabel, visibilityOffLabel, visibilityOnLabel } from '../../../assets/constants/constants'
import { FlashMessage, copyURIDescription, copyUsernameDescription } from '../../../assets/constants/messages'
import { DeleteCredential } from './components'
import { encrypt } from '../../../algorithms/tweetNacl/crypto'
import { updateCredentialOnLocalDB } from '../../../database/credentials'
import { credentialUpdatedFlash, editCanceledFlash, editValueFlash, copyValue } from '../../../notifications/UserMessages'
import { getKeychainValueFor } from '../../../keychain'
import { elderlyFireKey } from '../../../keychain/constants'
import { darkGrey } from '../../../assets/styles/colors'
import { buttonCopyTextSize, credencialCardDescriptionTextSize, whoEdittedTextSize } from '../../../assets/styles/text'

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */

function CardInfo({id, platform, cn, on, sc, vc, edited }: Readonly<{id: string, platform: string, cn: string, on: string, sc: string, vc: string, edited: any}>) {

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

  const { userId, userEmail, localDBKey } = useSessionInfo()
  const [editFlag, setEditFlag] = useState(true)

  const toggleShowSecurityCode = () => {setShowSecurityCode(!showSecurityCode)}
  const toggleEditFlag = () => {setEditFlag(!editFlag)}

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

      const userKey = await getKeychainValueFor(elderlyFireKey(userId))
      await updateCredentialFromFiretore(userId, userKey, id, data)
      .then(async (updated) => {
        toggleEditFlag()
        if(updated) {
          await updateCredentialOnLocalDB(userId, id, encrypt(data, localDBKey))
          setCardNumber(cardNumberEdited)
          setOwnerName(ownerNameEdited)
          setSecurityCode(securityCodeEditted)
          setVerificationCode(verificationCodeEdited)
          await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_UPDATED)
          credentialUpdatedFlash(emptyValue, platform, true)
        } else {
          setCardNumberEdited(cardNumber)
          setOwnerNameEdited(ownerName)
          setSecurityCodeEditted(securityCode)
          setVerificationCodeEdited(verificationCode)
        }
        setLoading(false)
        setModalVisible(false)
      })
      .catch(() => console.log('#1 Error updating credential'))
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
    toggleEditFlag()
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
      <View style= { { flex: 0.10, marginHorizontal: '10%', flexDirection: 'row'} }>
        {editFlag ?
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '3%'}}>
            <DeleteCredential id={id} platform={platform}/>
            <TouchableOpacity style={[{flex: 0.5, marginLeft: '1%'}, stylesButtons.mainConfig, stylesButtons.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.editButtonText]}>{editLabel}</Text>
            </TouchableOpacity>
          </View> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {credentialsModified && <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => setModalVisible(true)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.saveAcceptLabelText]}>{saveLabel}</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={cancelUpdate}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, options.cancelLabelText]}>{cancelLabel}</Text>
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
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{ownerNameLabel}</Text>
                {editFlag && 
                <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(ownerName, FlashMessage.ownerNameCopied, copyUsernameDescription)}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
                </TouchableOpacity>}
                </View>
                <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
                <View style={{margin: '2%', flexDirection: 'row'}}>
                    <TextInput 
                    editable={!editFlag} 
                    value={editFlag ? ownerName : ownerNameEdited}
                    style={[{ flex: 1}, credentials.credentialInfoText]}
                    onChangeText={text => editFlag ? setOwnerName(text): setOwnerNameEdited(text)}
                    />
                </View>
                </View>
            </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{cardNumberLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(cardNumber, FlashMessage.cardNumberCopied, copyURIDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? cardNumber : cardNumberEdited}
                  style={[{ flex: 1 }, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setCardNumber(text): setCardNumberEdited(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{securityCodeLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(securityCode, FlashMessage.securityCodeCopied, copyURIDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? securityCode : securityCodeEditted}
                  secureTextEntry={!(!showSecurityCode || !editFlag)}
                  style={[{ flex: 1 }, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setSecurityCode(text): setSecurityCodeEditted(text)}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 0.30}}>
            <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '3%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{verificationCodeLabel}</Text>
              {editFlag && 
              <TouchableOpacity style={[{flex: 0.4, marginTop:'3%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(securityCode, FlashMessage.verificationCodeCopied, copyURIDescription)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
              </TouchableOpacity>}
            </View>
            <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
              <View style={{margin: '2%', flexDirection: 'row'}}>
                <TextInput 
                  editable={!editFlag} 
                  value={editFlag ? verificationCode : verificationCodeEdited}
                  secureTextEntry={!(!showSecurityCode || !editFlag)}
                  style={[{ flex: 1 }, credentials.credentialInfoText]}
                  onChangeText={text => editFlag ? setVerificationCode(text): setVerificationCodeEdited(text)}
                />
              </View>
            </View>
          </View>
          {editFlag ?
          <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
            {showSecurityCode ?
              <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowSecurityCode} >
                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye'} size={34} color={darkGrey}/> 
                <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOnLabel}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[{marginLeft:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowSecurityCode} >
                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye-off'} size={34} color={darkGrey}/> 
                <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOffLabel}</Text>
              </TouchableOpacity>  
            }
          </View>
          : <></>}
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '6%', marginBottom: '2%',fontSize: whoEdittedTextSize}, {opacity: editFlag ? 100 : 0}]}>{buildEditMessage(edited.updatedBy, edited.updatedAt)}</Text> 
      </View>
      </View>
    <Options/>
    <YesOrNoSpinnerModal question={saveChangesLabel} yesFunction={saveCredentialUpdate} noFunction={dontSaveCredentialsUpdate} visibleFlag={modalVisible} loading={loading}/>
    </>
  )
}

export default function CredencialCardPage({ route }: Readonly<{route: any}>) {
  return (
    <>
      <KeyboardAvoidingWrapper>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MainBox text={route.params.platform}/>
          <CardInfo 
            id={route.params.id}
            cn={route.params.cardNumber}
            on={route.params.ownerName}
            platform={route.params.platform}
            sc={route.params.securityCode} 
            vc={route.params.verificationCode}
            edited={route.params.edited}
          />
        </View>
      </KeyboardAvoidingWrapper>
      <Navbar/>
    </>
  )
}