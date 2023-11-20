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
        borderWidth: 3, // Largura da linha na margem
        margin: '3%',
        backgroundColor: '#DBB8E9',
        borderColor: '#83419F', // Cor da linha na margem (cinza escuro)
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
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
     borderRadius: 20, 
     borderWidth: 5, 
     elevation: 10, // Android
     shadowColor: 'rgba(0,0,0, .5)', // IOS
     shadowOffset: { height: 2, width: 2 }, // IOS
     shadowOpacity: 2, // IOS
     shadowRadius: 2, //IOS
   },
   squareGenerator: {
     backgroundColor: '#9FCFDD',
     borderColor: '#297D95',
     borderRadius: 20, 
     borderWidth: 5, 
     elevation: 10, // Android
     shadowColor: 'rgba(0,0,0, .5)', // IOS
     shadowOffset: { height: 2, width: 2 }, // IOS
     shadowOpacity: 2, // IOS
     shadowRadius: 2, //IOS
   },
   squareCredentials: {
     backgroundColor: '#7FCA82',
     borderColor: '#449447',
     borderRadius: 20, 
     borderWidth: 5, 
     elevation: 10, // Android
     shadowColor: 'rgba(0,0,0, .5)', // IOS
     shadowOffset: { height: 2, width: 2 }, // IOS
     shadowOpacity: 2, // IOS
     shadowRadius: 2, //IOS
   },
   squareSettings: {
     backgroundColor: '#F197AC',
     borderColor: '#BC5E74',
     borderRadius: 20, 
     borderWidth: 5, 
     elevation: 10, // Android
     shadowColor: 'rgba(0,0,0, .5)', // IOS
     shadowOffset: { height: 2, width: 2 }, // IOS
     shadowOpacity: 2, // IOS
     shadowRadius: 2, //IOS
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