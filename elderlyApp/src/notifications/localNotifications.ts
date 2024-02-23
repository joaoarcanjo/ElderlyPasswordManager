import * as Notifications from "expo-notifications";

export const triggerNotifications = async (title: string, body: string, data: any) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title, //"You’ve got mail! 📬"
            body: body,
            data: {data: data},
        },
        trigger: { seconds: 1 },
    })
}