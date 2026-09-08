import { useState } from "react";
import "./SelectRole.css";

import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function SelectRole({ onBack, onConfirm }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="role-page">
      <div className="role-card">

        {/* Back Button */}
        <button className="back-button" onClick={onBack}>
          ←
        </button>

        {/* Brand */}
        <div className="brand">
          <div className="brand-placeholder">
            <img src={logo} alt="CuraCare Logo" />
          </div>

          <h2>CuraCare</h2>
        </div>

        {/* HEADING */}
        <h1 className="role-heading">
          Select Your Role
        </h1>

        {/* Role Cards */}
        <div className="role-options">

          {/* Doctor */}
          <button
            className={`role-option ${
              selectedRole === "doctor" ? "selected" : ""
            }`}
            onClick={() => setSelectedRole("doctor")}
          >
            <div className="role-icon doctor-icon">
              <div className="doctor-head"></div>
              <div className="doctor-body">
                <div className="doctor-cross">+</div>
              </div>
            </div>

            <span>Doctor</span>
          </button>

          {/* Patient */}
          <button
            className={`role-option ${
              selectedRole === "patient" ? "selected" : ""
            }`}
            onClick={() => setSelectedRole("patient")}
          >
            <div className="role-icon patient-icon">
              <div className="patient-head"></div>
              <div className="patient-body"></div>
              <div className="patient-wheel"></div>
            </div>

            <span>Patient</span>
          </button>

        </div>

        {/* Bottom Buttons */}
        <div className="role-buttons">

          <button className="go-back" onClick={onBack}>
            Go Back
          </button>

          <button
            className="confirm-button"
            disabled={!selectedRole}
            onClick={() => onConfirm(selectedRole)}
          >
            Confirm
          </button>

        </div>

        {/* Sound */}
        <button
          className="sound-button"
          onClick={() => setIsMuted(!isMuted)}
        >
          <img
            src={isMuted ? muteSpeaker : speaker}
            alt="Sound"
          />
        </button>

      </div>
    </div>
  );
}