import { React, useState } from "react";
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendServerUrl } from "../utils/constants.ts";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("user login");
    console.log(email + "---" + password + "---");
    setLoading(true);
    axios.post(`${backendServerUrl}token/`, {
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log(response);
        // Response was successful, now checking for specific status codes
        if (response.status === 200) {
          console.log('Success:', response.data["access"]);
          localStorage.setItem("accesstoken", response.data["access"]);
          localStorage.setItem("refreshtoken", response.data["refresh"]);
          console.log(email);
          console.log(localStorage.getItem("accesstoken"));
          axios.get(`${backendServerUrl}employees/?email=${email}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            },
          }).then(response => {
            if (response.status === 200) {
              const role = response.data["role"];
              localStorage.setItem("role", role);
              localStorage.setItem("name", response.data["first_name"]);
              localStorage.setItem("id",response.data["id"]);
              if (role === "Employee") {
                navigate("/dashboard");
              }
              else if (role ==="Manager"){
                navigate("/manager");
              }
              else {
                navigate("/admin");
              }
            }
          });

        } else if (response.status === 201) {
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
            console.log('Unauthorized:', error.response.data["detail"]);
            setError(error.response.data["detail"]);
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
      })
      .finally(()=>{
        setLoading(true);
      });
  };

  return (
    <div className="login">
      <div className="loginform">
        <form onSubmit={handleSubmit}>
          <h1>Login to your Account</h1>
          <div className="input-box">
            <input type="email" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FontAwesomeIcon icon={faUser} className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FontAwesomeIcon icon={faLock} className="icon" />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <div className="forgot1">
            <Link to="/forgot">Forgot password?</Link>
          </div>
        </form>
        {loading && <div>Loading...</div>} 
      </div>
    </div>
  );
};

export default Login;