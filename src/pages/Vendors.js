import React from 'react'
import { default as VendorsComponent } from '../components/vendor/Vendors'
import LayoutOne from '../layouts/LayoutOne'
import Breadcrumb from "../wrappers/breadcrumb/Breadcrumb";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";

export default function Vendors() {
    return (
        <div>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/vendors"}> Vendors</BreadcrumbsItem>
            <LayoutOne
                headerContainerClass="container-fluid"
                headerPaddingClass="header-padding-1"
            >
                <Breadcrumb />
                <VendorsComponent />
            </LayoutOne>
        </div>
    )
}
