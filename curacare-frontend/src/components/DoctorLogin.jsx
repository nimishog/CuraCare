import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { useState } from "react";
import "./DoctorLogin.css";

import logo from "../assets/logo.png";

export default function DoctorLogin({ onBack, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      console.log("Doctor logged in:", userCredential.user);

      alert("Doctor Login Successful!");

      // Dashboard navigation will be connected here
      // after we inspect the frontend guy's dashboard routing.
    } catch (error) {
      console.error("Doctor Login Error:", error);

      alert("Invalid email or password.");
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
            alt="MediKiosk Logo"
          />

          <span>Curacare</span>
        </div>

        {/* FORM */}
        <div className="doctor-form">

          <input
            className="doctor-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="register-text">
            Don't have an account?

            <button onClick={onRegister}>
              Register now
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}