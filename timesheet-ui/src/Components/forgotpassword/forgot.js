import React, { useState } from "react";
import './forgot.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const updatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Make a request to the backend to update the password (if needed)
    // Here we'll just display a success message for the mockup.
    setMessage('Password updated successfully!');
    setError('');
  };

  return (
    <div className="forgot">
    <div className="forgot-password">
      <h1>Forgot Password</h1>

      <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button >Send Verification Code</button>
            {/* <button onClick={sendEmail}>Send Verification Code</button> */}
          </div>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
    </div>
  );
};

export default ForgotPassword;
