import * as Notifications from "expo-notifications";
import { showMessage } from "react-native-flash-message";
import { Image } from 'react-native';
import { yellowBackground } from "../assets/styles/colors";
import { durationQuickMessage } from "../assets/constants/constants";

export const triggerNotifications = async (title: string, body: string, data: any) => {
    console.log("triggerNotifications")
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title, //"You’ve got mail! 📬"
            body: body,
            data: {data: data},
        },
        trigger: null,
    })
}

export const triggerFlashMessage = async (title: any, body: string, image: any) => {
    console.log("triggerNotifications")
    showMessage({
        floating: true,
        message: title,
        description: body,
        icon: props => <Image source={image} {...props} />,
        backgroundColor: yellowBackground,
        duration: durationQuickMessage,
        color: "black",
      })
}