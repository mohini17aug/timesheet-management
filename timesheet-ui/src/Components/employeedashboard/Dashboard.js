import React, { useState } from "react";
import { Container } from "@mui/material";
import Sidebar from "../common/SideBar.js";
import TopNav from "../common/TopNav.js";
import AttendanceReport from "../common/AttendanceReport.js";
import AttendanceTable from "./AttendanceTable.js";

const EmployeeDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    "05 Aug '24 - 11 Aug '24"
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, paddingLeft: '120px' }}>
        <TopNav />
        <Container>
          <AttendanceReport
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
          <AttendanceTable selectedDateRange={selectedDateRange} />
        </Container>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
