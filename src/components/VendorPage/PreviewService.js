import React from 'react'
import Style from './Style.module.css'
import VendorServiceCheckout from '../vendorServices/VendorServiceCheckout'

export default function PreviewService(props) {
    const { newContent, vendor, checkingOut, setCheckingOut } = props
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
                <VendorServiceCheckout service={newContent} vendorId={vendor.id} vendorName={vendor.name} setCheckingOut={setCheckingOut} /> : null
            }
        </div>
    )
}
