let initialState = {
}

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CATEGORIES":
            const stateCopy = JSON.parse(JSON.stringify(state))
            stateCopy.categories = action.categories
            return { ...stateCopy }
    }
    return state
}

export default generalReducer