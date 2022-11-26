//Get current group members
const GET_CURR_GROUP_MEMBERS = 'groups/GET_CURR_GROUP_MEMBERS'
const getCurrGroupMembers = (members) => {
    return { type: GET_CURR_GROUP_MEMBERS, members }
}

export const getCurrGroupMembersThunk = (group_id) => async (dispatch) => {
    const response = await fetch(`/api/groups/${group_id}/members`)

    if (response.ok) {
        const members = await response.json()
        await dispatch(getCurrGroupMembers(members))
        return members
    }
}

//Clear members
const CLEAR_GROUP_MEMBERS = 'groups/CLEAR_GROUP_MEMBERS'
export const clearGroupMembers = () => {
    return { type: CLEAR_GROUP_MEMBERS }
}



export const currGroupMembersReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CURR_GROUP_MEMBERS:
            return { ...action.members }
        case CLEAR_GROUP_MEMBERS:
            return null
        default:
            return state
    }
}
