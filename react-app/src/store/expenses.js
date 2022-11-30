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
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}

//Get all expenses of current user
const GET_CURR_USER_EXPENSES = 'expenses/GET_CURR_USER_EXPENSES'
const getCurrUserExpenses = (expenses) => {
    return { type: GET_CURR_USER_EXPENSES, expenses }
}

export const getCurrUserExpensesThunk = () => async (dispatch) => {
    const response = await fetch(`/api/expenses/current-user`)

    if (response.ok) {
        const expenses = await response.json()
        await dispatch(getCurrUserExpenses(expenses))
        return expenses
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
    } else {
        return ['An error occurred. Please try again.']
    }
}


//Create expense
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

//Edit expense
const EDIT_EXPENSE = 'expenses/EDIT_EXPENSE'
const editExpense = (expense) => {
    return { type: EDIT_EXPENSE, expense }
}

export const editExpenseThunk = (expense_id, expense) => async (dispatch) => {
    const { payer_id, description, total, date, splits } = expense
    const response = await fetch(`/api/expenses/${expense_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payer_id,
            description,
            total,
            date,
            splits
        })
    })

    if (response.ok) {
        const expense = await response.json()
        await dispatch(editExpense(expense))
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


//Delete an expense
const DELETE_EXPENSE = 'expenses/DELETE_EXPENSE'
const deleteExpense = (expense_id) => {
    return { type: DELETE_EXPENSE, expense_id }
}

export const deleteExpenseThunk = (expense_id) => async (dispatch) => {
    const response = await fetch(`/api/expenses/${expense_id}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const message = await response.json()
        await dispatch(deleteExpense(expense_id))
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

//Post a comment on expense
const ADD_COMMENT_EXPENSE = 'expenses/ADD_COMMENT_EXPENSE'
const addCommentExpense = (expense_id, comments) => {
    return { type: ADD_COMMENT_EXPENSE, expense_id, comments }
}

export const addCommentExpenseThunk = (expense_id, comment) => async (dispatch) => {
    const { text } = comment
    const response = await fetch(`/api/expenses/${expense_id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })

    if (response.ok) {
        const comment = await response.json()
        await dispatch(addCommentExpense(expense_id, comment))
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

//Delete an expense
const DELETE_COMMENT_EXPENSE = 'expenses/DELETE_COMMENT_EXPENSE'
const deleteCommentExpense = (comments, expense_id) => {
    return { type: DELETE_COMMENT_EXPENSE, comments, expense_id }
}

export const deleteCommentExpenseThunk = (comment_id, expense_id) => async (dispatch) => {
    const response = await fetch(`/api/expenses/comments/${comment_id}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const comments = await response.json()
        await dispatch(deleteCommentExpense(comments, expense_id))
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


export const expenseReducer = (state = null, action) => {
    switch (action.type) {
        case GET_GROUP_EXPENSES:
            return { ...action.expenses }
        case GET_CURR_USER_EXPENSES:
            return { ...action.expenses }
        case CREATE_EXPENSE:
            return null
        case EDIT_EXPENSE:
            return null
        case DELETE_EXPENSE:
            const stateDeleteExpense = { ...state }
            if (stateDeleteExpense) {
                const filtered = stateDeleteExpense.expenses.filter(expense => Number(expense.id) !== Number(action.expense_id))
                stateDeleteExpense.expenses = filtered
               return stateDeleteExpense
            } else {
                return null
            }
        case ADD_COMMENT_EXPENSE:
            const addCommentExpenseState = { ...state }
            const idx = addCommentExpenseState.expenses.findIndex(obj => {
                return obj.id == action.expense_id
            })
            const new_expense = {...addCommentExpenseState.expenses[idx]}
            new_expense['comments'] = action.comments.newComments
            addCommentExpenseState.expenses[idx] = new_expense
            return addCommentExpenseState
        case DELETE_COMMENT_EXPENSE:
            const delteCommentExpenseState = { ...state }
            const idx_del = delteCommentExpenseState.expenses.findIndex(obj => {
                return obj.id == action.expense_id
            })
            const new_expense_del = {...delteCommentExpenseState.expenses[idx_del]}
            new_expense_del['comments'] = action.comments.newComments
            delteCommentExpenseState.expenses[idx_del] = new_expense_del
            return delteCommentExpenseState
        default:
            return state
    }
}
