import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import firebase, { auth } from "../../firebase"
import { useHistory } from 'react-router-dom'
import PreLoader from "../../components/PreLoader";
import { useSelector } from 'react-redux'
import { useToasts } from "react-toast-notifications";

const LoginRegister = ({ location }) => {
  const { addToast } = useToasts()
  const user = useSelector(state => state.userData.user)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false)
  const [pwd, setPwd] = useState("")
  const [requesting, setRequesting] = useState(false)

  const { pathname } = location;
  const history = useHistory()

  const handleChange = (e) => {
    e.preventDefault()

    switch (e.target.name) {
      case "phone-number":
        setPhoneNumber(e.target.value)
        break

      case "user-password":
        setPwd(e.target.value)
        break

      default: break
    }
  }

  const setUpReCaptcha = () => {

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        verifyPhoneNumber();
      }
    })

  }

  const verifyPhoneNumber = (e) => {
    e.preventDefault()
    setRequesting(true)
    setUpReCaptcha()

    if (phoneNumber.length != 10) {
      alert("wrong phone number please enter 10 digit phone number")
      return
    }
    var appVerifier = window.recaptchaVerifier;
    auth.signInWithPhoneNumber("+91" + phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let otp = window.prompt("Enter OTP")
        confirmationResult.confirm(otp).then(result => {
          addToast('Phone Verified Successfully', { appearance: 'success' })
          console.log("result", result)
          console.log("result.user", result.user)
          setIsPhoneNumberVerified(true)
          setRequesting(false)
        })

      }).catch(function (error) {
        // Error; SMS not sent
        // ...
        addToast('SMS not sent', { appearance: 'error' })
        setRequesting(false)
      });
  }

  const register = (e) => {
    e.preventDefault()
    setRequesting(true)

    let credential = firebase.auth.EmailAuthProvider.credential("fakeEmail" + phoneNumber + "@gmail.com", pwd);

    auth.currentUser.linkWithCredential(credential)
      .then(function (usercred) {
        let user = usercred.user;
        addToast('Registeration Successfull', { appearance: 'success' })
        console.log("Account linking success", user);
        setRequesting(false)
        if (location && location.state && location.state.from == "become-seller")
          history.push('/become-vendor')
        else
          history.push("/")
      }).catch(function (error) {
        addToast('registration error occured', { appearance: 'error' })
        console.log("Account linking error", error);
        setRequesting(false)
      });
  }

  const login = (e) => {
    e.preventDefault()
    setRequesting(true)

    let email = "fakeemail" + phoneNumber + "@gmail.com"
    firebase.auth().signInWithEmailAndPassword(email, pwd)
      .then(result => {
        console.log(result)
        setRequesting(false)
        addToast('login Successfull', { appearance: 'success' })
        if (location && location.state && location.state.from == "become-seller")
          history.push('/become-vendor')
        else
          history.push("/")
      }).catch(function (error) {
        // Handle Errors here.
        addToast('login error occured', { appearance: 'error' })
        // ...
        setRequesting(false)
      });
  }

  return (
    <Fragment>
      <div id="sign-in-button" style={{
        position: "fixed",
        bottom: 0, right: 0, zIndex: 1
      }}>

      </div>
      <MetaTags>
        <title>fitX | Login</title>
        <meta
          name="description"
          content="Compare page of fitX Running Towards The Future."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Login Register
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content style={{ position: "relative" }}>
                      {
                        requesting ? <PreLoader style={{
                          position: "absolute",
                          background: "#ffffff56",
                          backdropFilter: "blur(2px)",
                          zIndex: 1,
                        }} /> : null
                      }
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="string"
                                name="phone-number"
                                placeholder="phone number"
                                value={phoneNumber}
                                onChange={handleChange}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={pwd}
                                onChange={handleChange}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button onClick={e => login(e)}
                                  disabled
                                  disabled={requesting}>
                                  <span>Login</span>
                                </button>
                                <button
                                  disabled={requesting}
                                  style={{
                                    display: "block",
                                    margin: "20px auto",
                                  }} onClick={e => verifyPhoneNumber(e)}>
                                  <span>or Send an OTP</span>
                                </button>
                              </div>

                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="string"
                                name="phone-number"
                                placeholder="phone number"
                                value={phoneNumber}
                                onChange={handleChange}
                                style={{
                                  opacity: isPhoneNumberVerified ? "0.6" : "1"
                                }}
                                disabled={isPhoneNumberVerified}
                              />
                              {
                                isPhoneNumberVerified ?
                                  <input
                                    type="password"
                                    name="user-password"
                                    placeholder="Password"
                                    value={pwd}
                                    onChange={handleChange}
                                  /> : null
                              }

                              <div className="button-box">
                                <button
                                  disabled={requesting}
                                  onClick={
                                    isPhoneNumberVerified ? e => register(e) : e => verifyPhoneNumber(e)
                                  }>
                                  <span>{isPhoneNumberVerified ? "Register" : "Send OTP"}</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
