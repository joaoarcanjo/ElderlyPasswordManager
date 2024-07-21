import {StyleSheet} from 'react-native'
import {
  credentialsButtonBackgroud,
  credentialsButtonBorder,
  settingsButtonBackgroud,
  generatorButtonBackgroud,
  generatorButtonBorder,
  questionsButtonBackgroud,
  questionsButtonBorder,
  settingsButtonBorder,
  color8,
  caregiverButtonBackgroud,
  caregiverButtonBorder,
  borderColorDark,
  mainPageOptionsTextColor
} from '../../../assets/styles/colors';
import { mainMenuButtonCaregiverTextSize, mainMenuButtonSquareTextSize } from '../../../assets/styles/text';

const stylesFirstHalf = StyleSheet.create({
    elderContainer: {
        backgroundColor: color8,
        borderColor: borderColorDark,
        borderWidth: 1, // Largura da linha na margem
        borderRightWidth: 0,
        borderLeftWidth: 0
    },
    caregiversButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        margin: '3%',
        backgroundColor: caregiverButtonBackgroud,
        borderColor: caregiverButtonBorder
    },
    caregiversButtonText: {
        fontSize: mainMenuButtonCaregiverTextSize,
        color: mainPageOptionsTextColor,
        fontWeight: 'bold'
    }
})

const stylesOptions = StyleSheet.create({
   squareQuestions: {
     backgroundColor: questionsButtonBackgroud,
     borderColor: questionsButtonBorder,
     borderRadius: 20, 
     borderWidth: 5
   },
   squareGenerator: {
     backgroundColor: generatorButtonBackgroud,
     borderColor: generatorButtonBorder,
     borderRadius: 20, 
     borderWidth: 5
   },
   squareCredentials: {
     backgroundColor: credentialsButtonBackgroud,
     borderColor: credentialsButtonBorder,
     borderRadius: 20, 
     borderWidth: 5
   },
   squareSettings: {
     backgroundColor: settingsButtonBackgroud,
     borderColor: settingsButtonBorder,
     borderRadius: 20, 
     borderWidth: 5
   },
   squareText: {
      marginHorizontal: '5%',
      fontSize: mainMenuButtonSquareTextSize,
      textAlign: 'center',
      fontWeight: 'bold',
      color: mainPageOptionsTextColor
   },
   squarePhoto: {
     margin: '5%',
     width: '60%',
     height: '60%',
     resizeMode: 'contain'
   },
   helpPhoto: {
    width: '20%',
    height: '80%',
    resizeMode: 'contain'
  }
});

export { stylesOptions, stylesFirstHalf }