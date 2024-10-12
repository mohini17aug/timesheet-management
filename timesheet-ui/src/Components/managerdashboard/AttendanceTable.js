import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, Typography } from '@mui/material';
import ApproveRejectButton from './ApproveRejectButton';
import axios from "axios";
import { backendServerUrl } from "../utils/constants.ts";
import { formatDateRange } from '../utils/utils.ts'


const AttendanceTable = (props) => {

  const [attendanceData, setAttendanceData] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);

  React.useEffect(() => {
    getProjects();
    getAttendanceData();
  }, [props.selectedDateRange])


  const getAttendanceData = async () => {
    const dates = formatDateRange(props.selectedDateRange);
    axios
      .get(`${backendServerUrl}timesheets/${localStorage.getItem('id')}/subordinates_timesheets/?start_date=${dates[0]}&end_date=${dates.at(-1)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        console.log(response)
        setAttendanceData(response.data);
      })
      .catch((error) => console.error("Error fetching projects:", error));

  }

  const getProjects = async () => {
    axios
      .get(`${backendServerUrl}projects/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setAvailableProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }

  const onApproveOrReject = (id, isApproved) => {
    const timesheetData = attendanceData.find(data => data.id === id);
    const timesheet = timesheetData.timesheet.map(ts =>
      ({ ...ts, status: isApproved ? 'Approved' : 'Rejected' })
    );

    console.log('timesheet', timesheet);
    const timesheetInfo = { employee: id, timesheet };

    axios
      .post(`${backendServerUrl}timesheets/`, timesheetInfo, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        getAttendanceData();
      })
      .catch(() => { });
  }



  const transform = (data) => {
    return data.map(employee => {
      const projects = {};
      let status = '';

      // Find the earliest date in the timesheet
      const minDate = new Date(
        Math.min(...employee.timesheet.map(entry => new Date(entry.date)))
      );

      // Organize hours by project dynamically based on the earliest date
      employee.timesheet.forEach(entry => {
        if (!projects[entry.project]) {
          projects[entry.project] = [0,0,0,0,0,0,0]; // Start an empty array for each project
        }

        const entryDate = new Date(entry.date);
        const dayDifference = Math.floor(
          (entryDate - minDate) / (1000 * 60 * 60 * 24)
        ); // Calculate the difference in days from the earliest date

        // Fill the array with 0 for missing days and insert hours
        while (projects[entry.project].length <= dayDifference) {
          projects[entry.project].push(0);
        }

        projects[entry.project][dayDifference] = entry.hours;
        if(!status && entry.status){
          status = entry.status;
        }
      });

      // Transform the project data into the required format
      const transformedProjects = Object.keys(projects).map(project => ({
        name: availableProjects.find(proj => String(proj.id) === project)?.name ?? '',
        hours: projects[project],
      }));

      // Return the final transformed object for each employee
      return {
        name: employee.first_name,
        projects: transformedProjects,
        id: employee.id,
        status : status
      };
    });
  }

  const data = transform(attendanceData);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }} >Emp Name</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Mon</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Tue</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Wed</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Thu</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Fri</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Sat</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Sun</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((emp, index) => (
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
                   {emp.status==='Submitted' && <ApproveRejectButton id={emp.id} onApproveOrReject={onApproveOrReject} />}
                    {emp.status==='Approved' &&<Typography variant="h6" style={{ flexGrow: 1, textAlign: "center", color: 'green' }}>Approved</Typography>}
                    {emp.status==='Rejected' && <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center", color: 'red' }}>Rejected</Typography>}
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
