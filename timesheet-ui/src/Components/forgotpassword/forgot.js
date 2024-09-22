import React, { useState } from "react";
import './forgot.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate();

  const sendEmail = () => {
    axios.post('https://timesheet-drf-app.onrender.com/timesheet/password-reset/', {
      email: email
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
  }
  

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
            <button onClick={sendEmail}>Send Verification Code</button>
          </div>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
    </div>
  );
};

export default ForgotPassword;
