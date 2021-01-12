import React, { useEffect, useState } from 'react'
import LayoutOne from '../layouts/LayoutOne'
import VendorProfileCard from '../components/vendorProfileCard/VendorProfileCard'
import VendorWhatWeDo from '../components/vendorWhatWeDo/VendorWhatWeDo'
import VendorPointOfSale from '../components/vendorPointOfSale/VendorPointOfSale'
import VendorServices from '../components/vendorServices/VendorServices'
// import VendorPricing from '../components/vendorPricing/VendorPricing'
import VendorTestimonials from '../components/vendorTestimonials/VendorTestimonials'
import VendorPage from '../components/VendorPage/VendorPage'


import PreLoader from '../components/PreLoader'
import { firestore } from '../firebase'

export default function Vendor(props) {

    const vendorS1 = props.location.state ? props.location.state.vendor : undefined
    const id = props.match ? props.match.params ? props.match.params.id : undefined : undefined
    const [vendor, setVendor] = useState(vendorS1)
    useEffect(() => {
        if (!vendorS1) {
            firestore.collection('vendors').doc(id).get()
                .then(doc => {
                    setVendor({ id: id, ...doc.data() })
                    console.log(doc.data())
                })
        }
    }, [])
    return (
        <LayoutOne>
            {
                !vendor ? <PreLoader /> :
                    <div className={'container'}>
                        {
                            !vendor ? null :
                                <VendorProfileCard vendor={vendor} />
                        }

                        {
                            !vendor.vendorPage ? null :
                                <VendorPage vendor={vendor} />
                        }

                        {/* {
                            !vendor.whatWeDo ? null :
                                <VendorWhatWeDo vendor={vendor} />
                        }

                        {
                            !vendor.pointOfSale ? null :
                                <VendorPointOfSale vendor={vendor} />
                        }

                        {
                            !vendor.pricingTable ? null :
                                <VendorPricing vendor={vendor} />
                        }

                        {
                            !vendor.services ? null :
                                <VendorServices vendor={vendor} />
                        }

                        {
                            !vendor.testimonials ? null :
                                <VendorTestimonials vendor={vendor} />
                        } */}

                    </div>
            }
        </LayoutOne>
    )
}