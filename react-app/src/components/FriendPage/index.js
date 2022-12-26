import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCurrUserExpensesThunk } from "../../store/expenses";
import { getCurrUserPaymentsThunk } from "../../store/payments";
import "./FriendPage.css";
import LeftMenu from "../LeftMenu";
import AddExpenseFormModal from "../AddExpenseForm";
import AddPaymentFormModal from "../AddPaymentForm";
import github from "../../assests/github.png";
import user_icon_img from "../../assests/user_icon_img.png";

export default function FriendPage() {
  return (
    <div id="friends_page_wrapper">
      <div id="friends_page_left">
        <LeftMenu />
      </div>
      <div id="friends_page_mid" className="flex_col">
        <div id="friends_page_head">
          <div id="friends_page_top">
            <div id="friends_page_title">Friend Name Here</div>
            <div id="friends_page_buttons_container">
              <AddExpenseFormModal />
              <AddPaymentFormModal />
            </div>
          </div>
        </div>
        <div id="dash_mid_main"></div>
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
}
