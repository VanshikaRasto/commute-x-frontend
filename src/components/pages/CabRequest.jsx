// src/pages/CabRequest.jsx - Updated with backend integration and admin list view
import React, { useState, useCallback, useEffect } from 'react';

const CabRequestForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupLat: '',
    pickupLng: '',
    destination: '',
    destinationLat: '',
    destinationLng: '',
    requestedDateTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addressTimeouts, setAddressTimeouts] = useState({});
  const [requests, setRequests] = useState([]);
  const [showRequestList, setShowRequestList] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get user role from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  // Load cab requests from backend
  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await fetch(`${API_BASE_URL}/cab-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setRequests(data.data);
      } else {
        setErrorMessage(`Failed to load requests: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setErrorMessage('Network error. Please check if the backend server is running.');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Toggle request list visibility
  const toggleRequestList = () => {
    if (!showRequestList) {
      loadRequests();
    }
    setShowRequestList(!showRequestList);
  };

  // Geocoding function
  const getCoordinatesFromAddress = useCallback(async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat).toFixed(6),
          lng: parseFloat(data[0].lon).toFixed(6)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  // Handle address change with geocoding
  const handleAddressChange = useCallback(async (field, address) => {
    const latField = field === 'pickupLocation' ? 'pickupLat' : 'destinationLat';
    const lngField = field === 'pickupLocation' ? 'pickupLng' : 'destinationLng';
    
    setFormData(prev => ({ ...prev, [field]: address }));
    
    // Clear existing timeout
    if (addressTimeouts[field]) {
      clearTimeout(addressTimeouts[field]);
    }
    
    if (address.trim().length > 3) {
      const newTimeout = setTimeout(async () => {
        setFormData(prev => ({ 
          ...prev, 
          [latField]: 'Loading...', 
          [lngField]: 'Loading...'
        }));
        
        const coordinates = await getCoordinatesFromAddress(address);
        if (coordinates) {
          setFormData(prev => ({ 
            ...prev, 
            [latField]: coordinates.lat, 
            [lngField]: coordinates.lng
          }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            [latField]: 'Not found', 
            [lngField]: 'Not found'
          }));
        }
      }, 1000);
      
      setAddressTimeouts(prev => ({ ...prev, [field]: newTimeout }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [latField]: '', 
        [lngField]: ''
      }));
    }
  }, [addressTimeouts, getCoordinatesFromAddress]);

  // Handle regular input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'pickupLocation' || name === 'destination') {
      handleAddressChange(name, value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate coordinates
    const invalidCoords = ['Loading...', 'Not found', ''];
    if (invalidCoords.includes(formData.pickupLat) || invalidCoords.includes(formData.pickupLng) ||
        invalidCoords.includes(formData.destinationLat) || invalidCoords.includes(formData.destinationLng)) {
      setErrorMessage('Please ensure all locations have valid coordinates before submitting!');
      return;
    }
    
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo || !userInfo.name) {
      setErrorMessage('User information not found. Please log in again.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const requestData = {
        pickupLocation: formData.pickupLocation,
        pickupLat: formData.pickupLat,
        pickupLng: formData.pickupLng,
        destination: formData.destination,
        destinationLat: formData.destinationLat,
        destinationLng: formData.destinationLng,
        requestedDateTime: formData.requestedDateTime,
        userId: userInfo._id,
        userName: userInfo.name,
        userEmail: userInfo.email
      };

      const response = await fetch(`${API_BASE_URL}/cab-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`Cab request submitted successfully! Request ID: ${data.requestId}`);
        
        // Reset form
        setFormData({
          pickupLocation: '',
          pickupLat: '',
          pickupLng: '',
          destination: '',
          destinationLat: '',
          destinationLng: '',
          requestedDateTime: ''
        });

        // Refresh request list if it's visible
        if (showRequestList) {
          loadRequests();
        }
        
        console.log('Cab request submitted:', data);
      } else {
        setErrorMessage(`${data.error || 'Failed to submit cab request'}`);
      }
      
    } catch (error) {
      console.error('Cab request error:', error);
      setErrorMessage('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Cab Request</h2>
          <p className="text-gray-500">Book your cab by filling the details below</p>
        </div>
        {(userRole === 1 || userRole === 3) && ( // Admin or Manager
          <button
            onClick={toggleRequestList}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {showRequestList ? 'Hide Request List' : 'View All Requests'}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 p-4 rounded-lg text-red-800 mb-4">
          {errorMessage}
        </div>
      )}

      {/* Cab Request List Section (Admin/Manager Only) */}
      {showRequestList && (userRole === 1 || userRole === 3) && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            All Cab Requests
            {loadingRequests && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          
          {loadingRequests ? (
            <div className="text-center py-4">
              <div className="text-gray-600">Loading requests...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No cab requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Pickup</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Destination</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Requested Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{request.id}</td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">{request.userName || 'Unknown'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{request.pickupLocation}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{request.destination}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(request.requestedTime).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : request.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Trip Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Trip Information</h3>
          
          {/* Pickup Location */}
          <div className="mb-4">
            <label className="block font-medium">Pickup Location *</label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="Enter pickup address - e.g., Sector 62, Noida, UP"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Destination */}
          <div className="mb-4">
            <label className="block font-medium">Destination *</label>
            <input
              type="text"
              name="destination"
              placeholder="Enter destination address - e.g., Connaught Place, Delhi"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Pickup Coordinates</label>
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded border">
                {formData.pickupLat && formData.pickupLng ? 
                  `${formData.pickupLat}, ${formData.pickupLng}` : 
                  'Will appear automatically when you enter pickup address'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Destination Coordinates</label>
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded border">
                {formData.destinationLat && formData.destinationLng ? 
                  `${formData.destinationLat}, ${formData.destinationLng}` : 
                  'Will appear automatically when you enter destination'}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-4">
            <label className="block font-medium">When do you need the cab? *</label>
            <input
              type="datetime-local"
              name="requestedDateTime"
              value={formData.requestedDateTime}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Distance & Duration Estimate */}
        {formData.pickupLat && formData.destinationLat && 
         !['Loading...', 'Not found'].includes(formData.pickupLat) && 
         !['Loading...', 'Not found'].includes(formData.destinationLat) && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Trip Estimate</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Estimated Distance:</span>
                <span className="ml-2 text-blue-700">Will be calculated</span>
              </div>
              <div>
                <span className="font-medium">Estimated Duration:</span>
                <span className="ml-2 text-blue-700">Will be calculated</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
            } text-white shadow-lg`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Request...
              </div>
            ) : (
              'Submit Cab Request'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          Your request will be processed and you'll receive confirmation shortly.<br/>
          Contact details will be taken from your user profile.
        </div>
      </form>
    </div>
  );
};

export default CabRequestForm;