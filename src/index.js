import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Your styling file
import App from './App';  // Import App from src/
import 'leaflet/dist/leaflet.css';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Ensure index.html contains a root div
);
