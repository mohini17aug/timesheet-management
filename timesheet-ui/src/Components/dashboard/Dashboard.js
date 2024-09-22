import React from 'react';
import { Container, Button } from '@mui/material';
import Sidebar from './SideBar.js';
import TopNav from './TopNov.js';
import AttendanceReport from './AttendanceReport.js';
import AttendanceTable from './AttendanceTable.tsx';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <TopNav />
        <Container>
          <AttendanceReport />
          <AttendanceTable />
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
