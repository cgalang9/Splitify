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

//Get current user groups
const CREATE_GROUP = 'groups/CREATE_GROUP'
const createGroup = (group) => {
    return { type: CREATE_GROUP, group }
}

export const createGroupThunk = (group) => async (dispatch) => {
    const { name, member_ids } = group
    const response = await fetch(`/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            member_ids
        })
    })

    if (response.ok) {
        const group = await response.json()
        await dispatch(createGroup(group))
        return group
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


export const groupsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CURR_USER_GROUPS:
            return { ...action.groups }
        case CREATE_GROUP:
            if (state) {
                let addGroupState = {...state}
                const new_groups = [action.group, ...addGroupState.groups]
                addGroupState.groups = new_groups
                return addGroupState
            } else {
                return {"groups": [{...action.group}]}
            }
        default:
            return state
    }
}
