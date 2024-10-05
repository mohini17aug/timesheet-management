// import React, { useState } from "react";
// import { Button } from "@mui/material";

// const AttendanceReport = (props) => {
//   const dates = [
//     "15 July '24 - 21 July '24",
//     "22 July '24 - 28 July '24",
//     "29 July '24 - 04 Aug '24",
//     "05 Aug '24 - 11 Aug '24",
//     "12 Aug '24 - 18 Aug '24",
//     "19 Aug '24 - 25 Aug '24",
//     "26 Aug '24 - 03 Sept '24",
//   ];

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100px",
//         }}
//       >
//         <Button style={{ width: "40px", height: "40px" }}>{"<"}</Button>
//         {dates.map((date) => (
//           <Button
//             key={date}
//             variant={
//               props?.selectedDateRange === date ? "contained" : "outlined"
//             }
//             onClick={() => props?.setSelectedDateRange(date)}
//             style={{ margin: "0 5px" }}
//           >
//             {date}
//           </Button>
//         ))}
//         <Button style={{ width: "40px", height: "40px" }}>{">"}</Button>
//       </div>
//     </div>
//   );
// };

// export default AttendanceReport;

import React, { useState } from "react";
import { Button } from "@mui/material";

const getTodayDate = () => {
  const today = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  return today.toLocaleDateString("en-US", options);
};

const getWeekStartAndEnd = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  const startOfLastWeek = new Date(today);
  const endOfLastWeek = new Date(today);

  const startOf2WeekBefore = new Date(today);
  const endOf2WeekBefore = new Date(today);

  const startOfNextWeek = new Date(today);
  const endOfNextWeek = new Date(today);

  // Adjust to the start of the week (Sunday)
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  // Adjust to the end of the week (Saturday)
  endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

  // Adjust to the start of the week (Sunday)
  startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7);

  // Adjust to the start of the week (Sunday)
  startOf2WeekBefore.setDate(today.getDate() - dayOfWeek - 14);

  endOfLastWeek.setDate(today.getDate() + (6 - dayOfWeek) - 7);
  endOf2WeekBefore.setDate(today.getDate() + (6 - dayOfWeek) - 14);

  startOfNextWeek.setDate(today.getDate() - dayOfWeek + 7);
  endOfNextWeek.setDate(today.getDate() + (6 - dayOfWeek) + 7);

  const options = { year: "numeric", month: "short", day: "numeric" };
  const start = startOfWeek.toLocaleDateString("en-US", options);
  const end = endOfWeek.toLocaleDateString("en-US", options);

  const startLastWeek = startOfLastWeek.toLocaleDateString("en-US", options);
  const endLastWeek = endOfLastWeek.toLocaleDateString("en-US", options);

  const start2WeekBefore = startOf2WeekBefore.toLocaleDateString(
    "en-US",
    options
  );
  const end2WeekBefore = endOfNextWeek.toLocaleDateString("en-US", options);

  const startNextWeek = startOfNextWeek.toLocaleDateString("en-US", options);
  const endNextWeek = endOfNextWeek.toLocaleDateString("en-US", options);

  return {
    start,
    end,
    startLastWeek,
    endLastWeek,
    start2WeekBefore,
    end2WeekBefore,
    startNextWeek,
    endNextWeek,
  };
};

// Example usage
console.log("Today's Date:", getTodayDate());
const {
  start,
  end,
  startLastWeek,
  endLastWeek,
  start2WeekBefore,
  end2WeekBefore,
  startNextWeek,
  endNextWeek,
} = getWeekStartAndEnd();
console.log("Start of the Week:", start);
console.log("End of the Week:", end);

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(`${start} - ${end}`);
  const dates = [
    `${start2WeekBefore} - ${end2WeekBefore}`,
    `${startLastWeek} - ${endLastWeek}`,
    `${start} - ${end}`,
    `${startNextWeek} - ${endNextWeek}`,
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
