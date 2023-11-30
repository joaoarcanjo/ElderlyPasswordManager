import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import {View, StyleSheet, Modal} from 'react-native'

export default function ModalBox({children, visibleFlag, setModalVisibility}: Readonly<{children: ReactNode, visibleFlag: boolean, setModalVisibility: Function}>) {
    return (
        <Modal
      transparent
      animationType="slide"
      visible={visibleFlag}
      onRequestClose={() => setModalVisibility}
      >
        <BlurView
          style={{ flex: 1 }}
          intensity={60} // You can adjust the intensity of the blur
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {children}
            </View>
          </View>
        </BlurView>
      </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  