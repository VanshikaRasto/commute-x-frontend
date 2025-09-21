import { useState, useCallback, useEffect } from "react";

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    contactNo: "",
    deskExtNo: "",
    deskNo: "",
    
    // Authentication
    password: "",
    confirmPassword: "",
    
    // Organization
    departmentId: "",
    regisNo: "",
    roleId: "2", // Default to regular user
    
    // Address & Location
    address: "",
    latitude: "",
    longitude: "",
    
    // Status
    status: "Active",
    isAvailable: true,
    isAccountVerified: true
  });

  const [strength, setStrength] = useState({ bar: 0, text: "", color: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [addressTimeout, setAddressTimeout] = useState(null);
  const [distance, setDistance] = useState("");
  
  // New states for user management
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Dropdown options
  const departmentOptions = [
    { value: "1", label: "IT Department" },
    { value: "2", label: "HR Department" },
    { value: "3", label: "Finance Department" },
    { value: "4", label: "Operations" },
    { value: "5", label: "Marketing" },
    { value: "6", label: "Administration" }
  ];

  const roleOptions = [
    { value: "1", label: "Administrator" },
    { value: "2", label: "Employee" },
  
  ];

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
    
    if (addressTimeout) {
      clearTimeout(addressTimeout);
    }
    
    if (address.trim().length > 3) {
      const newTimeout = setTimeout(async () => {
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
    const { name, value, type, checked } = e.target;
    
    if (name === "address") {
      handleAddressChange(value);
      return;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (name === "password") {
      setStrength(checkPasswordStrength(value));
    }

    // Auto-fill contact number with phone number if empty
    if (name === "phone" && !formData.contactNo) {
      setFormData(prev => ({ ...prev, contactNo: value }));
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(data.data || []);
      } else {
        setErrorMessage(`Failed to fetch users: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setErrorMessage("Network error while fetching users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Toggle user list view
  const handleViewAllUsers = () => {
    setShowUserList(!showUserList);
    if (!showUserList) {
      fetchUsers();
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.U_Name || "",
      email: user.Email_ID || "",
      phone: user.Mobile_No || "",
      contactNo: user.Contact_No || "",
      deskExtNo: user.Desk_ExtNo || "",
      deskNo: user.Desk_No || "",
      password: "",
      confirmPassword: "",
      departmentId: user.Department_Id?.toString() || "",
      regisNo: user.Regis_No || "",
      roleId: user.Role_Id?.toString() || "2",
      address: user.U_Address || "",
      latitude: user.Lat_Address || "",
      longitude: user.Long_Address || "",
      status: user.IsActive ? "Active" : "Inactive",
      isAvailable: user.IsAvailable || false,
      isAccountVerified: user.IsAccount_Verified || false
    });
    
    if (user.Distance) {
      setDistance(`${user.Distance} km`);
    }
    
    setShowUserList(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      contactNo: "",
      deskExtNo: "",
      deskNo: "",
      password: "",
      confirmPassword: "",
      departmentId: "",
      regisNo: "",
      roleId: "2",
      address: "",
      latitude: "",
      longitude: "",
      status: "Active",
      isAvailable: true,
      isAccountVerified: true
    });
    setDistance("");
    setStrength({ bar: 0, text: "", color: "" });
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccessMessage(`User deleted successfully!`);
        fetchUsers(); // Refresh the user list
      } else {
        setErrorMessage(`Failed to delete user: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      setErrorMessage("Network error while deleting user.");
    } finally {
      setDeleteConfirm(null);
    }
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

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    
    // For updates, allow empty passwords (won't update password)
    if (!editingUser && !formData.password) {
      setErrorMessage("Password is required for new users!");
      return;
    }
    
    // Validate coordinates
    if (!formData.latitude || !formData.longitude || 
        formData.latitude === 'Loading...' || formData.longitude === 'Loading...' ||
        formData.latitude === 'Not found' || formData.longitude === 'Not found') {
      setErrorMessage("Please ensure address has valid coordinates before submitting!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for backend
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        type: formData.roleId === "1" ? "admin" : "user",
        status: formData.status,
        departmentId: parseInt(formData.departmentId),
        regisNo: formData.regisNo,
        contactNo: formData.contactNo,
        deskExtNo: formData.deskExtNo,
        deskNo: formData.deskNo,
        roleId: parseInt(formData.roleId),
        isAvailable: formData.isAvailable,
        isAccountVerified: formData.isAccountVerified
      };

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }

      const url = editingUser 
        ? `${API_BASE_URL}/users/${editingUser.Id}`
        : `${API_BASE_URL}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const action = editingUser ? 'updated' : 'registered';
        setSuccessMessage(`User "${formData.name}" ${action} successfully! ${!editingUser ? `Registration No: ${formData.regisNo}` : ''}`);
        
        // Reset form
        handleCancelEdit();
        
        // Refresh user list if it's currently shown
        if (showUserList) {
          fetchUsers();
        }
        
        console.log(`User ${action} successfully:`, data);
      } else {
        setErrorMessage(`${data.error || `${editingUser ? 'Update' : 'Registration'} failed`}`);
      }
      
    } catch (error) {
      console.error(`${editingUser ? 'Update' : 'Registration'} error:`, error);
      setErrorMessage("Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get department name
  const getDepartmentName = (id) => {
    const dept = departmentOptions.find(d => d.value === id?.toString());
    return dept ? dept.label : 'Unknown';
  };

  // Get role name
  const getRoleName = (id) => {
    const role = roleOptions.find(r => r.value === id?.toString());
    return role ? role.label : 'Unknown';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {editingUser ? 'Edit User' : 'User Registration'}
          </h2>
          <p className="text-gray-500">
            {editingUser ? 'Update user information' : 'Complete all fields to register a new user in the system'}
          </p>
        </div>
        <div className="flex gap-3">
          {editingUser && (
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel Edit
            </button>
          )}
          <button
            onClick={handleViewAllUsers}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showUserList 
                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {showUserList ? 'Hide User List' : 'View All Users'}
          </button>
        </div>
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

      {/* User List View */}
      {showUserList && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Users</h3>
          
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.Id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{user.Id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{user.U_Name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{user.Email_ID}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{user.Mobile_No}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{getDepartmentName(user.Department_Id)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{getRoleName(user.Role_Id)}</td>
                      <td className="px-4 py-3 text-sm border-b border-r border-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-r border-gray-300">{formatDate(user.Created_at)}</td>
                      <td className="px-4 py-3 text-sm border-b border-gray-300">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
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
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user "{deleteConfirm.U_Name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm.Id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Organization Information */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Organization Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Registration Number *</label>
              <input
                type="text"
                name="regisNo"
                placeholder="e.g., EMP001, USR001"
                value={formData.regisNo}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium">Department *</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Department</option>
                {departmentOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">User Role *</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block font-medium">Account Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
          
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium">Email Address *</label>
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
              <label className="block font-medium">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Contact Number</label>
              <input
                type="tel"
                name="contactNo"
                placeholder="Alternative contact number"
                value={formData.contactNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium">Desk Extension</label>
              <input
                type="text"
                name="deskExtNo"
                placeholder="e.g., 1234"
                value={formData.deskExtNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium">Desk Number</label>
              <input
                type="text"
                name="deskNo"
                placeholder="e.g., A-101, B-205"
                value={formData.deskNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Authentication</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium">
                Password {!editingUser ? '*' : '(leave empty to keep current)'}
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={handleChange}
                required={!editingUser}
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
              <label className="block font-medium">
                Confirm Password {!editingUser ? '*' : ''}
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!editingUser}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Address Information</h3>
          
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
          </div>

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

        {/* Account Settings */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Account Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-medium">User Available for Tasks</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isAccountVerified"
                  checked={formData.isAccountVerified}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-medium">Account Verified</span>
              </label>
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
                : editingUser
                ? 'bg-orange-600 hover:bg-orange-700 transform hover:scale-[1.02]'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
            } text-white shadow-lg`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingUser ? 'Updating User...' : 'Registering User...'}
              </div>
            ) : (
              editingUser ? 'Update User' : 'Register User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}