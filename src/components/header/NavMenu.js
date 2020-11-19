import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { firestore } from "../../firebase"
import { useSelector } from 'react-redux'

const NavMenu = ({ strings, menuWhiteClass, sidebarMenu }) => {

  const categories = useSelector(state => state.generalData.categories)

  return (
    <div
      className={` ${
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
        } `}
    >
      <nav>
        <ul>
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
              Products
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                  <i className="fa fa-angle-down" />
                )}
            </Link>
            <ul className="submenu" style={{
              width: "270px"
            }}>

              {
                Object.entries(categories).map(([key, value]) => {
                  return (
                    <li key={key} className="submenu-title">
                      <Link to={process.env.PUBLIC_URL + `/products/${key}`}>
                        {key}
                      </Link>
                      <ul className="submenu" style={{
                         left: "250px",
                         top: "-32px",
                      }}>
                        {

                          value.map((val, i) => (
                            <li key={i}>
                              <Link to={process.env.PUBLIC_URL + "/products/" + val}>
                                {val}
                              </Link>
                            </li>
                          ))

                        }
                      </ul>
                    </li>
                  )
                })
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
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object
};

export default multilanguage(NavMenu);
