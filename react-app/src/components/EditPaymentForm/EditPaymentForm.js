import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../AddPaymentForm/AddPaymentForm.css'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { getCurrPaymentThunk } from '../../store/currentPayment'
import { editPaymentThunk } from '../../store/payments'
import { getGroupPaymentsThunk } from '../../store/payments';


function EditPaymentForm({ closeModal, paymentId }) {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        try {
            const data = await dispatch(getCurrPaymentThunk(paymentId))
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
    const payment = useSelector((state) => state.currPayment)

    const [payerId, setPayerId] = useState()
    const [payeeId, setPayeeId] = useState()
    const [groupId, setGroupId] = useState()
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState("")
    const [errors, setErrors] = useState()

    //display current payment details on form when opened
    useEffect(async() => {
        if(payment) {
            setGroupId(payment.group.id)
            setPayerId(payment.payer.id)
            setPayeeId(payment.payee.id)
            setTotal(parseFloat(payment.total).toFixed(2))
            setDate(new Date(payment.date_paid).toISOString().split('T')[0])
        }
    },[payment])

    useEffect(async() => {
        if (groupId) {
            await dispatch(getCurrGroupMembersThunk(groupId))
        }
    },[groupId])


    useEffect(() => {
        return async() => {
            await dispatch(clearGroupMembers())
        }
    }, [])

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
            const data = await dispatch(editPaymentThunk(paymentId, payment_obj))
            if (data.error) {
                await setErrors(data.error);
            } else {
                await dispatch(clearGroupMembers())
                dispatch(getGroupPaymentsThunk(groupId))
                history.push(`/groups/${groupId}`)
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
                    <div className='payment_form_title'>Edit payment</div>
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
                <div className='edit_payment_form_group_container'>
                    {payment && <div style={{ fontSize: 14, textAlign: 'center' }}>Group: {payment.group.name}</div>}
                </div>
                <div className='payment_form_btn_container'>
                    <button type="button" className='payment_form_cancel' onClick={closeModal}>Cancel</button>
                    <button type='submit' className='payment_form_save'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default EditPaymentForm
