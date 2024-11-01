import React, { useState } from 'react';
import SocialMediaIcons from './SocialMediaIcons';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Individual');
  const [agencyName, setAgencyName] = useState('');
  const navigate = useNavigate();  // React Router's hook to navigate to different routes


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload on form submission

    // Create a form data object to send in the POST request
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('location', location);
    formData.append('password', password);
    formData.append('account_type', accountType);

    if (accountType === 'Agency') {
      formData.append('agency_name', agencyName); // Only append agency name if it's an agency
    }

    try {
      // Send the POST request to insert_user.php
      const response = await fetch('http://localhost/backend/insert_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Send as URL-encoded form data
        },
        body: formData,
      });

      const result = await response.json(); // Parse JSON response
      if (result.status === 'success') {
        alert('User registered successfully!');
        // Optionally redirect to another page
        navigate('/homepage');
      } else {
        alert('Error registering user: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error with the registration.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-600 p-10 text-white flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Let's setup your account</h1>
        <p className="text-lg">Create your account by filling out the form or signing up via social media.</p>
      </div>

      {/* Right Section - Form */}
      <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}  // Update name state
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Update email state
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}  // Update location state
            required
          />

          {/* Radio Button for Account Type */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="accountType"
                value="Individual"
                checked={accountType === 'Individual'}
                onChange={() => setAccountType('Individual')}  // Update account type
                className="mr-2"
              />
              Individual
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="accountType"
                value="Agency"
                checked={accountType === 'Agency'}
                onChange={() => setAccountType('Agency')}  // Update account type
                className="mr-2"
              />
              Agency
            </label>
          </div>

          {/* Optional Agency Name */}
          {accountType === 'Agency' && (
            <input
              type="text"
              placeholder="Agency Name (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}  // Update agency name
            />
          )}

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
            Sign Up
          </button>
        </form>

        {/* Social Media Login */}
        <div className="mt-8">
          <p className="text-center text-gray-500">Or sign up with</p>
          <SocialMediaIcons />
        </div>

        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-600">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
