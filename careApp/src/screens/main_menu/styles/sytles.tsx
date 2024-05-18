import {StyleSheet} from 'react-native'
import {
  credencialsButtonBackgroud,
  credencialsButtonBorder,
  settingsButtonBackgroud,
  generatorButtonBackgroud,
  generatorButtonBorder,
  questionsButtonBackgroud,
  questionsButtonBorder,
  settingsButtonBorder,
  whiteBackgroud,
  elderlyButtonBackgroud,
  elderlyButtonBorder
} from '../../../assets/styles/colors';

const stylesFirstHalf = StyleSheet.create({
    caregiverContainer: {
        backgroundColor: whiteBackgroud,
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 1, // Largura da linha na margem
    },
    caregiversButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        margin: '3%',
        backgroundColor: elderlyButtonBackgroud,
        borderColor: elderlyButtonBorder
    },
    caregiversButtonText: {
        fontSize: 33,
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
     backgroundColor: credencialsButtonBackgroud,
     borderColor: credencialsButtonBorder,
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
     fontSize: 23,
     textAlign: 'center'
   },
   squarePhoto: {
     margin: '5%',
     width: '60%',
     height: '60%',
     resizeMode: 'contain'
   }
});

export { stylesOptions, stylesFirstHalf }