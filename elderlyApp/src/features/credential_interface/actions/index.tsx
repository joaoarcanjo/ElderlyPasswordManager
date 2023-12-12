import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { credentials, logout, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import { FlashMessage, copyValue, editCanceledFlash, editCompletedFlash, editValueFlash } from '../../../components/ShowFlashMessage'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { deleteCredential, updateCredential } from '../../../firebase/firestore/funcionalities'
import { YesOrNoModal } from '../../../components/Modal'
import { Spinner } from '../../../components/Spinner'
import Algorithm from '../../password_generator/actions/algorithm'
import { useLogin } from '../../login_interface/actions/session'

/**
 * Componente para apresentar as credenciais bem como as ações de editar/permissões
 * @returns 
 */
function AppInfo({id, platform, un, pw}: Readonly<{id: string, platform: string, un: string, pw: string}>) {

  const [username, setUsername] = useState(un)
  const [password, setPassword] = useState(pw)
  const [usernameEdited, setUsernameEdited] = useState(un)
  const [passwordEdited, setPasswordEdited] = useState(pw)

  const [avaliation, setAvaliation] = useState<number>(0)
  
  const [showPassword, setShowPassword] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<StackNavigationProp<any>>()

  useEffect(() => setAvaliation(getScore(passwordEdited)), [passwordEdited])
  const { userId } = useLogin()

  const toggleShowPassword = () => {setShowPassword(!showPassword);}

  const [editFlag, setEditFlag] = useState(true)
  const toggleEditFlag = () => {setEditFlag(!editFlag)}

  const inputStyle = editFlag ? credentials.credentialInputContainer : credentials.credentialInputContainerV2
  const credentialsModified = (password != passwordEdited || username != usernameEdited)

  /**
   * Função despoletada quando o utilizador decide guardar as alterações.
   * -> Manipula o estado de loading, atualiza as credenciais e manipula 
   * os estados de edição e normais.
   */
  function saveCredentialUpdate() {
    if(credentialsModified) {
      setLoading(true)
      updateCredential(userId, id, JSON.stringify({platform: platform, username: usernameEdited, password: passwordEdited}))
      .then((updated) => {
        toggleEditFlag()
        if(updated) {
          setUsername(usernameEdited)
          setPassword(passwordEdited)
          editCompletedFlash()
        } else {
          setUsernameEdited(username)
          setPasswordEdited(password)
        }
        setLoading(false)
      })
    } else {
      toggleEditFlag()
    }
    setModalVisible(false)
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

  const permissions = () => {
    navigation.navigate('Permissions', {platform: platform})
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
          <>
            <TouchableOpacity style={[{flex: 0.35, margin: '3%', marginVertical: '5%'}, stylesButtons.mainConfig, options.editButton]} onPress={() => {toggleEditFlag(); editValueFlash();}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.65, margin: '3%', marginVertical: '5%'}, logout.logoutButton, stylesButtons.mainConfig, options.permissionButton]} onPress={permissions}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Permissões</Text>
            </TouchableOpacity>
          </> :
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            {credentialsModified && <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => setModalVisible(true)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Guardar</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={cancelUpdate}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }

  return (
    <>
    <View style={{ flex: 0.52, width: '100%', marginVertical: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
        {!loading ? 
          <>
            <View style={{flex: 0.45}}>
              <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '8%', justifyContent: 'center', fontSize: 20}]}>UTILIZADOR</Text>
                {editFlag && 
                <TouchableOpacity style={[{flex: 0.5, marginTop:'10%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(username, FlashMessage.usernameCopied)}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
                </TouchableOpacity>}
              </View>
              <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
                <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
                  <TextInput 
                    editable={!editFlag} 
                    value={editFlag ? username : usernameEdited}
                    style={[{ flex: 1, fontSize: 22}, credentials.credentialInfoText]}
                    onChangeText={text => editFlag ? setUsername(text): setUsernameEdited(text)}
                  />
                </View>
              </View>
              {editFlag &&  <Text style={{marginLeft: '6%',fontSize: 13}}>Editado por: Elisabeth, 19/11/2021</Text>} 
            </View>
            <View style={{flex: 0.40}}>
              <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%'}}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '8%', justifyContent: 'center', fontSize: 20}]}>PASSWORD</Text>
                {editFlag && 
                <TouchableOpacity style={[{flex: 0.5, marginTop:'10%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyValue(password, FlashMessage.passwordCopied)}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
                </TouchableOpacity>}
              </View>
              <View style={[{ flex: 0.4, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%', marginVertical: '2%'}, inputStyle]}>
                <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
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
              <View style={{marginLeft: '6%', marginTop: '0%', height: '100%'}}>
                <Text style={{fontSize: 13}}>Editado por: Elisabeth, 19/11/2021</Text>   
              </View>
              <TouchableOpacity style={[{marginRight:'5%', marginTop: '0%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
              </TouchableOpacity>
            </View>
            :
            <View style={{ flex: 0.14, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '5%' }}>
              <TouchableOpacity style={[{flex: 0.50, marginRight: '5%'}, credentials.regenerateButton, stylesButtons.mainConfig]} onPress={() => {regeneratePassword()} }>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
              </TouchableOpacity>
            </View>}
          </> :
          <Spinner/>
        }
      </View>
    </View>
    <Options/>
    <YesOrNoModal question={'Guardar as alterações?'} yesFunction={() => saveCredentialUpdate()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    <DeleteCredential id={id} />
    </>
  )
}

/**
 * Componente que representa o botão para apagar a credencial
 * @returns 
 */
function DeleteCredential({id}: Readonly<{id: string}>) {
  
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [modalVisible, setModalVisible] = useState(false)
  const { userId } = useLogin()

  const deleteCredentialAction = () => {
    navigation.goBack()
    deleteCredential(userId, id)
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
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
      <AppInfo id={route.params.id} un={route.params.username} pw={route.params.password} platform={route.params.platform}/>
      <Navbar/>
    </View>
  )
}