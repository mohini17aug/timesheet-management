export const formatToCustomDate = (dateStr) => {
  const date = new Date(dateStr);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Day (e.g., 05)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; // Month abbreviation (e.g., Aug)
  const year = String(date.getFullYear()).slice(-2); // Last two digits of the year (e.g., 24)

  // Return the formatted string
  return `${day} ${month} '${year}`;
};




export const formatDateRange = (dateRange) => {
  const [startDateStr, endDateStr] = dateRange?.split(" - ");

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split(" ");
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const formattedYear = `20${year.replace("'", "")}`;
    return `${formattedYear}-${monthMap[month]}-${day.padStart(2, "0")}`;
  };

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);

  return getDatesInRange(startDate, endDate);
};

const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate);
  const dates = [];

  while (date <= new Date(endDate)) {
    dates.push(new Date(date).toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
};
