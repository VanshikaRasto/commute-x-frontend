// import { useState, useCallback } from "react";

// export default function UserRegistration() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     typeOfUser: "",
//     name: "",
//     phoneNumber: "",
//     homeAddress: "",
//     homeLat: "",
//     homeLng: "",
//     distanceToOfficeKm: "",
//   });

//   const [strength, setStrength] = useState({ bar: 0, text: "", color: "" });
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [addressTimeout, setAddressTimeout] = useState(null);

//   // Geocoding function to get lat/lng from address
//   const getCoordinatesFromAddress = useCallback(async (address) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
//       );
//       const data = await response.json();
      
//       if (data && data.length > 0) {
//         return {
//           lat: parseFloat(data[0].lat).toFixed(6),
//           lng: parseFloat(data[0].lon).toFixed(6)
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       return null;
//     }
//   }, []);

//   // ✅ Password Strength Checker
//   const checkPasswordStrength = (password) => {
//     let score = 0;
//     if (password.length >= 8) score++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^a-zA-Z0-9]/.test(password)) score++;

//     if (score <= 1) return { bar: 25, text: "Weak password", color: "bg-red-500" };
//     if (score === 2) return { bar: 50, text: "Medium strength", color: "bg-yellow-500" };
//     return { bar: 100, text: "Strong password", color: "bg-green-500" };
//   };

//   // ✅ Calculate distance function
//   const calculateDistance = useCallback((lat, lng) => {
//     const officeLat = 28.6139;
//     const officeLng = 77.2090;
//     const R = 6371;
//     const dLat = ((officeLat - lat) * Math.PI) / 180;
//     const dLon = ((officeLng - lng) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat * Math.PI / 180) *
//         Math.cos(officeLat * Math.PI / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = (R * c).toFixed(1);
    
//     setFormData(prev => ({ ...prev, distanceToOfficeKm: distance }));
//   }, []);

//   // Handle address change with automatic geocoding
//   const handleAddressChange = useCallback(async (address) => {
//     setFormData(prev => ({ ...prev, homeAddress: address }));
    
//     // Clear existing timeout
//     if (addressTimeout) {
//       clearTimeout(addressTimeout);
//     }
    
//     // Auto-geocode after user stops typing (debounce for 1 second)
//     if (address.trim().length > 3) {
//       const newTimeout = setTimeout(async () => {
//         // Show loading state
//         setFormData(prev => ({ 
//           ...prev, 
//           homeLat: 'Loading...', 
//           homeLng: 'Loading...',
//           distanceToOfficeKm: 'Calculating...'
//         }));
        
//         const coordinates = await getCoordinatesFromAddress(address);
//         if (coordinates) {
//           setFormData(prev => ({ 
//             ...prev, 
//             homeLat: coordinates.lat, 
//             homeLng: coordinates.lng
//           }));
//           // Calculate distance with new coordinates
//           calculateDistance(parseFloat(coordinates.lat), parseFloat(coordinates.lng));
//         } else {
//           setFormData(prev => ({ 
//             ...prev, 
//             homeLat: 'Not found', 
//             homeLng: 'Not found',
//             distanceToOfficeKm: 'Unable to calculate'
//           }));
//         }
//       }, 1000);
      
//       setAddressTimeout(newTimeout);
//     } else {
//       // Clear coordinates if address is too short
//       setFormData(prev => ({ 
//         ...prev, 
//         homeLat: '', 
//         homeLng: '',
//         distanceToOfficeKm: ''
//       }));
//     }
//   }, [addressTimeout, getCoordinatesFromAddress, calculateDistance]);

