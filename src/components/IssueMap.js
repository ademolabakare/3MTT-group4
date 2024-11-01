// src/components/IssueMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const IssueMap = ({ reports }) => (
  <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {reports.map((report, index) => (
      <Marker key={index} position={[51.505, -0.09]}>
        <Popup>
          <strong>{report.issue_type}</strong>
          <p>{report.description}</p>
          <p>Status: {report.status}</p>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default IssueMap;
