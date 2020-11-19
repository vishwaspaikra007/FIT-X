import { useEffect } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux'
import { auth, firestore } from './firebase'
export default function useFirebase() {

    const dispatch = useDispatch()
    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                // ...
                dispatch({ type: "USER", user })
            } else {
                // User is signed out.
                // ...
                dispatch({ type: "USER", user: {} })
            }
        });

        
    firestore.collection('web_config').doc('product_categories').get()
      .then(docs => {
        dispatch({type: "CATEGORIES",categories: docs.data()})
    })

    }, [])
}