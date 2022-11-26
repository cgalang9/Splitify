import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './AddPaymentForm.css'
import { getCurrUserGroupsThunk } from '../../store/groups'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { createPaymentsThunk } from '../../store/payments'


function AddPaymentForm() {
    const dispatch = useDispatch()
    const history = useHistory()

    //get list of groups user is in
    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
    },[])


    const user_groups = useSelector((state) => state.groups)
    const members = useSelector((state) => state.currGroupMembers)
    const user = useSelector((state) => state.session)

    const [payerId, setPayerId] = useState()
    const [payeeId, setPayeeId] = useState(user.user.id)
    const [groupId, setGroupId] = useState()
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState("")
    const [errors, setErrors] = useState()

    //sets a default group when form opened
    useEffect(() => {
        if (user_groups) {
            setGroupId(user_groups.groups[0].id)
        }
    },[user_groups])

    //gets members of new group when group selection changes
    useEffect(async() => {
        if (groupId) {
            await dispatch(getCurrGroupMembersThunk(groupId))
        }
    },[groupId])

    //sets default payer and payee  when group selection changes
    useEffect(() => {
        if (members) {
            setPayerId(members.members[0].user_id === user.user.id ? members.members[1].user_id : members.members[0].user_id)
        }
        setPayeeId(user.user.id)
    },[members])


    // useEffect(() => {
    //     return async() => {
    //         await dispatch(clearGroupMembers())
    //     }
    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        // validation: user can not pay themself
        if (Number(payeeId) === Number(payerId)) {
            setErrors(['Payer and payee must be different users'])
            return
        }

        const payment_obj = {
            "payer_id": Number(payerId),
            "payee_id": Number(payeeId),
            "group_id": Number(groupId),
            "total": Number(total),
            "date": date
        }


        try {
            const data = await dispatch(createPaymentsThunk(payment_obj))
            if (data.error) {
                await setErrors(data.error);
            } else {
                await dispatch(clearGroupMembers())
                history.push(`/groups/${groupId}`)
            }
        } catch (error) {
            console.log(error)
        }



    }


    useEffect(() => {}, [errors])

    return (
        <div id='add_expense_form_wrapper'>
            <form id='add_expense_form' onSubmit={handleSubmit}>
                <div>
                    <h1>Settle up</h1>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div>
                    <select
                            name="payer"
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            required
                            defaultValue=''
                        >
                            <option value="" disabled>Select Payer</option>
                            {members && user && members.members.map((member) => (
                                <option value={member.user_id} key={member.user_id}>{member.name === user.user.username ? 'you' : member.name}</option>
                            ))}
                    </select>
                    paid
                    <select
                            name="payee"
                            value={payeeId}
                            onChange={(e) => setPayeeId(e.target.value)}
                            required
                            defaultValue=''
                        >
                            <option value="" disabled>Select Payee</option>
                            {members && user && members.members.map((member) => (
                                <option value={member.user_id} key={member.user_id}>{member.name === user.user.username ? 'you' : member.name}</option>
                            ))}
                    </select>
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

export default AddPaymentForm
