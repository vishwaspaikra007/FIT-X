import PropTypes from "prop-types";
import React, { useEffect, Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { multilanguage, loadLanguages } from "redux-multilanguage";
import { connect } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";
import useFirebase from "./useFirebase";
import useRazorPay from './useRazorPay'
import PreLoader from "./components/PreLoader";
import { useSelector } from 'react-redux'
import Purchases from "./pages/other/Purchases";

const Reviews = lazy(() => import("./pages/other/Reviews"));
const Order = lazy(() => import("./pages/other/Order"));
const BecomeVendor = lazy(() => import("./pages/BecomeVendor"));
const Vendor = lazy(() => import("./pages/Vendor"));
const Vendors = lazy(() => import("./pages/Vendors"));

// home pages
const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));
// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const ShopGridFilter = lazy(() => import("./pages/shop/ShopGridFilter"));
const ShopGridTwoColumn = lazy(() => import("./pages/shop/ShopGridTwoColumn"));
const ShopGridNoSidebar = lazy(() => import("./pages/shop/ShopGridNoSidebar"));
const ShopGridFullWidth = lazy(() => import("./pages/shop/ShopGridFullWidth"));
const ShopGridRightSidebar = lazy(() =>
  import("./pages/shop/ShopGridRightSidebar")
);
const ShopListStandard = lazy(() => import("./pages/shop/ShopListStandard"));
const ShopListFullWidth = lazy(() => import("./pages/shop/ShopListFullWidth"));
const ShopListTwoColumn = lazy(() => import("./pages/shop/ShopListTwoColumn"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
const ProductTabRight = lazy(() =>
  import("./pages/shop-product/ProductTabRight")
);
const ProductSticky = lazy(() => import("./pages/shop-product/ProductSticky"));
const ProductSlider = lazy(() => import("./pages/shop-product/ProductSlider"));
const ProductFixedImage = lazy(() =>
  import("./pages/shop-product/ProductFixedImage")
);

// blog pages
const BlogStandard = lazy(() => import("./pages/blog/BlogStandard"));
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogRightSidebar = lazy(() => import("./pages/blog/BlogRightSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const Orders = lazy(() => import("./pages/other/Orders"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = (props) => {
  useRazorPay()
  useFirebase()

  const requesting = useSelector(state => state.generalData.requesting)
  useEffect(() => {
    props.dispatch(
      loadLanguages({
        languages: {
          en: require("./translations/english.json"),
          fn: require("./translations/french.json"),
          de: require("./translations/germany.json")
        }
      })
    );
  });

  return (
    <>
      <ToastProvider placement="bottom-left">
        <BreadcrumbsProvider>
          <Router>
            {/* <ScrollToTop> */}
              <Suspense
                fallback={
                  // <div className="fitX-preloader-wrapper">
                  //   <div className="fitX-preloader">
                  //     <span></span>
                  //     <span></span>
                  //   </div>
                  // </div>
                  <PreLoader />
                }
              >
                {
                  requesting ? <PreLoader style={{
                    background: "#ffffff56",
                    backdropFilter: "blur(2px)",
                  }} /> : null
                }
                <Switch>
                  <Route
                    exact
                    path={process.env.PUBLIC_URL + "/"}
                    component={HomeFashion}
                  />

                  <Route
                    path={process.env.PUBLIC_URL + "/vendor/:id"}
                    component={Vendor}
                  />

                  {/* Vendors */}

                  <Route
                    path={process.env.PUBLIC_URL + "/vendors"}
                    component={Vendors}
                  />

                  {/* Shop pages */}
                  {/* <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                  component={ShopGridStandard}
                /> */}
                  <Route
                    path={process.env.PUBLIC_URL + "/products/:tags"}
                    component={ShopGridFilter}
                  />
                  {/* <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-two-column"}
                  component={ShopGridTwoColumn}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}
                  component={ShopGridNoSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-full-width"}
                  component={ShopGridFullWidth}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-right-sidebar"}
                  component={ShopGridRightSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-standard"}
                  component={ShopListStandard}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-full-width"}
                  component={ShopListFullWidth}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-two-column"}
                  component={ShopListTwoColumn}
                /> */}

                  {/* Shop product pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/product/:id"}
                    render={(routeProps) => (
                      <Product {...routeProps} key={routeProps.match.params.id} />
                    )}
                  />
                  {/* <Route
                  path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                  component={ProductTabLeft}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-tab-right/:id"}
                  component={ProductTabRight}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-sticky/:id"}
                  component={ProductSticky}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-slider/:id"}
                  component={ProductSlider}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-fixed-image/:id"}
                  component={ProductFixedImage}
                /> */}

                  {/* Blog pages */}
                  {/* <Route
                  path={process.env.PUBLIC_URL + "/blog-standard"}
                  component={BlogStandard}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                  component={BlogNoSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
                  component={BlogRightSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/blog-details-standard"}
                  component={BlogDetailsStandard}
                /> */}

                  {/* Other pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/about"}
                    component={About}
                  />
                  {/* <Route
                    path={process.env.PUBLIC_URL + "/contact"}
                    component={Contact}
                  /> */}
                  <Route
                    path={process.env.PUBLIC_URL + "/my-account"}
                    component={MyAccount}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/become-vendor"}
                    component={BecomeVendor}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/login-register"}
                    component={LoginRegister}
                  />

                  <Route
                    path={process.env.PUBLIC_URL + "/cart"}
                    component={Cart}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/wishlist"}
                    component={Wishlist}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/compare"}
                    component={Compare}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/checkout"}
                    component={Checkout}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/purchases"}
                    component={Purchases}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/orders"}
                    component={Orders}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/order/:orderId"}
                    component={Order}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/reviews/:productId"}
                    component={Reviews}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/not-found"}
                    component={NotFound}
                  />

                  <Route exact component={NotFound} />
                </Switch>
              </Suspense>
            {/* </ScrollToTop> */}
          </Router>
        </BreadcrumbsProvider>
      </ToastProvider>
    </>
  );
};

App.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(multilanguage(App));
