import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

const Sidebar = ({ userDepartment }) => {
  const department = userDepartment ? userDepartment.toLowerCase() : '';
  const location = useLocation();

  const menuItems = [
    { text: 'All Issues', path: '/all', icon: <AdminPanelSettingsIcon />, roles: ['admin'] },
    { text: 'User Management', path: '/users', icon: <PeopleIcon />, roles: ['admin'] },
   
    
  ];

  const adminLinks = menuItems.filter(item => item.roles.includes('admin') && !item.roles.includes('road')); // A bit of logic to separate
  const departmentLinks = menuItems.filter(item => item.roles.includes(department));

  return (
    <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
      <Toolbar />
      <Box>
        <List>
          {departmentLinks.map((item) => 
            item.roles.includes(department) && (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;