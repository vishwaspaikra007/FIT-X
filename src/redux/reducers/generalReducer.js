let initialState = {
    categories: {},
    sellerInfo: undefined
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
    }
    return state
}

export default generalReducer