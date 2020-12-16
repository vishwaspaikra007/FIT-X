import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link, Redirect } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import firebase, { auth, firestore, timestamp } from "../../firebase"
import { useHistory } from 'react-router-dom'
import PreLoader from "../../components/PreLoader";
import { useSelector } from 'react-redux'
import { useToasts } from "react-toast-notifications";
import Axios from "axios";

const LoginRegister = ({ location }) => {
  const { addToast } = useToasts()
  const user = useSelector(state => state.userData.user)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false)
  const [pwd, setPwd] = useState("")
  const [requesting, setRequesting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // forgot password related states
  const [initiateForgotPasswordProcess, setInitiateForgotPasswordProcess] = useState(false)
  const [isPhoneNumberVerifiedForPWDChange, setIsPhoneNumberVerifiedForPWDChange] = useState(false)
  const [newPWD, setNewPWD] = useState("")
  const [confirmNewPWD, setConfirmNewPWD] = useState("")
  const [credentialToChangePassword, setCredentialToChangePassword] = useState(undefined)
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

      case "email":
        setEmail(e.target.value)
        break

      case "name":
        setName(e.target.value)
        break

      case "confirm-new-password":
        setConfirmNewPWD(e.target.value)
        break

      case "new-password":
        setNewPWD(e.target.value)
        break

      default: break
    }
  }

  const setUpReCaptcha = (type) => {

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        if (type === "authentication")
          verifyPhoneNumber();
        else if (type === "changePassword")
          verifyPhoneNumberToChangePassword()
      }
    })

  }

  const verifyPhoneNumber = async (e, type) => {

    if (phoneNumber.length != 10) {
      alert("wrong phone number please enter 10 digit phone number")
      return
    }
    if (!name && type === "register") {
      alert("please enter your name")
      return
    }
    if (pwd.length < 6 && type === "register") {
      alert("password must be atleast 6 character long")
      return
    }

    e.preventDefault()
    setRequesting(true)
    setUpReCaptcha("authentication")

    var appVerifier = window.recaptchaVerifier;

    // const url = 'http://localhost:3001/auth'
    const url = 'https://fit-x-backend.herokuapp.com/auth'

    const user = (await Axios.post(url, { phoneNumber: "+91" + phoneNumber })).data
    if (!user && type != "register") {
      setRequesting(false)
      addToast("No user with the given phone number", { appearance: 'warning', autoDismiss: true  })
      return
    } else if (user && type === "register") {
      setRequesting(false)
      addToast("User with the given phone number already exist", { appearance: 'error', autoDismiss: true  })
      return
    }

    auth.signInWithPhoneNumber("+91" + phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let otp = window.prompt("Enter OTP")
        confirmationResult.confirm(otp).then(result => {
          console.log(result)
          addToast('Phone Verified Successfully', { appearance: 'success', autoDismiss: true  })
          setIsPhoneNumberVerified(true)
          if (type === "register")
            register()
          else {
            setRequesting(false)
            if (location && location.state && location.state.from)
              history.push(location.state.from)
            else
              history.push("/")
          }
        })

      }).catch(function (error) {
        // Error; SMS not sent
        // ...
        addToast(error.message, { appearance: 'error', autoDismiss: true  })
        setRequesting(false)
      });
  }

  const register = (e) => {

    // password length is > 6 is verfied via register button

    let credential = firebase.auth.EmailAuthProvider.credential("fakeEmail" + phoneNumber + "@gmail.com", pwd);

    auth.currentUser.linkWithCredential(credential)
      .then(function (usercred) {
        let user = usercred.user;
        auth.currentUser.updateProfile({ displayName: name }).then(() => {
          firestore.collection("users").doc(user.uid).set({
            displayName: name,
            phoneNumber: phoneNumber,
            email: email,
            createdAt: timestamp
          }).then(() => {
            addToast('Registeration Successfull', { appearance: 'success', autoDismiss: true  })
            console.log("Account linking success", user);
            setRequesting(false)
            // if (location && location.state && location.state.from)
            //   history.push(location.state.from)
            // else
            history.push("/")
          }).catch(err => {
            addToast('registration error occured', { appearance: 'error', autoDismiss: true  })
            console.log("some error occured")
          })
        }).catch(err => {
          addToast('registration error occured', { appearance: 'error', autoDismiss: true  })
          console.log("some error occured")
        })
      }).catch(function (error) {
        addToast('registration error occured', { appearance: 'error', autoDismiss: true  })
        console.log("Account linking error", error);
        setRequesting(false)
      });
  }

  const login = async (e) => {
    e.preventDefault()
    if (!phoneNumber || !pwd) {
      alert("Please enter phone number and password")
      return
    }
    setRequesting(true)
    let email
    if (phoneNumber.includes('@')) {
      const docs = await firestore.collection('users').where('email', "==", phoneNumber).get()
      console.log(docs)
      if (docs.docs.length > 0) {
        email = "fakeemail" + docs.docs[0].data().phoneNumber + "@gmail.com"
      }
    } else {
      email = "fakeemail" + phoneNumber + "@gmail.com"
    }
    console.log(email)
    firebase.auth().signInWithEmailAndPassword(email, pwd)
      .then(result => {
        console.log(result)
        setRequesting(false)
        addToast('login Successfull', { appearance: 'success', autoDismiss: true  })
        if (location && location.state && location.state.from)
          history.push(location.state.from)
        else
          history.push("/")
      }).catch(function (err) {
        // Handle Errors here.
        console.log(err)
        addToast(err.message, { appearance: 'error', autoDismiss: true  })
        // ...
        setRequesting(false)
      });
  }

  const forgotPassword = (e) => {
    e.preventDefault()
    if (newPWD != confirmNewPWD) {
      alert("password did not match")
      return
    }
    if (newPWD < 6) {
      alert("password must have atleast 6 characters")
      return
    }

    setRequesting(true)
    auth.signInWithCredential(credentialToChangePassword).then(function () {
      let firebaseUser = auth.currentUser;
      firebaseUser.updatePassword(newPWD).then(function () {
        alert("password changed successfuly")
        setNewPWD("")
        setConfirmNewPWD("")
        setRequesting(false)
        setCredentialToChangePassword(undefined)
        setInitiateForgotPasswordProcess(false)
        addToast('Password Successfully Changed', { appearance: 'success  ', autoDismiss: true  })
        history.push("/")
      }).catch(function (err) {
        setRequesting(false)
        addToast(err.message, { appearance: 'error', autoDismiss: true  })
      });
    }).catch(function (err) {
      setRequesting(false)
      addToast(err.message, { appearance: 'error', autoDismiss: true  })
    });
  }

  const verifyPhoneNumberToChangePassword = (e) => {
    e.preventDefault()
    setRequesting(true)
    var applicationVerifier = new firebase.auth.RecaptchaVerifier(
      'sign-in-button');

    setUpReCaptcha("changePassword")

    var appVerifier = window.recaptchaVerifier;
    var provider = new firebase.auth.PhoneAuthProvider();
    provider.verifyPhoneNumber("+91" + phoneNumber, appVerifier)
      .then(function (verificationId) {
        var verificationCode = window.prompt('Please enter the verification ' +
          'code that was sent to your mobile device.');
        return firebase.auth.PhoneAuthProvider.credential(verificationId,
          verificationCode);
      })
      .catch(err => {
        setRequesting(false)
        addToast(err.message, { appearance: 'error', autoDismiss: true  })
      })
      .then(function (phoneCredential) {
        // return firebase.auth().signInWithCredential(phoneCredential);
        setCredentialToChangePassword(phoneCredential)
        setIsPhoneNumberVerifiedForPWDChange(true)
        setRequesting(false)
      });
  }

  return (
    <Fragment>
      {user && user.uid && location.state && location.state.from ? <Redirect to={location.state.from} /> : null}
      <div id="sign-in-button" style={{
        position: "fixed",
        bottom: 0, right: 0, zIndex: 999, background: "white"
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
                            {
                              !initiateForgotPasswordProcess ?
                                <form>
                                  <input
                                    type="string"
                                    name="phone-number"
                                    placeholder="phone number / email"
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
                                    <p style={{
                                      fontSize: "10px",
                                      marginTop: "10px",
                                    }}>
                                      We will send you a text to verify your phone.
                                      Message and Data rates may apply.
                                    </p>
                                  </div>
                                  <p onClick={() => setInitiateForgotPasswordProcess(true)}
                                    style={{
                                      textAlign: "right",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      marginTop: "20px",
                                      color: "#8f8f8f",
                                    }}
                                  >
                                    Forgot Password ?
                                  </p>
                                </form>
                                :
                                <form>
                                  <input
                                    type="string"
                                    name="phone-number"
                                    placeholder="phone number"
                                    value={phoneNumber}
                                    onChange={handleChange}
                                    disabled={isPhoneNumberVerifiedForPWDChange}
                                  />
                                  {
                                    !isPhoneNumberVerifiedForPWDChange ?
                                      <>
                                        <div className="button-box">
                                          <button
                                            disabled={requesting}
                                            style={{
                                              display: "block",
                                              margin: "20px auto",
                                            }} onClick={e => verifyPhoneNumberToChangePassword(e)}>
                                            <span>Send an OTP</span>
                                          </button>
                                        </div>
                                        <p style={{
                                          fontSize: "10px",
                                          marginTop: "10px",
                                        }}>
                                          We will send you a text to verify your phone.
                                          Message and Data rates may apply.
                                      </p>
                                      </> : null
                                  }

                                  {
                                    !isPhoneNumberVerifiedForPWDChange ? null :
                                      <>
                                        <input
                                          type="password"
                                          name="new-password"
                                          placeholder="New Password"
                                          value={newPWD}
                                          onChange={handleChange}
                                        />
                                        <input
                                          type="password"
                                          name="confirm-new-password"
                                          placeholder="Confirm New Password"
                                          value={confirmNewPWD}
                                          onChange={handleChange}
                                        />
                                        <div className="button-box">
                                          <button
                                            disabled={requesting}
                                            onClick={e => forgotPassword(e)}>
                                            <span>Continue</span>
                                          </button>
                                        </div>
                                      </>
                                  }
                                </form>
                            }
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <label>Name
                              <input
                                  type="string"
                                  name="name"
                                  placeholder=""
                                  value={name}
                                  onChange={handleChange}
                                  style={{
                                    opacity: isPhoneNumberVerified ? "0.6" : "1"
                                  }}
                                  disabled={isPhoneNumberVerified}
                                /></label>
                              <label>Mobile Number
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
                                /></label>
                              <label>email (optional)
                              <input
                                  type="string"
                                  name="email"
                                  placeholder="(optional)"
                                  value={email}
                                  onChange={handleChange}
                                  style={{
                                    opacity: isPhoneNumberVerified ? "0.6" : "1"
                                  }}
                                  disabled={isPhoneNumberVerified}
                                /></label>
                              <label>Password (atleast 6 character)
                                <input
                                  type="password"
                                  name="user-password"
                                  placeholder="Password"
                                  value={pwd}
                                  onChange={handleChange}
                                /> </label>
                              <div className="button-box">
                                <button
                                  disabled={requesting}
                                  onClick={
                                    pwd.length > 5 ? e => verifyPhoneNumber(e, "register")
                                      : e => alert("password must have atleast 6 characters")
                                  }>
                                  <span>Continue</span>
                                </button>
                              </div>
                              <p style={{
                                fontSize: "10px",
                                marginTop: "10px",
                              }}>
                                We will send you a text to verify your phone.
                                Message and Data rates may apply.
                              </p>
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
    </Fragment >
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
