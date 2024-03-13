import { useState, useEffect, useRef } from 'react'
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Contants from "expo-constants"
import * as Clipboard from 'expo-clipboard';


import { Platform } from 'react-native'
import { useSessionInfo } from '../firebase/authentication/session';

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken
    notification?: Notifications.Notification
}

export const usePushNotifications = (): PushNotificationState => {

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: true,
        }),
    })

    const { passwordCopied, usernameCopied} = useSessionInfo()

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>()
    const [notification, setNotification] = useState<Notifications.Notification | undefined>()

    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync()

            if(existingStatus !== 'granted') {
                alert("Failed to get push token for push notifications")
                return
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: Contants.expoConfig?.extra?.eas.projectId,
            })
        } else {
            //alert("Must be using a physical device for Push notifications")
        }


        if(Platform.OS == 'android') {
            Notifications.setNotificationChannelAsync("default", {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C"
            })
        }

        return token
    }

    useEffect(() => {

        const category = 'credentials';

        const actions = [
            {
                buttonTitle: 'UTILIZADOR 👁️',
                identifier: 'username',
                options: {
                    opensAppToForeground: false
                }
            },
            {
                buttonTitle: 'PASSWORD 🔑',
                identifier: 'password',
                options: {
                    opensAppToForeground: false
                }
            }
        ];

        Notifications.setNotificationCategoryAsync(category, actions);

        //TODO: O tokenId das push notifications vai ser armazenado localmente, na base de dados. Se, por exemplo, o token alterar, 
        //vai reenviar aos membros da relação, imaginemos que mudou de dispositivo.
        registerForPushNotificationsAsync().then((token) => { console.log(token); setExpoPushToken(token); })

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification)
        })
            
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response: { actionIdentifier: any; }) => {
            switch(response.actionIdentifier) {
                case 'username': {
                    console.log("USERNAME: "+usernameCopied)
                    console.log("PASSWORD: "+passwordCopied)
                    console.log(usernameCopied)
                    Clipboard.setStringAsync(usernameCopied)
                    break
                }
                case 'password': {
                    console.log(passwordCopied)
                    Clipboard.setStringAsync(passwordCopied)
                    break
                }
              }
        })

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current!
            )

            Notifications.removeNotificationSubscription(responseListener.current!)
        }
    }, [])

    return {
        expoPushToken,
        notification
    }
}