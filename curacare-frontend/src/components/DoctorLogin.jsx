import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { useState } from "react";
import "./DoctorLogin.css";

import logo from "../assets/logo.png";

export default function DoctorLogin({
  onBack,
  onRegister,
  onLogin
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Doctor logged in:", userCredential.user);

      // Move to Doctor Dashboard
      onLogin();

    } catch (error) {
      console.error("Doctor Login Error:", error);

      if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password.");
      } else if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="doctor-login-page">

      {/* BACK BUTTON */}
      <button
        className="doctor-back-button"
        onClick={onBack}
      >
        ←
      </button>

      {/* LOGIN CARD */}
      <div className="doctor-login-card">

        {/* BRAND */}
        <div className="doctor-brand">
          <img
            src={logo}
            alt="CuraCare Logo"
          />

          <span>CuraCare</span>
        </div>

        {/* FORM */}
        <form
          className="doctor-form"
          onSubmit={handleLogin}
        >

          <input
            className="doctor-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="doctor-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="forgot-password">
            Forgot password?
          </p>

          <button
            className="doctor-login-button"
            type="submit"
          >
            Login
          </button>

          <p className="register-text">
            Don't have an account?

            <button
              type="button"
              onClick={onRegister}
            >
              Register now
            </button>
          </p>

        </form>

      </div>

    </div>
  );
}