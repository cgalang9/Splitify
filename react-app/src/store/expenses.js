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

//Get expenses by group
const CREATE_EXPENSE = 'expenses/CREATE_EXPENSE'
const createExpense = (expense) => {
    return { type: CREATE_EXPENSE, expense }
}

export const createExpenseThunk = (expense) => async (dispatch) => {
    const { payer_id, group_id, description, total, date, splits } = expense
    const response = await fetch(`/api/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payer_id,
            group_id,
            description,
            total,
            date,
            splits
        })
    })

    if (response.ok) {
        const expense = await response.json()
        await dispatch(createExpense(expense))
        return expense
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


export const expenseReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_EXPENSES:
            return { ...action.expenses }
        case CREATE_EXPENSE:
            return null
        default:
            return state
    }
}
