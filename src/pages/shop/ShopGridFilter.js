import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { firestore } from '../../firebase'
import LoadContent from "../../components/LoadContent";

const ShopGridFilter = ({ location, match }) => {

    const [loadContent, setLoadContent] = useState(true)
    const [lastDoc, setLastDoc] = useState()
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)

    let tag1, tag2
    const limit = 3
    if (location.state && location.state)
        tag1 = location.state
    if (match && match.params && match.params.tags)
        tag2 = match.params.tags

    const tag = tag1 ? tag1 : tag2 ? tag2 : "all"

    const [products, setProducts] = useState([])
    console.log(tag)
    const getAndSetProducts = () => {
        let ref
        if (lastDoc)
            ref = firestore.collection('products').startAfter(lastDoc)
        else
            ref = firestore.collection('products')

        if (tag == "all")
            ref = ref.limit(limit).get()
        else
        {
            if((tag).split(" ")[0] === "category") {
                ref = ref.where('category', "==", tag.slice(tag.indexOf(" ")+1,) ).limit(limit).get()
            } else if((tag).split(" ")[0] === "subCategory") {
                ref = ref.where('category', "==", tag.slice(tag.indexOf(" ")+1,) ).limit(limit).get()
            } else
                ref = ref.where('tags', "array-contains-any", (tag).split(" ")).limit(limit).get()
        }

        ref.then(docs => {
            if (docs.docs.length > 0) {
                let productList = [...products]
                // let productList = JSON.parse(JSON.stringify(products))
                console.log(docs)
                docs.forEach(doc => {
                    productList.push({ id: doc.id, ...doc.data() })
                })
                setLoadContent(false)
                setProducts(productList)
                setLastDoc(docs.docs[docs.docs.length - 1])
                if (docs.docs.length < limit)
                    setAllowFurtherFetch(false)
            } else {
                setAllowFurtherFetch(false)
                setLoadContent(false)
            }
        })
    }

    useEffect(() => {
        if (loadContent && allowFurtherFetch) {
            getAndSetProducts()
        }
    }, [loadContent])

    useEffect(() => {
            setProducts([])
            setLastDoc(undefined)
            setAllowFurtherFetch(true)
            setLoadContent(true)
    }, [tag2])

    const [layout, setLayout] = useState('grid three-column');
    const [currentData, setCurrentData] = useState([]);

    const { pathname } = location;

    return (
        <Fragment>
            <MetaTags>
                <title>fitX | Shop Page</title>
                <meta name="description" content="Shop page of fitX Running Towards The Future." />
            </MetaTags>

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Shop</BreadcrumbsItem>

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb />

                <div className="shop-area pt-95 pb-100">
                    {/* shop topbar filter */}
                    {/* <ShopTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} products={products} getSortParams={getSortParams}/> */}

                    {/* shop page content default */}
                    <ShopProducts layout={layout} products={products} />
                    {
                        allowFurtherFetch ? <LoadContent onChange={bool => setLoadContent(bool)} style={{
                            height: "100px",
                            width: "200px",
                            margin: "auto"
                        }} /> : null
                    }
                    {
                        !allowFurtherFetch && !loadContent && !products.length ? 
                        <p style={{textAlign: 'center'}}>No Product found</p> : null 
                    }
                    {/* shop product pagination */}
                    <div className="pro-pagination-style text-center mt-30"></div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}

ShopGridFilter.propTypes = {
    location: PropTypes.object,
    products: PropTypes.array
}

const mapStateToProps = state => {
    return {
        products: state.productData.products
    }
}

export default connect(mapStateToProps)(ShopGridFilter);