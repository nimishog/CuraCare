import { useState } from "react";
import "./OTPVerification.css";

import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function OTPVerification({
  onBack,
  email,
  generatedOtp,
}) {
  const [otp, setOtp] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 6);

    setOtp(value);
    setError("");
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    if (otp === generatedOtp) {
      console.log("OTP Verified Successfully!");
      alert("Patient Login Successful!");
    } else {
      setError("Invalid OTP. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="otp-page">
      <div className="otp-card">

        {/* BACK BUTTON */}
        <button
          className="otp-back-button"
          onClick={onBack}
        >
          ←
        </button>

        {/* BRAND */}
        <div className="otp-brand">
          <img
            src={logo}
            alt="MediKiosk Logo"
          />

          <span>MediKiosk</span>
        </div>

        {/* TITLE */}
        <h1>OTP Verification</h1>

        {/* SUBTITLE */}
        <p className="otp-subtitle">
          We've sent a 6-digit verification code to
        </p>

        <p className="otp-email">
          {email}
        </p>

        {/* OTP INPUT */}
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="Enter 6-digit OTP"
          className="otp-input"
          inputMode="numeric"
          maxLength="6"
        />

        {/* ERROR */}
        {error && (
          <p className="otp-error">
            {error}
          </p>
        )}

        {/* BUTTONS */}
        <div className="otp-buttons">
          <button
            className="otp-go-back-button"
            onClick={onBack}
          >
            Go Back
          </button>

          <button
            className="verify-otp-button"
            disabled={otp.length !== 6 || loading}
            onClick={handleVerify}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        {/* SOUND BUTTON */}
        <button
          className="otp-sound-button"
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