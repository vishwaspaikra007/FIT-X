import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useSelector, useDispatch } from 'react-redux'
import { firestore } from '../../firebase'
import { useToasts } from 'react-toast-notifications'
import axios from 'axios'
import PreLoader from '../../components/PreLoader'
import { Redirect, useHistory } from 'react-router-dom'

const Checkout = ({ location, cartItems, currency }) => {

  const { addToast } = useToasts()
  const history = useHistory()
  const { pathname } = location;
  let cartTotalPrice = 0;

  const [requesting, setRequesting] = useState(false)
  const userInfoRedux = useSelector(state => state.generalData.userInfo)
  const user = useSelector(state => state.userData.user)
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  })


  useEffect(() => {
    if (user && user.uid && userInfo.displayName == "" && !userInfoRedux) {
      console.log(user)
      firestore.collection('users').doc(user.uid).get()
        .then(doc => {
          if (doc && doc.data()) {
            setUserInfo({ ...userInfo, ...doc.data(), uid: doc.id })
            dispatch({ type: "USER_INFO", userInfo: { ...doc.data(), uid: doc.id } })
          }
        })
    } else if (userInfoRedux) {
      setUserInfo({ ...userInfo, ...userInfoRedux })
    }

  }, [user])


  const checkout = async (e) => {
    e.preventDefault()
    console.log(cartTotalPrice.toFixed(2))
    if (
      !userInfo.phoneNumber ||
      !userInfo.address ||
      !userInfo.email ||
      !userInfo.displayName ||
      !userInfo.city ||
      !userInfo.pincode ||
      !userInfo.state) {
      alert("All inputs are necessary")
      return
    }
    setRequesting(true)
    // const domain = "https://fit-x-backend.herokuapp.com/"
    const domain = "http://localhost:3001/"
    const response = (await axios.post(domain + 'create-order', {
      amount: cartTotalPrice.toFixed(2),
      userInfo, 
      cartItems: cartItems.map(item => ({...item, deliveryStatus: 'order sent'}))
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
      description: cartItems.length + " products",
      image: 'https://avatars1.githubusercontent.com/u/44310959?s=460&u=ba991aaa71f29a628093f19348452aafa9db1717&v=4',
      handler: function (response) {
        alert(response.razorpay_payment_id)
        alert(response.razorpay_order_id)
        alert(response.razorpay_signature)
        setRequesting(false)
        addToast("payment successful", {appearance: "success", autoDismiss: true  })
        history.push('/orders')
      },
      modal: {
        escape: false,
        ondismiss: function(){
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
    <Fragment>
      {
        user && user.uid ? null :
          <Redirect to={{ pathname: '/login-register', state: { from: "/checkout" } }} />
      }
      {requesting ? <PreLoader style={{
        background: "#ffffff56",
        backdropFilter: "blur(2px)",
      }} /> : null}
      <MetaTags>
        <title>fitX | Checkout</title>
        <meta
          name="description"
          content="Checkout page of fitX Running Towards The Future."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Checkout
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Name</label>
                          <input type="text" name="displayName" value={userInfo.displayName}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Street Address</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                            name="address" value={userInfo.address}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Town / City</label>
                          <input type="text" name="city" value={userInfo.city}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>State </label>
                          <input type="text" name="state" value={userInfo.state}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Pincode</label>
                          <input type="text" name="pincode" value={userInfo.pincode}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input type="text" name="phoneNumber" value={userInfo.phoneNumber}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Email Address</label>
                          <input type="text" name="email" value={userInfo.email}
                            onChange={e => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(2);

                              discountedPrice != null
                                ? (cartTotalPrice +=
                                  finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                  finalProductPrice * cartItem.quantity);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.productName} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {discountedPrice !== null
                                      ? "₹" +
                                      (
                                        finalDiscountedPrice *
                                        cartItem.quantity
                                      ).toFixed(2)
                                      : "₹" +
                                      (
                                        finalProductPrice * cartItem.quantity
                                      ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              {"₹" +
                                cartTotalPrice.toFixed(2)}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25 btn-hover" style={{
                      overflow: "hidden",
                      borderRadius: "50px",
                    }}>
                      <button onClick={e => checkout(e)}>Place Order</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon mb-30">
                        <i className="pe-7s-cash"></i>
                      </div>
                      <div className="item-empty-area__text">
                        No items found in cart to checkout <br />{" "}
                        <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                          Shop Now
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Checkout.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData
  };
};

export default connect(mapStateToProps)(Checkout);
