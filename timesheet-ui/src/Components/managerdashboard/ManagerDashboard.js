import React, { useState } from 'react';
import Sidebar from '../common/SideBar';
import Header from './Header';
import AttendanceReport from "../common/AttendanceReport.js";
import AttendanceTable from './AttendanceTable';
import { Box } from '@mui/material';

function ManagerDashboard() {

  const [selectedDateRange, setSelectedDateRange] = useState(
    "05 Aug '24 - 11 Aug '24"
  );


  return (
    <Box sx={{ display: 'flex', marginLeft: '120px' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <AttendanceReport selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange}/>
        <AttendanceTable />
      </Box>
    </Box>
  );
}

export default ManagerDashboard;
