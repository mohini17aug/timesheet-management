import React from "react";
import { AppBar, Toolbar, Typography, InputBase, Avatar,Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate } from "react-router-dom";

const TopNav = () => {
 const navigate=useNavigate();
  const handleLogout = async () => {

    // Clear local storage or session storage
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshtoken'); // Clear name if stored
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    // Redirect to login page
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      color="default"
      style={{ backgroundColor: "#f5f5f5", boxShadow: "none" }}
    >
      <Toolbar>
        <div style={{ display: "flex", alignItems: "center", margin: "40px" }}>
          <SearchIcon />
          <InputBase placeholder="Search…" style={{ marginLeft: "10px" }} />
        </div>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
          Hello, {localStorage.getItem("name")}!
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" style={{ marginRight: "10px" }}>
            Role: {localStorage.getItem('role')}
          </Typography>
          <Avatar alt="Profile" src="/profile-pic.jpg" />
          <Button 
            color="primary" 
            variant="contained" 
            style={{ marginLeft: "15px" }} 
            onClick={handleLogout} // Call the logout function
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
