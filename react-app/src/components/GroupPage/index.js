import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import './GroupPage.css'

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()

    const [sortedExpenses, setSortedExpenses] = useState([])

    useEffect(async() => {
        await dispatch(getGroupExpensesThunk(groupId))
    },[groupId])

    const expenses = useSelector((state) => state.expenses)

    useEffect(async() => {
        if (expenses) {
            setSortedExpenses(expenses.expenses.sort((a, b) => new Date(b.date_paid).getTime() - new Date(a.date_paid).getTime()))
        }
    },[expenses])

    return (
        <div id='group_page_wrapper'>
            <div id='group_page_left' className='flex_col'>
                <div id='group_page_head'>
                    <div>Group Name</div>
                    <div>Add an Expense</div>
                    <div>Settle Up</div>
                </div>
                <div id='group_page_activity'>
                    {sortedExpenses.length > 0 && sortedExpenses.map(expense => (
                        <div key={expense.id} className='group_page_activity_li'>
                            {expense.description} {expense.date_paid}
                        </div>
                    ))}
                </div>
            </div>
            <div id='group_page_right'>
                RIGHT
            </div>
        </div>
    )
};

export default GroupPage
