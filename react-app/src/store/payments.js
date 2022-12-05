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

//Get all payments of current user
const GET_CURR_USER_PAYMENTS = 'payments/GET_CURR_USER_PAYMENTS'
const getCurrUserPayments = (payments) => {
    return { type: GET_CURR_USER_PAYMENTS, payments }
}

export const getCurrUserPaymentsThunk = () => async (dispatch) => {
    const response = await fetch(`/api/payments/current-user`)

    if (response.ok) {
        const payments = await response.json()
        await dispatch(getCurrUserPayments(payments))
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

//Post a comment on payment
const ADD_COMMENT_PAYMENT = 'payments/ADD_COMMENT_PAYMENT'
const addCommentPayment = (payment_id, comments) => {
    return { type: ADD_COMMENT_PAYMENT, payment_id, comments }
}

export const addCommentPaymentThunk = (payment_id, comment) => async (dispatch) => {
    const { text } = comment
    const response = await fetch(`/api/payments/${payment_id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })

    if (response.ok) {
        const comments = await response.json()
        console.log(comments)
        await dispatch(addCommentPayment(payment_id, comments))
        return comments
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}

//Delete an payment
const DELETE_COMMENT_PAYMENT = 'payments/DELETE_COMMENT_PAYMENT'
const deleteCommentPayment = (comments, payment_id) => {
    return { type: DELETE_COMMENT_PAYMENT, comments, payment_id }
}

export const deleteCommentPaymentThunk = (comment_id, payment_id) => async (dispatch) => {
    const response = await fetch(`/api/payments/comments/${comment_id}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const comments = await response.json()
        await dispatch(deleteCommentPayment(comments, payment_id))
        return comments
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


//Edit a comment on payment
const EDIT_COMMENT_PAYMENT = 'payments/EDIT_COMMENT_PAYMENT'
const editCommentPayment = (payment_id, comments) => {
    return { type: EDIT_COMMENT_PAYMENT, payment_id, comments }
}

export const editCommentPaymentThunk = (payment_id, comment_id, comment) => async (dispatch) => {
    const { text } = comment
    const response = await fetch(`/api/payments/comments/${comment_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })

    if (response.ok) {
        const comment = await response.json()
        await dispatch(editCommentPayment(payment_id, comment))
        return comment
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
        case GET_CURR_USER_PAYMENTS:
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
        case ADD_COMMENT_PAYMENT:
            const addCommentPaymentState = { ...state }
            const idx = addCommentPaymentState.payments.findIndex(obj => {
                return obj.id == action.payment_id
            })
            const new_payment = {...addCommentPaymentState.payments[idx]}
            new_payment['comments'] = action.comments.newComments
            addCommentPaymentState.payments[idx] = new_payment
            return addCommentPaymentState
        case DELETE_COMMENT_PAYMENT:
            const delteCommentPaymentState = { ...state }
            const idx_del = delteCommentPaymentState.payments.findIndex(obj => {
                return obj.id == action.payment_id
            })
            const new_payment_del = {...delteCommentPaymentState.payments[idx_del]}
            new_payment_del['comments'] = action.comments.newComments
            delteCommentPaymentState.payments[idx_del] = new_payment_del
            return delteCommentPaymentState
        case EDIT_COMMENT_PAYMENT:
            const editCommentPaymentState = { ...state }
            const idx_edit = editCommentPaymentState.payments.findIndex(obj => {
                return obj.id == action.payment_id
            })
            const edited_expense = {...editCommentPaymentState.payments[idx_edit]}
            edited_expense['comments'] = action.comments.newComments
            editCommentPaymentState.payments[idx_edit] = edited_expense
            return editCommentPaymentState
        default:
            return state
    }
}
