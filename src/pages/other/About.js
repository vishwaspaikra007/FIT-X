import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import BannerOne from "../../wrappers/banner/BannerOne";
import TextGridOne from "../../wrappers/text-grid/TextGridOne";
import FunFactOne from "../../wrappers/fun-fact/FunFactOne";
import TeamMemberOne from "../../wrappers/team-member/TeamMemberOne";
import BrandLogoSliderOne from "../../wrappers/brand-logo/BrandLogoSliderOne";
import { firestore } from "../../firebase";

const About = ({ location }) => {
  const { pathname } = location;
  const [termsAndConditions, setTermsAndConditions] = useState("")
  useEffect(() => {
    firestore.collection('web_config').doc('info').get()
      .then(doc => {
        let data
        if (doc.data().termsAndConditions) {
          try {
            data = JSON.parse(doc.data().termsAndConditions)
          } catch (error) {
            try {
              data = JSON.parse(JSON.stringify(doc.data().termsAndConditions))
            } catch (error) {
              data = doc.data().termsAndConditions
            }
          }
        }
        setTermsAndConditions(data)
      })
  }, [])

  return (
    <Fragment>
      <MetaTags>
        <title>fitX | About us</title>
        <meta
          name="description"
          content="About page of fitX Running Towards The Future."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        About us
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        {/* section title with text */}
        <SectionTitleWithText spaceTopClass="pt-100" spaceBottomClass="pb-95" />

        {/* banner */}
        {/* <BannerOne spaceBottomClass="pb-70" /> */}

        {/* text grid */}
        <TextGridOne spaceBottomClass="pb-70" />
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              {
                termsAndConditions
              }
            </div>
          </div>
        </div>

        {/* fun fact */}
        {/* <FunFactOne
          spaceTopClass="pt-100"
          spaceBottomClass="pb-70"
          bgClass="bg-gray-3"
        /> */}

        {/* team member */}
        {/* <TeamMemberOne spaceTopClass="pt-95" spaceBottomClass="pb-70" /> */}

        {/* brand logo slider */}
        <BrandLogoSliderOne spaceBottomClass="pb-70" />
      </LayoutOne>
    </Fragment>
  );
};

About.propTypes = {
  location: PropTypes.object
};

export default About;
