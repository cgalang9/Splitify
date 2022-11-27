import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getGroupExpensesThunk } from '../../store/expenses';
import { getGroupPaymentsThunk, deletePaymentThunk } from '../../store/payments';
import { deleteExpenseThunk } from '../../store/expenses';
import { getCurrGroupMembersThunk } from '../../store/currentGroupMembers';
import './AllExpenses.css'

const AllExpenses = () => {



    return (
        <>
 TEST
        </>
    )
};

export default AllExpenses
