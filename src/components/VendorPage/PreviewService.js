import React from 'react'
import Style from './Style.module.css'
import VendorServiceCheckout from '../vendorServices/VendorServiceCheckout'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PreviewService(props) {
    const { newContent, vendor, checkingOut, setCheckingOut } = props
    const user = useSelector(state => state.generalData.user)
    return (
        <div className={Style.cardPreview}>
            <img src={newContent.imgURL} />
            <h3>{newContent.header}</h3>
            <ul>
                {
                    newContent.list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>
            <p>Service Charge: ₹ <span>{newContent.price}</span></p>
            <button className={Style.button} onClick={() => setCheckingOut(newContent.header)}>Buy</button>
            {
              checkingOut && checkingOut === newContent.header ? 
                <>
                {
                    user && user.uid ?
                    <Redirect to={{pathname: '/login-register', state: {from: props.location.pathname}}} />
                    : null
                }
                <VendorServiceCheckout service={newContent} vendorId={vendor.id} bankAccountId={vendor.bankAccountId} vendorName={vendor.name} setCheckingOut={setCheckingOut} /></> : null
            }
        </div>
    )
}
