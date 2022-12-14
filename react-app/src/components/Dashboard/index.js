import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCurrUserExpensesThunk } from "../../store/expenses";
import { getCurrUserPaymentsThunk } from "../../store/payments";
import "./Dashboard.css";
import LeftMenu from "../LeftMenu";
import AddExpenseFormModal from "../AddExpenseForm";
import AddPaymentFormModal from "../AddPaymentForm";
import github from "../../assests/github.png";
import user_icon_img from "../../assests/user_icon_img.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // const [isLoaded, setIsLoaded] = useState(false)
  const [balance, setBalance] = useState();

  useEffect(async () => {
    async function fetchData() {
      await dispatch(getCurrUserExpensesThunk());
      await dispatch(getCurrUserPaymentsThunk());
      // setIsLoaded(true)
    }
    fetchData();
  }, []);

  const expenses = useSelector((state) => state.expenses);
  const payments = useSelector((state) => state.payments);
  const user = useSelector((state) => state.session);

  useEffect(() => {
    if (!user.user) {
      history.push("/");
    }
  }, []);

  const getUserBalance = () => {
    let total = 0;
    let your_owed = 0;
    let you_owe = 0;
    let splits = {}; //keeps track of who you owe or owes you by user id
    let user_keys = {}; //keeps track of usernames in split obj

    if (expenses) {
      expenses.expenses.forEach((expense) => {
        if (expense.payer.id === user.user.id) {
          expense.money_owed.forEach((owed) => {
            total += owed.amount_owed;
            your_owed += owed.amount_owed;
            if (splits[owed.user_id]) {
              splits[owed.user_id] += owed.amount_owed;
            } else {
              splits[owed.user_id] = owed.amount_owed;
              user_keys[owed.user_id] = owed.username;
            }
          });
        } else if (expense.payer.id !== user.user.id) {
          expense.money_owed.forEach((owed) => {
            if (owed.user_id === user.user.id) {
              total -= owed.amount_owed;
              you_owe += owed.amount_owed;
              if (splits[expense.payer.id]) {
                splits[expense.payer.id] -= owed.amount_owed;
              } else {
                splits[expense.payer.id] = -owed.amount_owed;
                user_keys[expense.payer.id] = expense.payer.username;
              }
            }
          });
        }
      });
    }

    if (payments) {
      payments.payments.forEach((payment) => {
        if (payment.payee.id === user.user.id) {
          total -= payment.total;
          your_owed -= payment.total;
          if (splits[payment.payer.id]) {
            splits[payment.payer.id] -= payment.total;
          } else {
            splits[payment.payer.id] = -payment.total;
            user_keys[payment.payer.id] = payment.payer.username;
          }
        }
        if (payment.payer.id === user.user.id) {
          total += payment.total;
          you_owe -= payment.total;
          if (splits[payment.payee.id]) {
            splits[payment.payee.id] += payment.total;
          } else {
            splits[payment.payee.id] = payment.total;
            user_keys[payment.payee.id] = payment.payee.username;
          }
        }
      });
    }

    //if negative balance of one count then add it to other count
    if (your_owed < 0) you_owe += -your_owed;
    if (you_owe < 0) you_owe += -you_owe;

    const netBalance = { total, you_owe, your_owed, splits, user_keys };
    setBalance(netBalance);
  };

  useEffect(() => {
    getUserBalance();
  }, [expenses, payments]);

  return (
    <div id="dash_wrapper">
      <div id="dash_left">
        <LeftMenu />
      </div>
      <div id="dash_mid" className="flex_col">
        <div id="dash_mid_head">
          <div id="dash_head_top">
            <div id="dash_head_title">Dashboard</div>
            <div id="dash_head_buttons_container">
              <AddExpenseFormModal />
              <AddPaymentFormModal />
            </div>
          </div>
          <div id="dash_mid_head_bottom">
            <div id="dash_mid_head_total">
              <div>total balance</div>
              {balance && balance.total === 0 && <div>$0.00</div>}
              {balance && balance.total > 0 && (
                <div style={{ color: "green" }}>
                  ${balance.total.toFixed(2)}
                </div>
              )}
              {balance && balance.total < 0 && (
                <div style={{ color: "red" }}>${balance.total.toFixed(2)}</div>
              )}
            </div>
            <div id="dash_mid_head_owe">
              <div>you owe</div>
              {balance && balance.you_owe <= 0 && <div>$0.00</div>}
              {balance && balance.you_owe > 0 && (
                <div style={{ color: "red" }}>
                  ${balance.you_owe.toFixed(2)}
                </div>
              )}
            </div>
            <div id="dash_mid_head_owed">
              <div>you are owed</div>
              {balance && balance.your_owed <= 0 && <div>$0.00</div>}
              {balance && balance.your_owed > 0 && (
                <div style={{ color: "green" }}>
                  ${balance.your_owed.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="dash_mid_main">
          <div id="dash_mid_main_you_owe" className="flex_col">
            <div id="dash_mid_owe_head">YOU OWE</div>
            <div id="dash_mid_owe_li" className="flex_col">
              {balance &&
                Object.keys(balance.splits).map(
                  (el) =>
                    balance.splits[el] < 0 && (
                      <div className="dash_mid_owe_li_wrapper">
                        <img
                          src={user_icon_img}
                          alt="user_icon"
                          className="user_icon_dash"
                        />
                        <div id="group_page_right_member_details">
                          <div style={{ fontSize: 16 }}>
                            {balance.user_keys[el]}
                          </div>
                          <div style={{ color: "red", fontSize: 14 }}>
                            you owe ${(balance.splits[el] * -1).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
          <div id="dash_mid_main_you_are_owed" className="flex_col">
            <div id="dash_mid_owed_head">YOU ARE OWED</div>
            <div id="dash_mid_owed_li" className="flex_col">
              {balance &&
                Object.keys(balance.splits).map(
                  (el) =>
                    balance.splits[el] > 0 && (
                      <div className="dash_mid_owed_li_wrapper">
                        <img
                          src={user_icon_img}
                          alt="user_icon"
                          className="user_icon_dash"
                        />
                        <div id="group_page_right_member_details">
                          <div style={{ fontSize: 16 }}>
                            {balance.user_keys[el]}
                          </div>
                          <div style={{ color: "green", fontSize: 14 }}>
                            owes you ${balance.splits[el].toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>
      <div id="dash_right">
        <div id="dash_right_title">MY LINKS</div>
        <div id="dash_right_github_container">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/cgalang9"
          >
            <img src={github} alt="github_logo" id="dash_right_github" />
          </a>
        </div>
        <div id="linkedin_container">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/carmelino-galang-53369a205"
          >
            <i className="fab fa-linkedin-in"></i>
            <span id="linkedin_text">LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
