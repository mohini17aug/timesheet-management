import {React,useState} from "react";
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("user login");
    
    // if(!email || !password ) {
    //     setError('Please fill in all fields');
    //     return;
    // }
    // axios.post('http://127.0.0.1:8000/login/', {
    //         username: email,
    //         password: password,
    //     })
    //     .then(response => {
    //         console.log(response.data);
    //         alert("Login Successfull !!");
    //             localStorage.setItem("Name",email)
    //             navigate("/booking");)
    //     .catch(error => {
    //         console.error('Error:', error.response.status);
    //         // Handle errors here
    //         if(error.response.status=== 400)
    //         {setError("Invalid user name or password")}
    //     });
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
                <div className="forgot">
                    <a href="/forgot">Forgot password?</a>
                </div>
            </form>
          </div>
        </div>
    );
};

export default Login;