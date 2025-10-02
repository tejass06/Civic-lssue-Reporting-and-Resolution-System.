import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getAllUsers, createUser } from './apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // State for the 'Add User' dialog

  // State for the new user form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateUser = async () => {
    try {
      const userData = { username: newUsername, password: newPassword, department: newDepartment };
      await createUser(userData);
      handleClose();
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to create user", error);
      alert('Failed to create user.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>User Management</Typography>
        <Button variant="contained" onClick={handleOpen}>Add New User</Button>
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog for adding a new user */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Department User</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Username" type="text" fullWidth variant="standard" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <TextField margin="dense" label="Password" type="password" fullWidth variant="standard" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <TextField margin="dense" label="Department" placeholder="e.g., Road, Garbage, Water" type="text" fullWidth variant="standard" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;