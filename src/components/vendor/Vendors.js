import React, { useEffect, useState } from 'react'
import style from './Vendors.module.css'
import { firestore } from '../../firebase'
import { Link } from 'react-router-dom'
import Img from '../Img'

export default function Vendors(props) {

    const [vendors, setVendors] = useState([])
    useEffect(() => {
        firestore.collection('vendors').get()
            .then(docs => {
                console.log(docs)
                let list = []
                docs.forEach(doc => {
                    list.push({ ...doc.data(), id: doc.id })
                })
                setVendors(list)
            })
    }, [])
    return (
        <div style={{
            width: "100%",
            position: "relative",
            marginBottom: "45px",
            paddingTop: "60px",
        }}>
            <div style={{
                display: props.asComponent ? "block" : "hidden",
                position: "absolute",
                top: 0,
                zIndex: 0,
                margin: "10px",
                background: "orange",
                borderRadius: "10px",
                width: "calc(100% - 20px)",
                height: "100%",
                boxSizing: "border-box",
                boxShadow: "0px 0px 12px -4px, inset 0 -12px 63px #764c00",
            }}
            >
                <div style={{
                    padding: "30px 20px",
                    fontWeight: "bold",
                    color: "white"
                }}>
                    <span style={{
                        float: "Left",
                    }}>Vendors</span>
                    {
                        props.asComponent && vendors.length > 0 ?
                            <Link to="/vendors">
                                <span style={{
                                    float: "right",
                                    color: "white",
                                }}>See All</span>
                            </Link> : null
                    }
                </div>
            </div>
            <div style={{
                width: "100%",
                position: "relative",
                overflow: props.asComponent ? "hidden" : "auto",
                overflowX: props.asComponent ? "auto" : "hidden"
            }}>
                <div className={
                    [style.vendorsWrap, props.asComponent ?
                        style.vendorsWrapAsComponent : style.vendorsWrapAsPage
                    ].join(" ")}>
                    {
                        vendors.map((vendor, index) => (
                            <Link to={{ pathname: "/vendor/" + vendor.id, state: { vendor: vendor } }} key={index} style={{
                                width: props.asComponent ? "130px" : "auto",
                                minHeight: "130px",
                                borderRadius: "5px",
                                margin: "10px",
                                overflow: "hidden",
                                boxShadow: "0px 0px 12px -4px black",
                                display: "block",
                                cursor: "pointer",
                                background: "white",
                            }}>
                                <Img src={vendor.imgURL} style={{
                                    width: "100%",
                                    height: "130px",
                                    objectFit: "cover",
                                }} />
                                <p style={{
                                    padding: "10px",
                                    boxShadow: "0 2px 9px",
                                    zIndex: "2",
                                    position: "relative",
                                    borderRadius: "0 0 5px",
                                    height: "100%",
                                }}><b>{vendor.name}</b></p>
                            </Link>
                        ))
                    }
                    <Link to="/vendors" style={{
                        display: props.asComponent && vendors.length > 0 ? "flex" : "none"
                    }}>
                        <div
                            style={{
                                padding: "5px",
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "white"
                            }}>
                            Show more
                </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
