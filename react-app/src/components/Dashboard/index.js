import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getCurrUserExpensesThunk } from '../../store/expenses';
import { getCurrUserPaymentsThunk, deletePaymentThunk } from '../../store/payments';
import { deleteExpenseThunk } from '../../store/expenses';
import './Dashboard.css'

const Dashboard = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    // const [isLoaded, setIsLoaded] = useState(false)
    const [balance, setBalance] = useState()


    useEffect(async() => {
        async function fetchData() {
            await dispatch(getCurrUserExpensesThunk())
            await dispatch(getCurrUserPaymentsThunk())
            // setIsLoaded(true)
        }
        fetchData();
    },[])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)
    const user = useSelector((state) => state.session)

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

    const getUserBalance = () => {
        let total = 0
        let your_owed = 0
        let you_owe = 0
        let splits = {} //keeps track of who you owe or owes you by user id
        let user_keys = {} //keeps track of usernames in split obj

        // const curr_user_id = user.user.id

        if (expenses){
            expenses.expenses.forEach(expense => {
                if (expense.payer.id === user.user.id) {
                        expense.money_owed.forEach(owed => {
                            total += owed.amount_owed
                            your_owed += owed.amount_owed
                            if(splits[owed.user_id]) {
                                splits[owed.user_id] += owed.amount_owed
                            } else {
                                splits[owed.user_id] = owed.amount_owed
                                user_keys[owed.user_id] = owed.username
                            }
                        })
                } else if (expense.payer.id !== user.user.id){
                    expense.money_owed.forEach(owed => {
                        if(owed.user_id === user.user.id) {
                            total -= owed.amount_owed
                            you_owe += owed.amount_owed
                            if(splits[expense.payer.id]) {
                                splits[expense.payer.id] -= owed.amount_owed
                            } else {
                                splits[expense.payer.id] = -(owed.amount_owed)
                                user_keys[expense.payer.id] = expense.payer.username
                            }
                        }
                    })
                }

            })
        }


        if(payments) {
            payments.payments.forEach(payment => {
                if(payment.payee.id === user.user.id) {
                    total -= payment.total
                    your_owed -= payment.total
                    if(splits[payment.payer.id]) {
                        splits[payment.payer.id] -= payment.total
                    } else {
                        splits[payment.payer.id] = -(payment.total)
                        user_keys[payment.payer.id] = payment.payer.username
                    }
                }
                if(payment.payer.id === user.user.id) {
                    total += payment.total
                    you_owe -= payment.total
                    if(splits[payment.payee.id]) {
                        splits[payment.payee.id] += payment.total
                    } else {
                        splits[payment.payee.id] = payment.total
                        user_keys[payment.payee.id] = payment.payee.username
                    }
                }
            })
        }

        const netBalance = {total, you_owe, your_owed, splits, user_keys}
        setBalance(netBalance)
    }

    useEffect(() => {
        getUserBalance()
    },[expenses, payments])

    console.log(balance)
    const ttt = ['test', 'test2']



    return (
        <div id='dash_wrapper'>
            <div id='dash_left' className='flex_col'>
                <div id='dash_left_head'>
                    <div id='dash_left_head_top'>
                        <div>Dashboard</div>
                        <div><button onClick={() => history.push('/add-expense')}>Add an Expense</button></div>
                        <div><button onClick={() => history.push('/add-payment')}>Settle Up</button></div>
                    </div>
                    <div id='dash_left_head_bottom'>
                        <div id='dash_left_head_total'>
                            <div>total balance</div>
                            {balance && balance.total === 0 && (
                                <div>$0.00</div>
                            )}
                            {balance && balance.total > 0 && (
                                <div style={{ color: 'green' }}>${balance.total.toFixed(2)}</div>
                            )}
                            {balance && balance.total < 0 && (
                                <div style={{ color: 'red' }}>${balance.total.toFixed(2)}</div>
                            )}
                        </div>
                        <div id='dash_left_head_owe'>
                            <div>you owe</div>
                            {balance && balance.you_owe === 0 && (
                                <div>$0.00</div>
                            )}
                            {balance && balance.you_owe > 0 && (
                                <div style={{ color: 'red' }}>${balance.you_owe.toFixed(2)}</div>
                            )}
                        </div>
                        <div id='dash_left_head_owed'>
                            <div>you are owed</div>
                            {balance && balance.your_owed === 0 && (
                                <div>$0.00</div>
                            )}
                            {balance && balance.your_owed > 0 && (
                                <div style={{ color: 'green' }}>${balance.your_owed.toFixed(2)}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div id='dash_left_main'>
                    <div id='dash_left_main_you_owe' className='flex_col'>
                        <div id='dash_left_owe_head'>YOU OWE</div>
                        <div id='dash_left_owe_li'>
                            {balance && Object.keys(balance.splits).map(el => (
                                balance.splits[el] < 0 && (
                                    <div>
                                        <div>{balance.user_keys[el]}</div>
                                        <div style={{ color: 'red' }}>you owe ${(balance.splits[el] * -1).toFixed(2)}</div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                    <div id='dash_left_main_you_are_owed' className='flex_col'>
                        <div id='dash_left_owed_head'>YOU ARE OWED</div>
                        <div id='dash_left_owed_li'>
                        {balance && Object.keys(balance.splits).map(el => (
                                balance.splits[el] > 0 && (
                                    <div>
                                        <div>{balance.user_keys[el]}</div>
                                        <div style={{ color: 'green' }}>owes you ${balance.splits[el].toFixed(2)}</div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div id='dash_right'>
                RIGHT
            </div>
        </div>
    )
};

export default Dashboard;
