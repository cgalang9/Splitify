import React from "react";
import { useHistory } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const history = useHistory();

  return (
    <div id="footer">
      <div id="footer-left">Splitify created by Carmelino Galang</div>
      <div className="footer-github-icon">
        Connect:
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/cgalang9"
        >
          <i className="fa-brands fa-github" />
          <span>GitHub</span>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/carmelino-galang-53369a205"
        >
          <i className="fab fa-linkedin-in"></i>
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
