import React from 'react';
import { Drawer, List, ListItem, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import TableChartIcon from '@mui/icons-material/TableChart';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
  return (
    <Drawer variant="permanent">
      <List>
        <ListItem>
          <img src="logo.png" alt="Logo" style={{ padding: '10px' }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon><FolderIcon /></ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon><GroupIcon /></ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon><TableChartIcon /></ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon><PersonIcon /></ListItemIcon>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
