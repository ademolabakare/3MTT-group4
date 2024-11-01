// src/components/LocationFilter.js
import React, { useState } from 'react';

const LocationFilter = ({ setFilteredReports }) => {
  const [location, setLocation] = useState('');

  const handleFilter = () => {
    fetch(`http://localhost/backend/filter_reports.php?location=${location}`)
      .then(res => res.json())
      .then(data => setFilteredReports(data.reports));
  };

  return (
    <div className="location-filter">
      <input
        type="text"
        placeholder="Filter by location..."
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default LocationFilter;
