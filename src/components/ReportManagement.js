// src/components/ReportManagement.js
import React, { useState } from 'react';

const ReportManagement = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const assignTask = (reportId, assignedTo) => {
    fetch('http://localhost/backend/assign_task.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        reportId,
        assignedTo,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Task assigned successfully!');
        }
      });
  };

  return (
    <div className="report-management">
      <h3>Report Management</h3>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Issue Type</th>
            <th>Status</th>
            <th>Assign To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.location}</td>
              <td>{report.issue_type}</td>
              <td>{report.status}</td>
              <td>
                <input
                  type="text"
                  placeholder="Assign to..."
                  onChange={e => setSelectedReport({ id: report.id, assignedTo: e.target.value })}
                />
              </td>
              <td>
                <button onClick={() => assignTask(selectedReport.id, selectedReport.assignedTo)}>
                  Assign Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportManagement;
