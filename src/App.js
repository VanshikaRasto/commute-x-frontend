// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import CabRequest from "./pages/CabRequest";
// import VendorMaster from "./pages/VendorMaster";
// import UserRegistration from "./pages/UserRegistration";
// import VehicleRegistration from "./pages/VehicleRegistration";
// import Route from "./pages/Route";
// import DriverRegistration from "./pages/DriverRegistration";


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
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CabRequest from "./pages/CabRequest";
import VendorMaster from "./pages/VendorMaster";
import UserRegistration from "./pages/UserRegistration";
import VehicleRegistration from "./pages/VehicleRegistration";
import Route from "./pages/Route";
import DriverRegistration from "./pages/DriverRegistration";

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async () => {
    setIsLogging(true);

    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setTimeout(() => {
        localStorage.setItem('authToken', 'dummy-token-123');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify({ username: 'admin', role: 'Super Admin' }));
        setIsLogging(false);
        onLogin();
      }, 1500);
    } else {
      setTimeout(() => {
        setIsLogging(false);
        alert('Invalid credentials! Use admin/admin');
      }, 1500);
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
      </div>
    </div>
  );
}

// Main App Component with Authentication
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Always start false

  // Clear any previous session data on app start
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    sessionStorage.clear();
    setActivePage("Dashboard");
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
        />
      </div>

      {/* Content Area - 81% */}
      <div className="w-[81%] flex-1 overflow-auto">
        {activePage === "Dashboard" && <Dashboard />}

        {/* Updated: pass apiUrl prop so the UserRegistration component posts to backend */}
        {activePage === "User Registration" && (
          <UserRegistration apiUrl="http://localhost:5000/api/users" />
        )}

        {activePage === "Vehicle Registration" && <VehicleRegistration />}
        {activePage === "Route" && <Route />}
        {activePage === "Driver Registration" && <DriverRegistration />}
        {activePage === "Cab Request" && <CabRequest />}
        {activePage === "Vendor Master" && <VendorMaster />}
      </div>
    </div>
  );
}

export default App;
