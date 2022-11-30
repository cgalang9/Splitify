import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './AddExpenseForm.css'
import { getCurrUserGroupsThunk } from '../../store/groups'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { createExpenseThunk } from '../../store/expenses'
import { getGroupExpensesThunk } from '../../store/expenses';
import cat_icon_img from '../../assests/cat_icon_img.png'


function AddExpenseForm({ closeModal }) {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
    },[])

    const user_groups = useSelector((state) => state.groups)
    const members = useSelector((state) => state.currGroupMembers)
    const user = useSelector((state) => state.session)

    const [payerId, setPayerId] = useState(user.user.id)
    const [groupId, setGroupId] = useState()
    const [description, setDescription] = useState("")
    const [total, setTotal] = useState()
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [errors, setErrors] = useState()


    useEffect(async() => {
        if (groupId) {
            await dispatch(getCurrGroupMembersThunk(groupId))
        }
        //clear checkboxes adn reset payer when changing group
        setCheckedUsers([])
        const boxes = document.querySelectorAll('.cbox')
        boxes.forEach(box => {
            box.checked = false
        })
        setPayerId(user.user.id)
    },[groupId])

    useEffect(async() => {
        await dispatch(clearGroupMembers())
        // return async() => {
        //     await dispatch(clearGroupMembers())
        // }
    }, [])



    useEffect(() => {}, [errors])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        let total_per_person = parseFloat(total/(checkedUsers.length + 1)).toFixed(2)
        let splits = [{"user_id": user.user.id, "amount_owed": total_per_person}]
        checkedUsers.forEach(user => {
            splits.push({"user_id": user.id, "amount_owed": total_per_person})
        })


        let expense_obj = {
            "payer_id": Number(payerId),
            "group_id": Number(groupId),
            "description": description,
            "total": Number(total),
            "date": date,
            "splits": splits
        }

        try {
            const data = await dispatch(createExpenseThunk(expense_obj))
            if (data.error) {
                await setErrors(data.error);
            } else {
                await dispatch(clearGroupMembers())
                dispatch(getGroupExpensesThunk(groupId))
                history.push(`/groups/${groupId}`)
                closeModal()

            }
        } catch (error) {
            console.log(error)
        }

    }

    //update users to split expense with when clicking checkbox
    const [checkedUsers, setCheckedUsers] = useState([])
    const handleCheck = async (e) => {
        let newArr = [...checkedUsers]
        const value = JSON.parse(e.target.value)
        if(e.target.checked) {
            newArr.push(value)
            setCheckedUsers(newArr)
        } else {
            const idx = newArr.findIndex(object => {
                return object.id === value.id;
              });
            newArr.splice(idx, 1)
            setCheckedUsers(newArr)
        }
    }

    return (
        <div className='expense_form_wrapper flex_col'>
            <form className='expense_form flex_col' onSubmit={handleSubmit}>
                <div className='expense_form_head'>
                    <div className='expense_form_title'>Add an expense</div>
                    <div className='expense_form_x' onClick={closeModal}><i className="fa-solid fa-x"/></div>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div className='expense_form_users'>
                    <div htmlFor="split" className='expense_form_users_title'>With you and: </div>
                    <div className='expense_form_users_list'>
                        {members && user && members.members.map((member) => (
                            member.user_id !== user.user.id && (
                                <div htmlFor={member.user_id} key={member.user_id}>
                                    <input type="checkbox"
                                        name={member.user_id}
                                        className='cbox'
                                        value={`{"id": ${member.user_id}, "name": "${member.name}"}`}
                                        onChange={handleCheck}
                                        disabled={payerId == member.user_id}
                                    />
                                    <span>{member.name}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div className='expense_form_main_inputs'>
                    <img src={cat_icon_img} alt='category_icon' className='expense_form_cat_icon' />
                    <div className='expense_form_main_inputs_right flex_col'>
                        <input
                            type="text"
                            className='expense_form_input_decription'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            minLength={1}
                            maxLength={40}
                            placeholder='Enter a description'
                        />
                        <div className='expense_form_total_container'>
                            <span>$</span>
                            <input
                                type="number"
                                className='expense_form_input_total'
                                step="0.01"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                required
                                min={1.00}
                                placeholder={parseFloat(0.00).toFixed(2)}
                            />
                        </div>
                    </div>
                </div>
                <div className='expense_form_paid_by'>
                    <label htmlFor="payer">Paid by
                        <select
                            name="payer"
                            className='expense_form_input_payer'
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            required
                            defaultValue={user.user.id}
                        >
                            <option value={user.user.id}>you</option>
                            {checkedUsers.length > 0 && checkedUsers.map(user => (
                                <option value={user.id} key={user.id}>{user.name}</option>
                            ))}
                        </select>
                     and split equally​.
                    </label>
                </div>
                <div className='expense_form_split_preview'>
                    {`($${total ? (parseFloat((checkedUsers.length > 0 ? total/(checkedUsers.length + 1) : total)).toFixed(2)) : 0.00.toFixed(2)}/person)`}
                </div>
                <div className='expense_form_date_container'>
                    <input
                        type="date"
                        className='expense_form_input_date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className='expense_form_group_container'>
                    <select
                        name="group"
                        className='expense_form_input_group'
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        required
                        defaultValue=''
                    >
                        <option value="" disabled>Select Group</option>
                        {user_groups && user_groups.groups.map(group =>
                              <option value={group.id} key={group.id}>{group.name}</option>
                        )}
                    </select>
                </div>
                <div className='expense_form_btn_container'>
                    <button type="button" className='expense_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='expense_form_save'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default AddExpenseForm
