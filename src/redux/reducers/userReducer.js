let initialState = {
    user: "1234567"
}

const userReducer = (state = initialState, action) => {
    // switch(action.type)
    // {
    //     case "USER":
    //         console.log("action", action)
    //         const stateCopy = JSON.parse(JSON.stringify(state))
    //         stateCopy.user = action.user
    //         return {
    //             ...stateCopy
    //         }; break;

    //     default: return state
    // }
    if(action.type == "USER")
    {
        console.log("action", action)
        const stateCopy = JSON.parse(JSON.stringify(state))
        stateCopy.user = action.user
        return {...stateCopy}
    }
    return state
}

export default userReducer