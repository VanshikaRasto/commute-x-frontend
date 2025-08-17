// src/pages/UserRegistration.jsx - Updated version with backend integration
import { useState, useCallback, useEffect } from "react";

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    type: "user",
    name: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "Active"
  });

  const [strength, setStrength] = useState({ bar: 0, text: "", color: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [addressTimeout, setAddressTimeout] = useState(null);
  const [distance, setDistance] = useState("");

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Geocoding function to get lat/lng from address
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

  // Password Strength Checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { bar: 25, text: "Weak password", color: "bg-red-500" };
    if (score === 2) return { bar: 50, text: "Medium strength", color: "bg-yellow-500" };
    return { bar: 100, text: "Strong password", color: "bg-green-500" };
  };

  // Calculate distance function
  const calculateDistance = useCallback((lat, lng) => {
    const officeLat = 28.6139;
    const officeLng = 77.2090;
    const R = 6371;
    const dLat = ((officeLat - lat) * Math.PI) / 180;
    const dLon = ((officeLng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) *
        Math.cos(officeLat * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = (R * c).toFixed(1);
    
    setDistance(`${distanceKm} km`);
    return distanceKm;
  }, []);

  // Handle address change with automatic geocoding
  const handleAddressChange = useCallback(async (address) => {
    setFormData(prev => ({ ...prev, address: address }));
    
    // Clear existing timeout
    if (addressTimeout) {
      clearTimeout(addressTimeout);
    }
    
    // Auto-geocode after user stops typing (debounce for 1 second)
    if (address.trim().length > 3) {
      const newTimeout = setTimeout(async () => {
        // Show loading state
        setFormData(prev => ({ 
          ...prev, 
          latitude: 'Loading...', 
          longitude: 'Loading...'
        }));
        setDistance('Calculating...');
        
        const coordinates = await getCoordinatesFromAddress(address);
        if (coordinates) {
          setFormData(prev => ({ 
            ...prev, 
            latitude: coordinates.lat, 
            longitude: coordinates.lng
          }));
          // Calculate distance with new coordinates
          calculateDistance(parseFloat(coordinates.lat), parseFloat(coordinates.lng));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            latitude: 'Not found', 
            longitude: 'Not found'
          }));
          setDistance('Unable to calculate');
        }
      }, 1000);
      
      setAddressTimeout(newTimeout);
    } else {
      // Clear coordinates if address is too short
      setFormData(prev => ({ 
        ...prev, 
        latitude: '', 
        longitude: ''
      }));
      setDistance('');
    }
  }, [addressTimeout, getCoordinatesFromAddress, calculateDistance]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "address") {
      handleAddressChange(value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "password") {
      setStrength(checkPasswordStrength(value));
    }
  };

  // Clear messages when form data changes
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Submit Form - Updated with Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("❌ Passwords do not match!");
      return;
    }
    
    // Validate coordinates
    if (!formData.latitude || !formData.longitude || 
        formData.latitude === 'Loading...' || formData.longitude === 'Loading...' ||
        formData.latitude === 'Not found' || formData.longitude === 'Not found') {
      setErrorMessage("❌ Please ensure address has valid coordinates before submitting!");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`✅ User registered successfully! Distance from office: ${distance}`);
        
        // Reset form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          type: "user",
          name: "",
          phone: "",
          address: "",
          latitude: "",
          longitude: "",
          status: "Active"
        });
        setDistance("");
        setStrength({ bar: 0, text: "", color: "" });
        
        console.log('User registered successfully:', data);
      } else {
        setErrorMessage(`❌ ${data.error || 'Registration failed'}`);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage("❌ Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">User Registration</h2>
      <p className="text-gray-500 mb-4">Fill the form to register a new user in the system</p>

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

      {/* FORM START */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
          
          {/* Full Name */}
          <div className="mb-4">
            <label className="block font-medium">Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="w-full h-2 bg-gray-200 mt-2 rounded">
                <div
                  className={`h-2 ${strength.color} rounded transition-all duration-300`}
                  style={{ width: `${strength.bar}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">{strength.text}</p>
            </div>
            <div>
              <label className="block font-medium">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* User Type */}
          <div className="mb-4">
            <label className="block font-medium">User Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        {/* Address Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Address Information</h3>
          
          {/* Home Address */}
          <div className="mb-4">
            <label className="block font-medium">Home Address *</label>
            <textarea
              name="address"
              placeholder="Type your complete address here - e.g., Sector 62, Noida, UP"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              rows="3"
            />
            <p className="text-sm text-gray-500 mt-1">
              💡 Address will be automatically geocoded to get coordinates
            </p>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium text-gray-600">Latitude (Auto-filled)</label>
              <input
                type="text"
                placeholder="Will appear automatically"
                value={formData.latitude}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-600">Longitude (Auto-filled)</label>
              <input
                type="text"
                placeholder="Will appear automatically"
                value={formData.longitude}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-600">Distance from Office</label>
              <input
                type="text"
                value={distance}
                readOnly
                placeholder="Will be calculated automatically"
                className="w-full p-3 border border-gray-300 rounded-lg bg-green-50 text-gray-700 font-medium"
              />
            </div>
          </div>
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
                Registering User...
              </div>
            ) : (
              'Register User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}