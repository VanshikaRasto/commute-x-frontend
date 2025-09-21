// src/pages/CabRequest.jsx - Complete Updated Version with Enhanced Features
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

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
  const [requests, setRequests] = useState([]);
  const [showRequestList, setShowRequestList] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingCoords, setLoadingCoords] = useState({
    pickup: false,
    destination: false
  });
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });

  // Use refs to store timeout IDs
  const timeoutRefs = useRef({
    pickup: null,
    destination: null
  });

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get authentication headers with better error handling
  const getAuthHeaders = () => {
    // Check multiple possible token storage keys
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('No authentication token found in localStorage');
      console.log('Available localStorage keys:', Object.keys(localStorage));
      setErrorMessage('Authentication token not found. Please login again.');
      return null;
    }
    
    // Validate token format (basic check)
    if (!token.includes('.')) {
      console.error('Invalid token format - not a JWT');
      setErrorMessage('Invalid token format. Please login again.');
      localStorage.clear(); // Clear invalid token
      return null;
    }
    
    console.log('Found token:', token.substring(0, 20) + '...');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Test authentication
  const testAuthentication = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return false;
  
    try {
      const response = await fetch(`${API_BASE_URL}/test-auth`, {
        method: 'GET',
        headers: headers
      });
  
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Authentication test successful:', data.user);
        return true;
      } else {
        console.log('❌ Authentication test failed:', data.error);
        setErrorMessage(`Authentication failed: ${data.error || 'Please login again'}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Authentication test error:', error);
      setErrorMessage('Unable to verify authentication. Please check your connection.');
      return false;
    }
  }, [API_BASE_URL]);

  // Get user info and test auth on component mount
  useEffect(() => {
    const initializeUser = async () => {
      // Get user info from localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const user = JSON.parse(storedUserInfo);
          setUserInfo(user);
          setUserRole(user.role || user.U_Role);
          console.log('User loaded:', { name: user.name, role: user.role });
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }

      // Test authentication
      const authValid = await testAuthentication();
      if (!authValid) {
        console.warn('Authentication test failed - user may need to login again');
      }
    };

    initializeUser();
  }, [testAuthentication]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  // Load cab requests from backend with enhanced filtering
  const loadRequests = async (statusFilter = '', page = 1) => {
    try {
      setLoadingRequests(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      let url = `${API_BASE_URL}/cab-requests?page=${page}&limit=50`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      console.log('Loading requests from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Requests loaded:', data.data.length);
        setRequests(data.data);
        setErrorMessage(''); // Clear any previous errors
      } else {
        if (response.status === 401) {
          setErrorMessage('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          setErrorMessage('Access denied. Insufficient permissions.');
        } else {
          setErrorMessage(`Failed to load requests: ${data.error || data.message || 'Unknown error'}`);
        }
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
      loadRequests(filters.status, filters.page);
    }
    setShowRequestList(!showRequestList);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    if (filterType !== 'page') {
      newFilters.page = 1; // Reset to first page when changing filters
    }
    setFilters(newFilters);
    
    if (showRequestList) {
      loadRequests(filterType === 'status' ? value : newFilters.status, newFilters.page);
    }
  };

  // IMPROVED GEOCODING FUNCTION
  const getCoordinatesFromAddress = useCallback(async (address) => {
    if (!address || address.trim().length < 3) return null;
    
    try {
      console.log('Geocoding address:', address);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'CabBookingApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Geocoding response:', data);
      
      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat).toFixed(6),
          lng: parseFloat(data[0].lon).toFixed(6)
        };
        console.log('Coordinates found:', result);
        return result;
      }
      
      console.log('No coordinates found for address');
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  // FIXED ADDRESS CHANGE HANDLER
  const handleAddressChange = useCallback(async (fieldType, address) => {
    console.log(`Address change for ${fieldType}:`, address);
    
    const isPickup = fieldType === 'pickupLocation';
    const latField = isPickup ? 'pickupLat' : 'destinationLat';
    const lngField = isPickup ? 'pickupLng' : 'destinationLng';
    const timeoutKey = isPickup ? 'pickup' : 'destination';
    const loadingKey = isPickup ? 'pickup' : 'destination';
    
    // Update the address field immediately
    setFormData(prev => ({ ...prev, [fieldType]: address }));
    
    // Clear existing timeout
    if (timeoutRefs.current[timeoutKey]) {
      clearTimeout(timeoutRefs.current[timeoutKey]);
      timeoutRefs.current[timeoutKey] = null;
    }
    
    // Clear coordinates if address is too short
    if (!address || address.trim().length < 3) {
      setFormData(prev => ({ 
        ...prev, 
        [latField]: '', 
        [lngField]: ''
      }));
      setLoadingCoords(prev => ({ ...prev, [loadingKey]: false }));
      return;
    }
    
    // Set loading state immediately
    setLoadingCoords(prev => ({ ...prev, [loadingKey]: true }));
    
    // Start geocoding after delay
    timeoutRefs.current[timeoutKey] = setTimeout(async () => {
      console.log(`Starting geocoding for ${fieldType}`);
      
      try {
        const coordinates = await getCoordinatesFromAddress(address.trim());
        
        if (coordinates) {
          console.log(`Setting coordinates for ${fieldType}:`, coordinates);
          setFormData(prev => ({ 
            ...prev, 
            [latField]: coordinates.lat, 
            [lngField]: coordinates.lng
          }));
        } else {
          console.log(`No coordinates found for ${fieldType}`);
          setFormData(prev => ({ 
            ...prev, 
            [latField]: 'Not found', 
            [lngField]: 'Not found'
          }));
        }
      } catch (error) {
        console.error(`Error geocoding ${fieldType}:`, error);
        setFormData(prev => ({ 
          ...prev, 
          [latField]: 'Error', 
          [lngField]: 'Error'
        }));
      } finally {
        setLoadingCoords(prev => ({ ...prev, [loadingKey]: false }));
        timeoutRefs.current[timeoutKey] = null;
      }
    }, 1500);
  }, [getCoordinatesFromAddress]);

  // Handle regular input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'pickupLocation' || name === 'destination') {
      handleAddressChange(name, value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form to backend with enhanced validation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    // Check authentication first
    const headers = getAuthHeaders();
    if (!headers) {
      await testAuthentication(); // Try to provide more specific error
      return;
    }
    
    // Enhanced validation
    if (!formData.pickupLocation.trim()) {
      setErrorMessage('Pickup location is required');
      return;
    }
    
    if (!formData.destination.trim()) {
      setErrorMessage('Destination is required');
      return;
    }
    
    if (!formData.requestedDateTime) {
      setErrorMessage('Requested date and time is required');
      return;
    }

    // Check if requested time is in the future
    const requestedDate = new Date(formData.requestedDateTime);
    const now = new Date();
    if (requestedDate <= now) {
      setErrorMessage('Requested date and time must be in the future');
      return;
    }
    
    // Validate coordinates
    const invalidCoords = ['Loading...', 'Not found', 'Error', ''];
    if (invalidCoords.includes(formData.pickupLat) || invalidCoords.includes(formData.pickupLng) ||
        invalidCoords.includes(formData.destinationLat) || invalidCoords.includes(formData.destinationLng)) {
      setErrorMessage('Please wait for coordinates to load or enter more specific addresses');
      return;
    }
    
    setLoading(true);
    
    try {
      const requestData = {
        pickupLocation: formData.pickupLocation.trim(),
        pickupLat: parseFloat(formData.pickupLat),
        pickupLng: parseFloat(formData.pickupLng),
        destination: formData.destination.trim(),
        destinationLat: parseFloat(formData.destinationLat),
        destinationLng: parseFloat(formData.destinationLng),
        requestedDateTime: formData.requestedDateTime
      };

      console.log('Sending cab request:', requestData);
      console.log('Using headers:', { ...headers, Authorization: headers.Authorization.substring(0, 20) + '...' });

      const response = await fetch(`${API_BASE_URL}/cab-requests`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

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

        // Refresh request list if showing
        if (showRequestList) {
          setTimeout(() => loadRequests(filters.status, filters.page), 1000);
        }
      } else {
        if (response.status === 401) {
          setErrorMessage('Authentication failed. Please login again.');
          // Optionally redirect to login
        } else if (response.status === 403) {
          setErrorMessage('Access denied. You do not have permission to create cab requests.');
        } else {
          setErrorMessage(`${data.error || data.message || 'Failed to submit cab request'}`);
        }
      }
      
    } catch (error) {
      console.error('Cab request error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check if the backend server is running at ' + API_BASE_URL);
      } else {
        setErrorMessage('Unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // FIXED Update request status function
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      
      const headers = getAuthHeaders();
      if (!headers) {
        setErrorMessage('Authentication token not found. Please login again.');
        return;
      }

      console.log(`Updating request ${requestId} to status ${newStatus}`);

      const response = await fetch(`${API_BASE_URL}/cab-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      console.log('Status update response:', data);

      if (response.ok && data.success) {
        setSuccessMessage(`Request ${requestId} status updated to ${newStatus}`);
        // Refresh the list immediately
        await loadRequests(filters.status, filters.page);
      } else {
        if (response.status === 401) {
          setErrorMessage('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          setErrorMessage('Access denied. You do not have permission to update requests.');
        } else if (response.status === 404) {
          setErrorMessage(`Request ${requestId} not found.`);
        } else {
          setErrorMessage(`Failed to update status: ${data.message || data.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check if the backend server is running.');
      } else {
        setErrorMessage('Error updating request status. Please try again.');
      }
    }
  };

  // Helper function to display coordinates status
  const getCoordinateDisplay = (lat, lng, isLoading) => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading coordinates...</span>
        </div>
      );
    }
    
    if (lat && lng && !['Not found', 'Error'].includes(lat)) {
      return `${lat}, ${lng}`;
    }
    
    if (lat === 'Not found') {
      return 'Address not found - please try a more specific address';
    }
    
    if (lat === 'Error') {
      return 'Error getting coordinates - please try again';
    }
    
    return 'Will appear automatically when you enter address (type at least 3 characters)';
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Cab Request</h2>
          <p className="text-gray-500">
            Book your cab by filling the details below
            {userInfo && (
              <span className="ml-2 text-sm">
                • Welcome, <span className="font-medium">{userInfo.name || userInfo.U_Name}</span>
              </span>
            )}
          </p>
        </div>
        {(userRole === 1 || userRole === 3) && (
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
        <div className="bg-green-100 border border-green-400 p-4 rounded-lg text-green-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 p-4 rounded-lg text-red-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Request List Section */}
      {showRequestList && (userRole === 1 || userRole === 3) && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              All Cab Requests
              {loadingRequests && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </h3>
            
            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              
              <button
                onClick={() => loadRequests(filters.status, filters.page)}
                disabled={loadingRequests}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          {loadingRequests ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-600">Loading requests...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              No cab requests found
              {filters.status && <div className="text-sm mt-2">Try changing the status filter</div>}
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
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{request.id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="font-semibold">{request.userName || 'Unknown'}</div>
                        {request.userEmail && (
                          <div className="text-xs text-gray-500">{request.userEmail}</div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm max-w-xs truncate" title={request.pickupLocation}>
                        {request.pickupLocation}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm max-w-xs truncate" title={request.destination}>
                        {request.destination}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(request.requestedTime).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {request.status === 'PENDING' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'CANCELLED')}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            title="Cancel Request"
                          >
                            Cancel
                          </button>
                        )}
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
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Trip Information</h3>
          
          {/* Pickup Location */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Pickup Location *</label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="Enter pickup address - e.g., Sector 62, Noida, UP"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Type at least 3 characters to start geocoding</p>
          </div>

          {/* Destination */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Destination *</label>
            <input
              type="text"
              name="destination"
              placeholder="Enter destination address - e.g., Connaught Place, Delhi"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Type at least 3 characters to start geocoding</p>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Pickup Coordinates</label>
              <div className={`text-sm p-3 rounded border min-h-[50px] flex items-center ${
                formData.pickupLat === 'Not found' || formData.pickupLat === 'Error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : formData.pickupLat && formData.pickupLng && !['Not found', 'Error'].includes(formData.pickupLat)
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-blue-50 text-gray-500 border-blue-200'
              }`}>
                {getCoordinateDisplay(formData.pickupLat, formData.pickupLng, loadingCoords.pickup)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Destination Coordinates</label>
              <div className={`text-sm p-3 rounded border min-h-[50px] flex items-center ${
                formData.destinationLat === 'Not found' || formData.destinationLat === 'Error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : formData.destinationLat && formData.destinationLng && !['Not found', 'Error'].includes(formData.destinationLat)
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-blue-50 text-gray-500 border-blue-200'
              }`}>
                {getCoordinateDisplay(formData.destinationLat, formData.destinationLng, loadingCoords.destination)}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-4">
            <label className="block font-medium mb-2">When do you need the cab? *</label>
            <input
              type="datetime-local"
              name="requestedDateTime"
              value={formData.requestedDateTime}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Select a future date and time for your trip</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || loadingCoords.pickup || loadingCoords.destination}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loading || loadingCoords.pickup || loadingCoords.destination
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Request...
              </div>
            ) : loadingCoords.pickup || loadingCoords.destination ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading Coordinates...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Submit Cab Request
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CabRequestForm;