import React, {useState} from 'react';

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

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const driverData = {
        registrationId: 'REG-' + Date.now(),
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
        ...formData
      };

      // Create JSON file for download
      const jsonData = JSON.stringify(driverData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filename = `${formData.driverName.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Driver registered successfully!');
      setLoading(false);
      
      console.log('Driver registered successfully:', driverData);
    }, 1000);
  };

  // Get max date for DOB (18 years ago)
  const getMaxDobDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Driver Registration</h2>
      <p className="text-gray-500 mb-4">Complete all fields to register a new driver in the system</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      {/* FORM START */}
      <div className="space-y-6">

        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
          
          {/* Driver Name */}
          <div className="mb-4">
            <label className="block font-medium">Full Name *</label>
            <input
              name="driverName"
              placeholder="Enter driver's full name"
              value={formData.driverName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* DOB + Age + Gender */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                max={getMaxDobDate()}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="70"
                placeholder="Age"
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block font-medium">Address *</label>
            <textarea
              name="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"   
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* License Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">License Information</h3>
          
          {/* License Number */}
          <div className="mb-4">
            <label className="block font-medium">License Number *</label>
            <input
              name="licenseNumber"
              placeholder="e.g., DL-1234567890"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Issue Date + Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Employment Details</h3>
          
          {/* Joining Date + Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Driving Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                placeholder="Years of experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                max="50"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200">Emergency Contact</h3>
          
          {/* Emergency Name + Phone */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium">Contact Name *</label>
              <input
                name="emergencyName"
                placeholder="Emergency contact name"
                value={formData.emergencyName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Contact Phone *</label>
              <input
                type="tel"
                name="emergencyPhone"
                placeholder="Emergency contact number"
                value={formData.emergencyPhone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Register Driver"}
        </button>
      </div>
    </div>
  );
};

export default DriverRegistration;