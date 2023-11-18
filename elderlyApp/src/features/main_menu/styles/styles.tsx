import {StyleSheet} from 'react-native'


const stylesFirstHalf = StyleSheet.create({
    elderContainer: {
        backgroundColor: 'white',
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
    },
    caregiversContainer: {
        width: '75%',
        borderBottomLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderBottomRightRadius: 20, // Arredonda o canto inferior direito
        borderTopWidth: 0,
        borderWidth: 3, // Largura do contorno
        borderColor: 'black', // Cor do contorno
        backgroundColor: 'white'
    },
    caregiversButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        margin: '3%',
        backgroundColor: '#DBB8E9',
        borderColor: '#83419F', // Cor da linha na margem (cinza escuro)
    },
    caregiversButtonText: {
        fontSize: 30,
        fontWeight: 'bold'
    }
})

const stylesOptions = StyleSheet.create({
   squareQuestions: {
     backgroundColor: '#F5D274',
     borderColor: '#D09C11',
   },
   squareGenerator: {
     backgroundColor: '#9FCFDD',
     borderColor: '#297D95',
   },
   squareCredentials: {
     backgroundColor: '#7FCA82',
     borderColor: '#449447',
   },
   squareSettings: {
     backgroundColor: '#F197AC',
     borderColor: '#BC5E74',
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