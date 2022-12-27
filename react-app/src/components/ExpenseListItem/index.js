import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteExpenseThunk } from "../../store/expenses";
import EditExpenseFormModal from "../EditExpenseForm";
import user_icon_img from "../../assests/user_icon_img.png";
import cat_icon_img from "../../assests/cat_icon_img.png";
import AddExpenseCommentForm from "../AddExpenseComment";
import EditExpenseCommentForm from "../EditExpenseComment";
import { deleteCommentExpenseThunk } from "../../store/expenses";
import "./ExpenseListItem.css";

const ExpenseListItem = ({ activity }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session);

  //calculations for rigth side of header
  const calcPayerOwes = (owed) => {
    let othersOwe = 0;
    owed.forEach((ele) => {
      othersOwe += ele.amount_owed;
    });
    return (othersOwe / owed.length).toFixed(2);
  };

  const calcUserOwes = (owed, id) => {
    for (let i = 0; i < owed.length; i++) {
      const ele = owed[i];
      if (ele.user_id == id) {
        return ele.amount_owed;
      }
    }
    return 0;
  };

  const handleExpenseDelete = async (expense_id, e) => {
    if (
      window.confirm(
        "Are you sure you want to delete this expense? You can not recover this expense after deletion."
      )
    ) {
      try {
        const data = await dispatch(deleteExpenseThunk(expense_id));
        if (data.error) {
          history.push("/error");
        }
        //closes details expansion when deleting
        const details =
          e.target.parentNode.parentNode.parentNode.nextElementSibling;
        details.classList.remove("active_details");
      } catch (error) {
        console.log(error);
      }
    }
  };

  //open and closes expense details when clicking header
  function toggleDetails(e) {
    const details = e.target.parentNode.nextElementSibling;
    if (e.target.parentNode.nextElementSibling) {
      if (details.classList.contains("active_details")) {
        details.classList.remove("active_details");
      } else {
        details.classList.add("active_details");
      }
    }
  }

  //sorts comments but date created (latest on bottom)
  const sortComments = (comments) => {
    return comments.sort(
      (a, b) =>
        new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
    );
  };

  const handleExpenseCommentDelete = async (comment_id, expense_id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? You can not recover this comment after deletion."
      )
    ) {
      try {
        const data = await dispatch(
          deleteCommentExpenseThunk(comment_id, expense_id)
        );
        if (data.error) {
          history.push("/error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Fixes bug: when creating date obj from string in store, date always 1 day behind. This function corrects the date
  const parseCorrectDate = (date) => {
    const correct_date = new Date(date);
    correct_date.setDate(correct_date.getDate() + 1);
    return correct_date;
  };

  //open/close edit comments form
  function toggleEditComment(comment_id) {
    const edit_comment_form = document.querySelector(
      `#expense_comment${comment_id}`
    );
    const original_comment = document.querySelector(
      `#expense_comment_box${comment_id}`
    );
    if (edit_comment_form) {
      if (edit_comment_form.classList.contains("display_none")) {
        edit_comment_form.classList.remove("display_none");
        original_comment.classList.add("display_none");
      } else {
        edit_comment_form.classList.add("display_none");
        original_comment.classList.remove("display_none");
      }
    }
  }

  const underlineTitle = (e) => {
    let title = document.querySelector(`#head_description_${activity.id}`);
    title.classList.add("underline");
  };
  const removeUnderlineTitle = (e) => {
    let title = document.querySelector(`#head_description_${activity.id}`);
    title.classList.remove("underline");
  };

  return (
    <div className="activity_expense">
      <div
        className="activity_expense_head"
        onClick={toggleDetails}
        onMouseEnter={underlineTitle}
        onMouseLeave={removeUnderlineTitle}
      >
        <div className="activity_expense_head_left">
          <div className="activity_expense_date flex_col">
            <div className="activity_expense_date_top">
              {parseCorrectDate(activity.date_paid)
                .toLocaleString("default", { month: "short" })
                .toUpperCase()}
            </div>
            <div className="activity_expense_date_bottom">
              {parseCorrectDate(activity.date_paid).getDate()}
            </div>
          </div>
          <div>
            <img
              src={cat_icon_img}
              alt="category_icon"
              className="category_icon"
            ></img>
          </div>
          <div
            className="activity_expense_head_description"
            id={`head_description_${activity.id}`}
          >
            {activity.description}
          </div>
        </div>
        <div className="activity_expense_head_quicktotal">
          <div className="activity_expense_head_quicktotal_payer flex_col">
            <div style={{ color: "gray" }}>
              {activity.payer.id === user.user.id
                ? "you"
                : activity.payer.username}{" "}
              paid
            </div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              ${activity.total.toFixed(2)}
            </div>
          </div>
          <div className="activity_expense_head_quicktotal_net">
            <div style={{ color: "gray" }}>
              {activity.payer.id === user.user.id
                ? `you lent`
                : `${activity.payer.username} lent you`}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {activity.payer.id === user.user.id ? (
                <span className="green">
                  $
                  {(
                    activity.total - calcPayerOwes(activity.money_owed)
                  ).toFixed(2)}
                </span>
              ) : (
                <span className="red">
                  ${calcUserOwes(activity.money_owed, user.user.id).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="activity_expense_delete">
          <div
            className="delete_expense_btn"
            onClick={(e) => handleExpenseDelete(activity.id, e)}
          >
            <i className="fa-solid fa-x" />
          </div>
        </div>
      </div>
      <div className="activity_expense_details">
        <div className="activity_expense_details_head">
          <img
            src={cat_icon_img}
            alt="category_icon"
            className="category_icon"
          ></img>
          <div className="flex_col">
            <div className="activity_expense_details_description">
              {activity.description}
            </div>
            <div className="activity_expense_details_total">
              ${activity.total.toFixed(2)}
            </div>
            <div className="activity_expense_edit">
              <EditExpenseFormModal expenseId={activity.id} />
            </div>
          </div>
        </div>
        <div className="activity_expense_details_bottom">
          <div className="activity_expense_details_breakdown flex_col">
            <div>
              <img
                src={user_icon_img}
                alt="user_icon"
                className="user_icon_details"
              />
              <div>
                <span>{activity.payer.username}</span> paid{" "}
                <span>${activity.total.toFixed(2)}</span> and owes{" "}
                <span>${calcPayerOwes(activity.money_owed)}</span>
              </div>
            </div>
            {activity.money_owed.length > 0 &&
              activity.money_owed.map((owed) => (
                <div key={owed.id}>
                  <img
                    src={user_icon_img}
                    alt="user_icon"
                    className="user_icon_details"
                  />
                  <div>
                    <span>{owed.username}</span> owes{" "}
                    <span>${owed.amount_owed.toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="activity_expense_details_comments flex_col">
            <div className="activity_expense_details_comments_head">
              <i className="fa-solid fa-comment" /> NOTES AND COMMENTS
            </div>
            {activity.comments.length > 0 &&
              sortComments(activity.comments).map((comment) => (
                <div key={comment.id} className="comment_box flex_col">
                  <div
                    className="flex_col"
                    id={`expense_comment_box${comment.id}`}
                  >
                    <div className="comment_head">
                      <div className="comment_head_left">
                        <span className="comment_username">
                          {comment.username}
                        </span>
                        <span className="comment_month">
                          {new Date(comment.date_created).toLocaleString(
                            "default",
                            { month: "short" }
                          )}
                        </span>
                        <span className="comment_date">
                          {new Date(comment.date_created).getDate()}
                        </span>
                      </div>
                      {user.user.id === comment.user_id && (
                        <div
                          className="delete_expense_comment_btn"
                          onClick={(e) =>
                            handleExpenseCommentDelete(comment.id, activity.id)
                          }
                        >
                          <i className="fa-solid fa-x" />
                        </div>
                      )}
                    </div>
                    <div className="comment_text">{comment.text}</div>
                    {user.user.id === comment.user_id && (
                      <button
                        className="edit_expense_comment_btn"
                        onClick={() => toggleEditComment(comment.id)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {user.user.id === comment.user_id && (
                    <EditExpenseCommentForm
                      expense_id={activity.id}
                      comment_id={comment.id}
                      original_text={comment.text}
                      toggleEditComment={() => toggleEditComment(comment.id)}
                    />
                  )}
                </div>
              ))}
            <div className="form_container">
              <AddExpenseCommentForm expense_id={activity.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseListItem;
