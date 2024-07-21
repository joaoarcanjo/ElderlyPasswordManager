import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCYjuZeshrZpZFLicjTag0YFjPAn2G6pYM",
  authDomain: "thesis-pm-fa03e.firebaseapp.com",
  projectId: "thesis-pm-fa03e",
  storageBucket: "thesis-pm-fa03e.appspot.com",
  messagingSenderId: "24842104175",
  appId: "1:24842104175:web:92bc7dd3074f7dac724c9a",
  measurementId: "G-52PMDTFCE5"
};
/*
const firebaseConfig = {
  apiKey: "AIzaSyBlBs4gok5Pq9POfdH9SBF4sfA29J6wdP0",
  authDomain: "thesis-2-ed7c6.firebaseapp.com",
  projectId: "thesis-2-ed7c6",
  storageBucket: "thesis-2-ed7c6.appspot.com",
  messagingSenderId: "293518750865",
  appId: "1:293518750865:web:34aa08c5185ef8fdb8fb30",
  measurementId: "G-FSWZZR38HL"
};*/

if(!firebase.apps.length) {
    const fire = firebase.initializeApp(firebaseConfig)
}

const FIREBASE_AUTH = firebase.auth()

const FIREBASE_STORAGE = firebase.storage()

export { firebase, FIREBASE_AUTH, FIREBASE_STORAGE }