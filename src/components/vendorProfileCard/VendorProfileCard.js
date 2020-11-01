import React from 'react'
import style from './VendorProfileCard.module.css'
import Img from '../Img'
import Rating from '@material-ui/lab/Rating';

export default function VendorProfileCard(props) {
    const vendor = props.vendor
    return (
        <div className={style.vendorCardWrap}>
            <div className={style.vendorCardProfileBackground}
            style={{
                backgroundImage: vendor.profileBackground,
            }}></div>
            <Img src={vendor.imgURL} className={style.img}/>
            <p>{vendor.name}</p>
            <Rating name="half-rating-read" precision={0.2} value={2.7} readOnly className={style.rating}/>

        </div>
    )
}
