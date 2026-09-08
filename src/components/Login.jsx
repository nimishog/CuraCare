import { useState } from "react";
import emailjs from "@emailjs/browser";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    try {
      setMessage("");

      if (!email) {
        setMessage("Please enter your email.");
        return;
      }

      // Generate a random 6-digit OTP
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

      // Store OTP temporarily for verification
      setGeneratedOtp(newOtp);
      setOtpSent(true);
      setMessage("OTP sent successfully! Check your email.");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = () => {
    if (!otpSent) {
      setMessage("Please request an OTP first.");
      return;
    }

    if (otp === generatedOtp) {
      setMessage("Login successful!");
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h1>CuraCare</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={sendOTP}>
        Send OTP
      </button>

      {otpSent && (
        <>
          <br />
          <br />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />

          <br />
          <br />

          <button onClick={verifyOTP}>
            Verify OTP
          </button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}

export default Login;