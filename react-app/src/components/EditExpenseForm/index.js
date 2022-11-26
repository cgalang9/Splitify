import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import './EditExpenseForm.css'
import { getCurrUserGroupsThunk } from '../../store/groups'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { createExpenseThunk } from '../../store/expenses'
import { getCurrExpenseThunk } from '../../store/currentExpense'



function EditExpenseForm() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { expenseId } = useParams()

    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
        await dispatch(getCurrExpenseThunk(expenseId))
    },[])

    const user_groups = useSelector((state) => state.groups)
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
            setTotal(expense.total)
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

        // let total_per_person = parseFloat(total/(checkedUsers.length + 1)).toFixed(2)
        // let splits = [{"user_id": user.user.id, "amount_owed": total_per_person}]
        // checkedUsers.forEach(user => {
        //     splits.push({"user_id": user.id, "amount_owed": total_per_person})
        // })


        // let expense_obj = {
        //     "payer_id": Number(payerId),
        //     "group_id": Number(groupId),
        //     "description": description,
        //     "total": Number(total),
        //     "date": date,
        //     "splits": splits
        // }

        // try {
        //     const data = await dispatch(createExpenseThunk(expense_obj))
        //     if (data.error) {
        //         await setErrors(data.error);
        //     } else {
        //         await dispatch(clearGroupMembers())
        //         history.push('/dashboard')
        //     }
        // } catch (error) {
        //     console.log(error)
        // }

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
        <div id='edit_expense_form_wrapper'>
            <form id='edit_expense_form' onSubmit={handleSubmit}>
                <div>
                    <h1>Edit expense</h1>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="split">With you and: </label>
                        {members && user && members.members.map((member) => (
                            member.user_id !== user.user.id && (
                                <label htmlFor={member.user_id} key={member.user_id}>
                                    <input type="checkbox"
                                        id={member.user_id}
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
                <div>
                    <label>Description </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        minLength={1}
                        maxLength={40}
                    />
                </div>
                <div>
                    <label>Total </label>
                    <input
                        type="number"
                        step="0.01"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        required
                        min={1}
                    />
                </div>
                <div>
                    <label>Date </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="payer">Paid by
                        {payerId && (
                            <select
                                name="payer"
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
                <div>
                    {`($${total ? (parseFloat((checkedUsers.length > 0 ? total/(checkedUsers.length + 1) : total)).toFixed(2)) : 0.00.toFixed(2)}/person)`}
                </div>
                <div>
                    {expense && <div>Group: {expense.group.name}</div>}
                </div>
                <button type='submit'>Save</button>
            </form>
            {/* <button className='cancel-btn' onClick={() => history.push(`/items/${itemId}`)}>Cancel</button> */}
        </div>
    )
}

export default EditExpenseForm
