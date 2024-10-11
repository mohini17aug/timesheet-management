import './App.css';
import Login from './Components/login/login';
import ForgotPassword from './Components/forgotpassword/Forgot.js';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import UpdatePassword from './Components/forgotpassword/UpdatePassword';
import EmployeeDashboard from './Components/employeedashboard/Dashboard';
import AdminDashboard from './Components/admindashboard/Admin';
import ManagerDashboard from './Components/managerdashboard/ManagerDashboard';


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
