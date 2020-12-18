import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import { Redirect } from "react-router-dom";
import { firestore } from "../../firebase"
import { useSelector, useDispatch } from 'react-redux'
import CancelIcon from '@material-ui/icons/Cancel';

import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  cartItemStock,
  deleteAllFromCart
} from "../../redux/actions/cartActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import PreLoader from "../../components/PreLoader";

const Cart = ({
  location,
  cartItems,
  currency,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart
}) => {
  const [quantityCount] = useState(1);
  const { addToast } = useToasts();
  const { pathname } = location;
  // const [cartTotalPrice, setCartTotalPrice] = useState(0)
  let cartTotalPrice = 0
  const user = useSelector(state => state.userData.user)
  const coupons = useSelector(state => state.generalData.coupons)
  const charges = useSelector(state => state.generalData.charges)
  const [couponCode, setCouponCode] = useState("")
  const [coupon, setCoupon] = useState()
  const [requesting, setRequesting] = useState(false)
  const dispatch = useDispatch()
  const [deliveryCharges, setDeliveryCharges] = useState()

  useEffect(() => {

    if(!charges) {
      firestore.collection('web_config').doc('charges').get()
      .then(doc => {
        dispatch({ type: "CHARGES", charges: doc.data() })
        setDeliveryCharges(doc.data().deliveryCharges)
      })
    } else {
      setDeliveryCharges(charges.deliveryCharges)
    }
    
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    setRequesting(true)
    if (!coupons) {

      firestore.collection('web_config').doc('coupons').get()
        .then(docs => {
          if (docs) {
            console.log(docs.data(), docs.data()[couponCode])

            dispatch({ type: "COUPONS", coupons: docs.data() })
            if (docs.data()[couponCode]) {
              setCoupon({
                ...docs.data()[couponCode],
                discount: (Math.min(cartTotalPrice * docs.data()[couponCode].discountPercentage / 100, docs.data()[couponCode].max)).toFixed( ),
              })
              setRequesting(false)
              addToast("Coupon applied", { appearance: "success", autoDismiss: true})
            }
            else {
              addToast("No coupon found", { appearance: 'error', autoDismiss: true })
              setRequesting(false)
              addToast("No coupon found", { appearance: "error", autoDismiss: true})

            }
          }
        })
    } else {
      if (coupons[couponCode]) {
        setCoupon({
          ...coupons[couponCode],
          discount: Math.min(cartTotalPrice * coupons[couponCode].discountPercentage   / 100, coupons[couponCode].max),
        })
        setRequesting(false)
        addToast("Coupon applied", { appearance: "success", autoDismiss: true})

      }
      else {
        addToast("No coupon found", { appearance: 'error', autoDismiss: true })
        setRequesting(false)
        addToast("No coupon found", { appearance: "error", autoDismiss: true})
      }
    }

  }
  return (
    <Fragment>
      {
        user && user.uid ? null :
          <Redirect to={{ pathname: "/login-register", state: { from: "/cart" } }} />
      }
      <MetaTags>
        <title>fitX | Cart</title>
        <meta
          name="description"
          content="Cart page of fitX Running Towards The Future."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Cart
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
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
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    {
                                      cartItem.images && cartItem.images.length > 0 ?
                                        <img
                                          className="img-fluid"
                                          src={
                                            process.env.PUBLIC_URL +
                                            cartItem.images[0]
                                          }
                                          alt=""
                                        /> : null}
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    {cartItem.productName}
                                  </Link>
                                  {cartItem.selectedProductColor &&
                                    cartItem.selectedProductSize ? (
                                      <div className="cart-item-variation">
                                        <span>
                                          Color: {cartItem.selectedProductColor}
                                        </span>
                                        <span>
                                          Size: {cartItem.selectedProductSize}
                                        </span>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null && discountedPrice !== 0 ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {"₹" +
                                          finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {"₹" +
                                          finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                      <span className="amount">
                                        {"₹" +
                                          finalProductPrice}
                                      </span>
                                    )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() =>
                                        decreaseQuantity(cartItem, addToast)
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() =>
                                        addToCart(
                                          cartItem,
                                          addToast,
                                          quantityCount
                                        )
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity &&
                                        cartItem.quantity >=
                                        cartItemStock(
                                          cartItem,
                                          cartItem.selectedProductColor,
                                          cartItem.selectedProductSize
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {discountedPrice !== null && discountedPrice !== 0
                                    ? "₹" +
                                    Math.ceil(
                                      finalDiscountedPrice * cartItem.quantity
                                    ).toFixed(2)
                                    : "₹" +
                                    Math.ceil(
                                      finalProductPrice * cartItem.quantity
                                    ).toFixed(2)}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      deleteFromCart(cartItem, addToast)
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllFromCart(addToast)}>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    {
                      requesting ? <PreLoader style={{
                        position: "absolute",
                        background: "#ffffff56",
                        backdropFilter: "blur(2px)",
                        zIndex: 1,
                      }} /> : null
                    }
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                          <button className="cart-btn-2" onClick={(e) => handleClick(e)}>
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5>
                        Total products{" "}
                        <span>
                          {"₹" + (cartTotalPrice.toFixed(2))}
                        </span>
                      </h5>

                      <h5>
                        Deliver Charges{" "}
                        <span>
                          {"₹" + (deliveryCharges)}
                        </span>
                      </h5>

                      {
                        !coupon? null :
                          <h5>
                            Coupon : {coupon.name}
                            <span>
                              {"- ₹" + coupon.discount}
                              <CancelIcon onClick={e => setCoupon()}/>
                            </span>
                          </h5>
                      }

                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>
                          {coupon ? "₹" + (cartTotalPrice + deliveryCharges - coupon.discount).toFixed(2)
                           : "₹" + (cartTotalPrice + deliveryCharges).toFixed(2)}
                        </span>
                      </h4>
                      <Link disabled={!deliveryCharges} to={{pathname:process.env.PUBLIC_URL + "/checkout", state: {
                        coupon: coupon,
                        deliveryCharges: deliveryCharges,
                      }}}>
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon mb-30">
                        <i className="pe-7s-cart" style={{
                          color: "orange"
                        }}></i>
                      </div>
                      <div className="item-empty-area__text">
                        No items found in cart <br />{" "}
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

Cart.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  location: PropTypes.object,
  deleteAllFromCart: PropTypes.func,
  deleteFromCart: PropTypes.func
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    decreaseQuantity: (item, addToast) => {
      dispatch(decreaseQuantity(item, addToast));
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    deleteAllFromCart: addToast => {
      dispatch(deleteAllFromCart(addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
