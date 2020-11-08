import { useEffect } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux'
import { auth } from './firebase'

export default function useFirebase() {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    useEffect(() => {
        console.log("users", user)
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                // ...
                console.log("users", user)

                dispatch({ type: "USER", user })
            } else {
                // User is signed out.
                // ...
                dispatch({ type: "USER", user: {} })
            }
        });
    }, [])
}