import { useState } from "react";
import emailjs from "@emailjs/browser";

import "./check.css";

import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function Check({
  onBack,
  onConfirm,
  setGeneratedOtp,
}) {
  const [email, setEmail] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleConfirm = async () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Generate a 6-digit OTP
      const newOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Send OTP using EmailJS
      await emailjs.send(
        "service_kw91dxr",
        "template_l4ryo6b",
        {
          email: email,
          passcode: newOtp,
        },
        "7fDrOnbG5Kxuie4Ye"
      );

      // Store OTP in App.jsx
      setGeneratedOtp(newOtp);

      console.log("OTP sent successfully");

      // Move to separate OTP verification page
      onConfirm(email);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("Failed to send OTP. Please try again.");
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
            alt="CuraCare Logo"
          />

          <span>CuraCare</span>
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