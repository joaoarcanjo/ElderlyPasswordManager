import React, { useState, useEffect, } from 'react'
import { TextInput, View, Text, Button } from "react-native";
import { Observable } from 'rxjs'
import { usernameSubject } from '../../../e2e/identity/state'
import { currentSessionSubject, sessionForRemoteUser, sessionListSubject } from '../../../e2e/session/state'
import { ChatMessageType, ProcessedChatMessage } from '../../../e2e/messages/types';
import { ChatSession } from '../../../e2e/session/types';
import { startSession } from '../../../e2e/session/functions';
import { createIdentity } from '../../../e2e/identity/functions';
import * as Crypto from 'expo-crypto'
import { encryptAndSendMessage } from '../../../e2e/messages/functions';

function ChatPageTest() {
    const username = useObservable(usernameSubject, '')
    const currSession = useObservable(currentSessionSubject, null)
    return (
        <View><Text>Signal Protocol Chat</Text>
        <View>
            <Text>Signal Protocol Typescript SDK</Text>
        </View>
        {
        username ? currSession ? <SessionDetails /> : <SessionList /> : <CreateIdentity />
      }
        </View>
    )
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CreateIdentity() {
  const [username, setUsername] = useState(`${getRandomNumber(1, 1000)}`);
  const [url, setUrl] = useState('http://192.168.1.68:442');

  const createID = async () => {
    await createIdentity(username)
  };

  return (
    <View>
      <View style={{marginBottom: 10, backgroundColor: 'lightblue'}}>
        <Text>Username:</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={{marginBottom: 10, backgroundColor: 'lightgreen'}}>
        <Text>REST API URL:</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
        />
      </View>
      <Button
        title="Create Identity"
        onPress={createID}
      />
    </View>
  );
}

function AddSession(): JSX.Element {
  const [remoteUsername, setRemoteUsername] = useState('insere')

  const createSession = () => {
      console.log("RemoteUsername: ", remoteUsername)
      startSession(remoteUsername)

      const session = sessionForRemoteUser(remoteUsername)
      currentSessionSubject.next(session || null)
      setRemoteUsername('')
  }

  return (
      <View style={{marginBottom: 10, backgroundColor: 'lightblue'}}>
          <Text>Create a new chat session</Text>
          <Text>Look up a user by username and start and end-to-end-encrypted chat</Text>
          <TextInput style={{margin: '5%', backgroundColor: 'lightblue', borderStartWidth: 5}}
            value={remoteUsername}
            onChangeText={setRemoteUsername}
          />
          <Button
            title="Start Session"
            onPress={createSession}
          />
      </View>
  )
}

function SessionList(): JSX.Element {
  const sessionList = useObservable(sessionListSubject, [])
  const username = useObservable(usernameSubject, '')

  return (
      <View>
          <Text>Chat Sessions ({username})</Text>

          <>
              {sessionList.map((session) => (
                  <SessionSummary key={Crypto.randomUUID()} session={session}></SessionSummary>
              ))}
          </>
          <AddSession />
      </View>
  )
}

interface SessionSummaryProps {
  session: ChatSession
}

function SessionSummary(props: SessionSummaryProps): JSX.Element {
  const { session } = props
  const { messages, remoteUsername } = session
  const lastActivity = (messages.length && Math.max(...messages.map((m) => m.timestamp))) || Date.now()

  console.log({ lastActivity })

  const viewChatSession = (username: string) => {
      currentSessionSubject.next(sessionForRemoteUser(username || '') || null)
  }

  return (
      <View>
          <Text>{remoteUsername}</Text>
          <Button
            title="view"
            onPress={() => viewChatSession(remoteUsername)}
          />
      </View>
  )
}

function SessionDetails(): JSX.Element {
  const session = useObservable(currentSessionSubject, null)
  const username = useObservable(usernameSubject, '')

  console.log({ session })

  const clearCurrentSession = () => {
      currentSessionSubject.next(null)
  }

  return (
      (session && (
          <View>
              <Text>
                  Chat: {username} - {session.remoteUsername}
              </Text>
              <Button
                title="Back"
                onPress={() => clearCurrentSession()}
              />
              <MessageList messages={session.messages} remoteUserName={session.remoteUsername} />
              <View>
                  <ComposeMessage toUser={session.remoteUsername} />
              </View>
          </View>
      )) || (
          <View>
              <Text>No active session</Text>
              <Button
                title="Back"
                onPress={() => clearCurrentSession()}
              />
          </View>
      )
  )
}

export interface ComposeMessageProps {
  toUser: string
}

function ComposeMessage(props: ComposeMessageProps): JSX.Element {
  const [message, setMessage] = useState('')

  const sendMessage = async (to: string, message: string) => {
      encryptAndSendMessage(to, message, false, ChatMessageType.NORMAL_DATA)
      setMessage('')
  }

  return (
      <View>
          <TextInput
            style={{margin: '5%', backgroundColor: 'lightblue', borderStartWidth: 5}}
            value={message}
            onChangeText={setMessage}
          />
          <Button
                title="Send Message"
                onPress={() => sendMessage(props.toUser, message)}
              />
      </View>
  )
}

export interface MessageListProps {
  messages: ProcessedChatMessage[]
  remoteUserName: string
}

function MessageList(props: MessageListProps): JSX.Element {
  return (
      <View>
          {props.messages.map((m) => (
              <MessageView message={m} incoming={m.from === props.remoteUserName} key={Crypto.randomUUID()}/>
          ))}
      </View>
  )
}

export interface MessageViewProps {
  message: ProcessedChatMessage
  incoming: boolean
}


function MessageView(props: MessageViewProps): JSX.Element {
  const timeString = new Date(props.message.timestamp).toLocaleString()

  return (
      <View>
          <Text>{timeString}</Text>
          <Text>{props.message.from+ ":"}</Text> 
          <Text>{props.incoming ? props.message.body : props.message.body}</Text>
      </View>
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

export default ChatPageTest