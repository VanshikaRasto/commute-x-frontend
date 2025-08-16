import React, { useState, useCallback } from 'react';

const Route = () => {
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    origin: '',
    destination: '',
    category: '',
    estimatedDistanceKm: '',
    estimatedTimeMinutes: '',
    isActive: true
  });

  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const addressTimeoutsRef = React.useRef({});

  // Geocoding function to get lat/lng from address
  const getCoordinatesFromAddress = useCallback(async (address) => {
    try {
      // Using OpenStreetMap Nominatim API (free)
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

  // Submit Form
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (stops.length === 0) {
      alert('Please add at least one stop to the route.');
      return;
    }
    
    // Validate that all stops have coordinates
    const invalidStops = stops.filter(stop => 
      !stop.lat || !stop.lng || 
      stop.lat === 'Loading...' || stop.lng === 'Loading...' ||
      stop.lat === 'Not found' || stop.lng === 'Not found'
    );
    
    if (invalidStops.length > 0) {
      alert('Please ensure all stops have valid coordinates before submitting.');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const routeData = {
        route_id: formData.routeId,
        name: formData.name,
        origin: formData.origin,
        destination: formData.destination,
        category: formData.category,
        estimated_distance_km: parseFloat(formData.estimatedDistanceKm) || 0,
        estimated_time_minutes: parseInt(formData.estimatedTimeMinutes, 10) || 0,
        is_active: formData.isActive,
        created_at: new Date().toISOString()
      };

      const routeStops = stops.map((stop, index) => ({
        stop_id: `STOP${String(index + 1).padStart(3, '0')}`,
        route_id: routeData.route_id,
        stop_name: stop.stopName,
        address: stop.address,
        sequence_no: index + 1,
        lat: parseFloat(stop.lat) || 0,
        lng: parseFloat(stop.lng) || 0
      }));

      const completeRouteData = {
        route: routeData,
        stops: routeStops,
        metadata: {
          total_stops: routeStops.length,
          registration_timestamp: new Date().toISOString()
        }
      };

      // Create JSON file for download
      const jsonData = JSON.stringify(completeRouteData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `${routeData.route_id}.json`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Route registered successfully!');
      setLoading(false);
      
      console.log('Route registered successfully:', completeRouteData);
    }, 1000);
  }, [formData, stops]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Route Registration</h2>
      <p className="text-gray-500 mb-4">Create a new route with multiple stops</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      {/* FORM START */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Route Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Route Information</h3>
          
          {/* Route ID */}
          <div className="mb-4">
            <label htmlFor="routeId" className="block font-medium">Route ID *</label>
            <input
              id="routeId"
              name="routeId"
              type="text"
              placeholder="e.g., ROUTE001"
              value={formData.routeId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Route Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">Route Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Gurgaon to Noida Route A"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Origin + Destination */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="origin" className="block font-medium">Origin *</label>
              <input
                id="origin"
                name="origin"
                type="text"
                placeholder="Starting point"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block font-medium">Destination *</label>
              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="Ending point"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          

          {/* Distance + Time + Active Status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="estimatedDistanceKm" className="block font-medium">Estimated Distance (km) *</label>
              <input
                id="estimatedDistanceKm"
                type="number"
                name="estimatedDistanceKm"
                placeholder="e.g., 25.5"
                value={formData.estimatedDistanceKm}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="estimatedTimeMinutes" className="block font-medium">Estimated Time (minutes) *</label>
              <input
                id="estimatedTimeMinutes"
                type="number"
                name="estimatedTimeMinutes"
                placeholder="e.g., 45"
                value={formData.estimatedTimeMinutes}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isActive" className="font-medium">Active Route</label>
            </div>
          </div>
        </div>

        {/* Route Stops Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Route Stops</h3>
          <p className="text-sm text-gray-500 mb-4">Add stops along the route path</p>
          
          {/* Stops Container */}
          <div className="space-y-4 mb-4">
            {stops.map((stop, index) => (
              <div key={stop.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Stop {index + 1}
                  </span>
                  {stops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStop(stop.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      aria-label={`Remove stop ${index + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Stop Name */}
                <div className="mb-3">
                  <label htmlFor={`stopName-${stop.id}`} className="block font-medium">Stop Name *</label>
                  <input
                    id={`stopName-${stop.id}`}
                    type="text"
                    placeholder="e.g., Sector 62 Metro Station"
                    value={stop.stopName}
                    onChange={(e) => updateStop(stop.id, 'stopName', e.target.value)}
                    required
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* Address */}
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
                </div>

                {/* Lat + Lng - Auto-filled, Read-only */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`lat-${stop.id}`} className="block font-medium">Latitude (Auto-filled)</label>
                    <input
                      id={`lat-${stop.id}`}
                      type="text"
                      placeholder="Will appear automatically"
                      value={stop.lat}
                      readOnly
                      className="w-full p-2 border rounded-lg bg-blue-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor={`lng-${stop.id}`} className="block font-medium">Longitude (Auto-filled)</label>
                    <input
                      id={`lng-${stop.id}`}
                      type="text"
                      placeholder="Will appear automatically"
                      value={stop.lng}
                      readOnly
                      className="w-full p-2 border rounded-lg bg-blue-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Stop Button */}
          <button
            type="button"
            onClick={addStop}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Stop
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Register Route"}
        </button>
      </form>
    </div>
  );
};

export default Route;