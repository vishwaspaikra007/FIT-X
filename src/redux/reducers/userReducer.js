let initialState = {
}

const userReducer = (state = initialState, action) => {
    if(action.type == "USER")
    {
        const stateCopy = JSON.parse(JSON.stringify(state))
        stateCopy.user = action.user
        return {...stateCopy}
    }
    return state
}

export default userReducer