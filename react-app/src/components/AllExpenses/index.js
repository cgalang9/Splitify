import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getCurrUserExpensesThunk } from '../../store/expenses';
import { getCurrUserPaymentsThunk, deletePaymentThunk } from '../../store/payments';
import { deleteExpenseThunk } from '../../store/expenses';
import './AllExpenses.css'
import LeftMenu from '../LeftMenu';

const AllExpenses = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [sortedActivity, setSortedActivity] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [balance, setBalance] = useState()

    useEffect(async() => {
        async function fetchData() {
            await dispatch(getCurrUserExpensesThunk())
            await dispatch(getCurrUserPaymentsThunk())
            setIsLoaded(true)
          }
          fetchData();
    },[])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)
    const user = useSelector((state) => state.session)

    //sort payments and expenses in alphabetical order on one list
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
    },[expenses, payments])

    const handleExpenseDelete = async(expense_id) => {
        if (window.confirm("Are you sure you want to delete this expense? You can not recover this expense after deletion.")) {
            try {
                const data = await dispatch(deleteExpenseThunk(expense_id))
                if (data.error) {
                    history.push('/error')
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handlePaymentDelete = async(payment_id) => {
        if (window.confirm("Are you sure you want to delete this payment? You can not recover this payment after deletion.")) {
            try {
                const data = await dispatch(deletePaymentThunk(payment_id))
                if (data.error) {
                    history.push('/error')
                }
            } catch (error) {
                console.log(error)
            }
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


    const getUserBalance = () => {
        let total = 0

        if (expenses){
            expenses.expenses.forEach(expense => {
                if (expense.payer.id === user.user.id) {
                    expense.money_owed.forEach(owed => {
                        total += owed.amount_owed
                    })
                } else {
                    expense.money_owed.forEach(owed => {
                        if(owed.user_id === user.user.id) total -= owed.amount_owed
                    })
                }
            })
        }

        if(payments) {
            payments.payments.forEach(payment => {
                if(payment.payee.id === user.user.id) total -= payment.total
                if(payment.payer.id === user.user.id) total += payment.total
            })
        }
        setBalance(total)
    }

    useEffect(() => {
        getUserBalance()
    },[sortedActivity])


    return (
        <>
        {isLoaded && (
            <div id='all_wrapper'>
                <div id='all_left'>
                    <LeftMenu />
                </div>
                <div id='all_mid' className='flex_col'>
                    <div id='all_head'>
                        <div>All Expenses</div>
                        <div><button onClick={() => history.push('/add-expense')}>Add an Expense</button></div>
                        <div><button onClick={() => history.push('/add-payment')}>Settle Up</button></div>
                    </div>
                    <div id='all_activity' className='flex_col'>
                        {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                            <div key={idx} className='all_activity_li'>
                            {activity.money_owed && (
                                <div className='all_activity_expense'>
                                    <div className='all_activity_expense_head'>
                                        <div className='all_activity_expense_date flex_col'>
                                            <div>{new Date(activity.date_paid).toLocaleString('default', { month: 'short' })}</div>
                                            <div>{new Date(activity.date_paid).getDate()}</div>
                                        </div>
                                        <div className='all_activity_expense_head_description'>
                                            <div>{activity.description}</div>
                                            <div>{activity.group.name}</div>
                                        </div>
                                        <div className='all_activity_expense_head_quicktotal'>
                                            {activity.payer.id === user.user.id ? 'you' : activity.payer.username} paid ${(activity.total).toFixed(2)}
                                            {activity.payer.id === user.user.id ?
                                                `you lent $${(activity.total - calcPayerOwes(activity.money_owed)).toFixed(2)}` :
                                                `${activity.payer.username} lent you $${calcUserOwes(activity.money_owed, user.user.id).toFixed(2)}`
                                            }
                                        </div>
                                        <div className='all_activity_expense_delete'>
                                            <div className='delete_expense_btn' onClick={() => handleExpenseDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                        </div>
                                    </div>
                                    <div className='all_activity_expense_details'>
                                        <div className='all_activity_expense_details_description'>
                                            {activity.description}
                                        </div>
                                        <div className='all_activity_expense_details_description'>
                                            ${activity.total}
                                        </div>
                                        <div className='all_activity_expense_edit'>
                                            <button onClick={() => history.push(`/expenses/${activity.id}/edit-expense`)}>Edit Expense</button>
                                        </div>
                                        <div className='all_activity_expense_details_breakdown'>
                                            {activity.payer.username} paid ${activity.total} and owes ${calcPayerOwes(activity.money_owed)}
                                            {activity.money_owed.length > 0 && activity.money_owed.map(owed => (
                                                <div key={owed.id}>
                                                    {owed.username} owes ${owed.amount_owed.toFixed(2)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activity.payee && (
                                <div className='all_activity_payment'>
                                    <div className='all_activity_payment_head'>
                                        <div className='all_activity_li_payment'>
                                            {activity.payer.username} paid {activity.payee.username} ${activity.total.toFixed(2)} in {activity.group.name}
                                        </div>
                                        {activity.payer.id === user.user.id && (
                                            <div className='all_activity_expense_head_quicktotal'>
                                                you paid ${(activity.total).toFixed(2)}
                                            </div>
                                        )}
                                        {activity.payee.id === user.user.id && (
                                            <div className='all_activity_expense_head_quicktotal'>
                                                you received ${(activity.total).toFixed(2)}
                                            </div>
                                        )}
                                        {activity.payer.id !== user.user.id && activity.payee.id !== user.user.id && (
                                            <div className='all_activity_expense_head_quicktotal'>
                                                not involved
                                            </div>
                                        )}
                                        <div className='all_activity_payment_delete'>
                                            <div className='delete_payment_btn' onClick={() => handlePaymentDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                        </div>
                                    </div>
                                    <div className='all_activity_payment_details'>
                                        <div className='all_activity_payment_details_title'>Payment</div>
                                        <div className='all_activity_payment_details_description'>
                                            {activity.description}
                                        </div>
                                        <div className='all_activity_payment_details_description'>
                                            ${activity.total}
                                        </div>
                                        <div className='all_activity_payment_edit'>
                                            <button onClick={() => history.push(`/payments/${activity.id}/edit-payment`)}>Edit payment</button>
                                        </div>
                                        <div className='all_activity_expense_details_breakdown'>
                                            <div>{activity.payer.username} paid ${activity.total}</div>
                                            <div>{activity.payee.username} paid ${activity.total}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                </div>
                <div id='all_right'>
                    <div>YOUR TOTAL BALANCES</div>
                    {balance === 0 && (
                        <div>You are settled up</div>
                    )}
                    {balance > 0 && (
                        <>
                            <div>you are owed</div>
                            <div style={{ color: 'green' }}>${balance.toFixed(2)}</div>
                        </>
                    )}
                    {balance < 0 && (
                        <>
                            <div>you owe</div>
                            <div style={{ color: 'red' }}>${(balance * -1).toFixed(2)}</div>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    )
};

export default AllExpenses
