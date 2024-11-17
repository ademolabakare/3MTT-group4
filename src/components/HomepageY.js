import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Bell, 
  Menu, 
  X, 
  MapPin, 
  ChevronDown, 
  Search,
  User,
  Home,
  AlertCircle,
  Settings,
  PieChart,
  Clock,
  FileText,
  HelpCircle,
  Plus
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReportForm from './ReportForm';

const Homepage = () => {
  const DEFAULT_LAT = 51.505;
  const DEFAULT_LON = -0.09;

  const [userDetails, setUserDetails] = useState(null);
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lon, setLon] = useState(DEFAULT_LON);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportLocations, setReportLocations] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [userActions, setUserActions] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Keep existing useEffect hooks and handler functions...


  // Fetch user details from the backend
  useEffect(() => {
    setIsLoading(true);
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
        if (!data.error && data.user) {
          setUserDetails(data.user);
          setLocation(data.user.location || '');
          const userLat = parseFloat(data.user.lat);
          const userLon = parseFloat(data.user.lon);
          if (!isNaN(userLat) && !isNaN(userLon)) {
            setLat(userLat);
            setLon(userLon);
          }
        }
      })
      .catch(error => console.error('Error fetching user details:', error))
      .finally(() => setIsLoading(false));
  }, []);

  // Keep your other existing useEffect hooks and handler functions...
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

  // Sidebar navigation items
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'reports', icon: FileText, label: 'My Reports' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'activity', icon: Clock, label: 'Recent Activity' },
    { id: 'issues', icon: AlertCircle, label: 'Active Issues' },
  ];

  const secondaryNavigation = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Keep existing header... */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        {/* ... Header content ... */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <MapPin className="text-blue-600" />
              <h1 className="text-xl font-semibold">CityWatch</h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="mt-2 space-y-2">
                      <div className="p-2 hover:bg-gray-50 rounded-lg">
                        <p className="text-sm">New report in your area</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {userDetails?.name?.charAt(0) || '?'}
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Modernized Sidebar with Navigation */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200`}>
          {isSidebarOpen && (
            <div className="flex flex-col h-full">
              {/* User Profile Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {userDetails?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-medium">{userDetails?.name || 'Guest'}</h2>
                    <p className="text-sm text-gray-500">{userDetails?.location || 'Location not set'}</p>
                  </div>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Create Report Button */}
                <div className="px-4 mt-6">
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Create Report</span>
                  </button>
                </div>

                {/* Secondary Navigation */}
                <nav className="px-4 mt-6 pt-6 border-t border-gray-200">
                  {secondaryNavigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Main Map Container */}
        <div className="flex-1 relative z-0">
          <MapContainer 
            center={[lat, lon]}
            zoom={13} 
            className="h-full w-full"
          >
            {/* ... Keep existing map content ... */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            <Marker position={[lat, lon]} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Report markers */}
            {reportLocations.map((report, index) => {
              const reportLat = parseFloat(report.latitude);
              const reportLon = parseFloat(report.longitude);

              if (!isNaN(reportLat) && !isNaN(reportLon)) {
                const userAction = userActions[report.id] || { upcall: false, downcall: false };

                return (
                  <Marker key={index} position={[reportLat, reportLon]} icon={reportIcon}>
                    <Popup>
                      <div className="popup-content">
                        <h3 className="font-semibold">{report.issue_type}</h3>
                        <p><strong>Description:</strong> {report.description}</p>
                        <p><strong>Agency:</strong> {report.agency}</p>
                        <p><strong>Official:</strong> {report.official_name}</p>
                        <p><strong>Location:</strong> {report.location}</p>

                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            className={`flex items-center space-x-1 ${userAction.upcall ? 'text-blue-600' : 'text-gray-600'}`}
                            onClick={() => handleCall(report.id, 'upcall')}
                          >
                            <FaThumbsUp /> <span>{report.upcall}</span>
                          </button>
                          <button
                            className={`flex items-center space-x-1 ${userAction.downcall ? 'text-red-600' : 'text-gray-600'}`}
                            onClick={() => handleCall(report.id, 'downcall')}
                          >
                            <FaThumbsDown /> <span>{report.downcall}</span>
                          </button>
                        </div>

                        {report.images && report.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {JSON.parse(report.images).map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={`http://localhost/backend/${image}`}
                                alt={`Report ${index} Image`}
                                onClick={() => handleImageClick(image)}
                                className="rounded cursor-pointer hover:opacity-80 transition-opacity"
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
        </div>
      </div>

      {/* Report Form Modal */}
     {/* Report Form Modal */}
{showReportForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
      <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold">Create New Report</h2>
        <button 
          onClick={() => setShowReportForm(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        <ReportForm 
          onSubmit={(formData) => {
            handleReportSubmit(formData);
            setShowReportForm(false);
          }}
        />
      </div>
    </div>
  </div>
)}

      {/* Keep existing Image Modal... */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]" onClick={closeEnlargedImage}>
          {/* ... Image modal content ... */}
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              onClick={closeEnlargedImage}
            >
              <X size={24} />
            </button>
            <img 
              src={`http://localhost/backend/${enlargedImage}`} 
              alt="Enlarged Report"
              className="max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;