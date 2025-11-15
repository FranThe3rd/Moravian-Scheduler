import React from "react";
import "./login.css";
import { signInWithGoogle } from "../firebase";

const SignIn = () => {
  // Moravian-only login
  const handleMoravianLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const email = user.email.toLowerCase();
      if (!email.endsWith("@moravian.edu")) {
        alert("You must sign in with a @moravian.edu email address.");
        await result.user.delete();
        return;
      }

      window.location.href = "/courses";
    } catch (error) {
      console.error("Login error:", error);
      alert("Sign-in failed. Please try again.");
    }
  };

  // Personal login (no restriction)
  const handlePersonalLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Personal login:", result.user.email);

      window.location.href = "/courses";
    } catch (error) {
      console.error("Login error:", error);
      alert("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="login-root">
      <div className="login-box">
        <h1 className="login-title">Log In</h1>
        <p className="login-sub">Choose how you want to access your account</p>

        {/* Moravian Login Button */}
        <button className="google-btn moravian-btn" onClick={handleMoravianLogin}>
          <img
            src="https://media.licdn.com/dms/image/v2/C4D0BAQEv-WV9xDTiyw/company-logo_200_200/company-logo_200_200/0/1630472037409?e=2147483647&v=beta&t=TXJvSYET44LksX4ttpDEDl-ybAkbkNteSNJZn_suMDk"
            alt="Moravian Logo"
            className="google-icon moravian-icon"
          />
          Sign in with Moravian
        </button>

        {/* Personal Google Login */}
        <button className="google-btn" onClick={handlePersonalLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Sign in with Personal Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
