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

interface ProjectRow {
  project: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
  total: number;
}

const AttendanceTable = () => {
  const empId = 3; 
  const [rows, setRows] = useState<ProjectRow[]>([
    {
      project: "",
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
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
      newRows[index][field] = value;

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
          return sum + (parseFloat(newRows[index][day]) || 0);
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
        project: "",
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 0,
        sun: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    axios.post(`${backendServerUrl}timesheets/`, {
      "employee": 4,
      "timesheet": [
        {
          "project": 2,
          "date": "2023-06-01",
          "hours": 9
        },
        {
          "project": 2,
          "date": "2023-06-02",
          "hours": 9
        },
        {
          "project": 3,
          "date": "2023-06-03",
          "hours": 9
        },
        {
          "project": 3,
          "date": "2023-06-04",
          "hours": 9
        },
        {
          "project": 3,
          "date": "2023-06-06",
          "hours": 9
        },
        {
          "project": 2,
          "date": "2023-06-07",
          "hours": 9
        }
      ],
      "approved": false
    }, {
      headers: {
          'Content-Type': 'application/json',
      }
  }).then(()=>{

  }).catch(()=>{

  })
  }

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
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <TableCell key={day}>
                  <TextField
                    type="text"
                    value={row[day as keyof ProjectRow]}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        day as keyof ProjectRow,
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              ))}
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
  );
};

export default AttendanceTable;
