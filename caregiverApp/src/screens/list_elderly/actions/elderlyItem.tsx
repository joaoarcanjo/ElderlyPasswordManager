import React from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { elderlyStyle, newElderlyOptions } from "../styles/styles"
import { stylesButtons } from "../../../assets/styles/main_style";
import { acceptElderly, decouplingElderly, refuseElderly } from "./functions";

interface ElderlyProps {
  name: string;
  //caregiverImage: string; 
}

const caregiverImage = '../../../assets/images/elderly.png'

export function ElderlyItem({name, phone, email, setRefresh, accepted}: Readonly<{name: string, phone: string, email: string, setRefresh: Function, accepted: number}>) {

  const lastUpdated = '2021-05-12'
  const credentialLastUpdated = '2021-05-12' 

  const deleteElderly = () => {
    decouplingElderly(email).then(() => setRefresh())
  }

  const accept = () => { acceptElderly(email).then(() => setRefresh()); }
  const refuse = () => { refuseElderly(email).then(() => setRefresh()); }

  return (
    accepted == 1 ? 
      <View style={[{flex: 1}, elderlyStyle.container]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
          <Image source={require(caregiverImage)} style={{ width: 80, height: 80, borderRadius: 40, marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{name}</Text>
            <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }} />
            <Text style={{ fontSize: 14, color: '#555' }}>Última atualização pessoal: {lastUpdated}</Text>
            <Text style={{ fontSize: 14, color: '#555' }}>Última atualização credenciais: {credentialLastUpdated}</Text>
          </View>
        </View>
      </View>
    : 
    <View style={[{flex: 1}, elderlyStyle.newElderlyContainer]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
        <View style={{ flex: 1 }}>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 18 }}>{`O idoso ${name} com o email ${email} enviou-lhe um pedido!`}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.acceptButton, stylesButtons.mainConfig]} onPress={accept}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Aceitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.rejectButton, stylesButtons.mainConfig]} onPress={refuse}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Recusar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export function ElderlyItemMockup({ name }: Readonly<ElderlyProps>) {

  const lastUpdated = '2021-05-12'
  const credentialLastUpdated = '2021-05-12' 
  return (
    <View style={[{flex: 1}, elderlyStyle.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
        <Image source={require(caregiverImage)} style={{ width: 80, height: 80, borderRadius: 40, marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{name}</Text>
          <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }} />
          <Text style={{ fontSize: 14, color: '#555' }}>Última atualização pessoal: {lastUpdated}</Text>
          <Text style={{ fontSize: 14, color: '#555' }}>Última atualização credenciais: {credentialLastUpdated}</Text>
        </View>
      </View>
    </View>
  )
}