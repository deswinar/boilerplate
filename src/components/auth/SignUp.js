// src/components/auth/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { UserAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
	const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const { createUser, signInWithGoogle } = UserAuth();
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    setError('');
    try {
      const user = createUser(name, email, password);
      navigate('/dashboard')
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
          sx={{
            width: '100%',
            marginTop: 1,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
            onClick={signInWithGoogle}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register with Google
          </Button>
          <Typography>
            Already have an account? <Link to="/signin">Sign In</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;