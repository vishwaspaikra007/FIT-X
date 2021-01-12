let initialState = {
    categories: {},
    sellerInfo: undefined,
    requesting: false,
    termsAndConditions: {}
}

const generalReducer = (state = initialState, action) => {
    const stateCopy = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case "CATEGORIES":
            stateCopy.categories = action.categories
            return { ...stateCopy }

        case "SELLER_INFO":
            stateCopy.sellerInfo = action.sellerInfo
            return { ...stateCopy }

        case "USER_INFO":
            stateCopy.userInfo = action.userInfo
            return { ...stateCopy }

        case "REQUESTING":
            stateCopy.requesting = action.requesting
            return { ...stateCopy }

        case "COUPONS":
            stateCopy.coupons = action.coupons
            return { ...stateCopy }

        case "CHARGES":
            stateCopy.charges = action.charges
            return { ...stateCopy }

        case "TERMS-AND-CONDITIONS":
            stateCopy.termsAndConditions[action.vendorId] = action.termsAndConditions
            return { ...stateCopy }

    }
    return state
}

export default generalReducer