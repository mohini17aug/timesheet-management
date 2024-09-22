import {React,useState} from "react";
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("user login");
    console.log(email+"---"+password+"---");
    axios.post('http://localhost:8000/timesheet/token/', {
        username: email,
        password: password,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log(response);
        alert("login Successfull !!");
        navigate("/");
    })
    .catch(error => {
        console.error('Error:', error.response.data);
        // // // Handle errors here
        // if (error.response) {
        //     // Server responded with a status other than 2xx
        //     console.error('Response Error:', error.response);
        //     console.log('Status:', error.response.status);
        //     console.log('Data:', error.response.data);
        //     console.log('Headers:', error.response.headers);
        //     setError(error.response.data.detail || 'Login failed, please try again.');
        // } else if (error.request) {
        //     // Request was made but no response was received
        //     console.error('No Response Error:', error.request);
        //     setError('No response from server. Please check your network.');
        // } else {
        //     // Something happened in setting up the request
        //     console.error('Axios Error:', error.message);
        //     setError('Error setting up request. Please try again.');
        // }
        // console.log('Config:', error.config);
    });
    };

    return(
        <div className="login">
        <div className="loginform">
            <form onSubmit={handleSubmit}>
                <h1>Login to your Account</h1>
                <div className="input-box">
                    <input type="email" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}required/>
                    <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <FontAwesomeIcon icon={faLock} className="icon" />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit">Login</button>
                <div className="forgot1">
                    <Link to="/forgot">Forgot password?</Link> 
                </div>
            </form>
          </div>
        </div>
    );
};

export default Login;