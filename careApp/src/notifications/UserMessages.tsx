
import { Image, AppState, InteractionManager, ImageProps } from 'react-native';
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { appActive, durationSlowMessage, durationQuickMessage } from '../assets/constants/constants';
import { triggerNotifications } from './localNotifications';
import { notificationColor } from '../assets/styles/colors';
import { credentialCreatedByElderlyDescription, credentialCreatedDescription, credentialDeletedByElderlyDescription, credentialDeletedDescription, credentialUpdatedByElderlyDescription, credentialUpdatedDescription, editModeActiveDescription, editModeCanceledDescription, elderlyPersonalInfoUpdatedDescription, FlashMessage, maxNumberOfConnectionsDescription, maxNumberOfConnectionsElderlyDescription, permissionsChangedDescription, personalInfoUpdatedDescription, sessionAcceptedDescription, sessionEndedDescription, sessionRejectedDescription, sessionRequestCanceledDescription, sessionRequestReceivedDescription, sessionRequestSentDescription, sessionVerifiedDescription } from '../assets/constants/messages';
import { notificationDescriptionTextSize, notificationTitleTextSize } from '../assets/styles/text';

/**
 * Copies the provided value to the clipboard and shows a flash message.
 * @param value - The value to be copied to the clipboard.
 * @param message - The flash message to be shown.
 * @param description - The optional description for the flash message.
 * @returns A Promise that resolves when the value is successfully copied to the clipboard.
 */
export async function copyValue(value: string, message: FlashMessage, description: string = ""): Promise<void> {
  Clipboard.setStringAsync(value).then(() => {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: message,
      description: description,
      icon: (props: any) => <Image source={require('../assets/images/copy.png')} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  })
}

/**
 * Displays a flash message with an edit mode active indicator.
 */
export function editValueFlash() {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    titleStyle: {fontSize: notificationTitleTextSize},
    message: FlashMessage.editModeActive,
    description: editModeActiveDescription,
    icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
}

/**
 * Displays a flash message indicating that the edit mode has been canceled.
 */
export function editCanceledFlash() {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    titleStyle: {fontSize: notificationTitleTextSize},
    message: FlashMessage.editModeCanceled,
    description: editModeCanceledDescription,
    icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
} 

/**
 * Displays a flash message indicating that the elderly's personal information has been updated.
 * @param elderlyEmail - The email of the elderly.
 */
export function elderlyPersonalInfoUpdatedFlash(elderlyEmail: string) {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    message: FlashMessage.elderlyPersonalInfoUpdated,
    description: elderlyPersonalInfoUpdatedDescription(elderlyEmail),
    icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
}

/**
 * Displays a flash message indicating that the caregiver's personal information has been updated.
 */
export function caregiverPersonalInfoUpdatedFlash() {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    titleStyle: {fontSize: notificationTitleTextSize},
    message: FlashMessage.personalInfoUpdated,
    description: personalInfoUpdatedDescription,
    icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
}

/**
 * Displays a flash message when a session request is sent.
 * @param elderlyEmail - The email of the elderly.
 */
export function sessionRequestSent(elderlyEmail: string) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.sessionRequestReceived,
      description: sessionRequestReceivedDescription(elderlyEmail),
      icon: (props: any) => <Image source={require("../assets/images/send.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
} 

/**
 * Displays a flash message when a session request is received.
 * @param elderlyEmail - The email of the elderly who sent the session request.
 */
export function sessionRequestReceivedFlash(elderlyEmail: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.sessionRequestReceived,
      description: sessionRequestReceivedDescription(elderlyEmail),
      icon: (props: any) => <Image source={require("../assets/images/send.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.sessionRequestReceived, sessionRequestReceivedDescription(elderlyEmail), "")
  }
}

/**
 * Displays a flash message indicating that a session has been accepted.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param byMe - A boolean indicating if the session acceptance was sent by the current user.
 */
export function sessionAcceptedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message:  byMe ? FlashMessage.sessionAccepted : FlashMessage.elderlyAccept,
      description: sessionAcceptedDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/check.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionAccepted : FlashMessage.elderlyAccept, sessionAcceptedDescription(from), "")
  }
}

/**
 * Displays a flash message indicating that a session has been rejected.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param byMe - Indicates if the rejection was made by the current user.
 */
export function sessionRejectedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message:  byMe ? FlashMessage.sessionRejected : FlashMessage.elderlyReject,
      description: sessionRejectedDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionRejected : FlashMessage.elderlyReject, sessionRejectedDescription(from), "")
  }
}

