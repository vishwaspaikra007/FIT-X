import React, { useState, useEffect } from 'react'
import LayoutOne from '../layouts/LayoutOne'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import Breadcrumb from "../wrappers/breadcrumb/Breadcrumb"
import { useSelector, useDispatch } from 'react-redux'
import { firestore, timestamp, increment } from '../firebase'
import { useToasts } from 'react-toast-notifications'
import { useHistory } from 'react-router-dom'
import Card from "react-bootstrap/Card";
import PreLoader from '../components/PreLoader'
import { Redirect } from 'react-router-dom'

export default function BecomeVendor(props) {
    const history = useHistory()
    const { addToast } = useToasts()
    const dispatch = useDispatch()
    const user = useSelector(state => state.userData.user)
    const sellerInfoRedux = useSelector(state => state.generalData.sellerInfo)

    const [sellerInfo, setSellerInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        shopAddress: "",
        bankAccountNumber: "",
        bankIFSCCode: "",
    })
    const [sellerInfoOld, setSellerInfoOld] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        shopAddress: "",
        bankAccountNumber: "",
        bankIFSCCode: "",
    })

    const [stateChanged, setStateChanged] = useState(false)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (user && user.uid && sellerInfo.firstName == "" && !sellerInfoRedux) {
            console.log(user)
            firestore.collection('vendors').doc(user.uid).get()
                .then(doc => {
                    console.log(doc, doc.data())
                    if (doc && doc.data()) {
                        setSellerInfo(doc.data())
                        setSellerInfoOld(doc.data())
                        dispatch({ type: "SELLER_INFO", sellerInfo: doc.data() })
                    }
                })
        } else if (sellerInfoRedux) {
            setSellerInfo(sellerInfoRedux)
            setSellerInfoOld(sellerInfoRedux)
        }
        console.log(sellerInfoRedux)
    }, [user])

    const handleChange = (e, type) => {
        e.preventDefault()
        switch (type) {
            case 'sellerInfo': setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value });
                setStateChanged(true); break;
            case 'cancel': setSellerInfo(sellerInfoOld);
                setStateChanged(false); break;

            case 'save':
                setLoading(true)

                if (user && user.uid) {
                    console.log(sellerInfoRedux)
                    let ref
                    const batch = firestore.batch()
                    if (sellerInfoRedux && sellerInfoRedux.createdAt) {
                        ref = firestore.collection("vendors").doc(user.uid).update(sellerInfo)

                    } else {
                        batch.set(firestore.collection("vendors").doc(user.uid), {
                            ...sellerInfo,
                            createdAt: sellerInfoRedux && sellerInfoRedux.createdAt ? sellerInfoRedux.createdAt : timestamp
                        })
                        batch.update(firestore.collection('analytics').doc('count'), { vendors: increment })
                        ref = batch.commit()
                    }
                    ref.then(doc => {
                        setLoading(false)
                        setStateChanged(false)
                        setSellerInfoOld(sellerInfo)
                        dispatch({ type: "SELLER_INFO", sellerInfo: sellerInfo })
                        addToast('Saved Successfully', { appearance: 'success' })
                    }).catch(err => {
                        addToast("error occured", { appearance: 'error' })
                    });
                } else history.push({ pathname: '/login-register', state: { from: props.location.pathname } })
                break;
            default: break;
        }
    }
    return (
        <>
            {
                user && user.uid ? null :
                    <Redirect to={{ pathname: "/login-register", state: { from: props.location.pathname } }} />
            }
            {
                loading ? <PreLoader style={{
                    background: "#ffffff56",
                    backdropFilter: "blur(2px)",
                }} /> : null
            }
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/become-vendor'}>
                Become Vendor
                </BreadcrumbsItem>
            <LayoutOne>
                <Breadcrumb />
                <div className="myaccount-area pb-80 pt-100">
                    <div className="container">
                        <div className="row">
                            <div className="ml-auto mr-auto col-lg-9">
                                <div className="myaccount-wrapper">
                                    <Card className="single-my-account mb-20">
                                        <Card.Header className="panel-heading">
                                            <h3 className="panel-title">
                                                <span>1 .</span> Edit your seller account information{" "}
                                            </h3>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="myaccount-info-wrapper">
                                                <div className="account-info-wrapper">
                                                    <h4>Become a Seller</h4>
                                                    <h5>Your Personal Details</h5>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="billing-info">
                                                            <label>First Name</label>
                                                            <input name="firstName" value={sellerInfo.firstName} onChange={e => handleChange(e, 'sellerInfo')} type="text" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="billing-info">
                                                            <label>Last Name</label>
                                                            <input name="lastName" value={sellerInfo.lastName} onChange={e => handleChange(e, 'sellerInfo')} type="text" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12">
                                                        <div className="billing-info">
                                                            <label>Email Address</label>
                                                            <input name="email" value={sellerInfo.email} onChange={e => handleChange(e, 'sellerInfo')} type="email" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="billing-info">
                                                            <label>Phone Number</label>
                                                            <input name="phoneNumber" value={sellerInfo.phoneNumber} onChange={e => handleChange(e, 'sellerInfo')} type="text" />
                                                        </div>
                                                    </div>

                                                    <div className="entries-wrapper" style={{
                                                        width: "-webkit-fill-available",
                                                    }}>
                                                        <div className="row" style={{
                                                            display: 'block',
                                                            padding: "10px",
                                                        }}>
                                                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center" style={{
                                                                width: "100%",
                                                                maxWidth: "100%",
                                                                display: 'block'
                                                            }}>
                                                                <div className="entries-info" style={{
                                                                    width: "100%",
                                                                }}>
                                                                    <label>Shop Address</label>
                                                                    <textarea name="shopAddress" value={sellerInfo.shopAddress} onChange={e => handleChange(e, 'sellerInfo')}></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h3 style={{
                                                        width: "100%",
                                                        marginTop: "20px",
                                                    }}>Bank Details</h3>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="billing-info">
                                                            <label>Bank Account Number</label>
                                                            <input name="bankAccountNumber" value={sellerInfo.bankAccountNumber} onChange={e => handleChange(e, 'sellerInfo')} type="text" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="billing-info">
                                                            <label>Bank IFSC Code</label>
                                                            <input name="bankIFSCCode" value={sellerInfo.bankIFSCCode} onChange={e => handleChange(e, 'sellerInfo')} type="text" />
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

                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </>
    )
}