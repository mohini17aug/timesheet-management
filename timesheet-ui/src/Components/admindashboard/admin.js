import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import { backendServerUrl } from "../../constants.ts";

const AdminDashboard = () => {
  // State for dialogs
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [openManagerDialog, setOpenManagerDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);



  // States for project
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // States for employee
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Default role is Employee
  const [manager, setManager] = useState(""); // Manager default value
  const [managersList, setManagersList] = useState([]);

  // Manager change states
  const [emailForManagerChange, setEmailForManagerChange] = useState("");
  const [currentManager, setCurrentManager] = useState("");
  const [updateManager, setUpdateManager] = useState("");
  const [employeeIdManager, setEmployeeIdManager] = useState(null);

  // Role change states
  const [emailForRoleChange, setEmailForRoleChange] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [updateRole, setUpdateRole] = useState("Employee");
  const [employeeIdRole, setEmployeeIdRole] = useState(null);

  // Feedback state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch managers when component loads
  useEffect(() => {
    axios
      .get(`${backendServerUrl}employees?role=Manager`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => setManagersList(response.data))
      .catch((error) => console.error("Error fetching managers:", error));
  }, []);

  // Reset employee form fields
  const resetEmployeeForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setManager(""); // Reset manager to null (default)
    setRole("Employee"); // Reset role to Employee by default
  };

  
  // Reset employee form fields
  const resetRoleForm = () => {
    setEmailForRoleChange("");
    setCurrentRole("");
    setUpdateRole("");
    setEmployeeIdRole("");
  };
  
  // Reset employee form fields
  const reseManagerChangeForm = () => {
   setEmailForManagerChange("");
   setCurrentManager("");
   setUpdateManager("");
   setEmployeeIdManager("");
  };


   // Fetch employee details by email for role change
   const handleFetchEmployeeManager = () => {
    axios
      .get(`${backendServerUrl}employees/?email=${emailForManagerChange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
       const employee = response.data;
        setEmployeeIdManager(employee.id); // Set employee ID
        /*setCurrentManager(employee.manager);*/ // Set current Manager
        const managerData = managersList.find((mgr) => mgr.id === employee.manager);
      
        if (managerData) {
          setCurrentManager(managerData.email); // Set the manager name
        } else {
          setCurrentManager("Manager not found"); // Fallback if manager ID is not found
        }

        setMessage("Employee details fetched successfully!");
        setError("");
      })
      .catch((error) => {
        setError("Error fetching employee manager");
        setMessage("");
      });
  };

   // Fetch employee details by email for role change
   const handleFetchEmployeeRole = () => {
    axios
      .get(`${backendServerUrl}employees/?email=${emailForRoleChange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        const employee = response.data;
        setEmployeeIdRole(employee.id); // Set employee ID
        setCurrentRole(employee.role); // Set current role
        setMessage("Employee details fetched successfully!");
        setError("");
      })
      .catch((error) => {
        setError("Error fetching employee details");
        setMessage("");
      });
  };

  // Update employee Manager
  const handleUpdateEmployeeManager = () => {
    if (!employeeIdManager) {
      setError("No employee found. Fetch the employee details first.");
      return;
    }

    // Find the manager ID based on the selected email
    const selectedManager = managersList.find((mgr) => mgr.id === manager); // This assumes `manager` holds the selected ID

    if (!selectedManager) {
      setError("Manager not found");
      return;
    }

    const data = {
      manager: selectedManager.id, // Send the manager ID in the request
    };
    
    axios
      .patch(`${backendServerUrl}employees/${employeeIdManager}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Employee Manager updated successfully!");
        setError("");
        setOpenManagerDialog(false); // Close dialog on success
      })
      .catch((error) => {
        setError("Error updating employee Manager");
        setMessage("");
      });
  };

  // Update employee role
  const handleUpdateEmployeeRole = () => {
    if (!employeeIdRole) {
      setError("No employee found. Fetch the employee details first.");
      return;
    }
    const data = {
      role: updateRole,
    };
    axios
      .patch(`${backendServerUrl}employees/${employeeIdRole}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Employee role updated successfully!");
        setError("");
        setOpenRoleDialog(false); // Close dialog on success
      })
      .catch((error) => {
        setError("Error updating employee role");
        setMessage("");
      });
  };

  // Functions to handle dialog actions
  const handleAddProject = () => {
    const data = { name, description };
    axios
      .post(`${backendServerUrl}projects/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Project added successfully!");
        setError("");
        setOpenProjectDialog(false); // Close dialog on success
      })
      .catch((error) => {
        setError("Error adding project");
        setMessage("");
      }
    );
  };

  const handleAddEmployee = () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      manager: manager || null, // Send null if no manager is selected
    };
    axios
      .post(`${backendServerUrl}employees/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Employee added successfully!");
        setError("");
        setOpenEmployeeDialog(false); // Close dialog on success
      })
      .catch((error) => {
        setError("Error adding employee");
      setMessage("");


      });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Buttons to trigger dialogs */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button onClick={() => setOpenProjectDialog(true)} style={buttonStyle}>Add Project</Button>
        <Button 
          onClick={() => {
            resetEmployeeForm(); // Reset the form before opening the dialog
            setOpenEmployeeDialog(true);
          }} 
          style={buttonStyle}
        >   Add Employee </Button>
        <Button 
          onClick={() => {
            resetRoleForm(); // Reset the form before opening the dialog
            setOpenRoleDialog(true);
          }} 
          style={buttonStyle}
        >Change Employee Designation</Button>
        <Button 
          onClick={() => {
            reseManagerChangeForm(); // Reset the form before opening the dialog
            setOpenManagerDialog(true);
          }} 
          style={buttonStyle}
        > Update Employee Manager</Button>
       
      </div>

      {/* Dialog for Add Project */}
      <Dialog open={openProjectDialog} onClose={() => setOpenProjectDialog(false)}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProject} color="primary">Add Project</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Add Employee */}
      <Dialog open={openEmployeeDialog} onClose={() => setOpenEmployeeDialog(false)}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="dense"
          />

          {/* Add label for the Select Manager dropdown */}
          <FormLabel component="legend" style={{ marginTop: "20px" }}>Select Manager</FormLabel>
          <Select
            value={manager}
            onChange={(e) => setManager(e.target.value)} // Directly set the manager ID
            fullWidth
            margin="dense"
          >
            <MenuItem value=""></MenuItem>
            {managersList.map((mgr) => (
              <MenuItem key={mgr.id} value={mgr.id}>
                {mgr.email}
              </MenuItem>
            ))}
          </Select>
          
          {/* Radio buttons for selecting role */}
          <FormLabel component="legend" style={{ marginTop: "20px" }}>Role</FormLabel>
          <RadioGroup
            value={role}
            onChange={(e) => setRole(e.target.value)} // Updates the role state
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
            <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
            <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
          </RadioGroup>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmployeeDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEmployee} color="primary">Add Employee</Button>
        </DialogActions>
      </Dialog>

        {/* Dialog for Change Employee Manager */}
        <Dialog open={openManagerDialog} onClose={() => setOpenManagerDialog(false)}>
        <DialogTitle>Change Employee Manager</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={emailForManagerChange}
            onChange={(e) => setEmailForManagerChange(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button onClick={handleFetchEmployeeManager} color="primary">Fetch Employee Manager</Button>

          {currentManager && (
            <div>
              <TextField
                label="Current Manager"
                value={currentManager}
                fullWidth
                margin="dense"
                disabled
              />
            </div>
          )}
          
          <FormLabel component="legend" style={{ marginTop: "20px" }}>Update Manager To</FormLabel>
          <Select
            value={manager}
            onChange={(e) => setUpdateManager(e.target.value)} // Directly set the manager ID
            fullWidth
            margin="dense"
          >
            <MenuItem value=""></MenuItem>
            {managersList.map((mgr) => (
              <MenuItem key={mgr.id} value={mgr.id}>
                {mgr.email}
              </MenuItem>
            ))}
          </Select>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManagerDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateEmployeeManager} color="primary">Update Manager</Button>
        </DialogActions>
      </Dialog>

        {/* Dialog for Change Employee Role */}
        <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
        <DialogTitle>Change Employee Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={emailForRoleChange}
            onChange={(e) => setEmailForRoleChange(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Button onClick={handleFetchEmployeeRole} color="primary">Fetch Employee Role</Button>

          {currentRole && (
            <div>
              <TextField
                label="Current Role"
                value={currentRole}
                fullWidth
                margin="dense"
                disabled
              />
            </div>
          )}
          
          <FormLabel component="legend" style={{ marginTop: "20px" }}>Update Role To</FormLabel>
          <RadioGroup
            value={updateRole}
            onChange={(e) => setUpdateRole(e.target.value)} // Updates the role state
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
            <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
            <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
          </RadioGroup>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateEmployeeRole} color="primary">Update Role</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// CSS for buttons
const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#494FBF",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

export default AdminDashboard;
