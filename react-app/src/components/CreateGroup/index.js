import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './CreateGroup.css'
import { getFriendsThunk } from '../../store/currUserFriends'
import { createGroupThunk } from '../../store/groups'


function CreateGroup({ closeModal }) {
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
        <div id='create_group_form_wrapper'>
            <form id='create_group_form flex_col' onSubmit={handleSubmit}>
                <div className='create_group_form_head'>
                    <div className='create_group_form_title'>Create group</div>
                    <div className='create_group_form_x' onClick={closeModal}><i className="fa-solid fa-x"/></div>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div className='create_group_form_container_name'>
                    <input
                        type="text"
                        className='create_group_form_input_name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={1}
                        maxLength={20}
                        placeholder='Enter group name'
                    />
                </div>
                <div className='create_group_form_container_members flex_col'>
                    <div className='create_group_form_members_head'>Add friends to group: </div>
                    <div className='create_group_form_member_li'>
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
                </div>
                <div className='expense_form_btn_container'>
                    <button type="button" className='expense_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='expense_form_save'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default CreateGroup
