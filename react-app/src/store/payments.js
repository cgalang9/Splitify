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


export const paymentsReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_PAYMENTS:
            return { ...action.payments }
        default:
            return state
    }
}
