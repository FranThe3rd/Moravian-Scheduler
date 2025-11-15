import React from "react";
import "./login.css";
import { signInWithGoogle } from "../firebase";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("User logged in:", result.user);

      // Redirect after login
      window.location.href = "/courses"; 
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-root">
      <div className="login-box">
        <h1 className="login-title">Log In</h1>
        <p className="login-sub">Access your Moravian Scheduler account</p>

        <button className="google-btn" onClick={handleLogin}>
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

export default Login;
