import { useState } from "react";
import "./DoctorRegister.css";

import logo from "../assets/logo.png";

export default function DoctorRegister({ onBack, onLogin }) {
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const handleRegister = () => {
    if (!doctorName || !email || !password || !retypePassword) {
      alert("Please fill all the fields");
      return;
    }

    if (password !== retypePassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({
      doctorName,
      email,
      password,
    });

    alert("Registration successful");

    // Go back to login page after registration
    onLogin();
  };

  return (
    <div className="doctor-register-page">

      {/* BACK BUTTON */}
      <button
        className="register-back-button"
        onClick={onBack}
      >
        ←
      </button>

      {/* REGISTER CARD */}
      <div className="doctor-register-card">

        {/* BRAND */}
        <div className="register-brand">
          <img
            src={logo}
            alt="MediKiosk Logo"
          />

          <span>CuraCare</span>
        </div>

        {/* FORM */}
        <div className="register-form">

          <input
            className="register-input"
            type="text"
            placeholder="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />

          <input
            className="register-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="register-input"
            type="password"
            placeholder="Retype Password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
          />

          <button
            className="doctor-register-button"
            onClick={handleRegister}
          >
            Register
          </button>

          <p className="login-text">
            Already have an account?

            <button
              onClick={onLogin}
            >
              Login now
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}