import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper } from '@mui/material';
import ApproveRejectButton from './ApproveRejectButton';
import axios from "axios";
import { backendServerUrl } from "../utils/constants.ts";
import {formatDateRange} from '../utils/utils.ts'


const AttendanceTable = (props) => {

  React.useEffect(() => {
    const dates = formatDateRange(props.selectedDateRange);
    axios
      .get(`${backendServerUrl}timesheets/${localStorage.getItem('id')}/subordinates_timesheets/?start_date=${dates[0]}&end_date=${dates.at(-1)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {console.log(response)})
      .catch((error) => console.error("Error fetching projects:", error));
}, [props.selectedDateRange])

const employees = [
  {
    name: 'Mohini',
    projects: [{ name: 'Project 1', hours: [8, 8, 8, 8, 4, 0, 0] }, { name: 'Project 2', hours: [8, 8, 8, 8, 4, 0, 0] }],
  },
  {
    name: 'Shivani',
    projects: [{ name: 'Time Off', hours: [8, 8, 8, 8, 0, 0, 0] }, { name: 'Project 2', hours: [8, 8, 8, 8, 8, 0, 0] }],
  },
];

return (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Emp Name</TableCell>
          <TableCell>Project</TableCell>
          <TableCell>Mon</TableCell>
          <TableCell>Tue</TableCell>
          <TableCell>Wed</TableCell>
          <TableCell>Thu</TableCell>
          <TableCell>Fri</TableCell>
          <TableCell>Sat</TableCell>
          <TableCell>Sun</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((emp, index) => (
          emp.projects.map((project, i) => (
            <TableRow key={`${emp.name}-${i}`}>
              {i === 0 && (
                <TableCell rowSpan={emp.projects.length}>{emp.name}</TableCell>
              )}
              <TableCell>{project.name}</TableCell>
              {project.hours.map((hour, day) => (
                <TableCell key={day}>{hour}</TableCell>
              ))}
              <TableCell>{project.hours.reduce((acc, hour) => acc + hour, 0)}</TableCell>
              {i === 0 && (
                <TableCell rowSpan={emp.projects.length}>
                  <ApproveRejectButton />
                </TableCell>
              )}
            </TableRow>
          ))
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
};

export default AttendanceTable;
