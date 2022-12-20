import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Splash.css";
import phone1 from "../../assests/phone1.png";
import phone2 from "../../assests/phone2.png";
import phone3 from "../../assests/phone3.png";
import phone4 from "../../assests/phone4.png";
import phone5 from "../../assests/phone5.png";
import background from "../../assests/background.png";

const Splash = () => {
  const history = useHistory();

  //sets and clear interval that changes active image and words on top row
  useEffect(() => {
    const icons = document.querySelectorAll(".main_icon");
    const words = document.querySelectorAll(".last_line");
    const left_icons = document.querySelectorAll(".left_icon");
    let idx = 0;
    function next() {
      icons[idx].classList.remove("active");
      words[idx].classList.remove("active");
      left_icons[idx].classList.remove("left_active");
      if (idx < 3) {
        icons[idx + 1].classList.add("active");
        words[idx + 1].classList.add("active");
        left_icons[idx + 1].classList.add("left_active");
        idx = idx + 1;
      } else {
        icons[0].classList.add("active");
        words[0].classList.add("active");
        left_icons[0].classList.add("left_active");
        idx = 0;
      }
    }
    //sets and clear interval
    let intervalID;
    intervalID = setInterval(next, 4000);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <div id="splash_wrapper" className="flex_col">
      <div
        id="splash_row1_wrapper"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div id="splash_row1" className="splash_row">
          <div id="splash_row1_left" className="flex_col">
            <div id="splash_row1_left_head" className="flex_col">
              <div className="splash_head_row">Less stress when</div>
              <div className="splash_head_row">sharing expenses</div>
              <div className="splash_head_row">
                <div style={{ color: "#70caae" }} className="last_line active">
                  on trips.
                </div>
                <div style={{ color: "rgb(92, 0, 162)" }} className="last_line">
                  with housemates.
                </div>
                <div style={{ color: "red" }} className="last_line">
                  with your partner.
                </div>
                <div style={{ color: "#70caae" }} className="last_line">
                  with anyone.
                </div>
              </div>
              <div id="splash_row1_left_img_container">
                <div
                  style={{ color: "#70caae" }}
                  className="left_icon left_active"
                >
                  <i className="fa-solid fa-plane"></i>
                </div>
                <div style={{ color: "rgb(92, 0, 162)" }} className="left_icon">
                  <i className="fa-solid fa-house"></i>
                </div>
                <div style={{ color: "red" }} className="left_icon">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <div className="left_icon">
                  <i className="fa-solid fa-asterisk"></i>
                </div>
              </div>
            </div>
            <div id="splash_row1_left_foot">
              Keep track of your shared expenses and balances with housemates,
              trips, groups, friends, and family.
            </div>
            <div id="splash_signup" onClick={() => history.push("/signup")}>
              Sign Up
            </div>
          </div>
          <div id="splash_row1_right" className="flex_col">
            <div id="splash_row1_right_img_container">
              <div style={{ color: "#70caae" }} className="main_icon active">
                <i className="fa-solid fa-plane"></i>
              </div>
              <div style={{ color: "rgb(92, 0, 162)" }} className="main_icon">
                <i className="fa-solid fa-house"></i>
              </div>
              <div style={{ color: "red" }} className="main_icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="main_icon">
                <i className="fa-solid fa-asterisk"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="splash_row2" className="splash_row">
        <div
          id="splash_row2_left"
          className="splash_box flex_col"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="splash_box_head flex_col">
            <div className="splash_box_title">Track balances</div>
            <div className="splash_box_text">
              Keep track of shared expenses, balances, and who owes who.
            </div>
          </div>
          <img src={phone1} alt="phone" className="phone_img"></img>
        </div>
        <div
          id="splash_row2_right"
          className="splash_box flex_col"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="splash_box_head flex_col">
            <div className="splash_box_title">Organize expenses</div>
            <div className="splash_box_text">
              Split expenses with any group: trips, housemates, friends, and
              family.
            </div>
          </div>
          <img src={phone2} alt="phone" className="phone_img"></img>
        </div>
      </div>
      <div id="splash_row3" className="splash_row">
        <div
          id="splash_row3_left"
          className="splash_box flex_col"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="splash_box_head flex_col">
            <div className="splash_box_title">Add expenses easily</div>
            <div className="splash_box_text">
              Quickly add expenses on the go before you forget who paid.
            </div>
          </div>
          <img src={phone3} alt="phone" className="phone_img"></img>
        </div>
        <div
          id="splash_row3_right"
          className="splash_box flex_col"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="splash_box_head flex_col">
            <div className="splash_box_title">Pay friends back</div>
            <div className="splash_box_text">
              Settle up with a friend and record any cash or online payment.
            </div>
          </div>
          <img src={phone4} alt="phone" className="phone_img"></img>
        </div>
      </div>
      <div
        id="splash_row4_wrapper"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div id="splash_row4">
          <div id="splash_row4_left">
            <div id="splash_row4_left_head_top">Get even more with PRO</div>
            <div id="splash_row4_left_head_bottom">
              Get even more organized with receipt scanning, charts and graphs,
              currency conversion, and more!
            </div>
            <div
              id="splash_signup_bottom"
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </div>
          </div>
          <div id="splash_row4_right">
            <img src={phone5} alt="phone" className="phone_img"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
