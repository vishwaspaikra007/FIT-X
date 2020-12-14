import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import Img from '../Img'

const ProductGridSingle = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);

  return (
    <Fragment>
      <div
        className={` ${
          sliderClassName ? sliderClassName : ""
          }`}
          style={{
            paddingBottom: "20px",
            borderBottom: "1px solid #7a7a7a",
          }}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img" style={{
            height: "0",
            overflow: 'hidden',
            paddingBottom: "100%",
          }}>
            <Link
              product={product}
              style={{
                width: '100%',
                height: "100%",
                position: "absolute"
              }}
              to={{
                pathname: process.env.PUBLIC_URL + "/product/" + product.id,
                state: { product: product }
              }}>
              <Img
                style={{
                  // width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: '0s',
                }}
                className="default-img"
                src={process.env.PUBLIC_URL + product.images[0]}
                alt=""
              />
              {product.images.length > 1 ? (
                <img
                  style={{
                    height: "100%",
                    objectFit: "cover",
                  }}
                  className="hover-img"
                  src={process.env.PUBLIC_URL + product.images[1]}
                  alt=""
                />
              ) : (
                  ""
                )}
            </Link>
            {product.discount || product.new ? (
              <div className="product-img-badges">
                {product.discount ? (
                  <span className="pink">-{product.discount}%</span>
                ) : (
                    ""
                  )}
                {product.new ? <span className="purple">New</span> : ""}
              </div>
            ) : (
                ""
              )}

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={wishlistItem !== undefined ? "active" : ""}
                  disabled={wishlistItem !== undefined}
                  title={
                    wishlistItem !== undefined
                      ? "Added to wishlist"
                      : "Add to wishlist"
                  }
                  onClick={() => addToWishlist(product, addToast)}
                >
                  <i className="pe-7s-like" />
                </button>
              </div>
              <div className="pro-same-action pro-cart">
                {product.affiliateLink ? (
                  <a
                    href={product.affiliateLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {" "}
                    Buy now{" "}
                  </a>
                ) : product.variation && product.variation.length >= 1 ? (
                  <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                    Select Option
                  </Link>
                ) : product.stock && product.stock > 0 ? (
                  <button
                    onClick={() => addToCart(product, addToast)}
                    className={
                      cartItem !== undefined && cartItem.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={cartItem !== undefined && cartItem.quantity > 0}
                    title={
                      cartItem !== undefined ? "Added to cart" : "Add to cart"
                    }
                  >
                    {" "}
                    <i className="pe-7s-cart"></i>{" "}
                    {cartItem !== undefined && cartItem.quantity > 0
                      ? "Added"
                      : "Add to cart"}
                  </button>
                ) : (
                        <button disabled className="active">
                          Out of Stock
                  </button>
                      )}
              </div>
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
            <h3 style={{
              height: "90px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.productName}
              </Link>
            </h3>
            {product.rating && product.rating > 0 ? (
              <div className="product-rating">
                <Rating ratingValue={product.rating} />
              </div>
            ) : (
                ""
              )}
            <div className="product-price">
              {discountedPrice !== null ? (
                <Fragment>
                  <span style={{
                  fontSize: "25px",
                  color: "orange"
                }}>{"₹" + finalDiscountedPrice}</span>{" "}
                  <span className="old">
                    {"₹" + finalProductPrice}
                  </span>
                </Fragment>
              ) : (
                  <span style={{
                    fontSize: "25px",
                    color: "orange"
                  }}>{"₹" + finalProductPrice} </span>
                )}
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

ProductGridSingle.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object
};

export default ProductGridSingle;
