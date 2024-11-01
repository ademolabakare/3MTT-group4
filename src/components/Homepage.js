import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';  // Import Leaflet for custom marker icons
import './Homepage.css';
import ReportForm from './ReportForm';  // The report form component
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';  // For thumbs up/down icons

const Homepage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [location, setLocation] = useState(''); // User's primary location text
  const [lat, setLat] = useState(51.505); // Default latitude
  const [lon, setLon] = useState(-0.09); // Default longitude
  const [showReportForm, setShowReportForm] = useState(false); // Toggle the form
  const [reportLocations, setReportLocations] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);  // State to store the clicked image
  const [userActions, setUserActions] = useState({});  // Declare state for user actions

  // Fetch user details from the backend
  useEffect(() => {
    fetch('http://localhost/backend/get_user_details.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data.error) {
          setUserDetails(data.user);
          setLocation(data.user.location || '');
          const userLat = parseFloat(data.user.lat);
          const userLon = parseFloat(data.user.lon);
          if (!isNaN(userLat) && !isNaN(userLon)) {
            setLat(userLat); // Set lat if valid
            setLon(userLon); // Set lon if valid
          } else {
            console.warn('Invalid latitude or longitude from user data.');
          }
        } else {
          console.log("User not logged in or session expired.");
        }
      })
      .catch(error => console.error('Error fetching user details:', error));
  }, []);

  // Fetch the report locations from the backend
  useEffect(() => {
    fetch('http://localhost/backend/get_location.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched report locations:', data);  // Log the fetched locations
        if (data.status === 'success' && Array.isArray(data.locations)) {
          setReportLocations(data.locations);
        } else {
          console.error('Expected an array of locations, but got:', data);
          setReportLocations([]);  // Set to empty array on error
        }
      })
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  // Custom Leaflet icon for markers (user and reports)
  const userIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const reportIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',  // Red marker icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Function to handle image click (show the image in fullscreen)
  const handleImageClick = (image) => {
    setEnlargedImage(image);  // Set the clicked image as the enlarged one
  };

  // Function to close the enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null);  // Clear the enlarged image state
  };

  // Toggle the report form
  const toggleReportForm = () => {
    setShowReportForm(prevState => !prevState);
  };

  // Handle report submission
  const handleReportSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost/backend/submit_report.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Report submitted successfully');
        setShowReportForm(false);  // Close the form after successful submission
      } else {
        alert('Failed to submit the report');
      }
    } catch (error) {
      console.error('Error submitting the report:', error);
    }
  };

  // Function to handle upcall/downcall and toggle state
  const handleCall = (reportId, action) => {
    const userAction = userActions[reportId] || { upcall: false, downcall: false };  // Get the user's previous action on this report
    let toggle, newAction;
  
    // Handle upcall action
    if (action === 'upcall') {
      if (userAction.upcall) {
        // User clicked again, so undo the upcall
        toggle = 'decrement';
        newAction = { upcall: false, downcall: false };
      } else {
        // User clicked upcall for the first time, or after downcall
        toggle = 'increment';
        newAction = { upcall: true, downcall: false };
      }
    }
  
    // Handle downcall action
    else if (action === 'downcall') {
      if (userAction.downcall) {
        // User clicked again, so undo the downcall
        toggle = 'decrement';
        newAction = { upcall: false, downcall: false };
      } else {
        // User clicked downcall for the first time, or after upcall
        toggle = 'increment';
        newAction = { upcall: false, downcall: true };
      }
    }
  
    // Update the backend
    fetch('http://localhost/backend/update_calls.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        reportId,
        action,
        toggle,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          // Update the report location data (for the thumbs-up/thumbs-down count)
          setReportLocations(prevLocations =>
            prevLocations.map(report => {
              if (report.id === reportId) {
                return {
                  ...report,
                  upcall: action === 'upcall' ? report.upcall + (toggle === 'increment' ? 1 : -1) : report.upcall,
                  downcall: action === 'downcall' ? report.downcall + (toggle === 'increment' ? 1 : -1) : report.downcall,
                };
              }
              return report;
            })
          );
  
          // Update the user's action state
          setUserActions(prevActions => ({
            ...prevActions,
            [reportId]: newAction,
          }));
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };
  

  console.log('Current lat:', lat, 'Current lon:', lon);

  return (
    <div className="homepage-layout">
      {userDetails ? (
        <>
          <div className={`sidebar ${showReportForm ? 'sidebar-expanded' : ''}`}>
            <div className="user-details">
              <h2>Name: {userDetails.name}</h2>
              <p>Primary Location: {userDetails.location}</p>
              <p>Lat: {userDetails.lat}</p>
              <p>Long: {userDetails.lon}</p>
              <p>Reports: 10 {/* Placeholder for activity count */}</p>
              <p>Notification:  {/* Placeholder for activity count */}</p>

              {/* Button to toggle the report form */}
              <button className="report-button" onClick={toggleReportForm}>
                {showReportForm ? "Close Report Form" : "Make Report"}
              </button>
            </div>

            {/* Show the ReportForm only when showReportForm is true */}
            {showReportForm && (
              <div className="report-form-container">
                <ReportForm onSubmit={handleReportSubmit} />
              </div>
            )}
          </div>

          {/* Main map section */}
          <div className="main-window">
            <MapContainer center={[userDetails.lat, userDetails.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Marker for the user's location */}
              <Marker position={[userDetails.lat, userDetails.lon]} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>

              {/* Render markers for all report locations */}
              {reportLocations.map((report, index) => {
                const reportLat = parseFloat(report.latitude);  // Convert to float
                const reportLon = parseFloat(report.longitude);  // Convert to float
                const { description } = report;

                if (!isNaN(reportLat) && !isNaN(reportLon)) {
                  const userAction = userActions[report.id] || { upcall: false, downcall: false }; // Use userAction for individual report

                  return (
                    <Marker key={index} position={[reportLat, reportLon]} icon={reportIcon}>
                      <Popup>
                        <div className="popup-content">
                          <h3>{report.issue_type}</h3>
                          <p><strong>Description:</strong> {report.description}</p>
                          <p><strong>Agency:</strong> {report.agency}</p>
                          <p><strong>Official:</strong> {report.official_name}</p>
                          <p><strong>Location:</strong> {report.location}</p>

                          {/* Thumbs Up/Down Section */}
                          <div className="thumbs-container">
                            <div
                              className={`thumbs-up ${userAction.upcall ? 'active' : ''}`}
                              onClick={() => handleCall(report.id, 'upcall')}
                            >
                              <FaThumbsUp className="thumbs-icon" /> {report.upcall}
                            </div>
                            <div
                              className={`thumbs-down ${userAction.downcall ? 'active' : ''}`}
                              onClick={() => handleCall(report.id, 'downcall')}
                            >
                              <FaThumbsDown className="thumbs-icon" /> {report.downcall}
                            </div>
                          </div>
                  
                          {/* Display images if available */}
                          {report.images && report.images.length > 0 && (
                            <div className="popup-images">
                              <p><strong>Images:</strong></p>
                              {JSON.parse(report.images).map((image, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={`http://localhost/backend/${image}`}
                                  alt={`Report ${index} Image`}
                                  onClick={() => handleImageClick(image)}
                                  style={{ cursor: 'pointer' }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                  
                }
                return null;
              })}
            </MapContainer>

            {/* Floating input for changing location */}
            <div className="floating-ribbon">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}  // Update location
                placeholder="Change location"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="spinner"></div>  // Display the spinner while loading
      )}
       {/* Fullscreen Image Modal */}
       {enlargedImage && (
        <div className="fullscreen-image-modal" onClick={closeEnlargedImage}>
          <div className="image-wrapper">
            <button className="close-button" onClick={closeEnlargedImage}>X</button>
            <img src={`http://localhost/backend/${enlargedImage}`} alt="Enlarged Report" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
