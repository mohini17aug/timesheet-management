import React from 'react';
import { Button, Box } from '@mui/material';

const DateRangePicker = () => {
  const dateRanges = ['15-21 Jul 24', '22-28 Jul 24', '29-4 Jul 24', '5-11 Jul - Aug 24', '12-18 Aug 24', '19-25 Aug 24', '26-11 Aug 24'];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
      {dateRanges.map((range, index) => (
        <Button key={index} variant={index === 3 ? "contained" : "outlined"} color="primary">
          {range}
        </Button>
      ))}
    </Box>
  );
};

export default DateRangePicker;
