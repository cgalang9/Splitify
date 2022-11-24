//Get current user groups
const GET_CURR_USER_GROUPS = 'groups/GET_CURR_USER_GROUPS'
const getCurrUserGroups = (groups) => {
    return { type: GET_CURR_USER_GROUPS, groups }
}

export const getCurrUserGroupsThunk = () => async (dispatch) => {
    const response = await fetch(`/api/groups/current-user`)

    if (response.ok) {
        const groups = await response.json()
        await dispatch(getCurrUserGroups(groups))
        return groups
    }
}


export const groupsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CURR_USER_GROUPS:
            return { ...action.groups }
        default:
            return state
    }
}
