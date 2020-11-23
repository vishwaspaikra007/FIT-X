import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { useSelector } from 'react-redux'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { auth } from '../../../firebase'

const MobileNavMenu = ({ strings }) => {
  const categories = useSelector(state => state.generalData.categories)
  const user = useSelector(state => state.userData.user)

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={user && user.uid ? "/my-account" : "/login-register"} style={{
            display: "grid",
            justifyContent: "center",
          }}>
            <AccountCircleIcon style={{
              width: "50px",
              height: "50px",
            }} />
            <span style={{
              textAlign: "center"
            }} >{user && user.uid ? null : "Login"}</span>
          </Link>

          {
            user && user.uid ?
              <ul className="submenu" style={{
                textAlign: "center",
                lineHeight: "5px",
              }}>
                <li className="menu-item-has-children" onClick={() => auth.signOut()}><a>Logout</a></li>
                <li>
                  <Link to={"/my-account"}>Profile</Link>
                </li>
              </ul>
              : null
          }

        </li>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</Link>
        </li>

        <li className="menu-item-has-children active">
          <Link to={process.env.PUBLIC_URL + "/products/all"}>
            {strings["shop"]}
          </Link>
          <ul className="sub-menu">
            {
              categories ? Object.keys(categories).map((key, i) => {
                return (
                  <li className="menu-item-has-children" key={i}>
                    <Link to={process.env.PUBLIC_URL + "/products/category " + key}>
                      {key}
                    </Link>
                    <ul className="sub-menu">
                      {
                        categories[key].map((value, index) => {
                          return (
                            <li key={index}>
                              <Link to={process.env.PUBLIC_URL + "/products/subCategory " + value}>
                                {value}
                              </Link>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </li>
                )
              }) : null
            }
          </ul>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {strings["contact_us"]}
          </Link>
          <Link to={"/become-vendor"}>Become Vendor
          </Link>
        </li>
        <li>
          <Link to={"/vendors"}>See All Vendors</Link>
        </li>
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object
};

export default multilanguage(MobileNavMenu);
