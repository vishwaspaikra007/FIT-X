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

const Checkout = ({ location, cartItems, currency, match }) => {

  const { addToast } = useToasts()
  const history = useHistory()
  const { pathname } = location;
  let cartTotalPrice = 0;
  let cartTotalPriceCopy = 0
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
    if (location.state && location.state.charges) {
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
    if (cartItems.length < 1) {
      return alert("There should be atleast one item in your cart")
    }
    setRequesting(true)
    const domain = window.location.hostname === 'localhost' ? "http://localhost:3001/" : "https://fit-x-backend.herokuapp.com/"

    const cartItemsObj = {}
    cartItems.map(item => {
      cartItemsObj[item.id] = {
        id: item.id,
        images: [item.images[0]],
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        bankAccountId: item.bankAccountId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        productName: item.productName,
        productSKU: item.productSKU,
        status: 'order created'
      }
    })
    const chargesCopy = location.state.charges['product charge to customers']
    const response = (await axios.post(domain + 'create-order', {
      amount: (location.state.coupon ? (cartTotalPrice + cartTotalPriceCopy - location.state.coupon.discount).toFixed(2)
        : (cartTotalPrice + cartTotalPriceCopy).toFixed(2)),
      userInfo,
      cartItems: cartItemsObj,
      charges: chargesCopy,
      chargesAmt: location.state.chargesAmt,
      coupon: location.state.coupon,
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
      image: 'android-chrome-512x512.png',
      handler: function (response) {
        // alert(response.razorpay_payment_id)
        // alert(response.razorpay_order_id)
        // alert(response.razorpay_signature)
        dispatch({ type: "DELETE_ALL_FROM_CART" });
        setRequesting(false)
        addToast("payment successful", { appearance: "success", autoDismiss: true })
        history.push('/orders')
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
    <Fragment>
      {
        user && user.uid ? null :
          <Redirect to={{ pathname: '/login-register', state: { from: "/checkout" } }} />
      }
      {requesting ? <PreLoader style={{
        background: "#ffffff56",
        backdropFilter: "blur(2px)",
      }} /> : null}
      {
        location.state && location.state.charges ? null : <Redirect to={'/cart'} />
      }
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
                              const discountedPrice = Math.ceil(getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              ));
                              const finalProductPrice = Math.ceil((
                                cartItem.price * currency.currencyRate
                              ).toFixed(2));
                              const finalDiscountedPrice = Math.ceil((
                                discountedPrice * currency.currencyRate
                              ).toFixed(2));

                              discountedPrice != null && discountedPrice != 0
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
                                    {discountedPrice !== null && discountedPrice !== 0
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
                            <li className="your-order-shipping">Total</li>
                            <li>{"₹" + cartTotalPrice}</li>
                          </ul>
                        </div>
                        {
                          location.state.charges && location.state.charges['product charge to customers'] && Object.keys(location.state.charges['product charge to customers']).map((key, index) => {
                            let _charge = location.state.charges['product charge to customers']
                            let amt = _charge[key].chargePercentage ?
                              _charge[key].chargeValue ?
                                Math.min(cartTotalPrice * _charge[key].chargePercentage / 100, _charge[key].chargeValue) :
                                cartTotalPrice * _charge[key].chargePercentage / 100 :
                              _charge[key].chargeValue
                            console.log(parseInt(amt))
                            cartTotalPriceCopy += parseFloat(amt)
                            return <div className="your-order-bottom" key={index}>
                              <ul>
                                <li className="your-order-shipping">{_charge[key].chargeName}</li>
                                <li>{"₹" + amt}</li>
                              </ul>
                            </div>
                          })
                        }
                        {
                          !location.state.coupon ? null :
                            <div className="your-order-bottom">
                              <ul>
                                <li className="your-order-shipping">Coupon : {location.state.coupon.name}</li>
                                <li>{"- ₹" + location.state.coupon.discount}</li>
                              </ul>
                            </div>
                        }
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Grand Total</li>
                            <li>
                              {location.state.coupon ? "₹" + (cartTotalPrice + cartTotalPriceCopy - location.state.coupon.discount).toFixed(2)
                                : "₹" + (cartTotalPrice + cartTotalPriceCopy).toFixed(2)}
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
                        <Link to={process.env.PUBLIC_URL + "/products/all"}>
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
