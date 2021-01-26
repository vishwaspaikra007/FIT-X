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
import FilterProduct from "../../components/product/FilterProduct";
import ShowTags from '../../components/product/ShowTags'

const ShopGridFilter = ({ location, match }) => {

    const [loadContent, setLoadContent] = useState(true)
    const [lastDoc, setLastDoc] = useState()
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)
    const [orderBy, setOrderBy] = useState("popularity")

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
        let ref = firestore.collection('products') 

        switch(orderBy) {
            case 'alphabetically': ref = ref.orderBy('productName'); break;
            case 'price low to high': ref = ref.orderBy('price'); break;
            case 'price high to low': ref = ref.orderBy('price', 'desc'); break;
            case 'percentage discount': ref = ref.orderBy('discount', 'desc'); break;
            case 'popularity': ref = ref.orderBy('sales', 'desc'); break;
        }

        if (lastDoc)
            ref = ref.startAfter(lastDoc)

        if (tag == "all")
            ref = ref.limit(limit).get()
        else
        {
            if((tag).split(" ")[0] === "category") {
                ref = ref.where('tags', "array-contains-any", [tag.slice(tag.indexOf(" ")+1,)] ).limit(limit).get()
            } else if((tag).split(" ")[0] === "subCategory") {
                ref = ref.where('tags', "array-contains-any", [tag.slice(tag.indexOf(" ")+1,)] ).limit(limit).get()
            } else
                ref = ref.where('tags', "array-contains-any", (tag).split(" ")).limit(limit).get()
        }

        ref.then(docs => {
            console.log(docs)
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
        }).catch(err => {
            console.log(err)
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

    const onSort = (e) => {
        console.log(e.target.value)
        setOrderBy(e.target.value)
        setProducts([])
        setLastDoc(undefined)
        setAllowFurtherFetch(true)
        setLoadContent(true)
    }

    const onFilter = () => {

    }

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
                    <ShowTags search={tag}/>
                    {/* shop topbar filter */}
                    {/* <ShopTopbarFilter getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} products={products} getSortParams={getSortParams}/> */}
                    <FilterProduct onFilter={onFilter} onSort={onSort}/>
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