import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import MenuCart from "./sub-components/MenuCart";
import { deleteFromCart } from "../../redux/actions/cartActions";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux"

const IconGroup = ({
  currency,
  cartData,
  wishlistData,
  compareData,
  deleteFromCart,
  iconWhiteClass,
}) => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.userData.user)
  const userInfo = useSelector(state => state.generalData.userInfo)
  const [search, setSearch] = useState("")

  const history = useHistory()

  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  const logout = () => {
    auth.signOut().then(_ => {
      dispatch({ type: "USER", user: {} })
      history.push({ path: process.env.PUBLIC_URL + "/", state: {} })
    })
  }

  const searchProduct = e => {
    e.preventDefault()
    if (search){
      history.push({ pathname: `/products/${search.split(" ")}` })
      e.currentTarget.parentElement.classList.toggle("active");
    }
  }

  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form onSubmit={e => searchProduct(e)}>
            <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value.toLowerCase())} />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            {
              user && user.uid ?
                <>
                  <li><Link to={process.env.PUBLIC_URL + "/my-account"}>my account</Link></li>
                  <li><Link to={process.env.PUBLIC_URL + "/orders"}>my orders</Link></li>
                  <li><Link to={process.env.PUBLIC_URL + "/purchases"}>Purchases</Link></li>
                  {
                    userInfo ? userInfo.isVendor ? <li><a href="https://admin-fitx.firebaseapp.com/" target="blank">Vendor Dashboard</a></li>
                      : <li><Link to={"/become-vendor"}>Become Vendor</Link></li> : null
                  }
                  <li onClick={() => logout()}><a>Logout</a></li>
                </>
                : <li><Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link></li>
            }
          </ul>
        </div>
      </div>
      {/* <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareData && compareData.length ? compareData.length : 0}
          </span>
        </Link>
      </div> */}
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistData && wishlistData.length ? wishlistData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart
          cartData={cartData}
          currency={currency}
          deleteFromCart={deleteFromCart}
        />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