//   // ✅ Handle Input Change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "homeAddress") {
//       handleAddressChange(value);
//       return;
//     }
    
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (name === "password") {
//       setStrength(checkPasswordStrength(value));
//     }
//   };

//   // ✅ Submit Form - Updated with JSON Download
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       alert("❌ Passwords do not match!");
//       return;
//     }
    
//     // Validate coordinates
//     if (!formData.homeLat || !formData.homeLng || 
//         formData.homeLat === 'Loading...' || formData.homeLng === 'Loading...' ||
//         formData.homeLat === 'Not found' || formData.homeLng === 'Not found') {
//       alert("❌ Please ensure address has valid coordinates before submitting!");
//       return;
//     }
    
//     setLoading(true);
    
//     // Simulate processing delay
//     setTimeout(() => {
//       const userData = {
//         registrationId: 'USER-' + Date.now(),
//         timestamp: new Date().toISOString(),
//         status: 'ACTIVE',
//         email: formData.email,
//         password_hash: btoa(formData.password), // Base64 encoded
//         type_of_user: formData.typeOfUser,
//         name: formData.name,
//         phone_number: formData.phoneNumber,
//         home_address: formData.homeAddress,
//         home_lat: formData.homeLat,
//         home_lng: formData.homeLng,
//         distance_to_office_km: formData.distanceToOfficeKm,
//       };

//       // Create JSON file for download
//       const jsonData = JSON.stringify(userData, null, 2);
//       const blob = new Blob([jsonData], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
//       const filename = `${formData.name.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      
//       const downloadLink = document.createElement('a');
//       downloadLink.href = url;
//       downloadLink.download = filename;
//       downloadLink.style.display = 'none';
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//       URL.revokeObjectURL(url);

//       setSuccessMessage("✅ User registered successfully!");
//       setLoading(false);
      
//       console.log('User registered successfully:', userData);
//     }, 1000);
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold text-blue-700 mb-2">User Registration</h2>
//       <p className="text-gray-500 mb-4">Fill the form to register a new user</p>

//       {successMessage && (
//         <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-4">
//           {successMessage}
//         </div>
//       )}

//       {/* ✅ FORM START */}
//       <div className="space-y-4">

//         <div>
//           <label className="block font-medium">Email *</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>

//         {/* Password + Confirm Password */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium">Password *</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-lg"
//             />
//             <div className="w-full h-2 bg-gray-200 mt-1 rounded">
//               <div
//                 className={`h-2 ${strength.color} rounded`}
//                 style={{ width: `${strength.bar}%` }}
//               ></div>
//             </div>
//             <p className="text-sm">{strength.text}</p>
//           </div>
//           <div>
//             <label className="block font-medium">Confirm Password *</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-lg"
//             />
//           </div>
//         </div>

//         {/* Type of User */}
//         <div>
//           <label className="block font-medium">Type of User *</label>
//           <select
//             name="typeOfUser"
//             value={formData.typeOfUser}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           >
//             <option value="">Select Type</option>
//             <option value="admin">Admin</option>
//             <option value="employee">Employee</option>
//             <option value="guest">Guest</option>
//           </select>
//         </div>

//         {/* Full Name */}
//         <div>
//           <label className="block font-medium">Full Name *</label>
//           <input
//             name="name"
//             placeholder="Enter full name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block font-medium">Phone Number *</label>
//           <input
//             type="tel"
//             name="phoneNumber"
//             placeholder="Enter phone number"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>

//         {/* Home Address */}
//         <div>
//           <label className="block font-medium">Home Address *</label>
//           <textarea
//             name="homeAddress"
//             placeholder="Type your address here - e.g., Sector 62, Noida, UP"
//             value={formData.homeAddress}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             rows="3"
//           />
//         </div>

//         {/* Lat/Lng - Auto-filled, Read-only */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium">Home Latitude (Auto-filled)</label>
//             <input
//               type="text"
//               placeholder="Will appear automatically"
//               value={formData.homeLat}
//               readOnly
//               className="w-full p-2 border rounded-lg bg-blue-50 text-gray-700"
//             />
//           </div>
//           <div>
//             <label className="block font-medium">Home Longitude (Auto-filled)</label>
//             <input
//               type="text"
//               placeholder="Will appear automatically"
//               value={formData.homeLng}
//               readOnly
//               className="w-full p-2 border rounded-lg bg-blue-50 text-gray-700"
//             />
//           </div>
//         </div>

//         {/* Distance */}
//         <div>
//           <label className="block font-medium">Distance to Office (km)</label>
//           <input
//             type="text"
//             value={formData.distanceToOfficeKm}
//             readOnly
//             placeholder="Will be calculated automatically"
//             className="w-full p-2 border rounded-lg bg-green-50 text-gray-700"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Processing..." : "Register User"}
//         </button>
//       </div>
//     </div>
//   );
// }






// src/components/UserRegistration.jsx
import React, { useState, useEffect } from "react";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "user", // default type
    status: "Active",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fixed office coordinates
  const officeLat = 28.6139;
  const officeLng = 77.209;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password))
      return "Strong";
    return "Medium";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData.password]);

  // Debounced geocoding for address
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.address) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.address
          )}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.length > 0) {
              setFormData((prev) => ({
                ...prev,
                latitude: data[0].lat,
                longitude: data[0].lon,
              }));
            }
          })
          .catch(() => {});
      }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.address]);

  // Distance calculation
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      const R = 6371;
      const lat1 = officeLat * (Math.PI / 180);
      const lat2 = parseFloat(formData.latitude) * (Math.PI / 180);
      const deltaLat = lat2 - lat1;
      const deltaLng =
        (parseFloat(formData.longitude) - officeLng) * (Math.PI / 180);

      const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setDistance((R * c).toFixed(2));
    }
  }, [formData.latitude, formData.longitude]);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError("Please enter a valid address");
      return;
    }

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccessMsg("User registered successfully!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            address: "",
            latitude: "",
            longitude: "",
            type: "user",
            status: "Active",
            joinDate: new Date().toISOString().split("T")[0],
          });
          setDistance(null);
        }
      })
      .catch(() => setError("Server error. Please try again."));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div>Password Strength: {passwordStrength}</div>
        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <div>
          Latitude: {formData.latitude} | Longitude: {formData.longitude}
        </div>
        {distance && <div>Distance from Office: {distance} km</div>}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}
    </div>
  );
};

export default UserRegistration;
