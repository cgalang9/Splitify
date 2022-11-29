//Get current group members
const GET_GROUP_MEMBERS = 'groupsForGroupPage/GET_GROUP_MEMBERS'
const getGroupMembers = (members) => {
    return { type: GET_GROUP_MEMBERS, members }
}

export const getGroupMembersThunk = (group_id) => async (dispatch) => {
    const response = await fetch(`/api/groups/${group_id}/members`)

    if (response.ok) {
        const members = await response.json()
        await dispatch(getGroupMembers(members))
        return members
    }
}

//Clear members
const CLEAR_GROUP_MEMBERS = 'groupsForGroupPage/CLEAR_GROUP_MEMBERS'
export const clearGroupMembers = () => {
    return { type: CLEAR_GROUP_MEMBERS }
}



export const groupMembersForGroupPageReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_MEMBERS:
            return { ...action.members }
        case CLEAR_GROUP_MEMBERS:
            return null
        default:
            return state
    }
}
