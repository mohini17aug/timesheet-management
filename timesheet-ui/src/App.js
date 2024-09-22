import './App.css';
import Login from './Components/Login/login';
import ForgotPassword from './Components/forgotpassword/forgot';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import UpdatePassword from './Components/forgotpassword/updatepassword';
import Employee from './Components/Employee/employee';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route  path="/updatepassword" element={<UpdatePassword/>}/>
      <Route path='/employee' element={<Employee/>}/>
    </Routes>
  </Router>
  );
}

export default App;
