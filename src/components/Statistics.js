// src/components/Statistics.js
import React from 'react';

const Statistics = ({ reports }) => {
  const openReports = reports.filter(report => report.status === 'open').length;
  const resolvedReports = reports.filter(report => report.status === 'resolved').length;

  return (
    <div className="statistics">
      <h3>Dashboard Overview</h3>
      <p>Total Reports: {reports.length}</p>
      <p>Open Reports: {openReports}</p>
      <p>Resolved Reports: {resolvedReports}</p>
    </div>
  );
};

export default Statistics;
