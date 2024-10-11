import React from "react";
import { AppBar, Toolbar, Typography, InputBase, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TopNav = () => {
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
          Good Morning, {localStorage.getItem("name")}!
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" style={{ marginRight: "10px" }}>
            Role: Developer
          </Typography>
          <Avatar alt="Profile" src="/profile-pic.jpg" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
