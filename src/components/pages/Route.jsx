import React, { useState, useCallback, useEffect } from 'react';

const Route = () => {
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    origin: '',
    destination: '',
    estimatedDistanceKm: '',
    estimatedTimeMinutes: '',
    isActive: true
  });

  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [showRoutesList, setShowRoutesList] = useState(true);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const addressTimeoutsRef = React.useRef({});

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Clear messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(addressTimeoutsRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Load routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch all routes
  const fetchRoutes = useCallback(async () => {
    setRoutesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/routes`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRoutes(data.data);
      } else {
        setErrorMessage(`Failed to fetch routes: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch routes error:', error);
      setErrorMessage('Network error while fetching routes');
    } finally {
      setRoutesLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch single route for editing
  const fetchRouteForEdit = useCallback(async (routeId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${routeId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        const route = data.data;
        
        // Parse duration back to minutes
        const durationMatch = route.duration.match(/(\d+)/);
        const durationMinutes = durationMatch ? durationMatch[1] : '';
        
        // Parse distance back to number
        const distanceMatch = route.distance.match(/(\d+)/);
        const distanceKm = distanceMatch ? distanceMatch[1] : '';
        
        setFormData({
          routeId: route.routeNo,
          name: route.name,
          origin: route.source,
          destination: route.destination,
          estimatedDistanceKm: distanceKm,
          estimatedTimeMinutes: durationMinutes,
          isActive: route.status === 'Active'
        });
        
        setStops(route.stops || []);
        setIsEditing(true);
        setEditingRouteId(routeId);
        setShowRoutesList(false);
      } else {
        setErrorMessage(`Failed to fetch route details: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch route error:', error);
      setErrorMessage('Network error while fetching route details');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Delete route
  const deleteRoute = useCallback(async (routeId, routeName) => {
    if (!window.confirm(`Are you sure you want to delete the route "${routeName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [routeId]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        await fetchRoutes(); // Refresh the routes list
      } else {
        setErrorMessage(`Failed to delete route: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete route error:', error);
      setErrorMessage('Network error while deleting route');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [routeId]: false }));
    }
  }, [API_BASE_URL, fetchRoutes]);

  // Reset form to create new route
  const resetForm = useCallback(() => {
    setFormData({
      routeId: '',
      name: '',
      origin: '',
      destination: '',
      estimatedDistanceKm: '',
      estimatedTimeMinutes: '',
      isActive: true
    });
    setStops([]);
    setIsEditing(false);
    setEditingRouteId(null);
    setShowRoutesList(false);
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  // Cancel editing and go back to routes list
  const cancelEdit = useCallback(() => {
    resetForm();
    setShowRoutesList(true);
  }, [resetForm]);

  // Geocoding function to get lat/lng from address
  const getCoordinatesFromAddress = useCallback(async (address) => {
    try {
      // Clean up address for better results
      const cleanAddress = address.trim().replace(/\s+/g, ' ');
      
      // Try multiple API endpoints as fallbacks
      const apiEndpoints = [
        // Direct Nominatim (might work if CORS is enabled)
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1&countrycodes=in`,
        // Alternative geocoding service
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cleanAddress)}&key=YOUR_OPENCAGE_KEY&limit=1&countrycode=in`,
        // Another fallback (you can add more)
        `https://geocode.maps.co/search?q=${encodeURIComponent(cleanAddress)}&limit=1`
      ];
      
      for (let i = 0; i < apiEndpoints.length; i++) {
        try {
          const endpoint = apiEndpoints[i];
          
          // Skip OpenCage if no API key
          if (endpoint.includes('opencagedata') && endpoint.includes('YOUR_OPENCAGE_KEY')) {
            continue;
          }
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'User-Agent': 'CabBookingApp/1.0'
            }
          });
          
          if (!response.ok) {
            console.warn(`Geocoding attempt ${i + 1} failed with status:`, response.status);
            continue;
          }
          
          const data = await response.json();
          
          // Handle different API response formats
          let lat, lng;
          
          if (endpoint.includes('nominatim') || endpoint.includes('maps.co')) {
            if (data && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lng = parseFloat(data[0].lon);
            }
          } else if (endpoint.includes('opencagedata')) {
            if (data && data.results && data.results.length > 0) {
              lat = data.results[0].geometry.lat;
              lng = data.results[0].geometry.lng;
            }
          }
          
          if (lat && lng) {
            return {
              lat: lat.toFixed(6),
              lng: lng.toFixed(6)
            };
          }
          
        } catch (apiError) {
          console.warn(`Geocoding attempt ${i + 1} error:`, apiError.message);
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  // Handle Input Change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }, []);

  // Add a new stop
  const addStop = useCallback(() => {
    const newStop = {
      id: Date.now(),
      stopName: '',
      address: '',
      lat: '',
      lng: ''
    };
    setStops(prevStops => [...prevStops, newStop]);
  }, []);

  // Remove a stop
  const removeStop = useCallback((stopId) => {
    setStops(prevStops => prevStops.filter(stop => stop.id !== stopId));
    // Clean up timeout for removed stop
    if (addressTimeoutsRef.current[stopId]) {
      clearTimeout(addressTimeoutsRef.current[stopId]);
      delete addressTimeoutsRef.current[stopId];
    }
  }, []);

  // Update stop data
  const updateStop = useCallback((stopId, field, value) => {
    setStops(prevStops => prevStops.map(stop => 
      stop.id === stopId ? { ...stop, [field]: value } : stop
    ));
  }, []);

  // Handle address change and auto-fetch coordinates with debouncing
  const handleAddressChange = useCallback((stopId, address) => {
    updateStop(stopId, 'address', address);
    
    // Clear any existing timeout for this stop
    if (addressTimeoutsRef.current[stopId]) {
      clearTimeout(addressTimeoutsRef.current[stopId]);
    }
    
    // Auto-geocode after user stops typing (debounce for 1 second)
    if (address.trim().length > 3) {
      addressTimeoutsRef.current[stopId] = setTimeout(async () => {
        // Show loading state
        updateStop(stopId, 'lat', 'Loading...');
        updateStop(stopId, 'lng', 'Loading...');
        
        const coordinates = await getCoordinatesFromAddress(address);
        if (coordinates) {
          updateStop(stopId, 'lat', coordinates.lat);
          updateStop(stopId, 'lng', coordinates.lng);
        } else {
          updateStop(stopId, 'lat', 'Not found');
          updateStop(stopId, 'lng', 'Not found');
        }
      }, 1000);
    } else {
      // Clear coordinates if address is too short
      updateStop(stopId, 'lat', '');
      updateStop(stopId, 'lng', '');
    }
  }, [updateStop, getCoordinatesFromAddress]);

  // Calculate estimated distance and time based on origin and destination
  const calculateRouteMetrics = useCallback(async (origin, destination) => {
    if (!origin || !destination) return;
    
    setCalculating(true);
    
    try {
      // Get coordinates for origin and destination
      const originCoords = await getCoordinatesFromAddress(origin);
      const destCoords = await getCoordinatesFromAddress(destination);
      
      if (originCoords && destCoords) {
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (parseFloat(destCoords.lat) - parseFloat(originCoords.lat)) * Math.PI / 180;
        const dLon = (parseFloat(destCoords.lng) - parseFloat(originCoords.lng)) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(parseFloat(originCoords.lat) * Math.PI/180) * Math.cos(parseFloat(destCoords.lat) * Math.PI/180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Calculate time based on distance (assuming average speed of 30 km/h in city)
        const avgSpeed = 30; // km/h
        const timeInHours = distance / avgSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        
        setFormData(prev => ({
          ...prev,
          estimatedDistanceKm: Math.round(distance).toString(),
          estimatedTimeMinutes: timeInMinutes.toString()
        }));
      } else {
        // Fallback calculation if coordinates not found
        const baseDistance = 15; // default km
        const baseTime = 35; // default minutes
        
        setFormData(prev => ({
          ...prev,
          estimatedDistanceKm: baseDistance.toString(),
          estimatedTimeMinutes: baseTime.toString()
        }));
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      // Fallback values
      setFormData(prev => ({
        ...prev,
        estimatedDistanceKm: '15',
        estimatedTimeMinutes: '35'
      }));
    } finally {
      setCalculating(false);
    }
  }, [getCoordinatesFromAddress]);

  // Auto-calculate when origin and destination both are filled
  useEffect(() => {
    if (formData.origin && formData.destination && 
        formData.origin.length > 3 && formData.destination.length > 3) {
      const timeoutId = setTimeout(() => {
        calculateRouteMetrics(formData.origin, formData.destination);
      }, 2000); // Wait 2 seconds after user stops typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData.origin, formData.destination, calculateRouteMetrics]);

  // Submit Form
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required fields
    if (!formData.routeId || !formData.name || !formData.origin || !formData.destination || !formData.estimatedDistanceKm || !formData.estimatedTimeMinutes) {
      setErrorMessage("All route information fields are required!");
      return;
    }
    
    if (stops.length === 0) {
      setErrorMessage("Please add at least one stop to the route.");
      return;
    }
    
    // Validate that all stops have coordinates
    const invalidStops = stops.filter(stop => 
      !stop.stopName || !stop.address ||
      !stop.lat || !stop.lng || 
      stop.lat === 'Loading...' || stop.lng === 'Loading...' ||
      stop.lat === 'Not found' || stop.lng === 'Not found'
    );
    
    if (invalidStops.length > 0) {
      setErrorMessage("Please ensure all stops have valid names, addresses, and coordinates before submitting.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for backend
      const submitData = {
        routeId: formData.routeId,
        name: formData.name,
        origin: formData.origin,
        destination: formData.destination,
        estimatedDistanceKm: parseFloat(formData.estimatedDistanceKm),
        estimatedTimeMinutes: parseInt(formData.estimatedTimeMinutes, 10),
        isActive: formData.isActive,
        stops: stops.map(stop => ({
          stopName: stop.stopName,
          address: stop.address,
          lat: parseFloat(stop.lat),
          lng: parseFloat(stop.lng)
        }))
      };

      console.log('Submitting route data:', submitData);

      const url = isEditing 
        ? `${API_BASE_URL}/routes/${editingRouteId}`
        : `${API_BASE_URL}/routes`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const action = isEditing ? 'updated' : 'registered';
        const stopsAction = isEditing ? data.stopsUpdated : data.stopsAdded;
        setSuccessMessage(`Route "${formData.name}" ${action} successfully with ${stopsAction} stops!`);
        
        // Reset form and refresh routes list
        resetForm();
        setShowRoutesList(true);
        await fetchRoutes();
        
        console.log(`Route ${action} successfully:`, data);
      } else {
        setErrorMessage(`${data.error || `Route ${isEditing ? 'update' : 'registration'} failed`}`);
      }
      
    } catch (error) {
      console.error(`Route ${isEditing ? 'update' : 'registration'} error:`, error);
      setErrorMessage("Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, [formData, stops, API_BASE_URL, isEditing, editingRouteId, resetForm, fetchRoutes]);

  // Routes List View
  if (showRoutesList) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Route Management</h2>
            <p className="text-gray-500">View, edit, and manage all routes</p>
          </div>
          <button
            onClick={resetForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Route
          </button>
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

        {routesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading routes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Route ID</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Source</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Destination</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Distance</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Duration</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Stops</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No routes found. Create your first route to get started.
                    </td>
                  </tr>
                ) : (
                  routes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">{route.routeNo}</td>
                      <td className="border border-gray-300 px-4 py-3">{route.name}</td>
                      <td className="border border-gray-300 px-4 py-3">{route.source}</td>
                      <td className="border border-gray-300 px-4 py-3">{route.destination}</td>
                      <td className="border border-gray-300 px-4 py-3">{route.distance}</td>
                      <td className="border border-gray-300 px-4 py-3">{route.duration}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{route.stopCount}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          route.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {route.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchRouteForEdit(route.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRoute(route.id, route.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            disabled={deleteLoading[route.id]}
                          >
                            {deleteLoading[route.id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Form View (Create/Edit)
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {isEditing ? 'Edit Route' : 'Route Registration'}
          </h2>
          <p className="text-gray-500">
            {isEditing ? 'Update route information and stops' : 'Create a new route with multiple stops and save to database'}
          </p>
        </div>
        <button
          onClick={cancelEdit}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Routes
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Route Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Route Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="routeId" className="block font-medium">Route ID *</label>
              <input
                id="routeId"
                name="routeId"
                type="text"
                placeholder="e.g., ROUTE001, RT_GUR_NOI_001"
                value={formData.routeId}
                onChange={handleChange}
                required
                disabled={isEditing} // Disable route ID editing to prevent conflicts
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'bg-gray-100' : ''}`}
              />
            </div>
            <div>
              <label htmlFor="name" className="block font-medium">Route Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Gurgaon to Noida Express Route"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="origin" className="block font-medium">Origin *</label>
              <input
                id="origin"
                name="origin"
                type="text"
                placeholder="Starting point location"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block font-medium">Destination *</label>
              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="Ending point location"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="estimatedDistanceKm" className="block font-medium">Estimated Distance (km) *</label>
              <div className="relative">
                <input
                  id="estimatedDistanceKm"
                  type="number"
                  name="estimatedDistanceKm"
                  placeholder={calculating ? "Calculating..." : "e.g., 25"}
                  value={formData.estimatedDistanceKm}
                  onChange={handleChange}
                  required
                  step="1"
                  min="1"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${calculating ? 'bg-yellow-50' : ''}`}
                />
                {calculating && (
                  <div className="absolute right-3 top-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="estimatedTimeMinutes" className="block font-medium">Estimated Time (minutes) *</label>
              <div className="relative">
                <input
                  id="estimatedTimeMinutes"
                  type="number"
                  name="estimatedTimeMinutes"
                  placeholder={calculating ? "Calculating..." : "e.g., 45"}
                  value={formData.estimatedTimeMinutes}
                  onChange={handleChange}
                  required
                  min="1"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${calculating ? 'bg-yellow-50' : ''}`}
                />
                {calculating && (
                  <div className="absolute right-3 top-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center mt-6">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-3 font-medium">Active Route</label>
            </div>
          </div>
        </div>

        {/* Route Stops Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Route Stops</h3>
          <p className="text-sm text-gray-500 mb-4">Add stops along the route path (minimum 1 stop required)</p>
          
          <div className="space-y-4 mb-4">
            {stops.map((stop, index) => (
              <div key={stop.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Stop {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStop(stop.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    aria-label={`Remove stop ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-3">
                  <label htmlFor={`stopName-${stop.id}`} className="block font-medium">Stop Name *</label>
                  <input
                    id={`stopName-${stop.id}`}
                    type="text"
                    placeholder="e.g., Sector 62 Metro Station"
                    value={stop.stopName}
                    onChange={(e) => updateStop(stop.id, 'stopName', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor={`address-${stop.id}`} className="block font-medium">Address *</label>
                  <input
                    id={`address-${stop.id}`}
                    type="text"
                    placeholder="Type address here - e.g., Sector 62, Noida, UP"
                    value={stop.address}
                    onChange={(e) => handleAddressChange(stop.id, e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Coordinates will auto-populate after typing address</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`lat-${stop.id}`} className="block font-medium text-gray-600">Latitude</label>
                    <input
                      id={`lat-${stop.id}`}
                      type="text"
                      placeholder={stop.lat === 'Loading...' ? 'Loading...' : stop.lat === 'Not found' ? 'Enter manually' : 'Will appear automatically'}
                      value={stop.lat}
                      onChange={(e) => updateStop(stop.id, 'lat', e.target.value)}
                      className={`w-full p-3 border border-gray-300 rounded-lg text-gray-700 ${
                        stop.lat === 'Loading...' ? 'bg-yellow-50' : 
                        stop.lat === 'Not found' ? 'bg-red-50' : 
                        stop.lat ? 'bg-green-50' : 'bg-blue-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`lng-${stop.id}`} className="block font-medium text-gray-600">Longitude</label>
                    <input
                      id={`lng-${stop.id}`}
                      type="text"
                      placeholder={stop.lng === 'Loading...' ? 'Loading...' : stop.lng === 'Not found' ? 'Enter manually' : 'Will appear automatically'}
                      value={stop.lng}
                      onChange={(e) => updateStop(stop.id, 'lng', e.target.value)}
                      className={`w-full p-3 border border-gray-300 rounded-lg text-gray-700 ${
                        stop.lng === 'Loading...' ? 'bg-yellow-50' : 
                        stop.lng === 'Not found' ? 'bg-red-50' : 
                        stop.lng ? 'bg-green-50' : 'bg-blue-50'
                      }`}
                    />
                  </div>
                </div>
                
                {(stop.lat === 'Not found' || stop.lng === 'Not found') && (
                  <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-700">
                      Coordinates not found automatically. You can:
                      <br />• Try a different address format
                      <br />• Enter coordinates manually (use Google Maps to find them)
                      <br />• Example coordinates for Delhi: 28.6139, 77.2090
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addStop}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            + Add Stop
          </button>
        </div>

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
                {isEditing ? 'Updating Route...' : 'Registering Route...'}
              </div>
            ) : (
              isEditing ? 'Update Route' : 'Register Route'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Route;