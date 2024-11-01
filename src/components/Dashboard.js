import React, { useEffect, useState } from 'react';
import IssueMap from './IssueMap';             // Map showing infrastructure issues
import Statistics from './Statistics';         // Displays dashboard statistics
import UserManagement from './UserManagement'; // Manage users
import ReportManagement from './ReportManagement'; // Manage infrastructure reports
import LocationFilter from './LocationFilter'; // Filter issues based on location
import './Dashboard.css';  // Custom styles for dashboard

const Dashboard = () => {
  const [reports, setReports] = useState([]);   // Store fetched reports
  const [loading, setLoading] = useState(true); // Loading state
  const [activeComponent, setActiveComponent] = useState('map'); // Track which component is active

  // Fetch reports on mount
  useEffect(() => {
    fetch('http://localhost/backend/get_reports.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setReports(data.reports); // Store the reports
        setLoading(false);        // Stop loading spinner
      })
      .catch(err => console.error(err));
  }, []);

  // Handle rendering different sections
  const renderComponent = () => {
    switch (activeComponent) {
      case 'map':
        return loading ? <p>Loading map...</p> : <IssueMap reports={reports} />;
      case 'stats':
        return <Statistics reports={reports} />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <ReportManagement reports={reports} />;
      case 'locationFilter':
        return <LocationFilter />;
      default:
        return <p>Select an option from the sidebar</p>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li onClick={() => setActiveComponent('map')}>Map View</li>
          <li onClick={() => setActiveComponent('stats')}>Statistics</li>
          <li onClick={() => setActiveComponent('users')}>User Management</li>
          <li onClick={() => setActiveComponent('reports')}>Report Management</li>
          <li onClick={() => setActiveComponent('locationFilter')}>Location Filter</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
