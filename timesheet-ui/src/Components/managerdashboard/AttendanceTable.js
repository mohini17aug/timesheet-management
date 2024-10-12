import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper } from '@mui/material';
import ApproveRejectButton from './ApproveRejectButton';
import axios from "axios";
import { backendServerUrl } from "../utils/constants.ts";
import { formatDateRange } from '../utils/utils.ts'


const AttendanceTable = (props) => {

  const [attendanceData, setAttendanceData] = React.useState([]);

  function transform(data) {
    return data?.map(employee => {
      const projects = {};

      // Organize hours by project
      employee.timesheet.forEach(entry => {
        if (!projects[entry.project]) {
          projects[entry.project] = Array(7).fill(0); // Fill 7 days with 0 initially
        }

        // Find the index based on the date range (April 28 - May 4)
        const dateIndex = new Date(entry.date).getDate() - 28;
        projects[entry.project][dateIndex] = entry.hours;
      });

      // Transform the project data into the required format
      const transformedProjects = Object.keys(projects).map(project => ({
        name: project,
        hours: projects[project],
      }));

      // Return the final transformed object for each employee
      return {
        name: employee.first_name,
        projects: transformedProjects,
        id: employee.id,
      };
    });
  }


  React.useEffect(() => {
    const dates = formatDateRange(props.selectedDateRange);
    axios
      .get(`${backendServerUrl}timesheets/${localStorage.getItem('id')}/subordinates_timesheets/?start_date=${dates[0]}&end_date=${dates.at(-1)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        console.log(response)
        const data = transform(response);
        setAttendanceData(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, [props.selectedDateRange])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:'bold'}} >Emp Name</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Project</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Mon</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Tue</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Wed</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Thu</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Fri</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Sat</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Sun</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Total</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((emp, index) => (
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
