import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk, deletePaymentThunk } from '../../store/payments';
import { deleteExpenseThunk } from '../../store/expenses';
import { getCurrGroupMembersThunk } from '../../store/currentGroupMembers';
import { getCurrUserGroupsThunk } from '../../store/groups';
import './GroupPage.css'
import LeftMenu from '../LeftMenu';

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const history = useHistory()

    const [sortedActivity, setSortedActivity] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [balances, setBalances] = useState()

    useEffect(async() => {
        async function fetchData() {
            await dispatch(getCurrUserGroupsThunk())
            await dispatch(getGroupExpensesThunk(groupId))
            await dispatch(getGroupPaymentsThunk(groupId))
            await dispatch(getCurrGroupMembersThunk(groupId))
            // setIsLoaded(true)
          }
          fetchData();
    },[groupId])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)
    const user = useSelector((state) => state.session)
    const group_members = useSelector((state) => state.currGroupMembers)
    const user_groups = useSelector((state) => state.groups)

    //redirect if not logged in or not part of group or group not found
    useEffect(() => {
        if(!user.user) {
            history.push('/')
        }
    },[])

    useEffect(() => {
        if(user_groups) {
            let inGroup = false
            user_groups.groups.forEach(group => {
                if (group.id === Number(groupId)) inGroup = true
            });
            if (!inGroup) history.push('/dashboard')
        }
    },[user_groups])

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
        setIsLoaded(true)
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


    const getBalancePerUser = () => {
        let totals = {}

        if(group_members) {
            group_members.members.forEach(member => {
                totals[member.user_id] = 0
            })
        }

        if (expenses){
            expenses.expenses.forEach(expense => {
                let money_owed = 0
                expense.money_owed.forEach(owed => {
                    totals[owed.user_id] -= owed.amount_owed
                    money_owed += owed.amount_owed
                })
                totals[expense.payer.id] += money_owed
            })
        }

        if(payments) {
            payments.payments.forEach(payment => {
                totals[payment.payee.id] -= payment.total
                totals[payment.payer.id] += payment.total
            })
        }
        setBalances(totals)
    }

    useEffect(() => {
        getBalancePerUser()
    },[sortedActivity, group_members])

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
            <div id='group_page_wrapper'>
                <div id='group_page_left'>
                    <LeftMenu />
                </div>
                <div id='group_page_mid' className='flex_col'>
                    <div id='group_page_head'>
                        <div id='group_page_head_title'>
                            <img src='https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-teal41-house-50px.png' alt='group_icon'></img>
                            {group_members ? group_members.group.name : ""}
                        </div>
                        <div id='group_page_head_buttons_container'>
                            <div><button onClick={() => history.push('/add-expense')} className='add_expense_btn'>Add an Expense</button></div>
                            <div><button onClick={() => history.push('/add-payment')} className='settle_up_btn'>Settle Up</button></div>
                        </div>
                    </div>
                    <div id='group_page_activity' className='flex_col'>
                        {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                            <div key={idx} className='group_page_activity_li'>
                            {activity.money_owed && (
                                <div className='group_page_activity_expense'>
                                    <div className='group_page_activity_expense_head' onClick={toggleDetails}>
                                        <div className='group_page_activity_expense_head_left'>
                                            <div className='group_page_activity_expense_date flex_col'>
                                                <div className='group_page_activity_expense_date_top'>{new Date(activity.date_paid).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                                                <div className='group_page_activity_expense_date_bottom'>{new Date(activity.date_paid).getDate()}</div>
                                            </div>
                                            <div>
                                                <img src='https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png' alt='category_icon' className='category_icon'></img>
                                            </div>
                                            <div className='group_page_activity_expense_head_description'>
                                                {activity.description}
                                            </div>
                                        </div>
                                        <div className='group_page_activity_expense_head_quicktotal'>
                                            <div className='group_page_activity_expense_head_quicktotal_payer'>
                                                <div style={{ color: 'gray' }}>
                                                    {activity.payer.id === user.user.id ? 'you' : activity.payer.username} paid
                                                </div>
                                                <div style={{ fontWeight: 700, fontSize: 14 }}>
                                                    ${(activity.total).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className='group_page_activity_expense_head_quicktotal_net'>
                                                <div style={{ color: 'gray' }}>
                                                    {activity.payer.id === user.user.id ? `you lent` : `${activity.payer.username} lent you`}
                                                </div>
                                                <div style={{ fontWeight: 700, fontSize: 14 }}>
                                                    {activity.payer.id === user.user.id ? <span className='green'>${(activity.total - calcPayerOwes(activity.money_owed)).toFixed(2)}</span> : <span className='red'>${calcUserOwes(activity.money_owed, user.user.id).toFixed(2)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='group_page_activity_expense_delete'>
                                            <div className='delete_expense_btn' onClick={() => handleExpenseDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                        </div>
                                    </div>
                                    <div className='group_page_activity_expense_details'>
                                        <div className='group_page_activity_expense_details_head'>
                                            <img src='https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png' alt='category_icon' className='category_icon'></img>
                                            <div className='flex_col'>
                                                <div className='group_page_activity_expense_details_description'>
                                                    {activity.description}
                                                </div>
                                                <div className='group_page_activity_expense_details_total'>
                                                    ${activity.total.toFixed(2)}
                                                </div>
                                                <div className='group_page_activity_expense_edit'>
                                                    <button className='edit_expense_btn' onClick={() => history.push(`/expenses/${activity.id}/edit-expense`)}>Edit Expense</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='group_page_activity_expense_details_bottom'>
                                            <div className='group_page_activity_expense_details_breakdown flex_col'>
                                                <div>
                                                    <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_details' />
                                                    <div><span>{activity.payer.username}</span> paid <span>${activity.total.toFixed(2)}</span> and owes <span>${calcPayerOwes(activity.money_owed)}</span></div>
                                                </div>
                                                {activity.money_owed.length > 0 && activity.money_owed.map(owed => (
                                                    <div key={owed.id}>
                                                        <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_details' />
                                                        <div><span>{owed.username}</span> owes <span>${owed.amount_owed.toFixed(2)}</span></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activity.payee && (
                                <div className='group_page_activity_payment'>
                                    <div className='group_page_activity_payment_head' onClick={toggleDetails}>
                                        <div className='group_page_activity_payment_head_left'>
                                            <img src='https://assets.splitwise.com/assets/api/payment_icon/square/small/offline.png' alt='money_icon' className='money_icon_payment_li'></img>
                                            <div className='group_page_activity_li_payment'>
                                                {activity.payer.username} paid {activity.payee.username} ${activity.total.toFixed(2)}
                                            </div>
                                        </div>
                                        {activity.payer.id === user.user.id && (
                                            <div className='group_page_activity_payment_head_quicktotal'>
                                                <div className='align_right' style={{ color: 'gray'}}>you paid </div>
                                                <div className='red' style={{ fontWeight: 700, fontSize: 14 }}>${(activity.total).toFixed(2)}</div>
                                            </div>
                                        )}
                                        {activity.payee.id === user.user.id && (
                                            <div className='group_page_activity_payment_head_quicktotal'>
                                                <div className='align_right' style={{ color: 'gray'}}>you received</div>
                                                <div className='green' style={{ fontWeight: 700, fontSize: 14 }}>${(activity.total).toFixed(2)}</div>
                                            </div>
                                        )}
                                        {activity.payer.id !== user.user.id && activity.payee.id !== user.user.id && (
                                            <div className='group_page_activity_payment_head_quicktotal' style={{ color: 'gray'}}>
                                                not involved
                                            </div>
                                        )}
                                        <div className='group_page_activity_payment_delete'>
                                            <div className='delete_payment_btn' onClick={() => handlePaymentDelete(activity.id)}><i className="fa-solid fa-x"/></div>
                                        </div>
                                    </div>
                                    <div className='group_page_activity_payment_details'>
                                        <div className='group_page_activity_payment_details_head'>
                                            <img src='https://assets.splitwise.com/assets/api/payment_icon/square/small/offline.png' alt='category_icon' className='category_icon'></img>
                                            <div className='flex_col'>
                                                <div className='group_page_activity_payment_details_description'>Payment</div>
                                                <div className='group_page_activity_payment_details_total'>
                                                    ${activity.total.toFixed(2)}
                                                </div>
                                                <div>
                                                    <button className='edit_payment_btn' onClick={() => history.push(`/expenses/${activity.id}/edit-expense`)}>Edit Expense</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='group_page_activity_payment_details_bottom'>
                                            <div className='group_page_activity_payment_details_breakdown'>
                                                <div>
                                                    <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_details' />
                                                    <div><span>{activity.payer.username}</span> paid <span>${activity.total.toFixed(2)}</span></div>
                                                </div>
                                                <div>
                                                    <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_details' />
                                                    <div><span>{activity.payee.username}</span> paid <span>${activity.total.toFixed(2)}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                </div>
                <div id='group_page_right'>
                    <div id='group_page_right_title'>GROUP BALANCES</div>
                    {group_members && group_members.members.map(member => (
                        <div key={member.user_id} id='group_page_right_member_item'>
                            <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' className='user_icon_group_right' />
                            <div id='group_page_right_member_details'>
                                <div>{member.name}</div>
                                {balances && (
                                    <>
                                    {balances[member.user_id] === 0 && (
                                        <div>settled up</div>
                                    )}
                                    {balances[member.user_id] > 0 && (
                                        <div style={{ color: 'green' }}>gets back ${balances[member.user_id].toFixed(2)}</div>
                                    )}
                                    {balances[member.user_id] < 0 && (
                                        <div style={{ color: 'red' }}>owes ${(balances[member.user_id] * -1).toFixed(2)}</div>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        </>
    )
};

export default GroupPage
