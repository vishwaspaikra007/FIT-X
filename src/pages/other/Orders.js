import React, { useState, useEffect } from 'react'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { firestore } from '../../firebase'
import { useToasts } from 'react-toast-notifications'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from "react-meta-tags";
import PreLoader from '../../components/PreLoader'
import LayoutOne from "../../layouts/LayoutOne";
import Class from './Orders.module.css'
import { Link, Redirect } from "react-router-dom";
import LoadContent from "../../components/LoadContent";

export default function Orders({ location, match }) {

    const [lastDoc, setLastDoc] = useState()
    const [loadContent, setLoadContent] = useState(true)
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)
    const [orders, setOrders] = useState([])

    const { pathname } = location;
    const limit = 5
    const user = useSelector(state => state.userData.user)

    const getAndSetOrders = () => {
        if (user && user.uid) {
            let ref = firestore.collection('orders')
                .where('userId', "==", user.uid)
                .orderBy('createdAt', 'desc')
            if (lastDoc)
                ref = ref.startAfter(lastDoc)

            ref.limit(limit).get()
                .then(docs => {
                    if (docs.docs.length > 0) {
                        let orderList = JSON.parse(JSON.stringify(orders))
                        console.log(docs)
                        docs.forEach(doc => {
                            orderList.push({
                                list: doc.data().cartItems,
                                couponDiscount: doc.data().couponDiscount,
                                couponName: doc.data().couponName,
                                id: doc.id
                            })
                        })
                        setLoadContent(false)
                        setOrders(orderList)
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
                <title>fitX | orders</title>
                <meta
                    name="description"
                    content="Orders of fitX Running Towards The Future."
                />
            </MetaTags>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
                Orders
        </BreadcrumbsItem>
            <LayoutOne headerTop="visible">
                <Breadcrumb />
                <div className={Class.orderWrap}>
                    {
                        orders.map((order, key) => (
                            <div key={key}>
                                <div className={Class.itemsWrap}>
                                    {
                                        order.list && Object.keys(order.list).map((id, key2) => {
                                            const item = order.list[id]
                                            return (
                                            <div key={key2} className={Class.itemBox}>
                                                <img className={Class.img} src={item.images[0]} />
                                                <div className={Class.description}>
                                                    <div className={Class.status}>{item.status}</div>
                                                    <div className={Class.text}>{item.productName}</div>
                                                    <Link to={'/product/' + item.id + '#review'} className={Class.link}>Write a review</Link>
                                                </div>
                                            </div>
                                        )})
                                    }
                                </div>
                                <Link className={Class.orderLink} to={{ pathname: `order/${order.id}`, state: { order: order } }}>
                                    >> order details
                                </Link>
                            </div>
                        ))
                    }
                    <LoadContent onChange={bool => setLoadContent(bool)} />
                </div>
            </LayoutOne>
        </>
    )
}
