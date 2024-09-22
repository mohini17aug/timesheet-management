import React, { useState } from "react";
import './forgot.css';

const UpdatePassword = () => {
  const [email, setEmail] = useState("");
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
      <h1>Update Password</h1>
      <div>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* <button>Submit</button> */}
          <button onClick={updatePassword}>Submit</button>
        </div>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
    </div>
  );
};

export default UpdatePassword;
