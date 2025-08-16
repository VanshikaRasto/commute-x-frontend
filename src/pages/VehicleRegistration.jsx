import React, { useState } from 'react';

const VehicleMaster = () => {
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

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const vehicleData = {
        vehicleId: 'VEH-' + Date.now(),
        timestamp: new Date().toISOString(),
        registrationStatus: formData.activeDeactive ? 'ACTIVE' : 'INACTIVE',
        ...formData
      };

      // Create JSON file for download
      const jsonData = JSON.stringify(vehicleData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `${formData.vehicleNo.replace(/[^a-zA-Z0-9]/g, '-') || 'vehicle'}.json`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Vehicle registered successfully!');
      setLoading(false);
      
      console.log('Vehicle registered successfully:', vehicleData);
    }, 1000);
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

      {/* FORM START */}
      <div className="space-y-4">

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

        {/* Driver Name, Driver Phone No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Driver Name</label>
            <input
              type="text"
              name="driverName"
              placeholder="Enter driver name"
              value={formData.driverName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Driver Phone No</label>
            <input
              type="tel"
              name="driverPhoneNo"
              placeholder="Enter driver phone number"
              value={formData.driverPhoneNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* DL No, DL Expire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">DL No</label>
            <input
              type="text"
              name="dlNo"
              placeholder="Enter driving license number"
              value={formData.dlNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">DL Expire</label>
            <input
              type="date"
              name="dlExpire"
              value={formData.dlExpire}
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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleMaster;