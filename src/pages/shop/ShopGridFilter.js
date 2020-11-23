import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import Paginator from 'react-hooks-paginator';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
import { getSortedProducts } from '../../helpers/product';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopTopbarFilter from '../../wrappers/product/ShopTopbarFilter';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { firestore } from '../../firebase'
import LoadContent from "../../components/LoadContent";

const ShopGridFilter = ({ location, match }) => {

    const [loadContent, setLoadContent] = useState(true)
    const [lastDoc, setLastDoc] = useState()
    const [tagState, setTagState] = useState()
    const [allowFurtherFetch, setAllowFurtherFetch] = useState(true)

    let tag1, tag2
    const limit = 3
    if (location.state && location.state)
        tag1 = location.state
    if (match && match.params && match.params.tags)
        tag2 = match.params.tags

    const tag = tag1 ? tag1 : tag2 ? tag2 : undefined

    const [products, setProducts] = useState([])

    useEffect(() => {
        // console.log(allowFurtherFetch)
        if (loadContent && allowFurtherFetch) {
            let ref
            if (lastDoc)
                ref = firestore.collection('products').startAfter(lastDoc)
            else
                ref = firestore.collection('products')

            if (tag == "all")
                ref = ref.limit(3).get()
            else
                ref = ref.where(tag.slice(0,tag.indexOf(" ")), '==', tag.slice(tag.indexOf(" ")+1,).toLowerCase()).limit(limit).get()

            ref.then(docs => {
                if (docs.docs.length > 0) {
                    let productList = JSON.parse(JSON.stringify(products))
                    console.log(docs)
                    docs.forEach(doc => {
                        productList.push({ id: doc.id, ...doc.data() })
                    })
                    setLoadContent(false)
                    setProducts(productList)
                    setLastDoc(docs.docs[docs.docs.length - 1])
                    if(docs.docs.length < limit)
                        setAllowFurtherFetch(false)
                } else {
                    setAllowFurtherFetch(false)
                }
            })
        }
    }, [loadContent])

    useEffect(() => {
        if(tagState != tag)
        {
            setTagState(tag)
            setProducts([])
            setAllowFurtherFetch(true)
        }
    }, [tag])

    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);

    const pageLimit = 15;
    const { pathname } = location;

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

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
                    <ShopProducts layout={layout} products={currentData} />
                    <LoadContent onChange={bool => setLoadContent(bool)} />
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