import './App.css';
import Login from './Components/login/Login.js';
import ForgotPassword from './Components/forgotpassword/Forgot.js';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import UpdatePassword from './Components/forgotpassword/UpdatePassword.js';
import EmployeeDashboard from './Components/employeedashboard/Dashboard.js';
import AdminDashboard from './Components/admindashboard/Admin.js';
import ManagerDashboard from './Components/managerdashboard/ManagerDashboard.js';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route  path="/updatepassword" element={<UpdatePassword/>}/>
      <Route  path="/dashboard" element={<EmployeeDashboard/>}/>
      <Route path='/admin' element={<AdminDashboard/>}/>
      <Route path='/manager' element={<ManagerDashboard/>}/>
    </Routes>
  </Router>
  );
}

export default App;
