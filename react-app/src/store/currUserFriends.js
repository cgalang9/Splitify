//Get current user friends
const GET_FRIENDS = 'currUserFriends/GET_FRIENDS'
const getFriends = (friends) => {
    return { type: GET_FRIENDS, friends }
}

export const getFriendsThunk = () => async (dispatch) => {
    const response = await fetch(`/api/friends/current-user`)

    if (response.ok) {
        const friends = await response.json()
        await dispatch(getFriends(friends))
        return friends
    }
}


export const currUserFriendsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_FRIENDS:
            return { ...action.friends }
        default:
            return state
    }
}
