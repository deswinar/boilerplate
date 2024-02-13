// src/components/auth/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Menu
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Dashboard = () => {
  const { user, loading, logout } = UserAuth();
  const [userData, setUserData] = useState([]);
  const [registered, setRegistered] = useState("");
  const [anchorEl, setAnchorEl] = useState("");
  const navigate = useNavigate();

  const getUserInformation = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserData(...userData, data);
      setRegistered(data.registeredAt.toDate().toISOString().substring(0,10));
    } catch (err) {
      console.error(err);
      // alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/signin");
    getUserInformation();
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            Icon
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard Title
          </Typography>
          <Button color="inherit">Welcome {userData.name}</Button>
          <Button color="inherit" onClick={handleClick}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Button component={Link} to="/form" color="primary" variant="contained">
        Go to Form
      </Button>
      <Button component={Link} to="/collection-settings" color="primary" variant="contained">
        Go to Collection Settings
      </Button>
    </div>
  );
};

export default Dashboard;