const pushNotificationURL = "https://exp.host/--/api/v2/push/send"

interface pushNotificationMessage {
    to: string | undefined,
    sound: string,
    title: string, 
    body: string, 
    data: object, 
    categoryId: string
}

export { pushNotificationMessage, pushNotificationURL }