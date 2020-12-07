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

export default function Orders({ location }) {

    const [lastDoc, setLastDoc] = useState()
    const [loadContent, setLoadContent] = useState(true)
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)
    const [products, setProducts] = useState([])

    const { pathname } = location;
    const limit = 5
    const user = useSelector(state => state.userData.user)

    const getAndSetProducts = () => {
        if (user && user.uid) {
            let ref
            if (lastDoc)
                ref = firestore.collection('orders').where('userId', "==", user.uid).startAfter(lastDoc)
            else
                ref = firestore.collection('orders').where('userId', "==", user.uid)

            ref.limit(limit).get()
                .then(docs => {
                    if (docs.docs.length > 0) {
                        let productList = JSON.parse(JSON.stringify(products))
                        console.log(docs)
                        docs.forEach(doc => {
                            productList.push(...doc.data().cartItems)
                        })
                        setLoadContent(false)
                        setProducts(productList)
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
            getAndSetProducts()
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
                <div className={Class.itemsWrap}>
                    {
                        products.map((item, key) => (
                            <div key={key} className={Class.itemBox}>
                                <img className={Class.img} src={item.images[0]} />
                                <div className={Class.description}>
                                    <div className={Class.status}>{item.deliveryStatus}</div>
                                    <div className={Class.text}>{item.productName}</div>
                                    <Link to={'/product/' + item.id + '#review'} className={Class.link}>Write a review</Link>
                                </div>
                            </div>
                        ))
                    }
                    <LoadContent onChange={bool => setLoadContent(bool)} />
                </div>
            </LayoutOne>
        </>
    )
}
