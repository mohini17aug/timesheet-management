import React from 'react';
import { Box, Button } from '@mui/material';

const ApproveRejectButton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button variant="contained" color="success">Approve</Button>
      {/* <Button variant="contained" color="error">Reject</Button> */}
    </Box>
  );
};

export default ApproveRejectButton;
