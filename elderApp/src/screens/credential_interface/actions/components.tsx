import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { deleteCredentialCardLabel, deleteCredentialLoginLabel, emptyValue } from "../../../assets/constants/constants"
import { stylesButtons } from "../../../assets/styles/main_style"
import { YesOrNoModal } from "../../../components/Modal"
import { credentialDeletedFlash } from "../../../components/UserMessages"
import { deleteCredentialFromLocalDB } from "../../../database/credentials"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { deleteCredentialFromFiretore } from "../../../firebase/firestore/functionalities"
import { logout } from "../styles/styles"
import { sendCaregiversCredentialInfoAction } from "./functions"

/**
 * Componente que representa o botão para apagar a credencial
 * @returns 
 */
export function DeleteCredential({id, platform, type}: Readonly<{id: string, platform: string, type: string}>) {
  
    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)
    const { userId } = useSessionInfo()
  
    const deleteCredentialAction = async () => {
      await deleteCredentialFromFiretore(userId, id)
      .then(() => deleteCredentialFromLocalDB(userId, id))
      .then(async () => await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_DELETED))
      .then(() => credentialDeletedFlash(userId, platform, true))
      .then(() => navigation.goBack())
      .catch(() => console.log('#1 Error deleting credential'))
    }

    const deleteButtonLabel = type === 'login' ? deleteCredentialLoginLabel : deleteCredentialCardLabel
  
    return (
      <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
        <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '20%', marginVertical: '3%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>{deleteButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }