// import { useState, useEffect } from "react";

// export default function Sidebar({ setActivePage, activePage: currentActivePage }) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [activePage, setActivePageState] = useState(currentActivePage || "Dashboard");
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   // Update local state when prop changes (for external navigation)
//   useEffect(() => {
//     if (currentActivePage) {
//       setActivePageState(currentActivePage);
//     }
//   }, [currentActivePage]);

//   const handlePageChange = (pageName) => {
//     setActivePageState(pageName);
//     setActivePage(pageName);
//   };

//   const handleLogout = async () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       setIsLoggingOut(true);
      
//       try {
//         // Clear all stored authentication data
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userInfo');
//         localStorage.removeItem('isLoggedIn');
//         sessionStorage.clear();
        
//         // Clear any cookies if you're using them
//         document.cookie.split(";").forEach((c) => {
//           document.cookie = c
//             .replace(/^ +/, "")
//             .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//         });
        
//         // Simulate logout API call (replace with your actual logout API)
//         // await fetch('/api/logout', { method: 'POST' });
        
//         setTimeout(() => {
//           setIsLoggingOut(false);
          
//           // Redirect to login page
//           window.location.href = '/login';
//           // Or if using React Router:
//           // window.location.replace('/login');
//           // Or if you have access to navigate from React Router:
//           // navigate('/login');
//         }, 1500);
        
//       } catch (error) {
//         console.error('Logout error:', error);
//         setIsLoggingOut(false);
//         alert('Logout failed. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-white border-r border-slate-200 shadow-sm">
//       {/* Enhanced Header */}
//       <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
//         <h1 className="text-xl font-bold text-slate-900">Commute-X</h1>
//         <p className="text-sm text-slate-600 mt-1">Transport</p>
//       </div>

//       {/* Enhanced Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        
//         {/* Dashboard - Functional Navigation */}
//         <NavItem
//           icon="📊"
//           label="Dashboard"
//           isActive={activePage === "Dashboard"}
//           onClick={() => handlePageChange("Dashboard")}
//         />

//         {/* Enhanced Management Dropdown */}
//         <div className="space-y-1">
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
//               isDropdownOpen || ["User Registration", "Vehicle Registration", "Route", "Driver Registration"].includes(activePage)
//                 ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
//                 : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-base">⚙️</span>
//               <span>Management</span>
//             </div>
//             <svg
//               className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {/* Enhanced Dropdown Items */}
//           <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
//             <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-3 pt-1">
//               <SubNavItem
//                 icon="👥"
//                 label="User Registration"
//                 isActive={activePage === "User Registration"}
//                 onClick={() => handlePageChange("User Registration")}
//               />
//               <SubNavItem
//                 icon="🚗"
//                 label="Vehicle Registration"
//                 isActive={activePage === "Vehicle Registration"}
//                 onClick={() => handlePageChange("Vehicle Registration")}
//               />
//               <SubNavItem
//                 icon="🗺️"
//                 label="Routes"
//                 isActive={activePage === "Route"}
//                 onClick={() => handlePageChange("Route")}
//               />
//               <SubNavItem
//                 icon="🧑‍✈️"
//                 label="Driver Registration"
//                 isActive={activePage === "Driver Registration"}
//                 onClick={() => handlePageChange("Driver Registration")}
//               />
//               <SubNavItem
//                 icon="🧑‍✈️"
//                 label="Vendor Master"
//                 isActive={activePage === "Vendor Master"}
//                 onClick={() => handlePageChange("Vendor Master")}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Cab Request */}
//         <NavItem
//           icon="🚕"
//           label="Cab Request"
//           isActive={activePage === "Cab Request"}
//           onClick={() => handlePageChange("Cab Request")}
//           //badge="3"
//         />

//         {/* Enhanced Divider */}
//         <div className="py-2">
//           <div className="border-t border-slate-200"></div>
//         </div>

//         {/* Settings */}
//         {/*<NavItem
//           icon="🛠️"
//           label="Settings"
//           isActive={activePage === "Settings"}
//           onClick={() => handlePageChange("Settings")}
//         />*/}

//       </nav>

//       {/* Enhanced Bottom User Section */}
//       <div className="p-3 border-t border-slate-200 bg-slate-50">
//         <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg mb-2 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
//             <span className="text-white text-sm font-semibold">A</span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-slate-900 truncate">Admin</p>
//             <p className="text-xs text-slate-500 truncate">Super Admin</p>
//           </div>
//         </div>
        
//         {/* Enhanced Logout Button */}
//         <button 
//           onClick={handleLogout}
//           disabled={isLoggingOut}
//           className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm ${
//             isLoggingOut 
//               ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
//               : 'text-slate-600 hover:bg-white hover:text-slate-900'
//           }`}
//         >
//           {isLoggingOut ? (
//             <>
//               <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
//               <span>Logging out...</span>
//             </>
//           ) : (
//             <>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               <span>Logout</span>
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// // Enhanced Main Navigation Item Component
// function NavItem({ icon, label, isActive, onClick, badge }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
//         isActive
//           ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
//           : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200"
//       }`}
//     >
//       <span className="text-base">{icon}</span>
//       <span className="flex-1 text-left">{label}</span>
//       {badge && (
//         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
//           {badge}
//         </span>
//       )}
//       {/* Enhanced Active indicator */}
//       {isActive && (
//         <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
//       )}
//     </button>
//   );
// }

