import PropTypes from "prop-types";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import VendorTab from '../../components/vendorTab/VendorTab'

const TabVendor = ({
  spaceTopClass,
  spaceBottomClass,
  bgColorClass,
  category
}) => {
  return (
    <div
      className={`product-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${bgColorClass ? bgColorClass : ""}`}
    >
      <div className="container">
        <SectionTitle titleText="DAILY DEALS!" positionClass="text-center" />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className="product-tab-list pt-30 pb-55 text-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="newVendors">
                <h4>New Vendors</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Best Sellers</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bestCombos">
                <h4>Best Combos</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="newVendors">
              <div className="row" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                display: "grid",
                gridGap: "20px"
              }}>
                <VendorTab
                  category={category}
                  type="newVendors"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="bestSeller">
              <div className="row" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                display: "grid",
                gridGap: "20px"
              }}>
                <VendorTab
                  category={category}
                  type="bestSeller"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="bestCombos">
              <div className="row" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                display: "grid",
                gridGap: "20px"
              }}>
                <VendorTab
                  category={category}
                  type="bestCombos"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

TabVendor.propTypes = {
  bgColorClass: PropTypes.string,
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabVendor;
