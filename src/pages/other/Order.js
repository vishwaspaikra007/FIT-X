import React, { useState, useEffect } from 'react'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { firestore, increment, timestamp } from '../../firebase'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from "react-meta-tags";
import PreLoader from '../../components/PreLoader'
import LayoutOne from "../../layouts/LayoutOne";
import { Link, Redirect } from "react-router-dom";
import Class from './Orders.module.css'
import { useHistory } from 'react-router-dom'
import Rating from '@material-ui/lab/Rating';
import { useToasts } from 'react-toast-notifications'

export default function Order({ location, match }) {

    const { pathname } = location
    const { params } = match
    const user = useSelector(state => state.userData.user)
    const history = useHistory()
    const { addToast } = useToasts()
    const [productReview, setProductReview] = useState({})
    const [requesting, setRequesting] = useState({})

    const [orderDetails, setOrderDetails] = useState(location.state ? location.state.order : undefined)

    const handleChange = async (e, product) => {
        console.log(productReview)
        e.preventDefault()
        switch (e.target.name) {
            // case 'productReview': setProductReview({...productReview,[]: e.target.value}); break
            case 'saveReview':
                if (!user) {
                    history.push({ pathname: '/login', state: { from: `/product/${product.id}` } })
                    return
                } else if (!productReview[product.id].rating) {
                    alert("please give rating")
                    return
                } else if (!productReview[product.id].review) {
                    alert("please give review")
                    return
                }
                setRequesting({ ...requesting, [product.id]: true })

                try {
                    const batch = firestore.batch()

                    batch.update(firestore.collection('products').doc(product.id).collection('reviews').doc(orderDetails.id), {
                        userId: user.uid,
                        name: user.displayName,
                        createdAt: timestamp,
                        ...productReview[product.id]
                    })

                    batch.set(firestore.collection('products').doc(product.id),{ 
                        ratings: { 
                            [orderDetails.list[product.id].reviewByUser.rating]: increment(-1),
                            [productReview[product.id].rating]: increment(1),
                        }
                    }, { merge: true })

                    batch.set(firestore.collection('orders').doc(orderDetails.id), {
                        cartItems: { [product.id]: { reviewByUser: productReview[product.id] } }
                    }, { merge: true })

                    await batch.commit()

                    addToast("review updated successfully", { appearance: 'success', autoDismiss: true })
                    setRequesting({ ...requesting, [product.id]: false })

                } catch (err) {
                    console.log("from here" + err)
                    const batch = firestore.batch()

                    const item = await firestore.collection('products').doc(product.id).get()
                    if(!item.exists) {
                        await firestore.collection('orders').doc(orderDetails.id).set({
                            cartItems: { [product.id]: { reviewByUser: productReview[product.id] } }
                        }, { merge: true })
                        setRequesting({ ...requesting, [product.id]: false })
                        addToast('product don\'t exist anymore though \n but your response has been recorded', { appearance: 'error', autoDismiss: true })
                        return
                    }

                    batch.set(firestore.collection('products').doc(product.id),
                        { ratings: { [productReview[product.id].rating]: increment(1) } }, { merge: true })

                    batch.set(firestore.collection('products').doc(product.id).collection('reviews').doc(orderDetails.id), {
                        userId: user.uid,
                        name: user.displayName,
                        createdAt: timestamp,
                        ...productReview[product.id]
                    })

                    batch.set(firestore.collection('orders').doc(orderDetails.id), {
                        cartItems: { [product.id]: { reviewByUser: productReview[product.id] } }
                    }, { merge: true })

                    batch.commit().then((doc) => {
                        addToast("review submitted successfully", { appearance: 'success', autoDismiss: true })
                        setRequesting({ ...requesting, [product.id]: false })
                    }).catch(err => {
                        console.log(err)
                        setRequesting({ ...requesting, [product.id]: false })
                        addToast(err.message, { appearance: 'error', autoDismiss: true })
                    })


                }

            default: break;
        }
    }


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
                        handleOrderDetails({ ...doc.data(), id: doc.id })
                    } else {
                        history.push('/404')
                    }
                })
        } else if (user && orderDetails) {
            handleOrderDetails(orderDetails)
        }
    }, [])

    useEffect(() => {
        let list = {}
        orderDetails && orderDetails.list && Object.keys(orderDetails.list).map(key => {
            if (orderDetails.list[key].reviewByUser)
                list[key] = orderDetails.list[key].reviewByUser
            else
                list[key] = { rating: 0, review: "" }
        })
        console.log(list, orderDetails)
        setProductReview(list)
    }, [orderDetails])

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
                                            orderDetails.list && Object.keys(orderDetails.list).sort().map((id, key2) => {
                                                const item = orderDetails.list[id]
                                                return (
                                                    <div key={key2} className={[Class.itemBox, Class.extraHeight].join(" ")}>
                                                        <img className={Class.img} src={item.images[0]} />
                                                        <div className={Class.description}>
                                                            <div className={Class.status}>{item.status}</div>
                                                            <div className={Class.text}>{item.productName}</div>
                                                            <Link to={'/product/' + item.id + '#review'} className={Class.link}>See Product</Link>
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
                                                                    {item.discount ? Math.ceil(item.price - item.price * (item.discount / 100)) * item.quantity : item.price * item.quantity}
                                                                </div>
                                                                {item.discount ? <div className={Class.originalPrice}>₹ {item.price}</div> : null}
                                                            </div>
                                                        </div>
                                                        {
                                                            user && user.uid ?
                                                                <div style={{
                                                                    gridColumn: '1 / span 2',
                                                                    position: 'relative',
                                                                }}>
                                                                    {
                                                                        requesting[item.id] ? <PreLoader style={{
                                                                            position: "absolute",
                                                                            background: "#ffffff56",
                                                                            backdropFilter: "blur(2px)",
                                                                            zIndex: 1,
                                                                        }} /> : null
                                                                    }
                                                                    <div className="ratting-form-wrapper">
                                                                        <h3>Add a Review</h3>
                                                                        <div className="ratting-form">
                                                                            <form>
                                                                                <div className="star-box" style={{
                                                                                    padding: "0 20px",
                                                                                    display: "grid",
                                                                                    margin: "10px 0",
                                                                                }}>
                                                                                    <div>Your rating:</div>
                                                                                    <Rating
                                                                                        value={productReview[item.id] && productReview[item.id].rating ? productReview[item.id].rating : 0}
                                                                                        name={"productRating for " + item.id}
                                                                                        onChange={(e, value) => setProductReview(
                                                                                            { ...productReview, [item.id]: { ...productReview[item.id], ["rating"]: value } })
                                                                                        } />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="col-md-12">
                                                                                        <div className="rating-form-style mb-10">
                                                                                            <input placeholder="Name" type="text" value={user.displayName} disabled
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-12">
                                                                                        <div className="rating-form-style form-submit">
                                                                                            <textarea
                                                                                                style={{ resize: 'none' }}
                                                                                                name="productReview"
                                                                                                placeholder="Message"
                                                                                                value={productReview[item.id] && productReview[item.id].review ? productReview[item.id].review : ""}
                                                                                                onChange={e => setProductReview(
                                                                                                    { ...productReview, [item.id]: { ...productReview[item.id], ["review"]: e.target.value } })
                                                                                                }
                                                                                            />
                                                                                            <input name="saveReview" type="submit" onClick={e => handleChange(e, item)} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div> : null
                                                        }
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
