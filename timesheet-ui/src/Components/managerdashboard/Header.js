import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Box>
        <Typography variant="h5">Good Morning, {localStorage.getItem("name")}!</Typography>
        <Typography variant="subtitle1" color="error">You have 7 requests pending</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 2 }}>Role: Project Manager</Typography>
        <Avatar src="profile_image_url" />
      </Box>
    </Box>
  );
};

export default Header;
