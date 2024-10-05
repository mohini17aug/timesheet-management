import React, { useState } from "react";
import { Button } from "@mui/material";

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState("5-11 Jul - Aug 24");

  const dates = [
    "15-21 Jul 24",
    "22-28 Jul 24",
    "29-4 Jul 24",
    "5-11 Jul - Aug 24",
    "12-18 Aug 24",
    "19-25 Aug 24",
    "26-11 Aug 24",
  ];

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
        <Button style={{ width: "40px", height: "40px" }}>{"<"}</Button>
        {dates.map((date) => (
          <Button
            key={date}
            variant={selectedDate === date ? "contained" : "outlined"}
            onClick={() => setSelectedDate(date)}
            style={{ margin: "0 5px" }}
          >
            {date}
          </Button>
        ))}
        <Button style={{ width: "40px", height: "40px" }}>{">"}</Button>
      </div>
    </div>
  );
};

export default AttendanceReport;
