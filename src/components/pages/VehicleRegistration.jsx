import React, { useState, useEffect } from 'react';

const VehicleRegistration = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhoneNo: '',
    vendorEmailId: '',
    vendorAddress: '',
    vendorAPI: '',
    vehicleNo: '',
    vehicleType: '',
    hireType: 'Custom',
    vehicleModel: '',
    insuranceExpireDate: '',
    pucExpireDate: '',
    driverName: '',
    driverPhoneNo: '',
    dlNo: '',
    dlExpire: '',
    activeDeactive: false,
    gpiDevice: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate required fields
    if (!formData.vehicleNo || !formData.vehicleType || !formData.vehicleModel) {
      setErrorMessage("❌ Vehicle number, type, and model are required!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for backend - exactly same fields as original
      const submitData = {
        vendorName: formData.vendorName,
        vendorPhoneNo: formData.vendorPhoneNo,
        vendorEmailId: formData.vendorEmailId,
        vendorAddress: formData.vendorAddress,
        vendorAPI: formData.vendorAPI,
        vehicleNo: formData.vehicleNo,
        vehicleType: formData.vehicleType,
        hireType: formData.hireType,
        vehicleModel: formData.vehicleModel,
        insuranceExpireDate: formData.insuranceExpireDate || null,
        pucExpireDate: formData.pucExpireDate || null,
        activeDeactive: formData.activeDeactive
      };

      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`✅ Vehicle "${formData.vehicleNo}" registered successfully!`);
        
        // Reset form
        setFormData({
          vendorName: '',
          vendorPhoneNo: '',
          vendorEmailId: '',
          vendorAddress: '',
          vendorAPI: '',
          vehicleNo: '',
          vehicleType: '',
          hireType: 'Custom',
          vehicleModel: '',
          insuranceExpireDate: '',
          pucExpireDate: '',
          driverName: '',
          driverPhoneNo: '',
          dlNo: '',
          dlExpire: '',
          activeDeactive: false,
          gpiDevice: '',
          registrationDate: new Date().toISOString().split('T')[0]
        });
        
        console.log('Vehicle registered successfully:', data);
      } else {
        setErrorMessage(`❌ ${data.error || 'Vehicle registration failed'}`);
      }
      
    } catch (error) {
      console.error('Vehicle registration error:', error);
      setErrorMessage("❌ Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-full px-4 mx-0">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Vehicle Master</h2>
      <p className="text-gray-500 mb-4">Manage your fleet vehicles and their details</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 p-4 rounded-lg text-red-800 mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Vendor Name, Phone, Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              placeholder="Hybrid Fleet Management Pvt Ltd"
              value={formData.vendorName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vendor Phone No</label>
            <input
              type="tel"
              name="vendorPhoneNo"
              placeholder="9810368111"
              value={formData.vendorPhoneNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vendor Email Id</label>
            <input
              type="email"
              name="vendorEmailId"
              placeholder="abc@abc.com"
              value={formData.vendorEmailId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Vendor Address */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Vendor Address</label>
          <input
            type="text"
            name="vendorAddress"
            placeholder="Keshavpur Rd2, Area Vikash Puri Delhi 110039"
            value={formData.vendorAddress}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Vendor API */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Vendor API</label>
          <input
            type="url"
            name="vendorAPI"
            placeholder=""
            value={formData.vendorAPI}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Vehicle No, Vehicle Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vehicle No</label>
            <input
              type="text"
              name="vehicleNo"
              placeholder="Enter vehicle number"
              value={formData.vehicleNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Vehicle Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="MUV">MUV</option>
            </select>
          </div>
        </div>

        {/* Hire Type, Vehicle Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Hire Type</label>
            <select
              name="hireType"
              value={formData.hireType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Custom">Custom</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Vehicle Model</label>
            <input
              type="text"
              name="vehicleModel"
              placeholder="Enter vehicle model"
              value={formData.vehicleModel}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Insurance Expire Date, PUC Expire Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                readOnly
              />
              Insurance Expire Date
            </label>
            <input
              type="date"
              name="insuranceExpireDate"
              value={formData.insuranceExpireDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                readOnly
              />
              PUC Expire Date
            </label>
            <input
              type="date"
              name="pucExpireDate"
              value={formData.pucExpireDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        

        

        {/* Active/Deactive, GPI Device */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="activeDeactive"
                checked={formData.activeDeactive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">Active / Deactive</span>
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">GPI Device</label>
            <select
              name="gpiDevice"
              value={formData.gpiDevice}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select GPI Device</option>
              <option value="GPS Tracker A">GPS Tracker A</option>
              <option value="GPS Tracker B">GPS Tracker B</option>
              <option value="GPS Tracker C">GPS Tracker C</option>
              <option value="No Device">No Device</option>
            </select>
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
                Registering Vehicle...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleRegistration;