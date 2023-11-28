import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { credentials, changer, logout, options } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AvaliationEmoji from '../../../components/EmojiAvaliation'
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import copyValue from '../../../components/ShowFlashMessage'

function AppInfo({un, pw}: Readonly<{un: string, pw: string}>) {

  const [username, setUsername] = useState(un)
  const [password, setPassword] = useState(pw)
  const [avaliation, setAvaliation] = useState<number>(0)
  
  useEffect(() => setAvaliation(getScore(password)), [password])
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const [editFlag, setEditFlag] = useState(false); 
  const toggleEditFlag = () => setEditFlag(!editFlag);
  
  return (
    <>
    <View style={{ flex: 0.50, width: '100%', marginBottom: '5%'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%'}, credentials.credentialInfoContainer]}>
        <View style={{flex: 0.45}}>
          <View style={{flex: 0.43, flexDirection: 'row'}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '5%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>USERNAME</Text>
            <View style={[{flex: 0.5, marginRight:'7%', marginTop:'10%', justifyContent: 'center',  alignItems: 'center' }, changer.caregiverNameContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontSize: 19}]}>Elisabeth</Text>
            </View>
          </View>
          {!editFlag ?
            <TouchableOpacity style={[{ flex: 0.35, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%'}, credentials.credentialInfoButton, stylesButtons.mainConfig]} onPress={() => copyValue(username)}>
              <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
                <Text style={[{ flex: 1, marginRight: '5%', padding: '3%'}, credentials.credentialInfoText]}>
                  {username}
                </Text>
              </View>
          </TouchableOpacity>   
          :
          <View style={[{ flex: 0.35, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%'}, credentials.credentialInfoButton, stylesButtons.mainConfig]}>
              <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
                <TextInput 
                  value={username}
                  style={[{ flex: 1, fontSize: 22, marginRight: '5%', padding: '3%'}, credentials.credentialInfoText]}
                  onChangeText={text => setUsername(text)}
                />
              </View>
          </View>   
          }
        </View>

        <View style={{flex: 0.55}}>
          <View style={{flex: 0.35, flexDirection: 'row'}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.5, marginTop: '5%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>PASSWORD</Text>
            <View style={[{flex: 0.5, marginRight:'7%', marginTop:'8%', justifyContent: 'center',  alignItems: 'center' }, changer.caregiverNameContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontSize: 19}]}>Elisabeth</Text>
            </View>
          </View>
          {!editFlag ?
            <TouchableOpacity style={[{ flex: 0.3, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%'}, credentials.credentialInfoButton, stylesButtons.mainConfig]} onPress={() => copyValue(password)}>
              <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
                <Text style={[{ flex: 1, marginRight: '5%', padding: '3%'}, credentials.credentialInfoText]}>
                  {!showPassword ? '*'.repeat(password.length): password}
                </Text>
                <AvaliationEmoji avaliation={avaliation}/>  
              </View>
          </TouchableOpacity>   
          :
          <View style={[{ flex: 0.3, alignItems: 'center', justifyContent: 'center', marginHorizontal: '4%'}, credentials.credentialInfoButton, stylesButtons.mainConfig]}>
              <View style={{marginHorizontal: '4%', flexDirection: 'row'}}>
                <TextInput 
                  value={password}
                  style={[{ flex: 1, fontSize: 22, marginRight: '5%', padding: '3%'}, credentials.credentialInfoText]}
                  onChangeText={text => setPassword(text)}
                />
                <AvaliationEmoji avaliation={avaliation}/>  
              </View>
          </View>   
          }
          <View style={{ flex: 0.32, justifyContent: 'center', alignItems: 'flex-end', marginBottom: '2%' }}>
            <TouchableOpacity style={[{marginRight:'5%', marginVertical: '2%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
              <MaterialCommunityIcons style={{marginHorizontal: '5%'}} disabled={editFlag} name={showPassword || (!showPassword && editFlag) ? 'eye' : 'eye-off'} size={40} color="black"/> 
          </TouchableOpacity>   
          </View>
        </View>
      </View>
    </View>
    {/* TODO: aparecer uma flash message a dizer que a edição foi ativada*/}
    <View style= { { flex: 0.13, marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-around'} }>
    <TouchableOpacity style={[{flex: 0.35, margin: '3%', marginVertical: '5%'}, stylesButtons.mainConfig, options.editButton]} onPress={() => toggleEditFlag()}>
            <MaterialIcons style={{marginHorizontal: '5%'}} name={editFlag ? 'edit': 'edit-off'} size={40} color="black"/> 
    </TouchableOpacity>
    <TouchableOpacity style={[{flex: 0.65, margin: '3%', marginVertical: '5%' }, logout.logoutButton, stylesButtons.mainConfig, options.permissionButton]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[options.permissionsButtonText]}>Permissões</Text>
    </TouchableOpacity>
    </View>
    </>
  )
}

function DeleteCredential() {
  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, logout.logoutButton, stylesButtons.mainConfig]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>Apagar</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CredencialPage({ route }: Readonly<{route: any}>) {

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={route.params.platformName}/>
      <AppInfo un={route.params.username} pw={route.params.password}/>
      <DeleteCredential/>
      <Navbar/>
    </View>
  )
}