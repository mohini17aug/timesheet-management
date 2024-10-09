import React, { useState } from "react";
import './forgot.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [otp,setOtp]=useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate();

  const updatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    axios.post('https://timesheet-drf-app.onrender.com/timesheet/password-reset-confirm/', {
        email : localStorage.getItem("email"),
        otp_code: otp,
        new_password: newPassword
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        console.log(response);
        // Response was successful, now check for specific status codes
        if (response.status === 200) {
          // Handle success (OK)
          console.log('Success:', response.data);
          console.log("update Successful");
          alert("Updated Successfully");
          navigate("/");
        } else if (response.status === 201) {
          // Handle resource created
          console.log('Resource created:', response.data);
        }
      })
      .catch(error => {
        if (error.response) {
          // Error response received from the server
          if (error.response.status === 400) {
            // Handle bad request
            console.log('Bad request:', error.response.data);
          } else if (error.response.status === 401) {
            // Handle unauthorized
            console.log('Unauthorized:', error.response.data);
          } else if (error.response.status === 404) {
            // Handle not found
            console.log('Not found:', error.response.data);
          }
        } else if (error.request) {
          // Request was made but no response was received
          console.log('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.log('Error', error.message);
        }
      });
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
              type="text"
              placeholder="Enter your Otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
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
