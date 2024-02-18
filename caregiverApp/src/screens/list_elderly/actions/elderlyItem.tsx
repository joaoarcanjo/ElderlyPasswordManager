import React from "react"
import { View, Text, Image } from "react-native"
import { elderlyStyle } from "../styles/styles"

interface ElderlyProps {
  name: string;
  //caregiverImage: string; 
}

const caregiverImage = '../../../assets/images/elderly.png'

export default function CaregiverItem({ name }: Readonly<ElderlyProps>) {

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