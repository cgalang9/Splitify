//Get current payment details
const GET_CURR_PAYMENT = 'groups/GET_CURR_PAYMENT'
const getCurrPayment = (payment) => {
    return { type: GET_CURR_PAYMENT, payment }
}

export const getCurrPaymentThunk = (payment_id) => async (dispatch) => {
    const response = await fetch(`/api/payments/${payment_id}`)

    if (response.ok) {
        const payment = await response.json()
        await dispatch(getCurrPayment(payment))
        return payment
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return  {'error': 'An error occurred. Please try again.' }
    }
}

//Clear curr payment
const CLEAR_PAYMENT = 'groups/CLEAR_GROUPCLEAR_Payment_MEMBERS'
export const clearPayment = () => {
    return { type: CLEAR_PAYMENT }
}



export const currPaymentReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CURR_PAYMENT:
            return { ...action.payment }
        case CLEAR_PAYMENT:
            return null
        default:
            return state
    }
}
