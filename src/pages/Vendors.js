import React from 'react'
import { default as VendorsComponent } from '../components/vendor/Vendors'
import LayoutOne from '../layouts/LayoutOne'
export default function Vendors() {
    return (
        <div>
            <LayoutOne
                headerContainerClass="container-fluid"
                headerPaddingClass="header-padding-1"
            >
                <VendorsComponent />
            </LayoutOne>
        </div>
    )
}
