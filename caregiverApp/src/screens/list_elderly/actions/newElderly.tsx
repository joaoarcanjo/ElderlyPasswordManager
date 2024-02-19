import React, { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, Image, Button } from "react-native"
import { Observable } from "rxjs"
import { stylesButtons } from "../../../assets/styles/main_style"
import { sessionListSubject } from "../../../e2e/session/state"
import { elderlyStyle, newElderlyOptions } from "../styles/styles"
import { acceptElderly, refuseElderly } from "./functions"
import { selectAllElderly } from "../../../database"
import { ChatSession } from "../../../e2e/session/types"

const caregiverImage = '../../../assets/images/elderly.png'
    
async function auxFunction(sessionList: ChatSession[]): Promise<any> {
  const currentElderly = await selectAllElderly()

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

export default function NewElderlyList() {

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
          <NewElderly session={session}/>
        </View>
      )
    })
  )
}

function NewElderly({session}: Readonly<{session: ChatSession}>) {

  const [ visibility, setVisibility ] = useState(true)

  const accept = () => { acceptElderly(session.remoteUsername); setVisibility(false) }
  const refuse = () => { refuseElderly(session.remoteUsername); setVisibility(false) }

  return (
    <>
    {visibility &&
      <View style={[{flex: 1}, elderlyStyle.newElderlyContainer]}>
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