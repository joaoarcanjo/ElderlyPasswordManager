import { pushNotificationMessage, pushNotificationURL } from "./constants-types";

async function sendPushNotification(message: pushNotificationMessage) {
  
    await fetch(pushNotificationURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
}
export { sendPushNotification }