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
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      const data = await response.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Reset form
  const resetForm = () => {
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
    setEditingVehicle(null);
  };

  // Edit vehicle
  const handleEdit = async (vehicleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          ...data.data,
          driverName: '',
          driverPhoneNo: '',
          dlNo: '',
          dlExpire: '',
          gpiDevice: '',
          registrationDate: new Date().toISOString().split('T')[0]
        });
        setEditingVehicle(vehicleId);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setErrorMessage("❌ Failed to load vehicle data");
    }
  };

  // Delete vehicle
  const handleDelete = async (vehicleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        fetchVehicles();
      } else {
        setErrorMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setErrorMessage("❌ Failed to delete vehicle");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

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
      // Prepare data for backend
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

      const url = editingVehicle 
        ? `${API_BASE_URL}/vehicles/${editingVehicle}`
        : `${API_BASE_URL}/vehicles`;
      
      const method = editingVehicle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(editingVehicle 
          ? `✅ Vehicle "${formData.vehicleNo}" updated successfully!`
          : `✅ Vehicle "${formData.vehicleNo}" registered successfully!`);
        
        resetForm();
        fetchVehicles();
        
        console.log('Vehicle operation successful:', data);
      } else {
        setErrorMessage(`❌ ${data.error || 'Vehicle operation failed'}`);
      }
      
    } catch (error) {
      console.error('Vehicle operation error:', error);
      setErrorMessage("❌ Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-full px-4 mx-0">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">Vehicle Master</h2>
          <p className="text-gray-500">Manage your fleet vehicles and their details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {setShowForm(true); resetForm();}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add Vehicle'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showForm ? 'View List' : 'Show Form'}
          </button>
        </div>
      </div>

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

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {editingVehicle && (
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-800 mb-4">
              ✏️ Editing Vehicle: {formData.vehicleNo}
              <button
                type="button"
                onClick={resetForm}
                className="ml-4 text-sm bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300"
              >
                Cancel Edit
              </button>
            </div>
          )}

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
                  : editingVehicle 
                    ? 'bg-orange-600 hover:bg-orange-700 transform hover:scale-[1.02]'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
              } text-white shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingVehicle ? 'Updating Vehicle...' : 'Registering Vehicle...'}
                </div>
              ) : (
                editingVehicle ? 'Update Vehicle' : 'Submit'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Registered Vehicles</h3>
          
          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No vehicles registered yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Add your first vehicle
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Vehicle No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Model</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Hire Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Vendor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Insurance</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">PUC</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {vehicle.vehicleNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{vehicle.vehicleType}</td>
                      <td className="border border-gray-300 px-4 py-2">{vehicle.vehicleModel}</td>
                      <td className="border border-gray-300 px-4 py-2">{vehicle.hireType}</td>
                      <td className="border border-gray-300 px-4 py-2">{vehicle.vendorName || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.activeDeactive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.activeDeactive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle.insuranceExpireDate 
                          ? new Date(vehicle.insuranceExpireDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle.pucExpireDate 
                          ? new Date(vehicle.pucExpireDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(vehicle.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(vehicle)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.098 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete vehicle <strong>"{showDeleteConfirm.vehicleNo}"</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRegistration;