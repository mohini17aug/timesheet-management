import React from "react";
import { Drawer, List, ListItem, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  return (
    <Drawer variant="permanent">
      <List style={{ backgroundColor: "#494FBF", height: "100%" }}>
        <ListItem>
          <b style={{ color: "aliceblue" }}>TIMESHEET APP</b>
        </ListItem>
        {localStorage.getItem('role') !== 'Admin' && <ListItem button onClick={() => { navigate('/dashboard') }}>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <GroupIcon />
            Employees
          </ListItemIcon>
        </ListItem>}
        {localStorage.getItem('role') === 'Manager' && <ListItem button onClick={() => { navigate('/manager') }}>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <PersonIcon />
            Manager
          </ListItemIcon>
        </ListItem>}
        {localStorage.getItem('role') === 'Admin' && <ListItem button onClick={() => { navigate('/admin') }}>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <DashboardIcon />
            Admin
          </ListItemIcon>
        </ListItem>}
      </List>
    </Drawer>
  );
};

export default Sidebar;
