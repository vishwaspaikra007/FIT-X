import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { firestore, arrayUnion } from '../../firebase'
import { useToasts } from 'react-toast-notifications'
import Rating from '@material-ui/lab/Rating';
import { useSelector } from 'react-redux'
import PreLoader from "../../components/PreLoader";

const ProductDescriptionTab = ({ spaceBottomClass, product }) => {
  const [productReview, setProductReview] = useState({
    rating: "",
    review: '',
  })
  const { addToast } = useToasts()

  const [reviews, setReviews] = useState(product.reviews ? product.reviews : [])
  const user = useSelector(state => state.userData.user)
  const [requesting, setRequesting] = useState(false)

  const handleChange = e => {
    e.preventDefault()
    switch (e.target.name) {
      // case 'productReview': setProductReview({...productReview,[]: e.target.value}); break

      case 'saveReview':
        setRequesting(true)
        firestore.collection('products').doc(product.id).update({
          reviews: arrayUnion({
            userId: user.uid,
            name: user.displayName,
            ...productReview
          })
        })
          .then(() => {
            addToast("review submitted successfully", { appearance: 'success' })
            setReviews([...reviews, productReview])
            setRequesting(false)
          }).catch(err => {
            console.log(err)
            setRequesting(false)
            addToast(err.message, { appearance: 'error' })
          })

      default: break;
    }
  }
  return (
    <div className={`description-review-area ${spaceBottomClass}`}>
      <div className="container" id="review">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Additional Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">{reviews.length > 0 ? `Reviews(${reviews.length})` : "No Reviews"}</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  {product.specification}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                {product.brief}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      {
                        product.reviews && product.reviews.map((review, key) => (
                          <div key={key} className="single-review child-review">
                            <div className="review-img">
                              {/* <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/img/testimonial/2.jpg"
                                }
                                alt=""
                              /> */}
                            </div>
                            <div className="review-content">
                              <div className="review-top-wrap">
                                <div className="review-left">
                                  <div className="review-name">
                                    <h4>{review.name}</h4>
                                  </div>
                                  <Rating value={review.rating} readOnly />
                                </div>
                              </div>
                              <div className="review-bottom">
                                <p>
                                  {
                                    review.review
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  {
                    user && user.uid ?
                      <div className="col-lg-5">
                        {
                          requesting ? <PreLoader style={{
                            position: "absolute",
                            background: "#ffffff56",
                            backdropFilter: "blur(2px)",
                            zIndex: 1,
                          }} /> : null
                        }
                        <div className="ratting-form-wrapper pl-50">
                          <h3>Add a Review</h3>
                          <div className="ratting-form">
                            <form action="#">
                              <div className="star-box">
                                <span>Your rating:</span>
                                <Rating
                                  name="productRating"
                                  onChange={(e, value) => setProductReview({ ...productReview, ["rating"]: value })} />
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="rating-form-style mb-10">
                                    <input placeholder="Name" type="text" value={user.displayName} disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="rating-form-style form-submit">
                                    <textarea
                                      name="productReview"
                                      placeholder="Message"
                                      value={productReview.review}
                                      onChange={e => setProductReview({ ...productReview, ["review"]: e.target.value })}
                                    />
                                    <input name="saveReview" type="submit" onClick={handleChange} />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div> : null
                  }
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

// ProductDescriptionTab.propTypes = {
//   brief: PropTypes.string,
//   spaceBottomClass: PropTypes.string
// };

export default ProductDescriptionTab;
