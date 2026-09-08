import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { useState } from "react";
import "./DoctorLogin.css";

import logo from "../assets/logo.png";

export default function DoctorLogin({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Doctor logged in:", userCredential.user);

    alert("Doctor Login Successful!");
  } catch (error) {
    console.error("Doctor Login Error:", error);

    alert("Invalid email or password.");
  }
};

  return (
    <div className="doctor-login-page">

      {/* LEFT SIDE */}
      <div className="doctor-visual-section">

        <div className="medical-circle">

          <div className="medical-image image-one">
            <img
              src="/hospital.jpg"
              alt="Hospital"
            />
          </div>

          <div className="medical-image image-two">
            <img
              src="/tablet.jpg"
              alt="Medical Technology"
            />
          </div>

          <div className="medical-image image-three">
            <img
              src="/doctor.jpg"
              alt="Doctor"
            />
          </div>

          <div className="medical-icon icon-one">✚</div>
          <div className="medical-icon icon-two">✚</div>
          <div className="medical-icon icon-three">✚</div>

        </div>

      </div>


      {/* LOGIN CARD */}
      <div className="doctor-login-card">

        {/* Back Button */}
        <button
          className="doctor-back-button"
          onClick={onBack}
        >
          ←
        </button>

        {/* Branding */}
        <div className="doctor-brand">
          <img src={logo} alt="MediKiosk Logo" />
          <h2>Curacure</h2>
        </div>


        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="doctor-login-button"
          >
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
          <span> Register</span>
        </p>

      </div>

    </div>
  );
}