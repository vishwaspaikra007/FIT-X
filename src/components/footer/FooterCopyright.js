import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../header/Logo";

const FooterCopyright = ({ footerLogo, spaceBottomClass, colorClass }) => {
  return (
    <div
      className={`copyright ${spaceBottomClass ? spaceBottomClass : ""} ${
        colorClass ? colorClass : ""
      }`}
    >
      <div className="footer-logo">
          {/* <img alt="" src={process.env.PUBLIC_URL + footerLogo} /> */}
          <Logo imageUrl={footerLogo}/>
      </div>
      <p>
        © 2020{" "}
        <a href="//hasthemes.com" rel="noopener noreferrer" target="_blank">
          fitX
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string
};

export default FooterCopyright;
