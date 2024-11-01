import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialMediaIcons from './SocialMediaIcons';

const LoginForm = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // React Router's hook to navigate to different routes

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form behavior (page reload)
  
    try {
      // Send POST request to the login PHP script
      const response = await fetch('http://localhost/backend/login_user.php', {
        method: 'POST',
        credentials: 'include',  // Include cookies (PHPSESSID)
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',  // Send as form data
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });
  
      const result = await response.json();  // Parse JSON response
      if (result.status === 'success') {
        alert('Login successful!');

        // Check account type and navigate accordingly
        if (result.account_type === 'Agency') {
          navigate('/dashboard');  // Redirect to dashboard for agency
        } else {
          navigate('/homepage');   // Redirect to homepage for individual
        }
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-600 p-10 text-white flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Let's setup your account</h1>
        <p className="text-lg">Get started by entering your details or login with a social account</p>
      </div>

      {/* Right Section - Form */}
      <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold mb-6">Login</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Update email state
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* Social Media Login */}
        <div className="mt-8">
          <p className="text-center text-gray-500">Or login with</p>
          <SocialMediaIcons />
        </div>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
