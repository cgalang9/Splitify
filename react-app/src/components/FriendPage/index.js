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
import group_icon_img from "../../assests/group_icon_img.png";
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
                    group_name: expense.group.name,
                    net: owed.amount_owed,
                  };
                } else {
                  splits[expense.group.id].net += owed.amount_owed;
                }
              }
            }
          });
        } else if (expense.payer.id === Number(friendId)) {
          expense.money_owed.forEach((owed) => {
            if (owed.user_id === user.user.id) {
              total -= owed.amount_owed;
              if (expense.group) {
                if (!splits[expense.group.id]) {
                  splits[expense.group.id] = {
                    group_name: expense.group.name,
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
          total -= payment.total;
          if (!splits[payment.group.id]) {
            splits[payment.group.id] = {
              group_name: payment.group.name,
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
              group_name: payment.group.name,
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

  const deleteFriend = async () => {
    if (
      currFriend &&
      window.confirm(
        `Are you sure you want to remove ${currFriend.username} as a friend? Balances within groups will NOT change`
      )
    ) {
      try {
        const data = await dispatch(deleteFriendThunk(friendId));
        if (data.error) {
          history.push("/error");
        } else {
          history.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //underline description in head on hover
  const underlineTitle = (e, groupId) => {
    let title = document.querySelector(`#li_title_${groupId}`);
    title.classList.add("underline");
  };

  const removeUnderlineTitle = (e, groupId) => {
    let title = document.querySelector(`#li_title_${groupId}`);
    title.classList.remove("underline");
  };

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
        <div id="friends_page_head_bottom">
          {splits &&
            currFriend &&
            Object.keys(splits).map((groupId) => (
              <div key={groupId}>
                {splits[groupId].net !== 0 && (
                  <div
                    className="friends_page_li_wrapper"
                    key={`${groupId}`}
                    onClick={() => history.push(`../groups/${groupId}`)}
                    onMouseEnter={(e) => underlineTitle(e, groupId)}
                    onMouseLeave={(e) => removeUnderlineTitle(e, groupId)}
                  >
                    <div className="friends_page_li_left">
                      <div>
                        <img
                          src={group_icon_img}
                          alt="group_icon"
                          className="group_icon_friends"
                        />
                      </div>
                      <div
                        className="friends_page_li_group_title"
                        id={`li_title_${groupId}`}
                      >
                        Group: {splits[groupId].group_name}
                      </div>
                    </div>
                    <div className="friends_page_li_right">
                      {splits[groupId].net !== 0 && (
                        <div className="friends_page_li_total flex_col">
                          <div style={{ color: "gray" }}>
                            {splits[groupId].net < 0
                              ? `you owe ${currFriend.username}`
                              : `${currFriend.username} owes you`}
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 16,
                              color: splits[groupId].net < 0 ? "red" : "green",
                            }}
                          >
                            $
                            {splits[groupId].net < 0
                              ? (splits[groupId].net * -1).toFixed(2)
                              : splits[groupId].net.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
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
              ${(total * -1).toFixed(2)}
            </div>
          </>
        )}
        <div>
          <button id="friends_page_delete_friend" onClick={deleteFriend}>
            Delete Friend
          </button>
        </div>
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
