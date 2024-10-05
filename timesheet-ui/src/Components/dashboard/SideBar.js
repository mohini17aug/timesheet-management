import React from "react";
import { Drawer, List, ListItem, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import TableChartIcon from "@mui/icons-material/TableChart";
import PersonIcon from "@mui/icons-material/Person";

const Sidebar = () => {
  return (
    <Drawer variant="permanent">
      <List style={{ backgroundColor: "#494FBF", height: "100%" }}>
        <ListItem>
          <b style={{ color: "aliceblue" }}>LOGO</b>
        </ListItem>
        <ListItem button>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <FolderIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <GroupIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <TableChartIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon
            style={{
              height: "50px",
              alignItems: "center",
              margin: "auto",
              color: "aliceblue",
            }}
          >
            <PersonIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
