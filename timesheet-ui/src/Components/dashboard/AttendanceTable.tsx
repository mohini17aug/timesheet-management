import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
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
  const empId = 3;
  const dates = formatDateRange(props.selectedDateRange);
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

  const handleInputChange = (
    index: number,
    field: keyof ProjectRow,
    value: string
  ) => {
    const newRows = [...rows];

    // Validate only the numeric fields, skip 'project'
    if (field === "project" || value === "" || /^[0-9]*$/.test(value)) {
      if (field !== "project") {
        newRows[index][field].hours = value;
      } else {
        newRows[index][field] = Number(value);
      }

      // Calculate the total only for numeric fields
      if (field !== "project" && Number(value) < 9) {
        const days = [
          "mon",
          "tue",
          "wed",
          "thu",
          "fri",
          "sat",
          "sun",
        ] as (keyof ProjectRow)[];
        const total = days.reduce((sum, day) => {
          return sum + (parseFloat(newRows[index][day].hours) || 0);
        }, 0);
        newRows[index].total = total;
      }

      setRows(newRows);
    }
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
    const timesheet = rows.map((row) => {
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
          hours: Number(row.sat.hours),
        },
        {
          project: row.project,
          date: row.sun.date,
          hours: Number(row.sun.hours),
        },
      ];
    });

    const timesheetData = { employee: empId, timesheet, approved: false };

    console.log(timesheetData);

    axios
      .post(`${backendServerUrl}timesheets/`, timesheetData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {})
      .catch(() => {});
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
                <TableCell>Mohini</TableCell> {/* Emp Id */}
                <TableCell>
                  <TextField
                    value={row.project}
                    onChange={(e) =>
                      handleInputChange(index, "project", e.target.value)
                    }
                  />
                </TableCell>
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
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
                      />
                    </TableCell>
                  )
                )}
                <TableCell>{row.total}</TableCell>
                <Button
                  size="small"
                  startIcon={<Remove />}
                  variant="contained"
                  color="secondary"
                  style={{ margin: "25px" }}
                  onClick={() => handleRemoveRow(index)}
                >
                  Remove
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleAddRow} variant="contained" color="primary">
          Add Row
        </Button>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
};

export default AttendanceTable;
