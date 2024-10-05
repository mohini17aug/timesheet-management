import React, { useState } from "react";
import { Button } from "@mui/material";

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState("05 Aug - 11 Aug '24");

  const dates = [
    "15 July - 21 July '24",
    "22 July - 28 July '24",
    "29 July - 04 Aug '24",
    "05 Aug - 11 Aug '24",
    "12 Aug - 18 Aug '24",
    "19 Aug - 25 Aug '24",
    "26 Aug - 3 Sept '24",
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