/**
 * Displays a flash message indicating that a session request has been canceled.
 * @param elderlyEmail - The email of the elderly who canceled the session request.
 */
export function sessionRequestCanceledFlash(elderlyEmail: string, byMe: boolean) {
  if (AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.sessionRequestCanceled,
      description: sessionRequestCanceledDescription(elderlyEmail),
      icon: (props: any) => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    });
  } else {
    triggerNotifications(FlashMessage.sessionRequestCanceled, sessionRequestCanceledDescription(elderlyEmail), "");
  }
}

/**
 * Displays a flash message when the maximum number of session is reached and cant accept new sessions.
 * This message is present when elderly receives a new session request.
 * @param from - The source of the rejection.
 */
export function sessionRejectMaxReachedFlash(from: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.cantAcceptConnection,
      description: maxNumberOfConnectionsDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.cantAcceptConnection, maxNumberOfConnectionsDescription(from), "")
  }
}


/**
 * Displays a flash message when the maximum number of session rejections is reached by elderly.
 * @param from - The source of the rejection.
 */
export function sessionRejectedMaxReachedFlash(from: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: FlashMessage.elderlyCantAcceptConnection,
      description: maxNumberOfConnectionsElderlyDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.elderlyCantAcceptConnection, maxNumberOfConnectionsElderlyDescription(from), "")
  }
}

/**
 * Displays a flash message indicating that a session has ended.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param byMe - Indicates whether the session was ended by the user.
 */
export function sessionEndedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: byMe ? FlashMessage.sessionEnded : FlashMessage.sessionEndedByElderly,
      description: sessionEndedDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/minus.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionEnded : FlashMessage.sessionEndedByElderly, sessionEndedDescription(from), "")
  }
}

/**
 * Displays a flash message indicating that the credential has been updated.
 * If the app is active, it shows a floating message with an icon and a description.
 * If the app is not active, it triggers a notification with the message and description.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param info - The information about the updated credential.
 */
export function credentialUpdatedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialUpdated : FlashMessage.credentialUpdatedByElderly
  const description = byMe ? credentialUpdatedDescription(platform) : credentialUpdatedByElderlyDescription(from, platform)
  
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: message,
      description: description,
      icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.credentialUpdatedByElderly, credentialUpdatedByElderlyDescription(from, platform), "")
  }
}

/**
 * Displays a flash message indicating that a credential has been created by someone other than the current user.
 * If the app is active, the message is shown as a floating message. Otherwise, a notification is triggered.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param info - The information about the credential.
 */
export function credentialCreatedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialCreated : FlashMessage.credentialCreatedByElderly
  const description = byMe ? credentialCreatedDescription(platform) : credentialCreatedByElderlyDescription(from, platform)

  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: message,
      description: description,
      icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
      position: 'top'
    })
  } else {
    triggerNotifications(message,  description, "")
  }
}

/**
 * Displays a flash message indicating that a credential has been deleted by another user.
 * @param from - The sender of the session acceptance. It is empty if byMe is true.
 * @param info - The information about the deleted credential.
 */
export function credentialDeletedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialDeleted : FlashMessage.credentialDeletedByEdlerly
  const description = byMe ? credentialDeletedDescription(platform) : credentialDeletedByElderlyDescription(from, platform)
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: message,
      description: description,
      icon: (props: any) => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(message, description, "")
  }
}

/**
 * Displays a flash message with session permissions information.
 * @param from - The source of the permissions change.
 */
export function sessionPermissionsFlash(from: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      message: FlashMessage.elderlyPermissionsReceived, 
      description: permissionsChangedDescription(from),
      icon: (props: any) => <Image source={require("../assets/images/minus.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    });
  } else {
    triggerNotifications(FlashMessage.elderlyPermissionsReceived, permissionsChangedDescription(from), "")
  }
}

/**
 * Sends the first key from the elderly to the specified recipient.
 * If the app state is 'active', it shows a floating message with the session verification details.
 * Otherwise, it triggers a notification with the session verification details.
 * 
 * @param from - The sender of the key.
 */
export function elderlySentFirstKey(from: string) {
  setTimeout(() => {
    if (AppState.currentState === 'active') {
      showMessage({
        floating: true,
        message: FlashMessage.sessionVerified,
        description: sessionVerifiedDescription(from),
        icon: (props: any) => <Image source={require("../assets/images/plus.png")} {...props} />,
        backgroundColor: notificationColor,
        duration: durationQuickMessage,
        color: "black",
      });
    } else {
      triggerNotifications(FlashMessage.sessionVerified, sessionVerifiedDescription(from), "");
    }
  }, 7000);
}