import React, { useState } from 'react';

const VendorMaster = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorPhoneNo: '',
    vendorEmailId: '',
    vendorAddress: '',
    vendorAPI: '',
    activeDeactive: false,
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
      const vendorData = {
        vendorId: 'VEN-' + Date.now(),
        timestamp: new Date().toISOString(),
        registrationStatus: formData.activeDeactive ? 'ACTIVE' : 'INACTIVE',
        ...formData
      };

      // Create JSON file for download
      const jsonData = JSON.stringify(vendorData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `${formData.vendorName.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Vendor registered successfully!');
      setLoading(false);
      
      console.log('Vendor registered successfully:', vendorData);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Vendor Master</h2>
      <p className="text-gray-500 mb-4">Fill the form to register a new vendor</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      {/* FORM START */}
      <div className="space-y-4">

        {/* Vendor Name */}
        <div>
          <label className="block font-medium">Vendor Name *</label>
          <input
            type="text"
            name="vendorName"
            placeholder="e.g., ABC Transport Solutions"
            value={formData.vendorName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Vendor Phone No *</label>
            <input
              type="tel"
              name="vendorPhoneNo"
              placeholder="e.g., 9876543210"
              value={formData.vendorPhoneNo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Vendor Email Id *</label>
            <input
              type="email"
              name="vendorEmailId"
              placeholder="e.g., contact@vendor.com"
              value={formData.vendorEmailId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Vendor Address */}
        <div>
          <label className="block font-medium">Vendor Address *</label>
          <input
            type="text"
            name="vendorAddress"
            placeholder="Enter complete vendor address..."
            value={formData.vendorAddress}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Vendor API */}
        <div>
          <label className="block font-medium">Vendor API *</label>
          <input
            type="url"
            name="vendorAPI"
            placeholder="e.g., https://api.vendor.com/v1/transport"
            value={formData.vendorAPI}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Active/Deactive */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="activeDeactive"
              checked={formData.activeDeactive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium">Active / Deactive</span>
          </label>
        </div>

        {/* Registration Date */}
        <div>
          <label className="block font-medium">Registration Date *</label>
          <input
            type="date"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Register Vendor"}
        </button>
      </div>
    </div>
  );
};

export default VendorMaster;