import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import './Splash.css'

const Splash = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    return (
        <div id='splash_wrapper' className='flex_col'>
            <div id='splash_row1_wrapper'>
                <div id='splash_row1' className='splash_row'>
                    <div id='splash_row1_left' className='flex_col'>
                        <div id='splash_row1_left_head' className='flex_col'>
                            <div className='splash_head_row'>Less stress when</div>
                            <div className='splash_head_row'>sharing expenses</div>
                            <div className='splash_head_row' style={{ color: '#70caae' }}>
                                {/* on trips.
                                with housemates.
                                with your partner. */}
                                with anyone.
                            </div>
                        </div>
                        <div id='splash_row1_left_foot'>Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family.</div>
                        <div id='splash_signup' onClick={() => history.push('/signup')}>Sign Up</div>
                    </div>
                    <div id='splash_row1_right' className='flex_col'>
                        <div id='splash_row1_right_img_container'>
                            <i className="fa-solid fa-plane main_icon"></i>
                            {/* <i className="fa-solid fa-house main_icon"></i> */}
                            {/* <i className="fa-solid fa-heart main_icon"></i> */}
                            {/* <i className="fa-solid fa-asterisk main_icon"></i> */}
                        </div>
                    </div>
                </div>
            </div>
            <div id='splash_row2' className='splash_row'>
                <div id='splash_row2_left' className='splash_box flex_col'>
                    <div className='splash_box_head flex_col'>
                        <div className='splash_box_title'>Track balances</div>
                        <div className='splash_box_text'>Keep track of shared expenses, balances, and who owes who.</div>
                    </div>
                    <img src='https://www.splitwise.com/assets/home_page/fixtures/asset1@2x.png' alt='phone' className='phone_img'></img>
                </div>
                <div id='splash_row2_right' className='splash_box flex_col'>
                    <div className='splash_box_head flex_col'>
                        <div className='splash_box_title'>Organize expenses</div>
                        <div className='splash_box_text'>Split expenses with any group: trips, housemates, friends, and family.</div>
                    </div>
                    <img src='https://www.splitwise.com/assets/home_page/fixtures/asset2@2x.png' alt='phone' className='phone_img'></img>
                </div>
            </div>
            <div id='splash_row3' className='splash_row'>
                <div id='splash_row3_left' className='splash_box flex_col'>
                    <div className='splash_box_head flex_col'>
                        <div className='splash_box_title'>Add expenses easily</div>
                        <div className='splash_box_text'>Quickly add expenses on the go before you forget who paid.</div>
                    </div>
                    <img src='https://www.splitwise.com/assets/home_page/fixtures/asset3@2x.png' alt='phone' className='phone_img'></img>
                    </div>
                <div id='splash_row3_right' className='splash_box flex_col'>
                    <div className='splash_box_head flex_col'>
                        <div className='splash_box_title'>Pay friends back</div>
                        <div className='splash_box_text'>Settle up with a friend and record any cash or online payment.</div>
                    </div>
                    <img src='https://www.splitwise.com/assets/home_page/fixtures/asset4@2x.png' alt='phone' className='phone_img'></img>
                </div>
            </div>
            <div id='splash_row4_wrapper'>
                <div id='splash_row4'>
                    <div id='splash_row4_left'>
                        <div id='splash_row4_left_head_top'>Get even more with PRO</div>
                        <div id='splash_row4_left_head_bottom'>Get even more organized with receipt scanning, charts and graphs, currency conversion, and more!</div>
                        <div id='splash_signup_bottom' onClick={() => history.push('/signup')}>Sign Up</div>
                    </div>
                    <div id='splash_row4_right'>
                        <img src='https://www.splitwise.com/assets/home_page/fixtures/asset5@2x.png' alt='phone' className='phone_img'></img>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Splash
