import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getCurrUserExpensesThunk } from '../../store/expenses';
import { getCurrUserPaymentsThunk, deletePaymentThunk } from '../../store/payments';
import './AllExpenses.css'
import LeftMenu from '../LeftMenu';
import AddExpenseFormModal from '../AddExpenseForm';
import AddPaymentFormModal from '../AddPaymentForm';
import ExpenseListItem from '../ExpenseListItem';
import PaymentListItem from '../PaymentListItem';

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

    useEffect(() => {
        if(!user.user) {
            history.push('/')
        }
    },[])

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

    function toggleDetails(e) {
        const details = e.target.parentNode.nextElementSibling
        if (e.target.parentNode.nextElementSibling) {
            if(details.classList.contains('active_details')) {
                details.classList.remove('active_details')
            } else {
                details.classList.add('active_details')
            }
        }
    }



    return (
        <>
        {isLoaded && (
            <div id='all_wrapper'>
                <div id='all_left'>
                    <LeftMenu />
                </div>
                <div id='all_mid' className='flex_col'>
                    <div id='all_head'>
                        <div id='all_head_title'>
                            All Expenses
                        </div>
                        <div id='all_head_buttons_container'>
                            <AddExpenseFormModal />
                            <AddPaymentFormModal />
                        </div>
                    </div>
                    <div id='all_activity' className='flex_col'>
                        {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                            <div key={idx} className='all_activity_li'>
                                {activity.money_owed && (
                                    <ExpenseListItem activity={activity} />
                                )}
                                {activity.payee && (
                                    <PaymentListItem activity={activity} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div id='all_right'>
                    <div id='all_right_title'>YOUR TOTAL BALANCES</div>
                    {balance === 0 && (
                        <div>You are settled up</div>
                    )}
                    {balance > 0 && (
                        <>
                            <div style={{ color: 'green' }} className='all_right_top_total'>you are owed</div>
                            <div style={{ color: 'green' }} className='all_right_total'>${balance.toFixed(2)}</div>
                        </>
                    )}
                    {balance < 0 && (
                        <>
                            <div style={{ color: 'red' }} className='all_right_top_total'>you owe</div>
                            <div style={{ color: 'red' }} className='all_right_total'>${(balance * -1).toFixed(2)}</div>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    )
};

export default AllExpenses
