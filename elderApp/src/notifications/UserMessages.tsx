
import { Image, AppState } from 'react-native';
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { appActive, durationQuickMessage, durationSlowMessage, emptyValue } from '../assets/constants/constants';
import { FlashMessage, caregiverPersonalInfoUpdatedDescription, editModeActiveDescription, editModeCanceledDescription, maxNumberOfConnectionsDescription, maxNumberOfConnectionsCaregiverDescription, sessionAcceptedDescription, sessionEndedDescription, sessionRejectedDescription, sessionRequestReceivedDescription, sessionRequestSentDescription, credentialUpdatedByCaregiver, credentialCreatedByCaregiver, credentialDeletedByCaregiver, credentialDeletedDescription, credentialCreatedDescription, credentialUpdatedDescription, personalInfoUpdatedDescription, sessionRequestCanceledDescription } from '../assets/constants/messages';
import { notificationColor } from '../assets/styles/colors';
import { triggerNotifications } from '../notifications/localNotifications';
import { notificationDescriptionTextSize, notificationTitleTextSize } from '../assets/styles/text';

/**
 * Copies the provided value to the clipboard and shows a flash message.
 * @param value - The value to be copied to the clipboard.
 * @param message - The flash message to be shown.
 * @param description - The optional description for the flash message.
 * @returns A Promise that resolves when the value is successfully copied to the clipboard.
 */
export async function copyValue(value: string, message: FlashMessage, description: string = emptyValue): Promise<void> {
  Clipboard.setStringAsync(value).then(() => {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: message,
      description: description,
      icon: props => <Image source={require('../assets/images/copy.png')} {...props} />,
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
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
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
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
} 

/**
 * Displays a flash message indicating that the caregiver's personal information has been updated.
 * @param caregiverEmail - The email of the caregiver.
 */
export function caregiverPersonalInfoUpdatedFlash(caregiverEmail: string) {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    message: FlashMessage.caregiverPersonalInfoUpdated,
    description: caregiverPersonalInfoUpdatedDescription(caregiverEmail),
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
}

/**
 * Displays a flash message indicating that the elderly's personal information has been updated.
 */
export function elderlyPersonalInfoUpdatedFlash() {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    titleStyle: {fontSize: notificationTitleTextSize},
    message: FlashMessage.personalInfoUpdated,
    description: personalInfoUpdatedDescription,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
}

/**
 * Displays a flash message when a session request is sent.
 * @param caregiverEmail - The email of the caregiver.
 */
export function sessionRequestSent(caregiverEmail: string) {
  showMessage({
    floating: true,
    textStyle: {fontSize: notificationDescriptionTextSize},
    titleStyle: {fontSize: notificationTitleTextSize},
    message: FlashMessage.sessionRequest,
    description: sessionRequestSentDescription(caregiverEmail),
    icon: props => <Image source={require("../assets/images/send.png")} {...props} />,
    backgroundColor: notificationColor,
    duration: durationQuickMessage,
    color: "black",
  })
} 

/**
 * Displays a flash message when a session request is received.
 * @param caregiverEmail - The email of the caregiver who sent the session request.
 */
export function sessionRequestReceivedFlash(caregiverEmail: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.sessionRequestReceived,
      description: sessionRequestReceivedDescription(caregiverEmail),
      icon: props => <Image source={require("../assets/images/send.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.sessionRequestReceived, sessionRequestReceivedDescription(caregiverEmail), emptyValue)
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
      message:  byMe ? FlashMessage.sessionAccepted : FlashMessage.caregiverAccept,
      description: sessionAcceptedDescription(from),
      icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionAccepted : FlashMessage.caregiverAccept, sessionAcceptedDescription(from), emptyValue)
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
      message:  byMe ? FlashMessage.sessionRejected : FlashMessage.caregiverReject,
      description: sessionRejectedDescription(from),
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionRejected : FlashMessage.caregiverReject, sessionRejectedDescription(from), emptyValue)
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
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    });
  } else {
    triggerNotifications(FlashMessage.sessionRequestCanceled, sessionRequestCanceledDescription(elderlyEmail), emptyValue);
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
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.cantAcceptConnection, maxNumberOfConnectionsDescription(from), emptyValue)
  }
}


/**
 * Displays a flash message when the maximum number of session rejections is reached.
 * by caregiver.
 * @param from - The source of the rejection.
 */
export function sessionRejectedMaxReachedFlash(from: string) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: FlashMessage.caregiverCantAcceptConnection,
      description: maxNumberOfConnectionsCaregiverDescription(from),
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.caregiverCantAcceptConnection, maxNumberOfConnectionsCaregiverDescription(from), emptyValue)
  }
}

/**
 * Displays a flash message indicating that a session has ended.
 * @param from - The source of the session end event.
 * @param byMe - Indicates whether the session was ended by the user.
 */
export function sessionEndedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: byMe ? FlashMessage.sessionEnded : FlashMessage.sessionEndedByCaregiver,
      description: sessionEndedDescription(from),
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationQuickMessage,
      color: "black",
    })
  } else {
    triggerNotifications(byMe ? FlashMessage.sessionEnded : FlashMessage.sessionEndedByCaregiver, sessionEndedDescription(from), emptyValue)
  }
}

/**
 * Displays a flash message indicating that the credential has been updated by another user.
 * If the app is active, it shows a floating message with an icon and a description.
 * If the app is not active, it triggers a notification with the message and description.
 * @param from - The user who updated the credential.
 * @param info - The information about the updated credential.
 */
export function credentialUpdatedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialUpdated : FlashMessage.credentialUpdatedByCaregiver
  const description = byMe ? credentialUpdatedDescription(platform) : credentialUpdatedByCaregiver(from, platform)
  
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: message,
      description: description,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
    })
  } else {
    triggerNotifications(FlashMessage.credentialUpdatedByCaregiver, credentialUpdatedByCaregiver(from, platform), emptyValue)
  }
}

/**
 * Displays a flash message indicating that a credential has been created by someone other than the current user.
 * If the app is active, the message is shown as a floating message. Otherwise, a notification is triggered.
 * @param from - The name of the person who created the credential.
 * @param info - The information about the credential.
 */
export function credentialCreatedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialCreated : FlashMessage.credentialCreatedByCaregiver
  const description = byMe ? credentialCreatedDescription(platform) : credentialCreatedByCaregiver(from, platform)

  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: message,
      description: description,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
      position: 'top'
    })
  } else {
    triggerNotifications(message,  description, emptyValue)
  }
}

/**
 * Displays a flash message indicating that a credential has been deleted by another user.
 * @param from - The username of the user who deleted the credential.
 * @param info - The information about the deleted credential.
 */
export function credentialDeletedFlash(from: string, platform: string, byMe: boolean) {
  const message = byMe ? FlashMessage.credentialDeleted : FlashMessage.credentialDeletedByCaregiver
  const description = byMe ? credentialDeletedDescription(platform) : credentialDeletedByCaregiver(from, platform)
  if(AppState.currentState === appActive) {
    showMessage({
      floating: true,
      textStyle: {fontSize: notificationDescriptionTextSize},
      titleStyle: {fontSize: notificationTitleTextSize},
      message: message,
      description: description,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: notificationColor,
      duration: durationSlowMessage,
      color: "black",
    })
  } else {
    triggerNotifications(message, description, emptyValue)
  }
}