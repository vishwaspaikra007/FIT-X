import React, { useEffect, useState } from 'react'
import LayoutOne from '../layouts/LayoutOne'
import VendorProfileCard from '../components/vendorProfileCard/VendorProfileCard'
import VendorWhatWeDo from '../components/vendorWhatWeDo/VendorWhatWeDo'
import VendorPointOfSale from '../components/vendorPointOfSale/VendorPointOfSale'
import VendorPricing from '../components/vendorPricing/VendorPricing'
import VendorTestimonials from '../components/vendorTestimonials/VendorTestimonials'
import PreLoader from '../components/PreLoader'
import { firestore } from '../firebase'

export default function Vendor(props) {

    const vendorS1 = props.location.state ? props.location.state.vendor : undefined
    const id = props.match ? props.match.params ? props.match.params.id : undefined : undefined
    const [vendor, setVendor] = useState(vendorS1)
    useEffect(() => {
        if(!vendorS1) {
            firestore.collection('vendors').doc(id).get()
                .then(doc => {
                    setVendor({id: id, ...doc.data()})
                })
        }
    }, [])
    return (
        <LayoutOne>
            {
                !vendor ? <PreLoader /> :
                    <div>
                        <VendorProfileCard vendor={vendor} />
                        <VendorWhatWeDo vendor={vendor} />
                        <VendorPointOfSale vendor={vendor} />
                        <VendorPricing vendor={vendor} />
                        <VendorTestimonials vendor={vendor} />
                    </div>
            }
        </LayoutOne>
    )
}