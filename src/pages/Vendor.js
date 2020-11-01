import React, {useEffect} from 'react'
import LayoutOne from '../layouts/LayoutOne'
import VendorProfileCard from '../components/vendorProfileCard/VendorProfileCard'

export default function Vendor(props) {
    
    const vendor = props.location.state ? props.location.state.vendor : undefined
    return (
        <LayoutOne>
            <div>
                <VendorProfileCard vendor={vendor}/>
            </div>
        </LayoutOne>
    )
}
