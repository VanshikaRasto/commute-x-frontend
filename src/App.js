// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./components/pages/Dashboard";
// import CabRequest from "./components/pages/CabRequest";
// import VendorMaster from "./components/pages/VendorMaster";
// import UserRegistration from "./components/pages/UserRegistration";
// import VehicleRegistration from "./components/pages/VehicleRegistration";
// import Route from "./components/pages/Route";
// import DriverRegistration from "./components/pages/DriverRegistration";


// function Login({ onLogin }) {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [isLogging, setIsLogging] = useState(false);

//   const handleSubmit = async () => {
//     setIsLogging(true);


//     if (credentials.username === 'admin' && credentials.password === 'admin') {
//       setTimeout(() => {
//         localStorage.setItem('authToken', 'dummy-token-123');
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('userInfo', JSON.stringify({ username: 'admin', role: 'Super Admin' }));
//         setIsLogging(false);
//         onLogin();
//       }, 1500);
//     } else {
//       setTimeout(() => {
//         setIsLogging(false);
//         alert('Invalid credentials! Use admin/admin');
//       }, 1500);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <span className="text-white text-2xl font-bold">C</span>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome to Commute-X</h1>
//           <p className="text-gray-600 mt-2">Sign in to your account</p>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//             <input
//               type="text"
//               required
//               value={credentials.username}
//               onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
//               placeholder="Enter your username"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//             <input
//               type="password"
//               required
//               value={credentials.password}
//               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-colors"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLogging}
//             className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
//               isLogging
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
//             } text-white shadow-lg`}
//           >
//             {isLogging ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Signing in...
//               </div>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component with Authentication
// function App() {
//   const [activePage, setActivePage] = useState("Dashboard");
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Always start false

//   // Clear any previous session data on app start
//   useEffect(() => {
//     localStorage.clear();
//     sessionStorage.clear();
//   }, []);

//   // Handle login
//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.clear();
//     sessionStorage.clear();
//     setActivePage("Dashboard");
//   };

//   // Show login screen if not authenticated
//   if (!isAuthenticated) {
//     return <Login onLogin={handleLogin} />;
//   }

//   // Show main app if authenticated
//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
      
//       {/* Sidebar - 19% */}
//       <div className="w-[19%] min-w-[200px] max-w-[280px]">
//         <Sidebar 
//           setActivePage={setActivePage} 
//           activePage={activePage}
//           onLogout={handleLogout}
//         />
//       </div>

//       {/* Content Area - 81% */}
//       <div className="w-[81%] flex-1 overflow-auto">
//         {activePage === "Dashboard" && <Dashboard />}
//         {activePage === "User Registration" && <UserRegistration />}
//         {activePage === "Vehicle Registration" && <VehicleRegistration />}
//         {activePage === "Route" && <Route />}
//         {activePage === "Driver Registration" && <DriverRegistration />}
//         {activePage === "Cab Request" && <CabRequest />}
//         {activePage === "Vendor Master" && <VendorMaster />}
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.js
// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./components/pages/Dashboard";
// import CabRequest from "./components/pages/CabRequest";
// import VendorMaster from "./components/pages/VendorMaster";
// import UserRegistration from "./components/pages/UserRegistration";
// import VehicleRegistration from "./components/pages/VehicleRegistration";
// import Route from "./components/pages/Route";
// import DriverRegistration from "./components/pages/DriverRegistration";

// function Login({ onLogin }) {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [isLogging, setIsLogging] = useState(false);

//   const handleSubmit = async () => {
//     setIsLogging(true);


//     if (credentials.username === 'admin' && credentials.password === 'admin') {
//       setTimeout(() => {
//         localStorage.setItem('authToken', 'dummy-token-123');
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('userInfo', JSON.stringify({ username: 'admin', role: 'Super Admin' }));
//         setIsLogging(false);
//         onLogin();
//       }, 1500);
//     } else {
//       setTimeout(() => {
//         setIsLogging(false);
//         alert('Invalid credentials! Use admin/admin');
//       }, 1500);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <span className="text-white text-2xl font-bold">C</span>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome to Commute-X</h1>
//           <p className="text-gray-600 mt-2">Sign in to your account</p>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//             <input
//               type="text"
//               required
//               value={credentials.username}
//               onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
//               placeholder="Enter your username"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//             <input
//               type="password"
//               required
//               value={credentials.password}
//               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLogging}
//             className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
//               isLogging
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
//             } text-white shadow-lg`}
//           >
//             {isLogging ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Signing in...
//               </div>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component with Authentication
// function App() {
//   const [activePage, setActivePage] = useState("Dashboard");
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Always start false

//   // Clear any previous session data on app start
//   useEffect(() => {
//     localStorage.clear();
//     sessionStorage.clear();
//   }, []);

//   // Handle login
//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.clear();
//     sessionStorage.clear();
//     setActivePage("Dashboard");
//   };

//   // Show login screen if not authenticated
//   if (!isAuthenticated) {
//     return <Login onLogin={handleLogin} />;
//   }

