import React, { useState } from "react";
import { Button } from "@mui/material";
import { formatToCustomDate } from "../../utils.ts";

const getWeekStartAndEnd = (offset) => {
  const today = new Date();
  today.setDate(today.getDate() + offset * 7); // Move by offset weeks
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Adjust to the start (Sunday) and end (Saturday) of the week
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

  const options = { year: "numeric", month: "short", day: "numeric" };
  return {
    start: startOfWeek.toLocaleDateString("en-US", options),
    end: endOfWeek.toLocaleDateString("en-US", options),
    startDateObj: startOfWeek,
  };
};

const getMultipleWeeks = (startOffset, numberOfWeeks) => {
  const weeks = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const offset = startOffset + i;
    const { start, end, startDateObj } = getWeekStartAndEnd(offset);
    weeks.push({ start, end, startDateObj });
  }
  return weeks;
};

const isCurrentWeek = (weekStartDate) => {
  const today = new Date();
  const startOfThisWeek = new Date(today);
  const dayOfWeek = today.getDay();

  // Get the start of the current week
  startOfThisWeek.setDate(today.getDate() - dayOfWeek);

  // Check if the start of the given week matches the start of this week
  return weekStartDate.toDateString() === startOfThisWeek.toDateString();
};

const AttendanceReport = ({setSelectedDateRange}) => {
  const [weekOffset, setWeekOffset] = useState(0); // Initial offset for weeks
  const weeksToShow = 4; // Number of weeks to show at a time
  const weeks = getMultipleWeeks(weekOffset, weeksToShow);

  const [selectedWeek, setSelectedWeek] = useState(null); // To track the currently selected week

  const handlePreviousClick = () => {
    setWeekOffset(weekOffset - weeksToShow);
    setSelectedWeek(null); // Reset selected week when navigating
  };

  const handleNextClick = () => {
    setWeekOffset(weekOffset + weeksToShow);
    setSelectedWeek(null); // Reset selected week when navigating
  };

  const handleWeekClick = (week) => {
    setSelectedDateRange(`${formatToCustomDate(week.start)} - ${formatToCustomDate(week.end)}`);
    setSelectedWeek(week.startDateObj); // Set the clicked week as the selected one
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px",
        }}
      >
        <Button
          style={{ width: "40px", height: "40px" }}
          onClick={handlePreviousClick}
        >
          {"<"}
        </Button>
        {weeks.map((week, index) => (
          <Button
            key={index}
            variant={
              selectedWeek
                ? selectedWeek.toDateString() === week.startDateObj.toDateString()
                  ? "contained"
                  : "outlined"
                : isCurrentWeek(week.startDateObj)
                ? "contained"
                : "outlined"
            } // Highlight selected week or current week by default
            style={{
              margin: "0 5px",
              backgroundColor:
                selectedWeek && selectedWeek.toDateString() === week.startDateObj.toDateString()
                  ? "#1976d2"
                  : !selectedWeek && isCurrentWeek(week.startDateObj)
                  ? "#1976d2"
                  : "transparent", // Color for selected or current week
              color:
                selectedWeek && selectedWeek.toDateString() === week.startDateObj.toDateString()
                  ? "#fff"
                  : !selectedWeek && isCurrentWeek(week.startDateObj)
                  ? "#fff"
                  : "#000", // Text color for selected or current week
            }}
            onClick={() => handleWeekClick(week)} // Handle week click
          >
            {`${week.start} - ${week.end}`}
          </Button>
        ))}
        <Button
          style={{ width: "40px", height: "40px" }}
          onClick={handleNextClick}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default AttendanceReport;
