import React from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import DateRangePicker from './DateRangePicker';
import AttendanceTable from './AttendanceTable';
import { Box } from '@mui/material';

function ManagerDashboard() {
  return (
    <Box sx={{ display: 'flex', marginLeft: '120px' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <DateRangePicker />
        <AttendanceTable />
      </Box>
    </Box>
  );
}

export default ManagerDashboard;
