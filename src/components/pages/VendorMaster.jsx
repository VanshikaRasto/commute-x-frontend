// src/pages/VendorMaster.jsx - Updated with backend integration
import React, { useState, useEffect } from 'react';

const VendorMaster = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhoneNo: '',
    vendorEmailId: '',
    vendorAddress: '',
    vendorAPI: '',
    activeDeactive: false
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [vendors, setVendors] = useState([]);
  const [showVendorList, setShowVendorList] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Clear messages after some time
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Load vendors from backend
  const loadVendors = async () => {
    try {
      setLoadingVendors(true);
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setVendors(data.data);
      } else {
        setErrorMessage(`Failed to load vendors: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
      setErrorMessage('Network error. Please check if the backend server is running.');
    } finally {
      setLoadingVendors(false);
    }
  };

  // Toggle vendor list visibility
  const toggleVendorList = () => {
    if (!showVendorList) {
      loadVendors();
    }
    setShowVendorList(!showVendorList);
  };

  // Submit Form to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate required fields
    if (!formData.vendorName || !formData.vendorPhoneNo || !formData.vendorEmailId || !formData.vendorAddress) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.vendorEmailId)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(formData.vendorPhoneNo)) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`Vendor "${formData.vendorName}" registered successfully! Vendor ID: ${data.vendorId}`);
        
        // Reset form
        setFormData({
          vendorName: '',
          vendorPhoneNo: '',
          vendorEmailId: '',
          vendorAddress: '',
          vendorAPI: '',
          activeDeactive: false
        });

        // Refresh vendor list if it's visible
        if (showVendorList) {
          loadVendors();
        }
        
        console.log('Vendor registered successfully:', data);
      } else {
        setErrorMessage(`${data.error || 'Failed to register vendor'}`);
      }
      
    } catch (error) {
      console.error('Vendor registration error:', error);
      setErrorMessage('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Vendor Master</h2>
          <p className="text-gray-500">Register and manage transportation vendors in the system</p>
        </div>
        <button
          onClick={toggleVendorList}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {showVendorList ? 'Hide Vendor List' : 'View All Vendors'}
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

      {/* Vendor List Section */}
      {showVendorList && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Registered Vendors
            {loadingVendors && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          
          {loadingVendors ? (
            <div className="text-center py-4">
              <div className="text-gray-600">Loading vendors...</div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No vendors registered yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Vendor Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, index) => (
                    <tr key={vendor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{vendor.id}</td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">{vendor.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{vendor.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">{vendor.email}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{vendor.address}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VENDOR REGISTRATION FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Vendor Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Vendor Information</h3>
          
          {/* Vendor Name */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Vendor Name *</label>
            <input
              type="text"
              name="vendorName"
              placeholder="e.g., ABC Transport Solutions Pvt Ltd"
              value={formData.vendorName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Vendor Phone Number *</label>
              <input
                type="tel"
                name="vendorPhoneNo"
                placeholder="e.g., +91-9876543210"
                value={formData.vendorPhoneNo}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Vendor Email Address *</label>
              <input
                type="email"
                name="vendorEmailId"
                placeholder="e.g., contact@abctransport.com"
                value={formData.vendorEmailId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Vendor Address */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Vendor Address *</label>
            <textarea
              name="vendorAddress"
              placeholder="Enter complete vendor address including city, state, and pincode"
              value={formData.vendorAddress}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Vendor API */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Vendor API Endpoint</label>
            <input
              type="url"
              name="vendorAPI"
              placeholder="e.g., https://api.abctransport.com/v1/booking (Optional)"
              value={formData.vendorAPI}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Provide API endpoint for third-party integration
            </p>
          </div>

          {/* Active Status */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="activeDeactive"
                checked={formData.activeDeactive}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Active Vendor</span>
                <p className="text-sm text-gray-500">Check to activate vendor immediately upon registration</p>
              </div>
            </label>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Registration Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                formData.activeDeactive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {formData.activeDeactive ? 'Will be Active' : 'Will be Inactive'}
              </span>
            </div>
            <div>
              <span className="font-medium">Registration Date:</span>
              <span className="ml-2 text-blue-700">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium">API Integration:</span>
              <span className="ml-2 text-blue-700">
                {formData.vendorAPI ? 'Enabled' : 'Manual Only'}
              </span>
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
                Registering Vendor...
              </div>
            ) : (
              'Register Vendor'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span>After registration, vendors can be assigned vehicles</span>
            <span>•</span>
            <span>Ensure contact information is accurate</span>
            <span>•</span>
            <span>API integration enables automated booking</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VendorMaster;