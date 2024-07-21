import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { View, TouchableOpacity, Text, Alert } from "react-native"
import { deleteCredentialLabel, emptyValue } from "../../../assets/constants/constants"
import { stylesButtons } from "../../../assets/styles/main_style"
import { YesOrNoModal } from "../../../components/Modal"
import { deleteCredentialFromLocalDB } from "../../../database/credentials"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../context/session"
import { deleteCredentialFromFiretore } from "../../../firebase/firestore/functionalities"
import { logout } from "../styles/styles"
import { sendCaregiversCredentialInfoAction } from "./functions"
import { credentialDeletedFlash } from "../../../notifications/UserMessages"

/**
 * Componente que representa o botão para apagar a credencial
 * @returns 
 */
export function DeleteCredential({id, platform}: Readonly<{id: string, platform: string}>) {
  
    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)
    const { userId } = useSessionInfo()
  
    const deleteCredentialAction = async () => {

      const startTime = Date.now()    
      await deleteCredentialFromFiretore(userId, id)
      .then(() => deleteCredentialFromLocalDB(userId, id))
      .then(async () => await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_DELETED))
      .then(() => credentialDeletedFlash(userId, platform, true))
      .then(() => navigation.goBack())
      .catch(() => console.log('#1 Error deleting credential'))

      const endTime = Date.now()
      const duration = endTime - startTime;
      //Alert.alert('Tempo de execução da operação de apagar uma credencial:', `${duration}ms`)
    }
  
    return (
      <View style= { { flex: 0.50, flexDirection: 'row', justifyContent: 'space-around', marginRight: '1%'} }>
        <YesOrNoModal question={'Apagar a credencial?'} yesFunction={() => deleteCredentialAction()} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
        <TouchableOpacity style={[{flex: 1}, logout.logoutButton, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[ logout.logoutButtonText]}>{deleteCredentialLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }