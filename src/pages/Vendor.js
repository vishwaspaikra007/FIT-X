import React, {useEffect} from 'react'
import LayoutOne from '../layouts/LayoutOne'

export default function Vendor(props) {
    
    const vendor = props.location.state ? props.location.state.vendor : undefined
    return (
        <LayoutOne>
            <div>
                {vendor.name}
            </div>
        </LayoutOne>
    )
}
