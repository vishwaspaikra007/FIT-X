import React, { useState, useEffect } from 'react'
import { firestore } from "../../firebase";
import Style from './Style.module.css'

import PreviewSection from './PreviewSection';
import PreviewCard from './PreviewCard';
import PreviewImage from './PreviewImage';
import PreviewService from './PreviewService';

export default function VendorPage(props) {
    const { vendor } = props
    const [services, setServices] = useState(vendor.vendorPage ? vendor.vendorPage : [])
    const [checkingOut, setCheckingOut] = useState(false)

    const renderPreview = (data, index) => {
        switch (data.type) {
            case 'section':
                return <PreviewSection key={index} index={index} newContent={data} />
                break;

            case 'service':
                return <PreviewService key={index} index={index} checkingOut={checkingOut} setCheckingOut={setCheckingOut} newContent={data} vendor={vendor} />
                break;

            case 'card':
                return <PreviewCard key={index} index={index} newContent={data} />
                break;

            case 'image':
                return <PreviewImage key={index} index={index} newContent={data} />
                break;

            default:
                break;
        }
    }

    return (
        <div>
            <div className="content">
                <div className="row margin-0">
                    <div className="col-12">
                        <section className={['box', Style.preview].join(" ")}>
                            <div className="content-body">
                                <div className="row">
                                    {
                                        services.map((content, index) => (
                                            renderPreview(content, index)
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
