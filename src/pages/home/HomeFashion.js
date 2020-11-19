import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderOne from "../../wrappers/hero-slider/HeroSliderOne";
import FeatureIcon from "../../wrappers/feature-icon/FeatureIcon";
import TabProduct from "../../wrappers/product/TabProduct";
import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";
import Vendors from "../../components/vendor/Vendors";
import Search from "../../components/search/Search";
import TabVendor from "../../wrappers/vendor/VendorTab";

const HomeFashion = () => {
  return (
    <Fragment>
      <MetaTags>
        <title>fitX | Fashion Home</title>
        <meta
          name="description"
          content="Fashion home of fitX Running Towards The Future."
        />
      </MetaTags>
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* hero slider */}
        {/* <HeroSliderOne /> */}
        <Search />
        {/* featured icon */}
        {/* <FeatureIcon spaceTopClass="pt-100" spaceBottomClass="pb-60" /> */}
        <TabVendor />
        {/* <Vendors asComponent={true}/> */}

        {/* tab product */}
        <TabProduct spaceBottomClass="pb-60" category="fashion" />

        {/* blog featured */}
        {/* <BlogFeatured spaceBottomClass="pb-55" /> */}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
