import React from "react";
import "./login.css";

const LogIn = () => {
  return (
    <div className="login-root">
      <div className="login-box">
        <h1 className="login-title">Log In</h1>
        <p className="login-sub">Access your Moravian Scheduler account</p>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LogIn;
