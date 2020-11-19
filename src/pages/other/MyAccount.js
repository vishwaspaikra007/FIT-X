import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import firebase, { firestore, timestamp } from '../../firebase'
import { useSelector } from 'react-redux'
import PreLoader from '../../components/PreLoader'

const MyAccount = ({ location }) => {
  const { pathname } = location;

  const user = useSelector(state => state.userData.user)

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })
  const [userInfoOld, setUserInfoOld] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })

  const [pwd, setPwd] = useState("")
  const [opwd, setOpwd] = useState("")
  const [cpwd, setCpwd] = useState("")
  const [stateChanged, setStateChanged] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && user.uid && userInfo.firstName == "") {
      console.log(user)
      firestore.collection('users').doc(user.uid).get()
        .then(doc => {
          if (doc && doc.data()) {
            setUserInfo(doc.data())
            setUserInfoOld(doc.data())
          }
        })
    }

  }, [user])

  const handleChange = (e, type) => {
    e.preventDefault()
    switch (type) {
      case 'userInfo': setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        setStateChanged(true); break;
      case 'cancel': setUserInfo(userInfoOld);
        setStateChanged(false); break;
      case 'pwd': setPwd(e.target.value); break;
      case 'cpwd': setCpwd(e.target.value); break;
      case 'opwd': setOpwd(e.target.value); break;

      case 'save':
        setLoading(true)
        if (user && user.uid)
          firestore.collection("users").doc(user.uid).set({
            ...userInfo, createdAt: timestamp
          })
            .then(doc => {
              setLoading(false)
              setStateChanged(false)
            }); break;
      case 'changePwd':
        if (cpwd == pwd) {
          setLoading(true)
          let credential = firebase.auth.EmailAuthProvider
            .credential(user.email, opwd)

          user.reauthenticateWithCredential(credential).then(function () {
            let firebaseUser = firebase.auth().currentUser;
            firebaseUser.updatePassword(cpwd).then(function () {
              alert("password changed successfuly")
              setOpwd("")
              setPwd("")
              setCpwd("")
              setLoading(false)
            }).catch(function (err) {
              alert(err)
              setLoading(false)
            });
          }).catch(function (err) {
            alert(err)
            setLoading(false)
          });
        } else {
          alert("password did not match")
        }

        break;

    }
  }

  return (
    <Fragment>
      {
        loading ? <PreLoader style={{
          background: "#ffffff56",
          backdropFilter: "blur(2px)",
        }} /> : null
      }
      <MetaTags>
        <title>fitX | My Account</title>
        <meta
          name="description"
          content="Compare page of fitX Running Towards The Future."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        My Account
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Edit your account information{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>My Account Information</h4>
                              <h5>Your Personal Details</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>First Name</label>
                                  <input name="firstName" value={userInfo.firstName} onChange={e => handleChange(e, 'userInfo')} type="text" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Last Name</label>
                                  <input name="lastName" value={userInfo.lastName} onChange={e => handleChange(e, 'userInfo')} type="text" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email Address</label>
                                  <input name="email" value={userInfo.email} onChange={e => handleChange(e, 'userInfo')} type="email" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Phone Number</label>
                                  <input name="phoneNumber" value={userInfo.phoneNumber} onChange={e => handleChange(e, 'userInfo')} type="text" />
                                </div>
                              </div>

                              <div className="entries-wrapper" style={{
                                width: "-webkit-fill-available",
                              }}>
                                <div className="row" style={{
                                  display: 'block'
                                }}>
                                  <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center" style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    display: 'block'
                                  }}>
                                    <div className="entries-info text-center" style={{
                                      width: "100%",
                                    }}>
                                      <label>Address</label>
                                      <textarea name="address" value={userInfo.address} onChange={e => handleChange(e, 'userInfo')}></textarea>
                                    </div>
                                  </div>
                                  {/* <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button onChange={e => handleChange(e, 'edit')} className="edit">Edit</button>
                                    <button onChange={e => handleChange(e, 'delete')}>Delete</button>
                                  </div>
                                </div> */}
                                </div>
                              </div>

                            </div>
                            {
                              !stateChanged ? null :
                                <div className="billing-back-btn">
                                  <div className="billing-btn">
                                    <button onClick={e => handleChange(e, 'cancel')} >Cancel</button>
                                  </div>
                                  <div className="billing-btn">
                                    <button onClick={e => handleChange(e, 'save')} >Save</button>
                                  </div>
                                </div>
                            }

                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>



                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> Change your password
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Old Password</label>
                                  <input value={opwd} onChange={e => handleChange(e, 'opwd')} type="password" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>New Password</label>
                                  <input value={pwd} onChange={e => handleChange(e, 'pwd')} type="password" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input value={cpwd} onChange={e => handleChange(e, 'cpwd')} type="password" />
                                </div>
                              </div>
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button onClick={e => handleChange(e, 'changePwd')} >Continue</button>
                                </div>
                              </div>
                            </div>

                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object
};

export default MyAccount;
