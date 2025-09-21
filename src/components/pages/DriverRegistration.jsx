import React, {useState, useEffect} from 'react';
import { Eye, X, User, Phone, Mail, Calendar, MapPin, FileText, Edit, Trash2, EyeOff, Save, XCircle } from 'lucide-react';

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    driverName: '',
    dob: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    issueDate: '',
    expiryDate: '',
    joiningDate: new Date().toISOString().split('T')[0],
    experience: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDriversList, setShowDriversList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate age from DOB
    if (name === 'dob') {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const handleEditDriver = async (driverId) => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const driver = data.data;
        setFormData({
          driverName: driver.driverName || '',
          phone: driver.phone || '',
          email: driver.email || '',
          address: driver.address || '',
          dob: driver.dob ? new Date(driver.dob).toISOString().split('T')[0] : '',
          age: driver.age ? driver.age.toString() : '',
          gender: driver.gender || '',
          licenseNumber: driver.licenseNumber || '',
          issueDate: driver.issueDate ? new Date(driver.issueDate).toISOString().split('T')[0] : '',
          expiryDate: driver.expiryDate ? new Date(driver.expiryDate).toISOString().split('T')[0] : '',
          experience: driver.experience || '',
          emergencyName: driver.emergencyName || '',
          emergencyPhone: driver.emergencyPhone || '',
          joiningDate: new Date().toISOString().split('T')[0]
        });
        setEditingDriverId(driverId);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(data.error || 'Failed to fetch driver details');
      }
    } catch (error) {
      console.error('Edit driver error:', error);
      setErrorMessage('Failed to fetch driver details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Delete Driver
  const handleDeleteDriver = async (driverId, driverName) => {
    if (window.confirm(`Are you sure you want to delete driver "${driverName}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setSuccessMessage(data.message || 'Driver deleted successfully');
          fetchDrivers(); // Refresh the list
        } else {
          setErrorMessage(data.error || 'Failed to delete driver');
        }
      } catch (error) {
        console.error('Delete driver error:', error);
        setErrorMessage('Failed to delete driver. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingDriverId(null);
    setShowForm(false);
    setFormData({
      driverName: '',
      dob: '',
      age: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      licenseNumber: '',
      issueDate: '',
      expiryDate: '',
      joiningDate: new Date().toISOString().split('T')[0],
      experience: '',
      emergencyName: '',
      emergencyPhone: ''
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

  // Fetch all drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Fetch all drivers
  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const driversData = data.data || [];
        console.log('Fetched drivers data:', driversData);
        setDrivers(driversData);
      } else {
        setErrorMessage(`❌ Failed to fetch drivers: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch drivers error:', error);
      setErrorMessage("❌ Network error. Please check if the backend server is running.");
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate required fields
    if (!formData.driverName || !formData.phone || !formData.licenseNumber || !formData.experience) {
      setErrorMessage("❌ Driver name, phone, license number, and experience are required!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for backend
      const submitData = {
        driverName: formData.driverName,
        dob: formData.dob || null,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        issueDate: formData.issueDate || null,
        expiryDate: formData.expiryDate || null,
        experience: formData.experience,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone
      };

      const url = isEditing 
        ? `${API_BASE_URL}/drivers/${editingDriverId}`
        : `${API_BASE_URL}/drivers`;
      
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
        setSuccessMessage(`✅ Driver "${formData.driverName}" ${action} successfully!`);
        
        // Reset form
        setFormData({
          driverName: '',
          dob: '',
          age: '',
          gender: '',
          address: '',
          phone: '',
          email: '',
          licenseNumber: '',
          issueDate: '',
          expiryDate: '',
          joiningDate: new Date().toISOString().split('T')[0],
          experience: '',
          emergencyName: '',
          emergencyPhone: ''
        });
        
        // Reset editing state
        setIsEditing(false);
        setEditingDriverId(null);
        setShowForm(false);
        
        // Refresh drivers list
        fetchDrivers();
        
        console.log(`Driver ${action} successfully:`, data);
      } else {
        setErrorMessage(`❌ ${data.error || `Driver ${isEditing ? 'update' : 'registration'} failed`}`);
      }
      
    } catch (error) {
      console.error(`Driver ${isEditing ? 'update' : 'registration'} error:`, error);
      setErrorMessage("❌ Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Get max date for DOB (18 years ago)
  const getMaxDobDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Driver Master</h1>
            <p className="text-gray-600 mt-1">Register and manage drivers in the system</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (showForm && isEditing) {
                  handleCancelEdit();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium"
            >
              {showForm ? <XCircle size={18} /> : <User size={18} />}
              {showForm ? 'Hide Form' : (isEditing ? 'Edit Driver' : 'Add Driver')}
            </button>
            <button
              onClick={() => setShowDriversList(!showDriversList)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-medium"
            >
              {showDriversList ? <EyeOff size={18} /> : <Eye size={18} />}
              {showDriversList ? 'Hide Driver List' : 'Show Driver List'}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {/* Registered Drivers Table */}
        {showDriversList && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Registered Drivers</h2>
            </div>
            
            <div className="overflow-x-auto">
              {loadingDrivers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading drivers...</span>
                </div>
              ) : drivers.length === 0 ? (
                <div className="text-center py-12">
                  <User size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No drivers registered yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver, index) => (
                      <tr key={driver.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm font-medium text-gray-900">
                          {driver.id || index + 1}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm text-gray-900">
                          {driver.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm text-gray-900">
                          {driver.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm text-gray-900">
                          {driver.email || 'Not Available'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm text-gray-900">
                          {driver.experience ? `${driver.experience} years` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            driver.status === 'Available' ? 'bg-green-100 text-green-800' :
                            driver.status === 'On Trip' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driver.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(driver.createdAt) || new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditDriver(driver.id)}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              disabled={loading}
                            >
                              <Edit size={12} className="mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteDriver(driver.id, driver.name)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              disabled={loading}
                            >
                              <Trash2 size={12} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Driver Registration/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-600">
                  {isEditing ? 'Edit Driver Information' : 'Driver Information'}
                </h2>
                {isEditing && (
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                
                {/* Basic Information Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Name *
                    </label>
                    <input
                      name="driverName"
                      placeholder="e.g., John Smith"
                      value={formData.driverName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g., +91-9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address (Optional - Not stored)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g., john@example.com (for reference only)"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
                      disabled
                      title="Email field is not available in the current database schema"
                    />
                  </div>
                </div>

                {/* Personal Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={getMaxDobDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age (Auto-calculated from DOB)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      readOnly
                      placeholder="Auto-calculated"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      title="Age is calculated automatically from date of birth"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      placeholder="Years of experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="Enter complete address including city, state, and pincode"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* License Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      name="licenseNumber"
                      placeholder="e.g., DL-1234567890"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date (Not stored)
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
                      disabled
                      title="Issue date field is not available in the current database schema"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      name="emergencyName"
                      placeholder="Emergency contact name"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      placeholder="Emergency contact number"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isEditing 
                          ? 'bg-green-600 hover:bg-green-700 transform hover:scale-[1.02]'
                          : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                    } text-white shadow-lg`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isEditing ? 'Updating Driver...' : 'Registering Driver...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? <Save size={20} /> : <User size={20} />}
                        {isEditing ? 'Update Driver' : 'Register Driver'}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRegistration;