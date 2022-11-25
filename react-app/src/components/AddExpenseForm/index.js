import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './AddExpenseForm.css'
import { getCurrUserGroupsThunk } from '../../store/groups'
import { getCurrGroupMembersThunk } from '../../store/currentGroupMembers'


function AddExpenseForm() {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
    },[])

    const user_groups = useSelector((state) => state.groups)
    const members = useSelector((state) => state.currGroupMembers)
    const user = useSelector((state) => state.session)


    const [payerId, setPayerId] = useState()
    const [groupId, setGroupId] = useState()
    const [description, setDescription] = useState("")
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState("")
    const [split, setSplit] = useState(0)
    const [errors, setErrors] = useState([])


    useEffect(async() => {
        if (groupId) {
            await dispatch(getCurrGroupMembersThunk(groupId))
        }
    },[groupId])


    useEffect(() => {}, [errors])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(groupId)

        setErrors([]);

        // try {
        //     const data = await dispatch(addItemReviewThunk(itemId, review))
        //     console.log(data)
        //     if (data.errors) {
        //         await setErrors(data.errors);
        //     } else {
        //         history.push(`/items/${itemId}`)
        //     }
        // } catch (res) {
        //     history.push('/404')
        // }
    }

    const [checked, setChecked] = useState(new Set())
    const handleCheck = async (e) => {
        let newSet = new Set(checked)
        if(e.target.checked) {
            newSet.add(e.target.value)
            setChecked(newSet)
        } else {
            newSet.delete(e.target.value)
            setChecked(newSet)
        }
    }

    return (
        <div id='add_expense_form_wrapper'>
            <form id='add_expense_form' onSubmit={handleSubmit}>
                <div>
                    <h1>Add An Expense</h1>
                </div>
                <div className='errors'>
                    {errors.errors && (errors.errors.map((error, ind) => (
                    <div key={ind}>{error}</div>
                    )))}
                </div>
                <div>
                    <label htmlFor="split">With you and: </label>
                        {members && user && members.members.map(member => (
                            member.user_id !== user.user.id && (
                                <label htmlFor={member.user_id} key={member.user_id}>
                                    <input type="checkbox"
                                        id={member.user_id}
                                        name={member.user_id}
                                        value={member.user_id}
                                        onChange={handleCheck}
                                        // checked={member.user_id === Number(payerId)}
                                        // disabled={member.user_id === Number(payerId)}
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
                        min={0.01}
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
                        <select
                            name="payer"
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            required
                            defaultValue=''
                        >
                            <option value="" disabled>Select Payer</option>
                            {members && user && members.members.map(member => (
                                  <option value={member.user_id} key={member.user_id}>{member.user_id === user.user.id ? "you" : member.name}</option>
                            ))}
                        </select>
                     and split equally​.
                    </label>
                </div>
                <div>
                    {`($${total ? (parseFloat((checked.size > 0 ? total/(checked.size + 1) : total)).toFixed(2)) : 0.00.toFixed(2)}/person)`}
                </div>
                <div>
                    <label htmlFor="group">Group</label>
                    <select
                        name="group"
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
                <button type='submit'>Save</button>
            </form>
            {/* <button className='cancel-btn' onClick={() => history.push(`/items/${itemId}`)}>Cancel</button> */}
        </div>
    )
}
// let optionTemplate = surveyData.map(surveyData => (
    //     <option value={surveyData.option} key={surveyData.surveyQuestion}>{surveyData.option.values}</option>
    //   ));
export default AddExpenseForm
