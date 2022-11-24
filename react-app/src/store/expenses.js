//Get expenses by group
const GET_GROUP_EXPENSES = 'expenses/GET_GROUP_EXPENSES'
const getGroupExpenses = (expenses) => {
    return { type: GET_GROUP_EXPENSES, expenses }
}

export const getGroupExpensesThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/expenses`)

    if (response.ok) {
        const expenses = await response.json()
        await dispatch(getGroupExpenses(expenses))
        return expenses
    }
}


export const expenseReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_EXPENSES:
            return { ...action.expenses }
        default:
            return state
    }
}
