import './App.css';
import Login from './Components/Login/login';
import ForgotPassword from './Components/forgotpassword/forgot';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import UpdatePassword from './Components/forgotpassword/updatepassword';
import Dashboard from './Components/dashboard/Dashboard';
import AdminDashboard from './Components/admindashboard/admin';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route  path="/updatepassword" element={<UpdatePassword/>}/>
      <Route  path="/dashboard" element={<Dashboard/>}/>
      <Route path='/admin' element={<AdminDashboard/>}/>
    </Routes>
  </Router>
  );
}

export default App;
