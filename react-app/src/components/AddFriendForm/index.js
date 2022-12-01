import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './AddFriendForm.css'
import { getFriendsThunk, addFriendThunk  } from '../../store/currUserFriends'


function AddFriendForm({ closeModal }) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [users, setUsers] = useState([])
    const [userSelection, setUserSelection] = useState([])
    const [friendId, setFriendId] = useState()
    const [errors, setErrors] = useState()


    useEffect(() => {
        async function fetchData() {
          const response = await fetch('/api/users/');
          const responseData = await response.json();
          setUsers(responseData.users);
          await dispatch(getFriendsThunk())
        }
        fetchData();
    }, []);

    const friends = useSelector((state) => state.currUserFriends)
    const currUser = useSelector((state) => state.session)

    //remove users who are already friends from list
    useEffect(() => {
        let filtered_users = []
        users.forEach(user => {
            const isFriend = friends.currUserFriends.some(el => el.id === user.id);
            const isCurrUser = currUser.user.id === user.id
            if (!isFriend && !isCurrUser) filtered_users.push({ 'id': user.id, 'username': user.username });
        })
        setUserSelection(filtered_users)
    }, [friends]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        try {
            const data = await dispatch(addFriendThunk(friendId))
            if (data.error) {
                await setErrors(data.error);
            } else {
                history.push(`/dashboard`)
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {}, [errors])

    return (
        <div className='add_friend_form_wrapper'>
            <form className='add_friend_form' onSubmit={handleSubmit}>
                <div className='add_friend_form_head'>
                    <div className='add_friend_form_title'>Add a friend</div>
                    <div className='add_friend_form_x' onClick={closeModal}><i className="fa-solid fa-x"/></div>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div className='add_friend_form_input_container'>
                    <select
                            name="friend"
                            value={friendId}
                            className='add_friend_form_friend_input'
                            onChange={(e) => setFriendId(e.target.value)}
                            required
                            defaultValue=''
                        >
                            <option value="" disabled>Select user</option>
                            {userSelection && userSelection.map((user) => (
                                <option value={user.id} key={user.id}>{user.username}</option>
                            ))}
                    </select>
                </div>
                <div className='add_friend_form_btn_container'>
                    <button type="button" className='add_friend_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='add_friend_form_save'>Add friend</button>
                </div>
            </form>
        </div>
    )
}

export default AddFriendForm
