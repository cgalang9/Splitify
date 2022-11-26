//Get current expense details
const GET_CURR_EXPENSE = 'groups/GET_CURR_EXPENSE'
const getCurrExpense = (expense) => {
    return { type: GET_CURR_EXPENSE, expense }
}

export const getCurrExpenseThunk = (expense_id) => async (dispatch) => {
    const response = await fetch(`/api/expenses/${expense_id}`)

    if (response.ok) {
        const expense = await response.json()
        await dispatch(getCurrExpense(expense))
        return expense
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return  {'error': 'An error occurred. Please try again.' }
    }
}

//Clear curr expense
const CLEAR_EXPENSE = 'groups/CLEAR_GROUPCLEAR_EXPENSE_MEMBERS'
export const clearExpense = () => {
    return { type: CLEAR_EXPENSE }
}



export const currExpenseReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CURR_EXPENSE:
            return { ...action.expense }
        case CLEAR_EXPENSE:
            return null
        default:
            return state
    }
}
