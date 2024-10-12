import React from 'react';
import { Box, Button } from '@mui/material';

const ApproveRejectButton = (props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button onClick={() => {
        props.onApproveOrReject(props.id, true)
      }} variant="contained" color="success">Approve</Button>
      <Button onClick={() => {
        props.onApproveOrReject(props.id, false)
      }} variant="contained" color="error">Reject</Button>
    </Box>
  );
};

export default ApproveRejectButton;
