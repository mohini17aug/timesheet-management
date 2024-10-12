import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  TextField,
  TableContainer,
  Paper,
} from "@mui/material";
import Remove from "@mui/icons-material/Remove";
import axios from "axios";
import { backendServerUrl } from "../utils/constants.ts";
import { formatDateRange } from "../utils/utils.ts";

const AttendanceTable = (props) => {
  const { selectedDateRange } = props;
  const empId = localStorage.getItem("id");
  const dates = formatDateRange(selectedDateRange);
  const [rows, setRows] = useState([
    {
      project: 0,
      mon: { date: dates[0], hours: 0 },
      tue: { date: dates[1], hours: 0 },
      wed: { date: dates[2], hours: 0 },
      thu: { date: dates[3], hours: 0 },
      fri: { date: dates[4], hours: 0 },
      sat: { date: dates[5], hours: 0 },
      sun: { date: dates[6], hours: 0 },
      total: 0,
    },
  ]);

  const [projects, setProjects] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isSetTime, setIsSetTime] = useState(false);

  useEffect(() => {
    axios
      .get(`${backendServerUrl}projects/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  // Function to fetch timesheet data
  const fetchTimeSheetData = async () => {
    const startDate = dates[0]; // Assuming dates is an array of formatted dates
    const endDate = dates[dates.length - 1];

    try {
      const response = await axios.get(`${backendServerUrl}timesheets/my_timesheets/?start_date=${startDate}&end_date=${endDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      console.log("get response : " + response.data.timesheet);
      return response.data.timesheet;
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      return [];
    }
  };

  const updateRows = async () => {
    const timesheetData = await fetchTimeSheetData();
    if (timesheetData.length > 0) {
      setIsSetTime(true);
      console.log(timesheetData[0].status);

      const status = timesheetData[0].status;

      if (status === "Approved") {
        setIsApproved(true);
        setIsSubmitted(true);
      }
      if (status === "Rejected") {
        setIsApproved(false);
        setIsSubmitted(false);
      }
      if (status === "Submitted") {
        setIsSubmitted(true);
        setIsApproved(false);
      }

      const rowsByProject = timesheetData.reduce(
        (acc, entry) => {
          const project = entry.project;

          if (!acc[project]) {
            acc[project] = {
              project,
              mon: { date: dates[0], hours: 0 },
              tue: { date: dates[1], hours: 0 },
              wed: { date: dates[2], hours: 0 },
              thu: { date: dates[3], hours: 0 },
              fri: { date: dates[4], hours: 0 },
              sat: { date: dates[5], hours: 0 },
              sun: { date: dates[6], hours: 0 },
              total: 0,
            };
          }

          const entryDate = new Date(entry.date);
          const dayDiff = Math.floor(
            (entryDate.getTime() - new Date(dates[0]).getTime()) /
            (1000 * 60 * 60 * 24)
          );

          if (dayDiff >= 0 && dayDiff < 7) {
            const dayOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][dayDiff];
            acc[project][dayOfWeek].hours += entry.hours;
            acc[project].total += entry.hours;
          }

          return acc;
        },
        {}
      );

      const formattedRows = Object.values(rowsByProject);
      // Sort rows by project ID
      formattedRows.sort((a, b) => a.project - b.project);
      setRows(formattedRows);
    }
    else {
      setIsSubmitted(false);
      setIsSetTime(false);
      const newRows = {
        project: 0,
        mon: { date: dates[0], hours: 0 },
        tue: { date: dates[1], hours: 0 },
        wed: { date: dates[2], hours: 0 },
        thu: { date: dates[3], hours: 0 },
        fri: { date: dates[4], hours: 0 },
        sat: { date: dates[5], hours: 0 },
        sun: { date: dates[6], hours: 0 },
        total: 0,
      };
      setRows([newRows]);
    }
  };

  // useEffect to fetch timesheet data and update rows
  useEffect(() => {
    updateRows();
  }, [selectedDateRange]); // Trigger this effect when selectedDateRange changes


  const fetchProjectIdByName = async (projectName) => {
    try {
      const response = await axios.get(
        `${backendServerUrl}projects/get-id-by-name/?name=${projectName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      }
      );
      return response.data.id;
    } catch (error) {
      console.error("Error fetching project ID:", error);
      return null;
    }
  };

  // Calculate the total hours for each day across all projects
  const calculateDailyTotals = () => {
    const totals = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };

    rows.forEach((row) => {
      totals.mon += row.mon.hours;
      totals.tue += row.tue.hours;
      totals.wed += row.wed.hours;
      totals.thu += row.thu.hours;
      totals.fri += row.fri.hours;
      totals.sat += row.sat.hours;
      totals.sun += row.sun.hours;
    });

    return totals;
  };
  const dailyTotals = calculateDailyTotals();

  useEffect(() => {
    const totalExceedsLimit = Object.values(dailyTotals).some(hours => hours > 8);
    setIsSubmitDisabled(totalExceedsLimit);
  }, [dailyTotals]);

  const calculateTotalHoursForWeek = () => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  };

  const totalHoursForWeek = calculateTotalHoursForWeek();

  const handleInputChange = (
    index,
    field,
    value
  ) => {
    const newRows = [...rows];

    if (field === "project") {
      newRows[index][field] = Number(value); // Directly assign the project ID
    } else if (value === "" || /^[0-8]*$/.test(value)) {
      const hourValue = Math.max(0, Math.min(Number(value), 8)); // Restrict to 0-8 hours
      newRows[index][field].hours = hourValue;
    }

    if (field !== "project" && Number(value) < 9) {
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const total = days.reduce((sum, day) => {
        return sum + (parseFloat(newRows[index][day].hours) || 0);
      }, 0);

      if (total > 40) {
        alert("Total hours for week cannot exceed 40");
      }
      newRows[index].total = total;
    }


    setRows(newRows);

  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        project: 0,
        mon: { date: dates[0], hours: 0 },
        tue: { date: dates[1], hours: 0 },
        wed: { date: dates[2], hours: 0 },
        thu: { date: dates[3], hours: 0 },
        fri: { date: dates[4], hours: 0 },
        sat: { date: dates[5], hours: 0 },
        sun: { date: dates[6], hours: 0 },
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (totalHoursForWeek < 40) {
      alert("fill for 40 hours");
    }
    else {
      setIsSetTime(false);
      const timesheet = rows.flatMap((row) => {
        return [
          {
            project: row.project,
            date: row.mon.date,
            hours: Number(row.mon.hours),
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.tue.date,
            hours: Number(row.tue.hours),
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.wed.date,
            hours: Number(row.wed.hours),
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.thu.date,
            hours: Number(row.thu.hours),
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.fri.date,
            hours: Number(row.fri.hours),
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.sat.date,
            hours: 0,
            status: "Submitted"
          },
          {
            project: row.project,
            date: row.sun.date,
            hours: 0,
            status: "Submitted"
          },
        ];
      });

      const timesheetData = { employee: empId, timesheet };

      console.log(timesheetData);

      axios
        .post(`${backendServerUrl}timesheets/`, timesheetData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        })
        .then((response) => {
          alert("Data submitted successfully !!");
          setIsSubmitted(true);
          setIsEditable(false);
          updateRows();
        })
        .catch(() => { });
    }
  };

  return (
    <>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {index === 0 && (
                  <TableCell rowSpan={index}>
                    {localStorage.getItem("name")}
                  </TableCell>
                )}
                <TableCell>
                  <Select
                    style={{ width: '125px' }}
                    value={row.project}
                    onChange={(e) =>
                      handleInputChange(index, "project", e.target.value)
                    }
                    disabled={isSubmitted}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                {["mon", "tue", "wed", "thu", "fri"].map(
                  (day) => (
                    <TableCell key={day}>
                      <TextField
                        type="text"
                        value={row[day].hours}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            day,
                            e.target.value
                          )
                        }
                        disabled={isSubmitted} //Disable on submit
                      />
                    </TableCell>
                  )
                )}
                <TableCell>
                  <TextField
                    type="text"
                    value={row.sat.hours}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.sun.hours}
                    disabled
                  />
                </TableCell>
                <TableCell>{row.total}</TableCell>
                {rows.length > 1 && <Button
                  size="small"
                  startIcon={<Remove />}
                  variant="contained"
                  color="secondary"
                  style={{ margin: "25px" }}
                  onClick={() => handleRemoveRow(index)}
                  disabled={isSubmitted}
                >
                  Remove
                </Button>
                }
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={1}>Daily Total</TableCell>
              <TableCell>{dailyTotals.mon > 8 ? 'Exceeds 8' : dailyTotals.mon}</TableCell>
              <TableCell>{dailyTotals.tue > 8 ? 'Exceeds 8' : dailyTotals.tue}</TableCell>
              <TableCell>{dailyTotals.wed > 8 ? 'Exceeds 8' : dailyTotals.wed}</TableCell>
              <TableCell>{dailyTotals.thu > 8 ? 'Exceeds 8' : dailyTotals.thu}</TableCell>
              <TableCell>{dailyTotals.fri > 8 ? 'Exceeds 8' : dailyTotals.fri}</TableCell>
              <TableCell>{dailyTotals.sat > 8 ? 'Exceeds 8' : dailyTotals.sat}</TableCell>
              <TableCell>{dailyTotals.sun > 8 ? 'Exceeds 8' : dailyTotals.sun}</TableCell>
              <TableCell>{totalHoursForWeek}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <span style={{margin: '5px'}}>
        <Button onClick={handleAddRow}
          variant="contained" color="primary" disabled={rows.length >= projects.length || isSubmitted} style={{padding: '5px'}}>
          Add Row
        </Button>
        <span style={{float:'right', padding: '5px'}}>Maximum Allowed Hours for the week: 40</span>
        </span>
      </TableContainer>
      <Button
        variant="contained"
        color={isSubmitDisabled ? "default" : "primary"} // Change color based on disabled state
        style={{
          float:'right',
          marginTop: "20px",
          backgroundColor: isSubmitDisabled ? '#ccc' : undefined, // Custom background color for disabled state
          color: isSubmitDisabled ? '#666' : undefined, // Custom text color for disabled state
          cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
        }}
        onClick={handleSubmit}
        disabled={isSubmitDisabled || isSubmitted}
      >
        Submit
      </Button>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {rows.length > 0 && isSetTime && (
          <Button
            variant="contained"
            style={{
              backgroundColor: isApproved
                ? "green"
                : isSubmitted
                  ? "orange"
                  : "red", // If both isApproved and isSubmitted are false, it's rejected
              color: "white",
            }}
            disabled={isSubmitDisabled || (!isApproved && !isSubmitted)} // Disabled if rejected
          >
            {isApproved
              ? "Approved"
              : isSubmitted
                ? "Submitted"
                : "Rejected"}  {/* If neither is true, it's rejected */}
          </Button>
        )}
      </div>
    </>
  );
};

export default AttendanceTable;