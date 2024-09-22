import './App.css';
import Login from './Components/Login/login';
import ForgotPassword from './Components/forgotpassword/forgot';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import UpdatePassword from './Components/forgotpassword/updatepassword';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route  path="/updatepassword" element={<UpdatePassword/>}/>
    </Routes>
  </Router>
  );
}

export default App;
