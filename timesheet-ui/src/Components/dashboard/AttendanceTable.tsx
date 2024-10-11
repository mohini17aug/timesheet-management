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
import { backendServerUrl } from "../../constants.ts";
import { formatDateRange } from "../../utils.ts";

interface ProjectRow {
  project: number;
  mon: { date: string; hours: number };
  tue: { date: string; hours: number };
  wed: { date: string; hours: number };
  thu: { date: string; hours: number };
  fri: { date: string; hours: number };
  sat: { date: string; hours: number };
  sun: { date: string; hours: number };
  total: number;
}

const AttendanceTable = (props) => {
  const {selectedDateRange} = props;
  const empId = localStorage.getItem("id");
  const dates = formatDateRange(selectedDateRange);
  // console.log(dates);
  const [rows, setRows] = useState<ProjectRow[]>([
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
  const [isEditable,setIsEditable] = useState(true);
  const[isSubmitDisabled, setIsSubmitDisabled] =useState(true);
  const[isApproved,setIsApproved] = useState(false);

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
      const response = await axios.get(`${backendServerUrl}timesheets/my_timesheets/?start_date=${startDate}&end_date=${endDate}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      console.log("get response : "+response.data.timesheet);
      return response.data.timesheet;
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      return [];
    }
  };

  // useEffect to fetch timesheet data and update rows
  useEffect(() => {
    const updateRows = async () => {
      const timesheetData = await fetchTimeSheetData();
      if (timesheetData.length > 0) {
        console.log(timesheetData[timesheetData.length-1]["approved"]);
        
        const lastEntry = timesheetData[timesheetData.length - 1];

        setIsApproved(lastEntry.approved === true); 

        const rowsByProject = timesheetData.reduce(
          (acc: Record<string, ProjectRow>, entry) => {
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
          {} as Record<string, ProjectRow>
        );

        const formattedRows = Object.values(rowsByProject) as ProjectRow[];
        // Sort rows by project ID
        formattedRows.sort((a, b) => a.project - b.project);
        setIsSubmitted(true);
        setRows(formattedRows);
      }
  else{
    setIsSubmitted(false);
    const newRows = {
      project:0,
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

    updateRows();
  }, [selectedDateRange]); // Trigger this effect when selectedDateRange changes


  const fetchProjectIdByName = async (projectName: string) => {
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
    index: number,
    field: keyof ProjectRow,
    value: string
  ) => {
    const newRows = [...rows];
  
    if (field === "project") {
      newRows[index][field] = Number(value); // Directly assign the project ID
    } else if (value === "" || /^[0-8]*$/.test(value)) {
      const hourValue = Math.max(0, Math.min(Number(value), 8)); // Restrict to 0-8 hours
      newRows[index][field].hours = hourValue;
    }
  
    if (field !== "project" && Number(value) < 9) {
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as (keyof ProjectRow)[];
      const total = days.reduce((sum, day) => {
        return sum + (parseFloat(newRows[index][day].hours) || 0);
      }, 0);

      if(total>40){
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

  const handleRemoveRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if(totalHoursForWeek < 40){
      alert("fill for 40 hours");
    }
    else{
    const timesheet = rows.flatMap((row) => {
      return [
        {
          project: row.project,
          date: row.mon.date,
          hours: Number(row.mon.hours),
        },
        {
          project: row.project,
          date: row.tue.date,
          hours: Number(row.tue.hours),
        },
        {
          project: row.project,
          date: row.wed.date,
          hours: Number(row.wed.hours),
        },
        {
          project: row.project,
          date: row.thu.date,
          hours: Number(row.thu.hours),
        },
        {
          project: row.project,
          date: row.fri.date,
          hours: Number(row.fri.hours),
        },
        {
          project: row.project,
          date: row.sat.date,
          hours: 0,
        },
        {
          project: row.project,
          date: row.sun.date,
          hours: 0,
        },
      ];
    });

    const timesheetData = { employee: empId, timesheet, approved: false };

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
      })
      .catch(() => {});
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
                    value={row.project}
                    onChange={(e) =>
                      handleInputChange(index, "project", e.target.value as string)
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
                        value={row[day as keyof ProjectRow].hours}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            day as keyof ProjectRow,
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
                <Button
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
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={handleAddRow} 
        variant="contained" color="primary" disabled={rows.length >=projects.length || isSubmitted}>
          Add Row
        </Button>
        <div>Total Hours for the Week: {totalHoursForWeek}</div>
      </TableContainer>
      <Button
        variant="contained"
        color={isSubmitDisabled ? "default" : "primary"} // Change color based on disabled state
        style={{
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
      {rows.length > 0  && isSubmitted && (
          <Button
            variant="contained"
            style={{
              backgroundColor: isApproved ? "green" : "orange",
              color: "white",
            }}
            disabled={isSubmitDisabled}
          >
            {isApproved ? "Approved" : "Pending"}
          </Button>
        )}</div>
    </>
  );
};

export default AttendanceTable;