//   // Show main app if authenticated
//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
      
//       {/* Sidebar - 19% */}
//       <div className="w-[19%] min-w-[200px] max-w-[280px]">
//         <Sidebar 
//           setActivePage={setActivePage} 
//           activePage={activePage}
//           onLogout={handleLogout}
//         />
//       </div>

//       {/* Content Area - 81% */}
//       <div className="w-[81%] flex-1 overflow-auto">
//         {activePage === "Dashboard" && <Dashboard />}

//         {/* Updated: pass apiUrl prop so the UserRegistration component posts to backend */}
//         {activePage === "User Registration" && (
//           <UserRegistration apiUrl="http://localhost:5000/api/users" />
//         )}

//         {activePage === "Vehicle Registration" && <VehicleRegistration />}
//         {activePage === "Route" && <Route />}
//         {activePage === "Driver Registration" && <DriverRegistration />}
//         {activePage === "Cab Request" && <CabRequest />}
//         {activePage === "Vendor Master" && <VendorMaster />}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import CabRequest from "./components/pages/CabRequest";
import VendorMaster from "./components/pages/VendorMaster";
import UserRegistration from "./components/pages/UserRegistration";
import VehicleRegistration from "./components/pages/VehicleRegistration";
import Route from "./components/pages/Route";
import DriverRegistration from "./components/pages/DriverRegistration";
import DriverManagement from "./components/pages/DriverManagement";

// Page permissions by role
const ROLE_PERMISSIONS = {
  1: ['Dashboard', 'User Registration', 'Vehicle Registration', 'Route', 'Driver Registration', 'Cab Request', 'Vendor Master'],
  2: ['Cab Request'],
  3: ['Dashboard', 'Cab Request'],
  4: ['Cab Request']
};

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLogging(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        setIsLogging(false);
        onLogin(data.user); // Pass user data to parent
      } else {
        setError(data.error || 'Login failed');
        setIsLogging(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the server is running.');
      setIsLogging(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Commute-X</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLogging}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isLogging
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
            } text-white shadow-lg`}
          >
            {isLogging ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">Demo Credentials:</p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Admin: admin/admin | Employee: employee/employee
          </p>
        </div>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requiredPermissions, userRole, pageName }) {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  
  if (!userPermissions.includes(pageName)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-400 mt-2">Contact your administrator for access.</p>
        </div>
      </div>
    );
  }
  
  return children;
}

// Main App Component with Role-based Authentication
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set default page based on role
        if (userData.role === 2) { // Employee
          setActivePage("Cab Request");
        } else {
          setActivePage("Dashboard");
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Set default page based on role
    if (userData.role === 2) { // Employee
      setActivePage("Cab Request");
    } else {
      setActivePage("Dashboard");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    setActivePage("Dashboard");
  };

  // Get allowed pages for current user
  const getAllowedPages = () => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar - 19% */}
      <div className="w-[19%] min-w-[200px] max-w-[280px]">
        <Sidebar 
          setActivePage={setActivePage} 
          activePage={activePage}
          onLogout={handleLogout}
          user={user}
          allowedPages={getAllowedPages()}
        />
      </div>

      {/* Content Area - 81% */}
      <div className="w-[81%] flex-1 overflow-auto">
        
        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <ProtectedRoute userRole={user.role} pageName="Dashboard">
            <Dashboard />
          </ProtectedRoute>
        )}

        {/* User Registration */}
        {activePage === "User Registration" && (
          <ProtectedRoute userRole={user.role} pageName="User Registration">
            <UserRegistration apiUrl="http://localhost:5000/api/users" />
          </ProtectedRoute>
        )}

        {/* Vehicle Registration */}
        {activePage === "Vehicle Registration" && (
          <ProtectedRoute userRole={user.role} pageName="Vehicle Registration">
            <VehicleRegistration />
          </ProtectedRoute>
        )}

        {/* Route */}
        {activePage === "Route" && (
          <ProtectedRoute userRole={user.role} pageName="Route">
            <Route />
          </ProtectedRoute>
        )}

        {/* Driver Registration */}
        {activePage === "Driver Registration" && (
          <ProtectedRoute userRole={user.role} pageName="Driver Registration">
            <DriverRegistration />
          </ProtectedRoute>
        )}

        {/* Driver Management */}
{activePage === "Driver Management" && (
  <ProtectedRoute userRole={user.role} pageName="Driver Management">
    <DriverManagement />
  </ProtectedRoute>
)}

        {/* Cab Request */}
        {activePage === "Cab Request" && (
          <ProtectedRoute userRole={user.role} pageName="Cab Request">
            <CabRequest />
          </ProtectedRoute>
        )}

        {/* Vendor Master */}
        {activePage === "Vendor Master" && (
          <ProtectedRoute userRole={user.role} pageName="Vendor Master">
            <VendorMaster />
          </ProtectedRoute>
        )}

      </div>
    </div>
  );
}

export default App;
