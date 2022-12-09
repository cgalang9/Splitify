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
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return  {'error': 'An error occurred. Please try again.' }
    }
}

//Add a friends (for current user)
const ADD_FRIEND = 'currUserFriends/ADD_FRIEND'
const addFriend = (friend) => {
    return { type: ADD_FRIEND, friend }
}

export const addFriendThunk = (friend_id) => async (dispatch) => {
    const response = await fetch(`/api/friends`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "friend_id": friend_id
        })
    })

    if (response.ok) {
        const friend = await response.json()
        await dispatch(addFriend(friend))
        return friend
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return  {'error': 'An error occurred. Please try again.' }
    }
}

//Add a friends (for current user)
const DELETE_FRIEND = 'currUserFriends/DELETE_FRIEND'
const deleteFriend = (friend_id) => {
    return { type: DELETE_FRIEND, friend_id }
}

export const deleteFriendThunk = (friend_id) => async (dispatch) => {
    const response = await fetch(`/api/friends`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "friend_id": friend_id
        })
    })

    if (response.ok) {
        const message = await response.json()
        await dispatch(deleteFriend(friend_id))
        return message
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return  {'error': 'An error occurred. Please try again.' }
    }
}


export const currUserFriendsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_FRIENDS:
            return { ...action.friends }
        case ADD_FRIEND:
            let addFriendState = {...state}
            if (addFriendState) {
                const new_friends = [action.friend, ...addFriendState.currUserFriends]
                addFriendState.currUserFriends = new_friends
                return addFriendState
            } else {
                return {"currUserFriends": [{...action.friend}]}
            }
        case DELETE_FRIEND:
            let deleteFriendState = {...state}
            const deleted = deleteFriendState.currUserFriends.filter(friend => friend.id !== action.friend_id)
            deleteFriendState.currUserFriends = deleted
            return deleteFriendState
        default:
            return state
    }
}
