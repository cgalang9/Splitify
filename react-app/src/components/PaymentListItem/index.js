import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deletePaymentThunk } from "../../store/payments";
import EditPaymentFormModal from "../EditPaymentForm";
import user_icon_img from "../../assests/user_icon_img.png";
import payment_icon_img from "../../assests/payment_icon_img.png";
import AddPaymentCommentForm from "../AddPaymentComment";
import { deleteCommentPaymentThunk } from "../../store/payments";
import EditPaymentCommentForm from "../EditPaymentComment";
import "./PaymentListItem.css";

const PaymentListItem = ({ activity }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.session);

  const handlePaymentDelete = async (payment_id, e, payerId, payeeId) => {
    if (payerId !== user.user.id && payeeId !== user.user.id) {
      alert("You do not have permission to delete this payment");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this payment? You can not recover this payment after deletion."
      )
    ) {
      try {
        const data = await dispatch(deletePaymentThunk(payment_id));
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

  //sort comments by date create for comments section
  const sortComments = (comments) => {
    return comments.sort(
      (a, b) =>
        new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
    );
  };

  const handlePaymentCommentDelete = async (comment_id, payment_id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? You can not recover this comment after deletion."
      )
    ) {
      try {
        const data = await dispatch(
          deleteCommentPaymentThunk(comment_id, payment_id)
        );
        if (data.error) {
          history.push("/error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  //open/close edit comments form
  function toggleEditComment(comment_id) {
    const edit_comment_form = document.querySelector(
      `#payment_comment${comment_id}`
    );
    const original_comment = document.querySelector(
      `#payment_comment_box${comment_id}`
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

  //underline description in head on hover
  const underlineTitle = (e) => {
    let title = document.querySelector(`#head_title_${activity.id}`);
    title.classList.add("underline");
  };

  const removeUnderlineTitle = (e) => {
    let title = document.querySelector(`#head_title_${activity.id}`);
    title.classList.remove("underline");
  };

  return (
    <div className="activity_payment">
      <div
        className="activity_payment_head"
        onClick={toggleDetails}
        onMouseEnter={underlineTitle}
        onMouseLeave={removeUnderlineTitle}
      >
        <div className="activity_payment_head_left">
          <img
            src={payment_icon_img}
            alt="money_icon"
            className="money_icon_payment_li"
          ></img>
          <div
            className="group_page_activity_li_payment"
            id={`head_title_${activity.id}`}
          >
            {activity.payer.username} paid {activity.payee.username} $
            {activity.total.toFixed(2)}
          </div>
        </div>
        {activity.payer.id === user.user.id && (
          <div className="activity_payment_head_quicktotal">
            <div className="align_right" style={{ color: "gray" }}>
              you paid{" "}
            </div>
            <div className="red" style={{ fontWeight: 700, fontSize: 14 }}>
              ${activity.total.toFixed(2)}
            </div>
          </div>
        )}
        {activity.payee.id === user.user.id && (
          <div className="activity_payment_head_quicktotal">
            <div className="align_right" style={{ color: "gray" }}>
              you received
            </div>
            <div className="green" style={{ fontWeight: 700, fontSize: 14 }}>
              ${activity.total.toFixed(2)}
            </div>
          </div>
        )}
        {activity.payer.id !== user.user.id &&
          activity.payee.id !== user.user.id && (
            <div
              className="activity_payment_head_quicktotal"
              style={{ color: "gray" }}
            >
              not involved
            </div>
          )}
        <div className="activity_payment_delete">
          <div
            className="delete_payment_btn"
            onClick={(e) =>
              handlePaymentDelete(
                activity.id,
                e,
                activity.payer.id,
                activity.payee.id
              )
            }
          >
            <i className="fa-solid fa-x" />
          </div>
        </div>
      </div>
      <div className="activity_payment_details">
        <div className="activity_payment_details_head">
          <img
            src={payment_icon_img}
            alt="category_icon"
            className="category_icon"
          ></img>
          <div className="flex_col">
            <div className="activity_payment_details_description">Payment</div>
            <div className="activity_payment_details_total">
              ${activity.total.toFixed(2)}
            </div>
            <div>
              <EditPaymentFormModal paymentId={activity.id} />
            </div>
          </div>
        </div>
        <div className="activity_payment_details_bottom">
          <div className="activity_payment_details_breakdown">
            <div>
              <img
                src={user_icon_img}
                alt="user_icon"
                className="user_icon_details"
              />
              <div>
                <span>{activity.payer.username}</span> paid{" "}
                <span>${activity.total.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <img
                src={user_icon_img}
                alt="user_icon"
                className="user_icon_details"
              />
              <div>
                <span>{activity.payee.username}</span> paid{" "}
                <span>${activity.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="activity_payment_details_comments flex_col">
            <div className="activity_expense_details_comments_head">
              <i className="fa-solid fa-comment" /> NOTES AND COMMENTS
            </div>
            {activity.comments.length > 0 &&
              sortComments(activity.comments).map((comment) => (
                <div key={comment.id} className="comment_box flex_col">
                  <div
                    className="flex_col"
                    id={`payment_comment_box${comment.id}`}
                  >
                    <div className="comment_head">
                      <div className="comment_head_left">
                        <span className="bold">{comment.username}</span>
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
                          className="delete_payment_comment_btn"
                          onClick={(e) =>
                            handlePaymentCommentDelete(comment.id, activity.id)
                          }
                        >
                          <i className="fa-solid fa-x" />
                        </div>
                      )}
                    </div>
                    <div className="comment_text">{comment.text}</div>
                    {user.user.id === comment.user_id && (
                      <button
                        className="edit_payment_comment_btn"
                        onClick={() => toggleEditComment(comment.id)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {user.user.id === comment.user_id && (
                    <EditPaymentCommentForm
                      payment_id={activity.id}
                      comment_id={comment.id}
                      original_text={comment.text}
                      toggleEditComment={() => toggleEditComment(comment.id)}
                    />
                  )}
                </div>
              ))}
            <div className="form_container">
              <AddPaymentCommentForm payment_id={activity.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentListItem;
