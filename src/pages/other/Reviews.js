import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { firestore } from '../../firebase'
import MetaTags from "react-meta-tags";
import PreLoader from '../../components/PreLoader'
import LayoutOne from "../../layouts/LayoutOne";
import { Link, Redirect } from "react-router-dom";
import LoadContent from "../../components/LoadContent";
import Rating from '@material-ui/lab/Rating';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function Reviews({ location, match }) {

  const [lastDoc, setLastDoc] = useState()
  const [loadContent, setLoadContent] = useState(true)
  const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)
  const [reviews, setReviews] = useState([])

  const { pathname } = location;
  const limit = 2
  const user = useSelector(state => state.userData.user)

  const getAndSetReviews = () => {
    if (user && user.uid && match.params.productId) {
      let ref = firestore.collection('products').doc(match.params.productId)
        .collection('reviews')
        .orderBy('createdAt', 'desc')
      if (lastDoc)
        ref = ref.startAfter(lastDoc)

      ref.limit(limit).get()
        .then(docs => {
          if (docs.docs.length > 0) {
            let reviewsList = JSON.parse(JSON.stringify(reviews))
            console.log(docs)
            docs.forEach(doc => {
              reviewsList.push({...doc.data(), id: doc.id})
            })
            setLoadContent(false)
            setReviews(reviewsList)
            setLastDoc(docs.docs[docs.docs.length - 1])
            if (docs.docs.length < limit)
              setAllowFurtherFetch(false)
          } else {
            setAllowFurtherFetch(false)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    if (loadContent && allowFurtherFetch) {
      getAndSetReviews()
    }
  }, [loadContent])

  return (
    <>
      {
        user && user.uid ? null :
          <Redirect to={{ pathname: '/login-register', state: { from: pathname } }} />
      }

      <MetaTags>
        <title>fitX | orders</title>
        <meta
          name="description"
          content={"Reviews of product " + match.params.productId}
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Reviews
            </BreadcrumbsItem>


      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="review-wrapper">
          {
            reviews.map((review, key) => (
              <div key={key} className="single-review child-review">
                <div className="review-img">
                  {/* <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/img/testimonial/2.jpg"
                                }
                                alt=""
                              /> */}
                  <AccountCircleIcon className="img" />
                </div>
                <div className="review-content">
                  <div className="review-top-wrap">
                    <div className="review-left">
                      <div className="review-name">
                        <h4>{review.name}</h4>
                      </div>
                      <Rating value={review.rating ? review.rating : 0} readOnly />
                    </div>
                  </div>
                  <div className="review-bottom">
                    <p>
                      {
                        review.review
                      }
                    </p>
                  </div>
                  <span>id: {review.id}</span>
                </div>
              </div>
            ))
          }
        </div>
        {
          allowFurtherFetch ? <LoadContent onChange={bool => setLoadContent(bool)} style={{
            height: "100px",
            width: "200px",
            margin: "auto"
          }} /> : null
        }
      </LayoutOne>
    </>
  )
}
