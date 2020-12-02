import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import { firestore } from '../../firebase'

const Product = ({ location, product: productS1, match }) => {
  const { params: {id} } = match;
  const { pathname } = location

  let productS2
  if(location && location.state && location.state.product)
    productS2 = location.state.product

  const [product, setProduct] = useState(
    productS1 ? productS1 : productS2 ? productS2 : undefined
  )

  console.log("productS1",productS1,"productS2", productS2)  

  useEffect(() => {
    if (!product) {
      console.log(id)
      firestore.collection('products').doc(id).get().then(doc => {
        console.log("doc.data()", doc.data())
        setProduct({ ...doc.data(), id: doc.id })
      })
    }
  }, [])
  return (
    <Fragment>
      <MetaTags>
        <title>fitX | Product Page</title>
        <meta
          name="description"
          content="Product page of fitX Running Towards The Future."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Shop Product
      </BreadcrumbsItem>
      {
        !product ? null :


          <LayoutOne headerTop="visible">
            {/* breadcrumb */}
            <Breadcrumb />

            {/* product description with image */}
            <ProductImageDescription
              spaceTopClass="pt-100"
              spaceBottomClass="pb-100"
              product={product}
            />

            {/* product description tab */}
            <ProductDescriptionTab
              spaceBottomClass="pb-90"
              product={product}
            />
            {/*  */}
            {/* related product slider */}
            <RelatedProductSlider
              spaceBottomClass="pb-95"
              // category={product.weight[0]}
            />
          </LayoutOne>
      }
    </Fragment>
  );
};

Product.propTypes = {
  location: PropTypes.object,
  product: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const itemId = ownProps.match.params.id;
  return {
    product: state.productData.products.filter(
      single => single.id === itemId
    )[0]
  };
};

export default connect(mapStateToProps)(Product);
