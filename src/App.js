import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';  // Import the login form component
import SignupForm from './components/SignupForm'; // Import the signup form component
import Homepage from './components/HomepageY';  // Import homepage
import Dashboard from './components/Dashboard';  // Import the dashboard component

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login form */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Route for the signup form */}
        <Route path="/signup" element={<SignupForm />} />
        
        {/* Route for homepage after login */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Route for agency dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Add dashboard route */}

        {/* Default route */}
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
