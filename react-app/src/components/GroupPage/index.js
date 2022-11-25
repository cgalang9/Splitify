import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk } from '../../store/payments';
import './GroupPage.css'

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()

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

    return (
        <div id='group_page_wrapper'>
            <div id='group_page_left' className='flex_col'>
                <div id='group_page_head'>
                    <div>Group Name</div>
                    <div>Add an Expense</div>
                    <div>Settle Up</div>
                </div>
                <div id='group_page_activity'>
                    {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                        <div key={idx} className='group_page_activity_li'>
                        {activity.money_owed && (
                            <>
                                {activity.name}
                                {new Date(activity.date_paid).toLocaleString('default', { month: 'short' })}
                                {new Date(activity.date_paid).getDate()}
                                {activity.description}
                            </>
                        )}
                        {activity.payee && (
                            <>
                                {activity.payer.username} paid {activity.payee.username} ${activity.total.toFixed(2)}
                            </>
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
