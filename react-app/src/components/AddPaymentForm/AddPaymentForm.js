import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './AddPaymentForm.css'
import { getCurrUserGroupsThunk } from '../../store/groups'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { createPaymentsThunk } from '../../store/payments'
import { getGroupPaymentsThunk } from '../../store/payments';


function AddPaymentForm({ closeModal }) {
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
    const [total, setTotal] = useState()
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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
                dispatch(getGroupPaymentsThunk(groupId))
                history.push(`/groups/${groupId}`)
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }



    }


    useEffect(() => {}, [errors])

    return (
        <div className='payment_form_wrapper'>
            <form className='payment_form flex_col' onSubmit={handleSubmit}>
                <div className='payment_form_head'>
                    <div className='payment_form_title'>Settle up</div>
                    <div className='payment_form_x' onClick={closeModal}><i className="fa-solid fa-x"/></div>
                </div>
                <div className='errors'>
                    {errors && (
                        <div className='errors'>{errors}</div>
                    )}
                </div>
                <div className='payment_form_icon_container'>
                    <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_payment_form' />
                    <i className="fa-solid fa-arrow-right" />
                    <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_payment_form' />
                </div>
                <div className='payment_form_paid_by'>
                    <select
                            name="payer"
                            value={payerId}
                            className='payment_form_input_payer'
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
                            className='payment_form_input_payee'
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
                <div className='payment_form_total_container'>
                    <span>$</span>
                    <input
                        type="number"
                        className='payment_form_input_total'
                        step="0.01"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        required
                        min={0.01}
                        placeholder={parseFloat(0.00).toFixed(2)}
                    />
                </div>
                <div className='payment_form_date_container'>
                    <input
                        type="date"
                        className='payment_form_input_date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className='payment_form_group_container'>
                    <select
                        name="group"
                        className='payment_form_input_group'
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
                <div className='payment_form_btn_container'>
                    <button type="button" className='payment_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='payment_form_save'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default AddPaymentForm
