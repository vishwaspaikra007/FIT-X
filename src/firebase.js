import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyD2kw2jmZ6BaiYToJHttTeseQPi6BEo71Y",
    authDomain: "fit-x-fc353.firebaseapp.com",
    databaseURL: "https://fit-x-fc353.firebaseio.com",
    projectId: "fit-x-fc353",
    storageBucket: "fit-x-fc353.appspot.com",
    messagingSenderId: "625222878652",
    appId: "1:625222878652:web:317cc6718cfb3d8f0197b9"
  };

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage()
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  const timestamp = firebase.firestore.FieldValue.serverTimestamp
  const increment = firebase.firestore.FieldValue.increment(1)
  const arrayUnion = (newElement) => firebase.firestore.FieldValue.arrayUnion(newElement)

  export {storage, firestore, auth, timestamp, increment, arrayUnion, firebase as default}