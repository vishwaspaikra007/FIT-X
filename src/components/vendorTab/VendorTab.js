import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import VendorProfileCard from '../vendorProfileCard/VendorProfileCard'

export default function VendorTab() {

    const [vendors, setVendors] = useState([])
    useEffect(() => {
        let vendorsCopy = []
        firestore.collection('vendors').limit(5).get()
            .then(docs => {
                docs.forEach(doc => {
                    vendorsCopy.push({ id: doc.id, ...doc.data() })
                })
                setVendors(vendorsCopy)
            })
    }, [])
    return (
        <>
            {
                vendors.map(vendor => (
                    <VendorProfileCard vendor={vendor} />
                ))
            }

        </>
    )
}
