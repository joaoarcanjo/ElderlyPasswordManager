import React, { useState, useEffect } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { Observable } from "rxjs"
import { stylesButtons } from "../../../assets/styles/main_style"
import { currentSessionSubject, sessionListSubject } from "../../../e2e/session/state"
import { elderlyStyle, newElderlyOptions } from "../styles/styles"
import { acceptElderly, refuseElderly } from "./functions"
import { getAllElderly } from "../../../database"
import { ChatSession } from "../../../e2e/session/types"
import { ChatMessageType } from "../../../e2e/messages/types"
import { Spinner } from "../../../components/LoadingComponents"
import { sessionEstablishedFlash } from "../../../components/ShowFlashMessage"
    
async function auxFunction(sessionList: ChatSession[]): Promise<any> {
  const currentElderly = await getAllElderly()

  const elderly = new Map<string, ChatSession>()

  //Obter a lista de idosos que se estão a conectar.
  sessionList.forEach((session) => {
    let exists = false
    currentElderly.forEach((elderly) => {
      if (session.remoteUsername === elderly.email) {
        exists = true
      }
    })
    if(!exists) {
      elderly.set(session.remoteUsername, session)
    } 
    exists = false
  })

  if(elderly.size == 0) return []

  const toReturn: ChatSession[] = []
  
  elderly.forEach((elderly) => {
    toReturn.push(elderly)
  })
  return toReturn
}

export default function NewElderlyList({setRefresh}: {setRefresh: Function}) {

  const [newElderlyList, setNewElderlyList] = useState<ChatSession[]>([])
  const sessionList = useObservable(sessionListSubject, [])

  useEffect(() => {
    if(sessionList.length != 0) {
      auxFunction(sessionList).then((elderly) => {
        setNewElderlyList(elderly)
      })
    }
  }, [sessionList])

  if(newElderlyList.length == 0 || sessionList.length == 0) return <></>

  return (
    newElderlyList.map((session, index) => {
      return (
        <View key={index}>
          <NewElderly session={session} setRefresh={setRefresh}/>
        </View>
      )
    })
  )
}

//TODO: AQUI VAI FICAR LOADING ATÉ RECEBER A PERSONAL DATA DO IDOSO.
//QUANDO RECEBER TAIS DADOS, VAI PARAR DE FAZER LOADING, LANÇA UMA FLASH MESSAGE A DIZER QUE A SESSÃO
//FOI ESTABELECIDA E VAI REALIZAR REFRESH AO COMPONENTE PAI.
function NewElderly({session, setRefresh}: Readonly<{session: ChatSession, setRefresh: Function}>) {

  const [visibility, setVisibility] = useState(true)
  const [loading, setLoading] = useState(false)
  const currSession = useObservable(currentSessionSubject, null)

  const accept = () => { acceptElderly(session.remoteUsername); setLoading(true) }
  const refuse = () => { refuseElderly(session.remoteUsername); setVisibility(false) }

  useEffect(() => {
    if(loading && currSession?.remoteUsername === session.remoteUsername) {
      session?.messages.forEach(async (message) => {
        if(message.type === ChatMessageType.PERSONAL_DATA) {
          sessionEstablishedFlash()
          setVisibility(false)
          setLoading(false)
          setRefresh()
        }
      })
    }
  }, [currentSessionSubject.value])

  return (
    <>
    {visibility &&
        <View style={[{flex: 1}, elderlyStyle.newElderlyContainer]}>
          {
            !loading ?
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
              <View style={{ flex: 1 }}>
                <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 18 }}>{`O idoso com o email ${session.remoteUsername} enviou-lhe um pedido!`}</Text>
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
            : <Spinner width={130} height={130}/>
          }
        </View> 
    }
    </>
    
  )
}

function useObservable<T>(observable: Observable<T>, initialValue: T): T {
    const [value, setValue] = useState(initialValue)
  
    useEffect(() => {
        const subscription = observable.subscribe((newValue) => {
            setValue(newValue)
        })
        return () => subscription.unsubscribe()
    }, [observable])
  
    return value
  }