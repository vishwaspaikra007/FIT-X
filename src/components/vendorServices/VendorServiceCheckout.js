import React, { useEffect, useState } from 'react'
import style from "./VendorService.module.css"
import { useSelector, useDispatch } from 'react-redux'
import { firestore } from '../../firebase'
import ReactDOM from "react-dom"
import Img from '../Img'
import CancelIcon from '@material-ui/icons/Cancel';
import { Redirect, useHistory } from 'react-router-dom'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import PreLoader from '../PreLoader'
import { usehistory } from 'react-router-dom'

export default function VendorServiceCheckout({ service, vendorId, vendorName, setCheckingOut }) {

  const termsAndConditions = useSelector(state => state.generalData.termsAndConditions)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!termsAndConditions || !termsAndConditions[vendorId]) {
      firestore.collection('terms-and-conditions').doc(vendorId).get()
        .then(doc => {
          console.log(doc.data().termsAndConditions)
          dispatch({ type: 'TERMS-AND-CONDITIONS', termsAndConditions: doc.data().termsAndConditions, vendorId: vendorId })
        })
    }

  }, [])

  return ReactDOM.createPortal(<Component service={service} vendorId={vendorId} termsAndConditions={termsAndConditions} vendorName={vendorName} setCheckingOut={setCheckingOut} />, document.getElementById('modal'))
}

function Component({ service, vendorId, termsAndConditions, vendorName, setCheckingOut }) {
  const [agree, setAgree] = useState(false)
  const user = useSelector(state => state.userData.user)
  const userInfo = useSelector(state => state.generalData.userInfo)
  const [requesting, setRequesting] = useState(false)
  const { addToast } = useToasts()
  const history = useHistory()
  
  useEffect(() => {
    console.log(agree)
  }, [agree])

  const checkout = async () => {
    setRequesting(true)
    // const domain = window.location.hostname === 'localhost' ? "http://localhost:3001/" : "https://fit-x-backend.herokuapp.com/"
    const domain = "https://fit-x-backend.herokuapp.com/"

    const response = (await axios.post(domain + 'create-order', {
      amount: service.price,
      type: 'service',
      userName : userInfo.displayName,
      userId: user.uid,
      userPhoneNumber: user.phoneNumber,
      userEmail: user.email,
      vendorId: vendorId,
      vendorName: vendorName,
      service: {
        imgURL: service.imgURL, 
        imagePath: service.imagePath,
        price: service.price, 
        points: service.list, 
        title: service.header
      },
      agreedToTermsAndConditions: agree,
    })).data
    console.log(response)

    if (!response.success) {
      alert("payment failed try again")
      setRequesting(false)
      return
    }
    console.log(response)

    const options = {
      key: "rzp_test_5GYgTGJ0LVCc6x",
      currency: response.currency,
      amount: response.amount.toString(),
      order_id: response.id,
      name: 'FitX',
      description: service.name,
      image: '/apple-touch-icon.png',
      handler: function (response) {
        // alert(response.razorpay_payment_id)
        // alert(response.razorpay_order_id)
        // alert(response.razorpay_signature)
        setRequesting(false)
        addToast("payment successful", { appearance: "success", autoDismiss: true })
        history.push('/purchases')
      },
      modal: {
        escape: false,
        ondismiss: function () {
          alert("payment cancelled")
          setRequesting(false)
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phoneNumber
      }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  return (
    <>
      {
        user && user.uid ? null :
          <Redirect to={{ pathname: '/login-register', state: { from: '/vendor/' + vendorId } }} />
      }
      <div className={style.serviceCheckoutWrap}>
        {
          requesting ? <PreLoader style={{
            position: "absolute",
            background: "#ffffff56",
            backdropFilter: "blur(2px)",
            zIndex: 1,
          }} /> : null
        }
        <div className={[style.wrap, style.maxWidth].join(" ")}>
          <CancelIcon className={style.cancel} onClick={() => setCheckingOut(false)} />
          <Img
            src={service.imgURL}
            className={style.img}
          />
          <h3 className={style.h}
          >
            {service.header}
          </h3>
          <p className={style.p}>from {vendorName}</p>
          <div className={style.price}
          >
            <div>
              Service Charge: ₹{" "}
              <span>
                {service.price}
              </span>
            </div>
          </div>
          {
            termsAndConditions && termsAndConditions[vendorId] ?
              <>
                <pre className={style.pre}><h3>Terms and Conditions</h3><p>{JSON.parse(termsAndConditions[vendorId])}</p></pre>
                <input className={style.checkbox} type={"checkbox"} onChange={e => setAgree(!agree)} />
                <p className={style.p}>>Agree To Terms and Conditions</p>
              </>
              : null
          }
          <button disabled={!agree} className={style.button} onClick={() => checkout()}>Checkout</button>
        </div>
      </div>
    </>
  )
}

