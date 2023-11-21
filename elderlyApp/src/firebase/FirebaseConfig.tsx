import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCYjuZeshrZpZFLicjTag0YFjPAn2G6pYM",
  authDomain: "thesis-pm-fa03e.firebaseapp.com",
  projectId: "thesis-pm-fa03e",
  storageBucket: "thesis-pm-fa03e.appspot.com",
  messagingSenderId: "24842104175",
  appId: "1:24842104175:web:92bc7dd3074f7dac724c9a",
  measurementId: "G-52PMDTFCE5"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase }