import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './EditPaymentForm.css'
import { getCurrGroupMembersThunk, clearGroupMembers } from '../../store/currentGroupMembers'
import { getCurrPaymentThunk } from '../../store/currentPayment'
import { editPaymentThunk } from '../../store/payments'
import { getCurrUserPaymentsThunk } from '../../store/payments';


function EditPaymentForm({ paymentId }) {
    const dispatch = useDispatch()
    const history = useHistory()
    // const { paymentId } = useParams()

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
            setTotal(payment.total)
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
                dispatch(getCurrUserPaymentsThunk())
                history.push(`/groups/${groupId}`)
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
                    <h1>Edit payment</h1>
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
                    {payment && <div>Group: {payment.group.name}</div>}
                </div>
                <button type='submit'>Save</button>
            </form>
            {/* <button className='cancel-btn' onClick={() => history.push(`/items/${itemId}`)}>Cancel</button> */}
        </div>
    )
}

export default EditPaymentForm
