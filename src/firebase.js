import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCbKM4kMIUHSG9b1HytV6pfPctLSPZEhlM",
  authDomain: "fitx-c9b1d.firebaseapp.com",
  databaseURL: "https://fitx-c9b1d.firebaseio.com",
  projectId: "fitx-c9b1d",
  storageBucket: "fitx-c9b1d.appspot.com",
  messagingSenderId: "109210468067",
  appId: "1:109210468067:web:841ffb013f16b2f92bcfd6"
};

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage()
  const firestore = firebase.firestore()
  const auth = firebase.auth()

  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  const increment = (byValue) => firebase.firestore.FieldValue.increment(byValue)
  const arrayUnion = (newElement) => firebase.firestore.FieldValue.arrayUnion(newElement)
  const _delete = firebase.firestore.FieldValue.delete()
  export {_delete, storage, firestore, auth, timestamp, increment, arrayUnion, firebase as default}