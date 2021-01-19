import React, { useState, useEffect } from 'react'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { firestore } from '../../firebase'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from "react-meta-tags";
import PreLoader from '../../components/PreLoader'
import LayoutOne from "../../layouts/LayoutOne";
import { Link, Redirect } from "react-router-dom";
import Class from './Orders.module.css'
import { useHistory } from 'react-router-dom'

export default function Order({ location, match }) {

    const { pathname } = location
    const { params } = match
    const user = useSelector(state => state.userData.user)
    const history = useHistory()

    const [orderDetails, setOrderDetails] = useState(location.state ? location.state.order : undefined)

    const handleOrderDetails = (orderDetails) => {
        let total = 0
        Object.keys(orderDetails.cartItems).map(key => {
            let item = orderDetails.cartItems[key]
            total += (item.discount ? Math.ceil(item.price - item.price * (item.discount / 100)) : item.price) * item.quantity
        })
        setOrderDetails({
            list: orderDetails.cartItems,
            paymentMethod: orderDetails.paymentCaptureDetails ? orderDetails.paymentCaptureDetails.payload.payment.entity.method : undefined,
            coupon: orderDetails.coupon,
            chargesAmt: orderDetails.chargesAmt,
            deliveryCharges: orderDetails.deliveryCharges,
            total: total,
            grandTotal: orderDetails.amount / 100,
            id: orderDetails.id,
            address: orderDetails.userInfo.address,
            city: orderDetails.userInfo.city,
            state: orderDetails.userInfo.state,
            pincode: orderDetails.userInfo.pincode,
        })
    }
    useEffect(() => {
        if (user && params && params.orderId && !orderDetails) {
            firestore.collection('orders').doc(params.orderId).get()
                .then(doc => {
                    console.log(doc.data())
                    if (doc.data()) {
                        handleOrderDetails({...doc.data(), id: doc.id})
                    } else {
                        history.push('/404')
                    }
                })
        } else if(user && orderDetails) {
            handleOrderDetails(orderDetails)
        }
    }, [])
    return (
        <>
            {
                user && user.uid ? null :
                    <Redirect to={{ pathname: '/login-register', state: { from: pathname } }} />
            }

            <MetaTags>
                <title>fitX | Orders Details</title>
                <meta
                    name="description"
                    content={"Order detail of product " + match.params.productId}
                />
            </MetaTags>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Order Details</BreadcrumbsItem>
            <LayoutOne headerTop="visible">
                <Breadcrumb />
                <div className="container">
                {!orderDetails ? null :
                    <>
                        <div className={Class.orderWrap}>
                            <div>
                                <div className={Class.itemsWrap}>
                                    {
                                        orderDetails.list && Object.keys(orderDetails.list).map((id, key2) => {
                                            const item = orderDetails.list[id]
                                            return (
                                                <div key={key2} className={[Class.itemBox, Class.extraHeight].join(" ")}>
                                                    <img className={Class.img} src={item.images[0]} />
                                                    <div className={Class.description}>
                                                        <div className={Class.status}>{item.status}</div>
                                                        <div className={Class.text}>{item.productName}</div>
                                                        <Link to={'/product/' + item.id + '#review'} className={Class.link}>Write a review</Link>
                                                    </div>
                                                    <div className={Class.extraDetails}>
                                                        <div>
                                                            <div>Qty : {item.quantity}</div>
                                                            Sold by : 
                                                            <div className={Class.vendorName}>{item.vendorName}</div>
                                                        </div>
                                                        <div>
                                                            <div className={Class.finalPrice}>
                                                                {item.quantity + "*"}
                                                                {item.discount ? Math.ceil(item.price - item.price * (item.discount / 100)) : item.price}
                                                                {"= ₹"} 
                                                                {item.discount ? Math.ceil(item.price - item.price * (item.discount / 100))*item.quantity : item.price*item.quantity}
                                                            </div>
                                                            {item.discount ? <div className={Class.originalPrice}>₹ {item.price}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <h4 className={Class.h_center}>Payment Information</h4>
                        <div className={[Class.itemsWrap, Class.noGrid].join(" ")}>
                            <b>Payment Method</b>
                            <div>{orderDetails.paymentMethod}</div>
                            <hr></hr>
                            <b>Payment Address</b>
                            <div>{orderDetails.address}</div>
                            <div>{orderDetails.city}</div>
                            <div>{orderDetails.state}</div>
                            <div>{orderDetails.pincode}</div>
                        </div>

                        <h4 className={Class.h_center}>Billing Address</h4>
                        <div className={[Class.itemsWrap, Class.noGrid].join(" ")}>
                            <b>Billing Address</b>
                            <div>{orderDetails.address}</div>
                            <div>{orderDetails.city}</div>
                            <div>{orderDetails.state}</div>
                            <div>{orderDetails.pincode}</div>
                        </div>

                        <h4 className={Class.h_center}>Payment Details</h4>
                        <div className={[Class.itemsWrap, Class.noGrid].join(" ")}>
                            <div className={Class.grid}><div>Order Total</div><div>₹ {orderDetails.total}</div></div>
                            {
                                orderDetails.chargesAmt && Object.keys(orderDetails.chargesAmt).map((key, index) => (
                                    <div key={index} className={Class.grid}>
                                        <div>{key}</div>
                                        <div>₹ {orderDetails.chargesAmt[key]}</div>
                                    </div>
                                ))
                            }
                            {orderDetails.deliveryCharges ? <div className={Class.grid}><div>Delivery Charges</div><div>₹ {orderDetails.deliveryCharges}</div></div> : null}
                            {!orderDetails.coupon ? null : <div className={Class.grid}><div>Discount : {orderDetails.coupon.name}</div><div>- ₹ {orderDetails.coupon.discount}</div></div>}
                            <div className={Class.grid}><b>Grand Total</b><b>₹ {orderDetails.grandTotal}</b></div>
                        </div>

                    </>
                }
                <div className="row mb-40">
                    <div className="col-lg-12">
                        <div className="item-empty-area text-center">

                            <div className="item-empty-area__text">
                                <Link to={process.env.PUBLIC_URL + "/products/all"}>
                                    Shop More
                      </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </LayoutOne>
        </>
    )
}
