import { useState } from "react";
import "./check.css";

import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function Check({ onBack, onConfirm }) {
  const [email, setEmail] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleConfirm = async () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
        BACKEND API CALL

        Change this URL according to your backend endpoint.
      */

      const response = await fetch(
        "http://localhost:5000/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send OTP"
        );
      }

      // Move to OTP page
      onConfirm(email);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-page">
      <div className="check-card">

        {/* BACK BUTTON */}
        <button
          className="check-back-button"
          onClick={onBack}
        >
          ←
        </button>


        {/* BRAND */}
        <div className="check-brand">
          <img
            src={logo}
            alt="MediKiosk Logo"
          />

          <span>MediKiosk</span>
        </div>


        {/* TITLE */}
        <h1>Enter Your Email Address</h1>


        {/* EMAIL INPUT */}
        <div className="email-input-container">

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="email-input"
            autoComplete="email"
          />

          {error && (
            <p className="email-error">
              {error}
            </p>
          )}

        </div>


        {/* BUTTONS */}
        <div className="check-buttons">

          <button
            className="go-back-button"
            onClick={onBack}
          >
            Go Back
          </button>


          <button
            className="confirm-abha-button"
            disabled={!isValidEmail || loading}
            onClick={handleConfirm}
          >
            {loading ? "Sending..." : "Confirm"}
          </button>

        </div>


        {/* SOUND BUTTON */}
        <button
          className="check-sound-button"
          onClick={() => setIsMuted(!isMuted)}
        >
          <img
            src={isMuted ? muteSpeaker : speaker}
            alt={isMuted ? "Muted" : "Sound"}
          />
        </button>

      </div>
    </div>
  );
}