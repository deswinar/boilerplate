// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/auth/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthContextProvider } from './context/AuthContext';
import Form from './components/Form';
import AddCollection from './components/crud/AddCollection';
import CollectionSettings from './components/CollectionSettings';

const AppRoutes = () => {
  // Implement authentication state management and check if the user is an admin

  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>            
            } 
          />
          <Route 
            path="/form" 
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>            
            } 
          />
          <Route 
            path="/collection-settings" 
            element={
              <ProtectedRoute>
                <CollectionSettings />
              </ProtectedRoute>            
            } 
          />
          <Route 
            path="/add-collection" 
            element={
              <ProtectedRoute>
                <AddCollection />
              </ProtectedRoute>            
            } 
          />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default AppRoutes;