import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../AddExpenseForm/AddExpenseForm.css'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { getCurrExpenseThunk } from '../../store/currentExpense'
import { editExpenseThunk } from '../../store/expenses'
import { getGroupExpensesThunk } from '../../store/expenses';


function EditExpenseForm({ closeModal, expenseId }) {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        try {
            const data = await dispatch(getCurrExpenseThunk(expenseId))
            if (data.error) {
                await dispatch(clearGroupMembers())
                history.push('/dashboard')
            }
        } catch (error) {
            console.log(error)
        }
    },[])

    const members = useSelector((state) => state.currGroupMembers)
    const user = useSelector((state) => state.session)
    const expense = useSelector((state) => state.currExpense)

    const [payerId, setPayerId] = useState()
    const [groupId, setGroupId] = useState()
    const [description, setDescription] = useState("")
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState("")
    const [errors, setErrors] = useState()
    const [checkedUsers, setCheckedUsers] = useState([])

    //display current expense details on form
    useEffect(async() => {
        if(expense) {
            setGroupId(expense.group.id)
            setDescription(expense.description)
            setTotal(parseFloat(expense.total).toFixed(2))
            setDate(new Date(expense.date_paid).toISOString().split('T')[0])
            let checkedUsersArr = []
            if (expense.payer.id !== user.user.id) {
                checkedUsersArr.push({"id": expense.payer.id, "name": expense.payer.username})
            }
            expense.money_owed.forEach(owed => {
                if(Number(owed.user_id) !== user.user.id) {
                    checkedUsersArr.push({"id": owed.user_id, "name": owed.username})
                }
            })
            setCheckedUsers(checkedUsersArr)
            setPayerId(expense.payer.id)
        }
    },[expense])


    useEffect(async() => {
        if (groupId) {
            await dispatch(getCurrGroupMembersThunk(groupId))
        }
    },[groupId])


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
            "description": description,
            "total": Number(total),
            "date": date,
            "splits": splits
        }

        try {
            const data = await dispatch(editExpenseThunk(expenseId, expense_obj))
            if (data.error) {
                await setErrors(data.error);
            } else {
                await dispatch(clearGroupMembers())
                dispatch(getGroupExpensesThunk(groupId))
                history.push(`/groups/${groupId}`)
            }
        } catch (error) {
            console.log(error)
        }

    }

    //update users to split expense with when clicking checkbox
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

    //checks checkboxes of user by default if they paid or if they owe payer
    const isChecked = (id) => {
        if (id == payerId) {
            return true
        }
        for (let i = 0; i < checkedUsers.length; i++) {
            const user_id = checkedUsers[i].id;
            if (user_id == id) {
                return true
            }
        }
        return false
    }


    return (
        <div className='expense_form_wrapper flex_col'>
            <form className='expense_form flex_col' onSubmit={handleSubmit}>
                <div className='expense_form_head'>
                    <div className='expense_form_title'>Edit expense</div>
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
                                <label htmlFor={member.user_id} key={member.user_id}>
                                    <input type="checkbox"
                                        name={member.user_id}
                                        className='cbox'
                                        value={`{"id": ${member.user_id}, "name": "${member.name}"}`}
                                        onChange={handleCheck}
                                        disabled={payerId == member.user_id}
                                        checked={isChecked(member.user_id)}
                                    />
                                    <span>{member.name}</span>
                                </label>
                            )
                        ))}
                    </div>
                </div>
                <div className='expense_form_main_inputs'>
                    <img src='https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png' alt='category_icon' className='expense_form_cat_icon' />
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
                                placeholder={0.00}
                            />
                        </div>
                    </div>
                </div>
                <div className='expense_form_paid_by'>
                <label htmlFor="payer">Paid by
                        {payerId && (
                            <select
                                name="payer"
                                className='expense_form_input_payer'
                                value={payerId}
                                onChange={(e) => setPayerId(e.target.value)}
                                required
                                defaultValue=''
                            >
                                <option value="" disabled>Select payer</option>
                                <option value={user.user.id}>you</option>
                                {checkedUsers.length > 0 && checkedUsers.map(user => (
                                    <option value={user.id} key={user.id}>{user.name}</option>
                                ))}
                            </select>
                        )}
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
                <div className='edit_expense_form_group_container'>
                    {expense && <div style={{ fontSize: 14, textAlign: 'center' }}>Group: {expense.group.name}</div>}
                </div>
                <div className='expense_form_btn_container'>
                    <button type="button" className='expense_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='expense_form_save'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default EditExpenseForm
