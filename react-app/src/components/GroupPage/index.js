import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk } from '../../store/payments';
import './GroupPage.css'

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const history = useHistory()

    const [sortedActivity, setSortedActivity] = useState([])

    useEffect(async() => {
        await dispatch(getGroupExpensesThunk(groupId))
        await dispatch(getGroupPaymentsThunk(groupId))
    },[groupId])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)

    useEffect(async() => {
        let expenses_all = []
        let payments_all = []
        if (expenses) {
            expenses_all = expenses.expenses
        }
        if (payments) {
            payments_all = payments.payments
        }
        const expenses_payments = [...expenses_all, ...payments_all]
        setSortedActivity(expenses_payments.sort((a, b) => new Date(b.date_paid).getTime() - new Date(a.date_paid).getTime()))
    },[expenses, payments])

    const handleExpenseDelete = async(expense_id) => {

    }

    return (
        <div id='group_page_wrapper'>
            <div id='group_page_left' className='flex_col'>
                <div id='group_page_head'>
                    <div>Group Name</div>
                    <div><button onClick={() => history.push('/add-expense')}>Add an Expense</button></div>
                    <div>Settle Up</div>
                </div>
                <div id='group_page_activity' className='flex_col'>
                    {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                        <div key={idx} className='group_page_activity_li'>
                        {activity.money_owed && (
                            <div className='group_page_activity_expense'>
                                <div className='group_page_activity_expense_head'>
                                    <div className='group_page_activity_expense_date flex_col'>
                                        <div>{new Date(activity.date_paid).toLocaleString('default', { month: 'short' })}</div>
                                        <div>{new Date(activity.date_paid).getDate()}</div>
                                    </div>
                                    <div className='group_page_activity_expense_description'>
                                        {activity.description}
                                    </div>
                                    <div className='group_page_activity_expense_delete'>
                                        <div className='delete_expense_btn' onClick={handleExpenseDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activity.payee && (
                            <div className='group_page_activity_li_payment'>
                                {activity.payer.username} paid {activity.payee.username} ${activity.total.toFixed(2)}
                            </div>
                        )}
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