// // Enhanced Sub Navigation Item Component
// function SubNavItem({ icon, label, isActive, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-all duration-200 ${
//         isActive
//           ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
//           : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//       }`}
//     >
//       <span className="text-sm">{icon}</span>
//       <span className="flex-1 text-left">{label}</span>
//     </button>
//   );
// }


import { useState, useEffect } from "react";

// Role-based permissions
const ROLE_PERMISSIONS = {
  1: ['Dashboard', 'User Registration', 'Vehicle Registration', 'Route', 'Driver Registration', 'Vendor Master', 'Cab Request'], // Admin
  2: ['Cab Request'], // Employee
  3: ['Dashboard', 'Cab Request'], // Manager
  4: ['Cab Request'] // Guest
};

const ROLE_NAMES = {
  1: 'Administrator',
  2: 'Employee',
  3: 'Manager',
  4: 'Guest'
};

export default function Sidebar({ setActivePage, activePage: currentActivePage, onLogout, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePage, setActivePageState] = useState(currentActivePage || "Dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Update local state when prop changes (for external navigation)
  useEffect(() => {
    if (currentActivePage) {
      setActivePageState(currentActivePage);
    }
  }, [currentActivePage]);

  const handlePageChange = (pageName) => {
    setActivePageState(pageName);
    setActivePage(pageName);
  };

  // Check if user can access a page
  const canAccess = (pageName) => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(pageName);
  };

  // Check if user can access any management items
  const canAccessManagement = () => {
    const managementItems = ['User Registration', 'Vehicle Registration', 'Route', 'Driver Registration', 'Vendor Master'];
    return managementItems.some(item => canAccess(item));
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggingOut(true);
      
      try {
        // Call the onLogout function from App.js
        if (onLogout) {
          onLogout();
        }
        
        setTimeout(() => {
          setIsLoggingOut(false);
        }, 1500);
        
      } catch (error) {
        console.error('Logout error:', error);
        setIsLoggingOut(false);
        alert('Logout failed. Please try again.');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border-r border-slate-200 shadow-sm">
      {/* Enhanced Header */}
      <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
        <h1 className="text-xl font-bold text-slate-900">Commute-X</h1>
        <p className="text-sm text-slate-600 mt-1">Transport</p>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        
        {/* Dashboard - Only show if user can access */}
        {canAccess('Dashboard') && (
          <NavItem
            icon="📊"
            label="Dashboard"
            isActive={activePage === "Dashboard"}
            onClick={() => handlePageChange("Dashboard")}
          />
        )}

        {/* Enhanced Management Dropdown - Only show if user can access any management item */}
        {canAccessManagement() && (
          <div className="space-y-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isDropdownOpen || ["User Registration", "Vehicle Registration", "Route", "Driver Registration", "Vendor Master"].includes(activePage)
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">⚙️</span>
                <span>Management</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Enhanced Dropdown Items - Only show items user can access */}
            <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-3 pt-1">
                
                {canAccess('User Registration') && (
                  <SubNavItem
                    icon="👥"
                    label="User Registration"
                    isActive={activePage === "User Registration"}
                    onClick={() => handlePageChange("User Registration")}
                  />
                )}
                
                {canAccess('Vehicle Registration') && (
                  <SubNavItem
                    icon="🚗"
                    label="Vehicle Registration"
                    isActive={activePage === "Vehicle Registration"}
                    onClick={() => handlePageChange("Vehicle Registration")}
                  />
                )}
                
                {canAccess('Route') && (
                  <SubNavItem
                    icon="🗺️"
                    label="Routes"
                    isActive={activePage === "Route"}
                    onClick={() => handlePageChange("Route")}
                  />
                )}
                
                {canAccess('Driver Registration') && (
                  <SubNavItem
                    icon="🧑‍✈️"
                    label="Driver Registration"
                    isActive={activePage === "Driver Registration"}
                    onClick={() => handlePageChange("Driver Registration")}
                  />
                )}
                
                {canAccess('Vendor Master') && (
                  <SubNavItem
                    icon="🧑‍✈️"
                    label="Vendor Master"
                    isActive={activePage === "Vendor Master"}
                    onClick={() => handlePageChange("Vendor Master")}
                  />
                )}
                
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Cab Request - Show for all roles */}
        {canAccess('Cab Request') && (
          <NavItem
            icon="🚕"
            label="Cab Request"
            isActive={activePage === "Cab Request"}
            onClick={() => handlePageChange("Cab Request")}
          />
        )}

        {/* Enhanced Divider */}
        <div className="py-2">
          <div className="border-t border-slate-200"></div>
        </div>

      </nav>

      {/* Enhanced Bottom User Section - Show actual user info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg mb-2 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {ROLE_NAMES[user?.role] || 'Unknown Role'}
            </p>
          </div>
        </div>
        
        {/* Enhanced Logout Button */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm ${
            isLoggingOut 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'text-slate-600 hover:bg-white hover:text-slate-900'
          }`}
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Enhanced Main Navigation Item Component
function NavItem({ icon, label, isActive, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
        isActive
          ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
          {badge}
        </span>
      )}
      {/* Enhanced Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
      )}
    </button>
  );
}

// Enhanced Sub Navigation Item Component
function SubNavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}