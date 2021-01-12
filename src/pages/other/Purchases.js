import React, { useState, useEffect } from 'react'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { firestore } from '../../firebase'
import { useToasts } from 'react-toast-notifications'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from "react-meta-tags";
import PreLoader from '../../components/PreLoader'
import LayoutOne from "../../layouts/LayoutOne";
import Class from './Purchase.module.css'
import { Link, Redirect } from "react-router-dom";
import LoadContent from "../../components/LoadContent";
import Img from '../../components/Img';

export default function Purchases({ location, match }) {

    const [lastDoc, setLastDoc] = useState()
    const [loadContent, setLoadContent] = useState(true)
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)
    const [purchaseList, setPurchaseList] = useState([])

    const { pathname } = location;
    const limit = 5
    const user = useSelector(state => state.userData.user)

    const getAndSetOrders = () => {
        if (user && user.uid) {
            let ref = firestore.collection('services')
                .where('userId', "==", user.uid)
                .orderBy('createdAt', 'desc')
            if (lastDoc)
                ref = ref.startAfter(lastDoc)

            ref.limit(limit).get()
                .then(docs => {
                    if (docs.docs.length > 0) {
                        let purchaseListCopy = JSON.parse(JSON.stringify(purchaseList))
                        console.log(docs)
                        docs.forEach(doc => {
                            purchaseListCopy.push({
                                ...doc.data(),
                                paymentMethod: doc.data().paymentCaptureDetails ? doc.data().paymentCaptureDetails.payload.payment.entity.method : undefined,
                                id: doc.id,
                            })
                        })
                        setLoadContent(false)
                        setPurchaseList(purchaseListCopy)
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
            getAndSetOrders()
        }
    }, [loadContent])

    return (
        <>
            {
                user && user.uid ? null :
                    <Redirect to={{ pathname: '/login-register', state: { from: pathname } }} />
            }

            <MetaTags>
                <title>fitX | Purchases</title>
                <meta
                    name="description"
                    content="Purchases of fitX Running Towards The Future."
                />
            </MetaTags>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
                Purchases
        </BreadcrumbsItem>
            <LayoutOne headerTop="visible">
                <Breadcrumb />
                <div className={[Class.PurchaseWrap, 'container'].join(" ")}>
                    {
                        purchaseList.map((item, key) => (
                            <div className={Class.ServiceWrap} key={key}>
                                <div className={[Class.imgWrap, item.paymentCaptureDetails ? null : Class.red].join(" ")}>
                                    <Img src={item.service.imgURL} style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: 'cover',
                                        borderRadius: "50%",
                                        border: "5px solid white",
                                    }}/>
                                </div>
                                <h3 className={Class.title}>{item.service.title}</h3>
                                <div className={Class.name}>from {item.vendorName}</div>
                                <ul className={Class.ul}>
                                    {
                                        item.service.points.map((point, key) => (
                                            <li key={key}>{point}</li>
                                        ))
                                    }
                                </ul>
                                <div className={Class.id}>{item.paymentCaptureDetails ? item.id : <span className={Class.redText}>Payment failed</span>}</div>
                            </div>
                        ))
                    }
                </div>
                {
                    allowFurtherFetch ? <LoadContent onChange={bool => setLoadContent(bool)} style={{
                        height: "100px",
                        width: "200px",
                        margin: "auto"
                    }}/> : null
                }
            </LayoutOne>
        </>
    )
}
