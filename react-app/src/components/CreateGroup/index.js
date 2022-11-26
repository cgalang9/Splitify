import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './CreateGroup.css'
import { getFriendsThunk } from '../../store/currUserFriends'
import { createGroupThunk } from '../../store/groups'


function CreateGroup() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [name, setName] = useState([])
    const [errors, setErrors] = useState()


    useEffect(async () => {
        await dispatch(getFriendsThunk())
    }, []);

    const friends = useSelector((state) => state.currUserFriends)
    const user = useSelector((state) => state.session)

    const [checkedUsers, setCheckedUsers] = useState([Number(user.user.id)])
    const handleCheck = async (e) => {
        let newArr = [...checkedUsers]
        if(e.target.checked) {
            newArr.push(Number(e.target.value))
            setCheckedUsers(newArr)
        } else {
            const idx = newArr.indexOf(Number(e.target.value))
            newArr.splice(idx, 1)
            setCheckedUsers(newArr)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        const group_obj = {
            "name": name,
            "member_ids": checkedUsers
        }

        try {
            const data = await dispatch(createGroupThunk(group_obj))
            if (data.error) {
                await setErrors(data.error);
            } else {
                history.push(`/dashboard`)
            }
        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {}, [errors])

    return (
        <div id='edit_payment_form_wrapper'>
            <form id='edit_payment_form' onSubmit={handleSubmit}>
                <div>
                    <h1>Create group</h1>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div>
                    <label>Group Name </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={1}
                        maxLength={20}
                    />
                </div>
                <div>
                    <label htmlFor="users">Add friends to group: </label>
                        {friends && friends.currUserFriends.map((friend) => (
                            <label htmlFor={friend.id} key={friend.id}>
                                <input type="checkbox"
                                    name={friend.id}
                                    value={friend.id}
                                    onChange={handleCheck}
                                />
                                <span>{friend.username}</span>
                            </label>
                        ))}
                </div>
                <button type='submit'>Save</button>
            </form>
            {/* <button className='cancel-btn' onClick={() => history.push(`/items/${itemId}`)}>Cancel</button> */}
        </div>
    )
}

export default CreateGroup
