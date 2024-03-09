import {StyleSheet} from 'react-native'
import {
  credencialsButtonBackgroud,
  credencialsButtonBorder,
  settingsButtonBackgroud,
  generatorButtonBackgroud,
  generatorButtonBorder,
  questionsButtonBackgroud,
  questionsButtonBorder,
  caregiversButtonBackgroud,
  caregiversButtonBorder, 
  settingsButtonBorder,
  whiteBackgroud,
  blackBorder
} from '../../../assets/styles/colors';

const stylesFirstHalf = StyleSheet.create({
    elderContainer: {
        backgroundColor: whiteBackgroud,
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 1, // Largura da linha na margem
    },
    caregiversButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        margin: '3%',
        backgroundColor: caregiversButtonBackgroud,
        borderColor: caregiversButtonBorder
    },
    caregiversButtonText: {
        fontSize: 30,
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
     fontSize: 21,
     fontWeight: 'bold'
   },
   squarePhoto: {
     margin: '5%',
     width: '60%',
     height: '60%',
     resizeMode: 'contain'
   }
});

export { stylesOptions, stylesFirstHalf }