import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getCurrUserExpensesThunk } from "../../store/expenses";
import { getCurrUserPaymentsThunk } from "../../store/payments";
import "./FriendPage.css";
import LeftMenu from "../LeftMenu";
import AddExpenseFormModal from "../AddExpenseForm";
import AddPaymentFormModal from "../AddPaymentForm";
import github from "../../assests/github.png";
import user_icon_img from "../../assests/user_icon_img.png";
import { deleteFriendThunk } from "../../store/currUserFriends";

export default function FriendPage() {
  const { friendId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.currUserFriends);
  const user = useSelector((state) => state.session);

  const [currFriend, setCurrFriend] = useState(null);
  const [total, setTotal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [splits, setSplits] = useState(null);

  //redirect if not logged in or not part of group or group not found
  useEffect(() => {
    if (!user.user) {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    let friend = null;
    if (friends) {
      friend = friends.currUserFriends.find((fr) => fr.id === Number(friendId));
      if (!friend) {
        history.push("/dashboard"); //redirect to dash if friend is not actually friends with curr user
      } else {
        setCurrFriend(friend);
      }
    }
  }, [friendId, friends]);

  useEffect(async () => {
    async function fetchData() {
      await dispatch(getCurrUserExpensesThunk());
      await dispatch(getCurrUserPaymentsThunk());
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  const expenses = useSelector((state) => state.expenses);
  const payments = useSelector((state) => state.payments);

  const getUserBalance = () => {
    let total = 0;
    let splits = {}; //keeps track of balance by group
    if (expenses) {
      expenses.expenses.forEach((expense) => {
        if (expense.payer.id === user.user.id) {
          expense.money_owed.forEach((owed) => {
            if (owed.user_id === Number(friendId)) {
              total += owed.amount_owed;
              if (expense.group) {
                if (!splits[expense.group.id]) {
                  splits[expense.group.id] = {
                    group_name: expense.group.id,
                    net: owed.amount_owed,
                  };
                } else {
                  splits[expense.group.id].net += owed.amount_owed;
                }
              }
            }
          });
        } else if (expense.payer.id === friendId) {
          expense.money_owed.forEach((owed) => {
            if (owed.user_id === user.user.id) {
              total -= owed.amount_owed;
              if (expense.group) {
                if (!splits[expense.group.id]) {
                  splits[expense.group.id] = {
                    group_name: expense.group.id,
                    net: -owed.amount_owed,
                  };
                } else {
                  splits[expense.group.id].net -= owed.amount_owed;
                }
              }
            }
          });
        }
      });
    }
    if (payments) {
      payments.payments.forEach((payment) => {
        if (
          payment.payee.id === user.user.id &&
          payment.payer.id === Number(friendId)
        ) {
          console.log(payment);
          total -= payment.total;
          if (!splits[payment.group.id]) {
            splits[payment.group.id] = {
              group_name: payment.group.id,
              net: -payment.total,
            };
          } else {
            splits[payment.group.id].net -= payment.total;
          }
        }
        if (
          payment.payer.id === user.user.id &&
          payment.payee.id === Number(friendId)
        ) {
          total += payment.total;
          if (!splits[payment.group.id]) {
            splits[payment.group.id] = {
              group_name: payment.group.id,
              net: payment.total,
            };
          } else {
            splits[payment.group.id].net += payment.total;
          }
        }
      });
    }
    setTotal(total);
    setSplits(splits);
  };

  useEffect(() => {
    getUserBalance();
  }, [expenses, payments, friendId]);

  return (
    <div id="friends_page_wrapper">
      <div id="friends_page_left">
        <LeftMenu />
      </div>
      <div id="friends_page_mid" className="flex_col">
        <div id="friends_page_head">
          <div id="friends_page_head_top">
            <div id="friends_page_head_title">
              <img src={user_icon_img} alt="user_icon" />
              <div>{currFriend ? currFriend.username : ""}</div>
            </div>
            <div id="friends_page_head_buttons_container">
              <AddExpenseFormModal />
              <AddPaymentFormModal />
            </div>
          </div>
        </div>
        <div id="friends_page_head_bottom"></div>
      </div>
      <div id="friends_page_right">
        <div id="friends_page_right_bal_title">YOUR BALANCE</div>
        {isLoaded && total === 0 && (
          <div className="friends_page_right_total">You are settled up</div>
        )}
        {isLoaded && total > 0 && (
          <>
            <div
              style={{ color: "green" }}
              className="friends_page_right_top_total"
            >
              you are owed
            </div>
            <div
              style={{ color: "green" }}
              className="friends_page_right_total"
            >
              ${total.toFixed(2)}
            </div>
          </>
        )}
        {isLoaded && total < 0 && (
          <>
            <div
              style={{ color: "red" }}
              className="friends_page_right_top_total"
            >
              you owe
            </div>
            <div style={{ color: "red" }} className="friends_page_right_total">
              ${total.toFixed(2)}
            </div>
          </>
        )}
        {/* <div id="friends_page_delete_friend">
          <button>Delete Friend</button>
        </div> */}
        <div id="friends_page_right_title">MY LINKS</div>
        <div id="friends_page_right_github_container">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/cgalang9"
          >
            <img
              src={github}
              alt="github_logo"
              id="friends_page_right_github"
            />
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
}
