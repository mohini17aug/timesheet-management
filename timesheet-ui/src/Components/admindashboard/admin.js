import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { backendServerUrl } from "../utils/constants.ts";
import './Admin.css'
import Sidebar from "../common/SideBar.js";
import TopNav from "../common/TopNav.js";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Projects");
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openEditProjectDialog, setOpenEditProjectDialog] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // New state for delete dialog
  const [projectToDelete, setProjectToDelete] = useState(null); // New state for project to delete


  const [employeesList, setEmployeesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [openEditEmployeeDialog, setOpenEditEmployeeDialog] = useState(false);

  const [openManagerDialog, setOpenManagerDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openDeleteEmployeeDialog, setOpenDeleteEmployeeDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [manager, setManager] = useState("");
  const [managersList, setManagersList] = useState([]);

  const [_, setEmailForManagerChange] = useState("");
  const [currentManager, setCurrentManager] = useState("");
  const [updateManager, setUpdateManager] = useState("");
  const [employeeIdManager, setEmployeeIdManager] = useState(null);

  const [emailForRoleChange, setEmailForRoleChange] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [updateRole, setUpdateRole] = useState("Employee");
  const [employeeIdRole, setEmployeeIdRole] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchManagers();
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchManagers();

    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  const resetEmployeeForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setManager("");
    setCurrentManager("");
    setUpdateManager("");
    setRole("Employee");
  };

  const resetRoleForm = () => {
    setEmailForRoleChange("");
    setCurrentRole("");
    setUpdateRole("");
    setEmployeeIdRole("");
  };

  const fetchProjects = () => {
    axios
      .get(`${backendServerUrl}projects/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => setProjectsList(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  };

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
        setOpenProjectDialog(false);
        fetchProjects(); // Refresh the list
      })
      .catch((error) => {
        setError("Error adding project");
        setMessage("");
      });
  };
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setName(project.name);
    setDescription(project.description);
    setOpenEditProjectDialog(true);
  };

  const handleUpdateProject = () => {
    if (!selectedProject) return;

    const data = { name, description };
    axios
      .patch(`${backendServerUrl}projects/${selectedProject.id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Project updated successfully!");
        setError("");
        setOpenEditProjectDialog(false);
        fetchProjects(); // Refresh the list
      })
      .catch((error) => {
        setError("Error updating project");
        setMessage("");
      });
  };

  const handleOpenDeleteDialog = (project) => {
    setProjectToDelete(project);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;

    axios
      .delete(`${backendServerUrl}projects/${projectToDelete.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Project deleted successfully!");
        setError("");
        setOpenDeleteDialog(false);
        fetchProjects(); // Refresh the list
      })
      .catch((error) => {
        setError("Error deleting project");
        setMessage("");
      });
  };

  const fetchEmployees = () => {
    axios
      .get(`${backendServerUrl}employees/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => setEmployeesList(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  };

  const fetchManagers = () => {
    axios
      .get(`${backendServerUrl}employees?role=Manager`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => setManagersList(response.data))
      .catch((error) => console.error("Error fetching managers:", error));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employeesList.filter((employee) =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setEmail(employee.email);
    setRole(employee.role);
    setManager(employee.manager);
    setOpenEditEmployeeDialog(true);
  };



  const handleUpdateEmployee = () => {
    if (!selectedEmployee) return;

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      manager: updateManager || null,
    };

    axios
      .patch(`${backendServerUrl}employees/${selectedEmployee.id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Employee updated successfully!");
        setError("");
        setOpenEditEmployeeDialog(false);
        fetchEmployees(); // Refresh the list
      })
      .catch((error) => {
        setError("Error updating employee");
        setMessage("");
      });
  };


  const handleOpenDeleteEmployeeDialog = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteEmployeeDialog(true);
  };

  const handleConfirmDeleteEmployee = () => {
    if (!employeeToDelete) return;

    axios
      .delete(`${backendServerUrl}employees/${employeeToDelete.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        setMessage("Employee deleted successfully!");
        setError("");
        setOpenDeleteEmployeeDialog(false);
        fetchEmployees(); // Refresh the list
      })
      .catch((error) => {
        setError("Error deleting employee");
        setMessage("");
      });
  };


  const handleFetchEmployeeManager = () => {
    axios
      .get(`${backendServerUrl}employees/?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        const employee = response.data;
        setEmployeeIdManager(employee.id);
        const managerData = managersList.find((mgr) => mgr.id === employee.manager);

        if (managerData) {
          setCurrentManager(managerData.email);
        } else {
          setCurrentManager("Manager not found");
        }

        setMessage("Employee details fetched successfully!");
        setError("");
      })
      .catch((error) => {
        setError("Error fetching employee manager");
        setMessage("");
      });
  };

  const handleFetchEmployeeRole = () => {
    axios
      .get(`${backendServerUrl}employees/?email=${emailForRoleChange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      })
      .then((response) => {
        const employee = response.data;
        setEmployeeIdRole(employee.id);
        setCurrentRole(employee.role);
        setMessage("Employee details fetched successfully!");
        setError("");
      })
      .catch((error) => {
        setError("Error fetching employee details");
        setMessage("");
      });
  };

  const handleUpdateEmployeeManager = () => {
    if (!employeeIdManager) {
      setError("No employee found. Fetch the employee details first.");
      return;
    }

    console.log("Manager is ", manager);

    const selectedManager = managersList.find((mgr) => mgr.id === manager);
    console.log(selectedManager);

    if (!selectedManager) {
      setError("Manager not found");
      return;
    }

    const data = {
      manager: selectedManager.id,
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
        setOpenManagerDialog(false);
      })
      .catch((error) => {
        setError("Error updating employee Manager");
        setMessage("");
      });
  };

  const handleUpdateEmployeeRoleChange = (employee) => {
    setSelectedEmployee(employee);
    setEmailForRoleChange(employee.email);
    setEmployeeIdRole(employee.id);

    setOpenRoleDialog(true);
  };
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
        setOpenRoleDialog(false);
        fetchEmployees(); // Refresh the list
      })
      .catch((error) => {
        setError("Error updating employee role");
        setMessage("");
      });
  };


  const handleAddEmployee = () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      manager: manager || null,
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
        setOpenEmployeeDialog(false);
      })
      .catch((error) => {
        setError("Error adding employee");
        setMessage("");
      });
  };


  return (
    <div style={{ display: "flex", paddingLeft: '150px' }}>
      <Sidebar />
      {/* Main Content */}
      <div style={{ flex: 1}}>
        <TopNav></TopNav>
        <span style={{display:'flex', width:'auto'}}>
          <div className="left-pane">
            <List component="nav">
              <ListItem
                button
                className={`list-item ${selectedOption === "Projects" ? "selected" : ""}`}
                onClick={() => setSelectedOption("Projects")}
              >
                <ListItemText primary="Projects" />
              </ListItem>
              <ListItem
                button
                className={`list-item ${selectedOption === "Employees" ? "selected" : ""}`}
                onClick={() => setSelectedOption("Employees")}
              >
                <ListItemText primary="Employees" />
              </ListItem>
            </List>
          </div>

        {message && <div style={{ color: "green" }}>{message}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {selectedOption === "Projects" && (
          <div style={{ padding: "20px", width: '100%'}}>
            <h2>Project Management</h2>
            <Button onClick={() => setOpenProjectDialog(true)} style={buttonStyle}>
              Add Project
            </Button>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectsList.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditProject(project)} color="primary">
                          Edit
                        </Button>
                        <Button onClick={() => handleOpenDeleteDialog(project)} color="secondary">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          
        )}

        {selectedOption === "Employees" && (
          <div style={{ padding: "20px" , width:'100%'}}>
            <h2>Employee Management</h2>

            <div className="button-container">
              <Button
                onClick={() => {
                  resetEmployeeForm();
                  setOpenEmployeeDialog(true);
                }}
                style={buttonStyle}
              >
                Add Employee
              </Button>
            </div>
            <div style={{ margin: "20px 0" }}>
              <TextField
                label="Search Employees"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                margin="dense"
              />
            </div>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.first_name}</TableCell>
                      <TableCell>{employee.last_name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.manager}</TableCell>
                      <TableCell>
                        <Button onClick={() => {
                          resetEmployeeForm();
                          handleEditEmployee(employee);
                        }
                        } color="primary">
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            resetRoleForm(); // Reset the form before opening the dialog
                            handleUpdateEmployeeRoleChange(employee);
                          }} color="primary">

                          Change Role</Button>
                        <Button onClick={() => handleOpenDeleteEmployeeDialog(employee)} color="secondary">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        </span>
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
            <Button onClick={handleAddProject} color="primary">
              Add Project
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Edit Project */}
        <Dialog open={openEditProjectDialog} onClose={() => setOpenEditProjectDialog(false)}>
          <DialogTitle>Edit Project</DialogTitle>
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
            <Button onClick={() => setOpenEditProjectDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateProject} color="primary">
              Update Project
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for project Delete Confirmation */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {projectToDelete?.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
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

            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              Select Manager
            </FormLabel>
            <Select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
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

            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              Role
            </FormLabel>
            <RadioGroup
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
              <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmployeeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee} color="primary">
              Add Employee
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Change Employee Manager */}
        <Dialog open={openManagerDialog} onClose={() => setOpenManagerDialog(false)}>
          <DialogTitle>Change Employee Manager</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmailForManagerChange(e.target.value)}
              fullWidth
              margin="dense"
            />
            <Button onClick={handleFetchEmployeeManager} color="primary">
              Fetch Employee Manager
            </Button>

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

            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              Update Manager To
            </FormLabel>
            <Select
              value={updateManager}
              onChange={(e) => setUpdateManager(e.target.value)}
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
            <Button onClick={handleUpdateEmployeeManager} color="primary">
              Update Manager
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Edit Employee */}
        <Dialog open={openEditEmployeeDialog} onClose={() => setOpenEditEmployeeDialog(false)}>
          <DialogTitle>Edit Employee</DialogTitle>
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
              fullWidth
              margin="dense"
              disabled // Disable the email field to prevent editing
            />

            <Button onClick={handleFetchEmployeeManager} color="primary">
              Fetch Employee Manager
            </Button>

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

            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              Update Manager To
            </FormLabel>
            <Select
              value={updateManager}
              onChange={(e) => setUpdateManager(e.target.value)}
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
            <Button onClick={() => setOpenEditEmployeeDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateEmployee} color="primary">
              Update Employee
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Delete Employee */}
        <Dialog open={openDeleteEmployeeDialog} onClose={() => setOpenDeleteEmployeeDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {employeeToDelete?.first_name} {employeeToDelete?.last_name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteEmployeeDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDeleteEmployee} color="secondary">
              Confirm
            </Button>
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
            <Button onClick={handleFetchEmployeeRole} color="primary">
              Fetch Employee Role
            </Button>

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

            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              Update Role To
            </FormLabel>
            <RadioGroup
              value={updateRole}
              onChange={(e) => setUpdateRole(e.target.value)}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
              <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateEmployeeRole} color="primary">
              Update Role
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#494FBF",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

export default AdminDashboard;