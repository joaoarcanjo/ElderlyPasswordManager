import React,{useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { permission, caregiver } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { Caregiver } from '../../../database/types'
import { getCaregivers } from '../../../database'
import { caregiverListUpdated } from '../../list_caregivers/actions/state'
import { addCaregiverToArray, getCaregiversArray, removeCaregiverFromArray } from '../../../firebase/firestore/functionalities'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { encryptAndSendMessage } from '../../../e2e/messages/functions'
import { ChatMessageType } from '../../../e2e/messages/types'

const caregiverImage = '../../../assets/images/caregiver.png'
const crossImage = "../../../assets/images/cross.png"
const checkImage = "../../../assets/images/check.png"

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
  return (
    <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, permission.container, stylesButtons.mainConfig]} onPress={() => func()}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, permission.text]}>{name}</Text>{value ? 
        <Image source={require(checkImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>:
        <Image source={require(crossImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>}
    </TouchableOpacity>
  )
}

function CaregiverPermissionsItem({ name, caregiverId, caregiverEmail, elderlyId, canRead, canWrite }: Readonly<{ name: string, caregiverId: string, caregiverEmail:string, elderlyId: string, canRead: boolean, canWrite: boolean }>) {

  const [readPermission, setReadPermission] = useState(canRead)
  const [writePermission, setWritePermission] = useState(canWrite)

  const readFunction = async () => {
    const result = !readPermission ? await addCaregiverToArray(elderlyId, caregiverId, 'readCaregivers') : await removeCaregiverFromArray(elderlyId, caregiverId, 'readCaregivers')
    if (result) {
      setReadPermission(!readPermission)
      console.log(caregiverEmail)
      await encryptAndSendMessage(caregiverEmail, '', false, ChatMessageType.PERMISSION_DATA) 
    }
  }

  const writeFunction = async () => {
    console.log(!writePermission)
    const result = !writePermission ? await addCaregiverToArray(elderlyId, caregiverId, 'writeCaregivers') : await removeCaregiverFromArray(elderlyId, caregiverId, 'writeCaregivers')
    console.log(result)
    if (result) {
      setWritePermission(!writePermission)
      await encryptAndSendMessage(caregiverEmail, '', false, ChatMessageType.PERMISSION_DATA) 
    }
  }

  return (
    <View style={[{ flex: 0.5, margin: '3%' }, caregiver.container]}>
      <View style={{ flex: 0.45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require(caregiverImage)} style={[{ width: '50%', height: '70%', resizeMode: 'contain' }]} />
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ width: '50%', fontSize: 25, marginTop: '5%' }]}>{name}</Text>
      </View>
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }} />
      <View style={{ flex: 0.65, marginBottom: '3%' }}>
        <Requirement name={'Ler credenciais'} value={readPermission} func={readFunction} />
        <Requirement name={'Alterar credenciais'} value={writePermission} func={writeFunction} />
      </View>
    </View>
  )
}


interface CaregiverPermission {
  canRead: boolean,
  canWrite: boolean,
  caregiver: Caregiver
}

async function getCaregiversPermissions(userId: string): Promise<CaregiverPermission[]> {
  const caregivers = await getCaregivers()
    const readCaregivers = await getCaregiversArray(userId, 'readCaregivers')
    const writeCaregivers = await getCaregiversArray(userId, 'writeCaregivers')

    let caregiversPermissions: CaregiverPermission[] = []

    caregivers.forEach((caregiver) => {
      caregiversPermissions.push({
        canRead: readCaregivers.includes(caregiver.id),
        canWrite: writeCaregivers.includes(caregiver.id),
        caregiver
      })
    })
    return caregiversPermissions
}

function CaregiversPermissions() {

  const [caregivers, setCaregivers] = useState<CaregiverPermission[]>([])
  const { userId } = useSessionInfo()

  const refreshValue = async () => {
    const caregiversPermissions = await getCaregiversPermissions(userId)
    setCaregivers(caregiversPermissions)
  }

  useEffect(() => {
    caregiverListUpdated.subscribe(() => refreshValue())
  }, [caregiverListUpdated])
  
  return (
    <View style={{ flex: 0.73, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', marginTop: '5%'}]}>
      {caregivers.map((item) => <CaregiverPermissionsItem key={item.caregiver.id} name={item.caregiver.name} caregiverId={item.caregiver.id} elderlyId={userId} canRead={item.canRead} canWrite={item.canWrite} caregiverEmail={item.caregiver.email}/>)}
      </View>
    </View>
  )
}

export default function PermissionsPage() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Permissões'}/>
      <CaregiversPermissions/>
      <Navbar/>
    </View>
  )
}