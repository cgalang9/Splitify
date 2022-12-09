import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk } from '../../store/payments';
import { getGroupMembersThunk } from '../../store/groupMembersForGroupPage'
import { getCurrUserGroupsThunk } from '../../store/groups';
import './GroupPage.css'
import LeftMenu from '../LeftMenu';
import AddExpenseFormModal from '../AddExpenseForm';
import AddPaymentFormModal from '../AddPaymentForm';
import user_icon_img from '../../assests/user_icon_img.png'
import group_icon_img from '../../assests/group_icon_img.png'
import ExpenseListItem from '../ExpenseListItem';
import PaymentListItem from '../PaymentListItem';
import github from '../../assests/github.png'

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
            await dispatch(getGroupMembersThunk(groupId))
            // setIsLoaded(true)
          }
          fetchData();
    },[groupId])

    const expenses = useSelector((state) => state.expenses)
    const payments = useSelector((state) => state.payments)
    const user = useSelector((state) => state.session)
    const group_members = useSelector((state) => state.groupMembersForGroupPage)
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

    //calculate balances of all users in group for display on right side
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

    //minimize all detials when switching groups
    useEffect(() => {
        const payment_detail_sections = document.querySelectorAll('.activity_payment_details')
        payment_detail_sections.forEach(section => {
            section.classList.remove('active_details')
        })
        const expense_detail_sections = document.querySelectorAll('.activity_expense_details')
        expense_detail_sections.forEach(section => {
            section.classList.remove('active_details')
        })
    },[groupId])


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
                            <img src={group_icon_img} alt='group_icon'></img>
                            {group_members ? group_members.group.name : ""}
                        </div>
                        <div id='group_page_head_buttons_container'>
                            <AddExpenseFormModal />
                            <AddPaymentFormModal />
                        </div>
                    </div>
                    <div id='group_page_activity' className='flex_col'>
                        {sortedActivity.length > 0 && sortedActivity.map((activity, idx) => (
                            <div key={idx} className='group_page_activity_li'>
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
                <div id='group_page_right'>
                    <div id='group_page_right_title'>GROUP BALANCES</div>
                    {group_members && group_members.members.map(member => (
                        <div key={member.user_id} id='group_page_right_member_item'>
                            <img src={user_icon_img} alt='user_icon' className='user_icon_group_right' />
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
                    <div id='all_right_links_title'>MY LINKS</div>
                    <div id='all_right_github_container'><a href='https://github.com/cgalang9'><img src={github} alt='github_logo' id='all_right_github'/></a></div>
                    <div id='linkedin_container'><a href="https://www.linkedin.com/in/carmelino-galang-53369a205">
                        <i class="fab fa-linkedin-in"></i><span id='linkedin_text'>LinkedIn</span>
                    </a></div>
                </div>
            </div>
        )}
        </>
    )
};

export default GroupPage
