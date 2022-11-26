//Get payments by group
const GET_GROUP_PAYMENTS = 'payments/GET_GROUP_PAYMENTS'
const getGroupPayments = (payments) => {
    return { type: GET_GROUP_PAYMENTS, payments }
}

export const getGroupPaymentsThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/payments`)

    if (response.ok) {
        const payments = await response.json()
        await dispatch(getGroupPayments(payments))
        return payments
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}

//Create a payment
const CREATE_PAYMENT = 'payments/CREATE_PAYMENT'
const createPayments = (payment) => {
    return { type: CREATE_PAYMENT, payment }
}

export const createPaymentsThunk = (payment) => async (dispatch) => {
    const { payer_id, payee_id, group_id, total, date } = payment
    const response = await fetch(`/api/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payer_id,
            payee_id,
            group_id,
            total,
            date
        })
    })

    if (response.ok) {
        const payments = await response.json()
        await dispatch(createPayments(payments))
        return payments
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }

}


//Edit payment
const EDIT_PAYMENT = 'payments/EDIT_PAYMENT'
const editPayment = (payment) => {
    return { type: EDIT_PAYMENT, payment }
}

export const editPaymentThunk = (payment_id, payment) => async (dispatch) => {
    const { payer_id, payee_id, group_id, total, date } = payment
    const response = await fetch(`/api/payments/${payment_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payer_id,
            payee_id,
            group_id,
            total,
            date
        })
    })

    if (response.ok) {
        const payment = await response.json()
        await dispatch(editPayment(payment))
        return payment
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


//Delete a payment
const DELETE_PAYMENT = 'payments/DELETE_PAYMENT'
const deletePayment = (payment_id) => {
    return { type: DELETE_PAYMENT, payment_id }
}

export const deletePaymentThunk = (payment_id) => async (dispatch) => {
    const response = await fetch(`/api/payments/${payment_id}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const message = await response.json()
        await dispatch(deletePayment(payment_id))
        return message
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


export const paymentsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_PAYMENTS:
            return { ...action.payments }
        case CREATE_PAYMENT:
            return null
        case EDIT_PAYMENT:
            return null
        case DELETE_PAYMENT:
            const stateDeletePayment = { ...state }
            if (stateDeletePayment) {
                const filtered = stateDeletePayment.payments.filter(payment => Number(payment.id) !== Number(action.payment_id))
                stateDeletePayment.payments = filtered
               return stateDeletePayment
            } else {
                return null
            }
        default:
            return state
    }
}
