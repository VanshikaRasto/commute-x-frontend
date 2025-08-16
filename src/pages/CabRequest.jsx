import React, { useState, useCallback } from 'react';

const CabRequestForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupLat: '',
    pickupLng: '',
    dropoffLocation: '',
    dropoffLat: '',
    dropoffLng: '',
    requestedDateTime: '',
    contactNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [addressTimeouts, setAddressTimeouts] = useState({});

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
    const latField = field === 'pickupLocation' ? 'pickupLat' : 'dropoffLat';
    const lngField = field === 'pickupLocation' ? 'pickupLng' : 'dropoffLng';
    
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
    
    if (name === 'pickupLocation' || name === 'dropoffLocation') {
      handleAddressChange(name, value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate coordinates
    const invalidCoords = ['Loading...', 'Not found', ''];
    if (invalidCoords.includes(formData.pickupLat) || invalidCoords.includes(formData.pickupLng) ||
        invalidCoords.includes(formData.dropoffLat) || invalidCoords.includes(formData.dropoffLng)) {
      alert('❌ Please ensure all locations have valid coordinates before submitting!');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const cabRequestData = {
        requestId: 'CAB-' + Date.now(),
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        pickup_location: formData.pickupLocation,
        pickup_lat: formData.pickupLat,
        pickup_lng: formData.pickupLng,
        dropoff_location: formData.dropoffLocation,
        dropoff_lat: formData.dropoffLat,
        dropoff_lng: formData.dropoffLng,
        requested_datetime: formData.requestedDateTime,
        contact_number: formData.contactNumber
      };

      // Create JSON file for download
      const jsonData = JSON.stringify(cabRequestData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `cab-request-${cabRequestData.requestId}.json`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Cab request submitted successfully!');
      setLoading(false);
      
      console.log('Cab request submitted:', cabRequestData);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Cab Request</h2>
      <p className="text-gray-500 mb-4">Book your cab by filling the details below</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">

        {/* Pickup Location */}
        <div>
          <label className="block font-medium">Pickup Location *</label>
          <input
            type="text"
            name="pickupLocation"
            placeholder="Enter pickup address"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="block font-medium">Dropoff Location *</label>
          <input
            type="text"
            name="dropoffLocation"
            placeholder="Enter dropoff address"
            value={formData.dropoffLocation}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Coordinates Display */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Pickup Coordinates</label>
            <div className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
              {formData.pickupLat && formData.pickupLng ? 
                `${formData.pickupLat}, ${formData.pickupLng}` : 
                'Will appear automatically'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Dropoff Coordinates</label>
            <div className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
              {formData.dropoffLat && formData.dropoffLng ? 
                `${formData.dropoffLat}, ${formData.dropoffLng}` : 
                'Will appear automatically'}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="block font-medium">When do you need the cab? *</label>
          <input
            type="datetime-local"
            name="requestedDateTime"
            value={formData.requestedDateTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block font-medium">Contact Number </label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Enter your phone number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>



        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? "Submitting..." : "Request Cab"}
        </button>
      </div>
    </div>
  );
};

export default CabRequestForm;