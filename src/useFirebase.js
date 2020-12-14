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
                firestore.collection('users').doc(user.uid).get()
                    .then(docs => {
                        const refs = []
                        const keys = []
                        dispatch({ type: "USER_INFO", userInfo: docs.data() })
                        if(docs.data().cartItems === null ||
                        docs.data().cartItems === undefined ||
                        Object.keys(docs.data().cartItems).length < 1)
                            return
                        Object.keys(docs.data().cartItems).map(async (key) => {
                            refs.push(firestore.collection('products').doc(key).get())
                            keys.push(docs.data().cartItems[key])
                        })
                        Promise.all(refs).then(docs => {
                            docs.map((doc,i) => {
                                console.log(doc.data())
                                dispatch({
                                    type: "ADD_TO_CART",
                                    payload: {...doc.data(), id: doc.id, quantity: keys[i]}
                                  });
                            })
                        })
                    })
            } else {
                // User is signed out.
                // ...
                dispatch({ type: "USER", user: {} })
            }
        });


        firestore.collection('web_config').doc('product_categories').get()
            .then(docs => {
                dispatch({ type: "CATEGORIES", categories: docs.data() })
            })

    }, [])
}