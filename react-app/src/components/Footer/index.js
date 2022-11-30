import React from 'react';
import { useHistory } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
    const history = useHistory()


    return (
        <div id='footer'>
            <div className="footer-github-icon">
                <a href="https://github.com/cgalang9">
                    <i className="fa-brands fa-github" /> <span className='foot_link_name'>Github</span>
                </a>
            </div>
            <div>
                Splitify created by Carmelino Galang
            </div>
        </div>
    )
};

export default Footer
