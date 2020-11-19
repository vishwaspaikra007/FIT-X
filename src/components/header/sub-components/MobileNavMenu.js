import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { useSelector } from 'react-redux'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const MobileNavMenu = ({ strings }) => {

  const categories = useSelector(state => state.generalData.categories)
  const user = useSelector(state => state.userData.user)

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li  className="menu-item-has-children">
          <Link to={user && user.uid ? "/my-account": "/login-register"} style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <AccountCircleIcon style={{
            width: "50px",
            height: "50px",
          }}/>
          </Link>
        </li>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</Link>
        </li>

        <li className="menu-item-has-children active">
          <Link to={process.env.PUBLIC_URL + "/products"}>
            {strings["shop"]}
          </Link>
          <ul className="sub-menu">
            {
              categories ? Object.keys(categories).map((key, i) => {
                return (
                  <li className="menu-item-has-children" key={i}>
                    <Link to={process.env.PUBLIC_URL + "/products/" + key}>
                      {key}
                    </Link>
                    <ul className="sub-menu">
                      {
                        categories[key].map((value, index) => {
                          return (
                            <li key={index}>
                              <Link to={process.env.PUBLIC_URL + "/products/" + value}>
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
        </li>
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object
};

export default multilanguage(MobileNavMenu);
