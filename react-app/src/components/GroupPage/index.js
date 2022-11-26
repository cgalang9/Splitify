import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk } from '../../store/payments';
import { deleteExpenseThunk } from '../../store/expenses';
import './GroupPage.css'

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const history = useHistory()

    const [sortedActivity, setSortedActivity] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(async() => {
        await dispatch(getGroupExpensesThunk(groupId))
        await dispatch(getGroupPaymentsThunk(groupId))
    },[groupId])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)
    const user = useSelector((state) => state.session)

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
        await setSortedActivity(expenses_payments.sort((a, b) => new Date(b.date_paid).getTime() - new Date(a.date_paid).getTime()))
        // await setIsLoaded(true)
    },[expenses, payments])

    const handleExpenseDelete = async(expense_id) => {
        try {
            const data = await dispatch(deleteExpenseThunk(expense_id))
            if (data.error) {
                history.push('/error')
            } else {
                history.push(`/groups/${groupId}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const calcPayerOwes = (owed) => {
        let othersOwe = 0
        owed.forEach(ele => {
            othersOwe += ele.amount_owed
        });
        return (othersOwe / (owed.length)).toFixed(2)
    }

    const calcUserOwes = (owed, id) => {
        for (let i = 0; i < owed.length; i++) {
            const ele = owed[i]
            if (ele.user_id == id) {
                return ele.amount_owed
            }
        }
        return 0
    }


    useEffect(() => setIsLoaded(true), [])
    return (
        <>
        {isLoaded && (
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
                                        <div className='group_page_activity_expense_head_description'>
                                            {activity.description}
                                        </div>
                                        <div className='group_page_activity_expense_head_quicktotal'>
                                            {activity.payer.id === user.user.id ? 'you' : activity.payer.username} paid ${(activity.total).toFixed(2)}
                                            {activity.payer.id === user.user.id ?
                                                `you lent $${(activity.total - calcPayerOwes(activity.money_owed)).toFixed(2)}` :
                                                `${activity.payer.username} lent you $${calcUserOwes(activity.money_owed, user.user.id).toFixed(2)}`
                                            }
                                        </div>
                                        <div className='group_page_activity_expense_delete'>
                                            <div className='delete_expense_btn' onClick={() => handleExpenseDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                        </div>
                                    </div>
                                    <div className='group_page_activity_expense_details'>
                                        <div className='group_page_activity_expense_details_description'>
                                            {activity.description}
                                        </div>
                                        <div className='group_page_activity_expense_details_description'>
                                            ${activity.total}
                                        </div>
                                        <div className='group_page_activity_expense_edit'>
                                            <button onClick={() => history.push(`/expenses/${activity.id}/edit-expense`)}>Edit Expense</button>
                                        </div>
                                        <div className='group_page_activity_expense_details_breakdown'>
                                            {activity.payer.username} paid ${activity.total} and owes ${calcPayerOwes(activity.money_owed)}
                                            {activity.money_owed.length > 0 && activity.money_owed.map(owed => (
                                                <div>
                                                    {owed.username} owes ${owed.amount_owed.toFixed(2)}
                                                </div>
                                            ))}
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
        )}
        </>
    )
};

export default GroupPage
