import { useState } from "react";
import "./check.css";

import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function Check({ onBack, onVerified }) {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* EMAIL CONTINUE */
  const handleEmailContinue = () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setStep("otp");
  };

  /* OTP INPUT */
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
    setError("");
  };

  /* OTP VERIFY - UI ONLY */
  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter a 6 digit verification code");
      return;
    }

    setError("");

    // No actual OTP verification
    if (onVerified) {
      onVerified(email);
    }
  };

  /* GO BACK FROM OTP TO EMAIL */
  const handleOtpBack = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  return (
    <div className="check-page">
      <div className="check-card">

        {/* BACK BUTTON */}
        <button
          className="check-back-button"
          onClick={step === "email" ? onBack : handleOtpBack}
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

        {/* EMAIL PAGE */}
        {step === "email" && (
          <div className="check-content">

            <h1>Enter Your Email Address</h1>

            <p className="check-subtitle">
              Enter your email address to continue
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email address"
              className="email-input"
            />

            {error && (
              <p className="email-error">
                {error}
              </p>
            )}

            <div className="check-buttons">

              <button
                className="go-back-button"
                onClick={onBack}
              >
                Go Back
              </button>

              <button
                className="confirm-abha-button"
                onClick={handleEmailContinue}
              >
                Continue
              </button>

            </div>

          </div>
        )}

        {/* OTP PAGE - SAME COMPONENT */}
        {step === "otp" && (
          <div className="check-content">

            <h1>Verify Your Email</h1>

            <p className="check-subtitle">
              Enter the 6 digit verification code
            </p>

            <p className="email-display">
              {email}
            </p>

            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="email-input otp-input"
              inputMode="numeric"
            />

            {error && (
              <p className="email-error">
                {error}
              </p>
            )}

            <div className="check-buttons">

              <button
                className="go-back-button"
                onClick={handleOtpBack}
              >
                Change Email
              </button>

              <button
                className="confirm-abha-button"
                onClick={handleVerify}
              >
                Verify
              </button>

            </div>

          </div>
        )}

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