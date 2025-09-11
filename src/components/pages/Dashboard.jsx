// src/pages/Dashboard.jsx - Clean Production UI
import React, { useState, useEffect, useCallback } from 'react';
import { dashboardAPI, usersAPI, vehiclesAPI, driversAPI, routesAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    vehicles: 0,
    drivers: 0,
    routes: 0,
    activeRequests: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load dashboard data function
  const loadDashboardData = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      // Fetch dashboard stats and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getActivities()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please check if the backend server is running.');
      
      // Fallback to mock data if API fails
      setStats({
        users: 1247,
        vehicles: 89,
        drivers: 156,
        routes: 24,
        activeRequests: 12
      });
      
      setActivities([
        { message: "User 'John Doe' added to system", time: "2 minutes", type: "user" },
        { message: "Vehicle registration DL-01-AB-1234 completed", time: "5 minutes", type: "vehicle" },
        { message: "Driver 'Amit Kumar' profile updated", time: "8 minutes", type: "driver" },
        { message: "New route 'Delhi-Gurgaon Express' created", time: "12 minutes", type: "route" },
        { message: "Booking #B001 confirmed for Delhi to Noida", time: "18 minutes", type: "booking" }
      ]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Listen for custom events from other components
  useEffect(() => {
    const handleDataUpdate = (event) => {
      console.log('Data update event received:', event.detail);
      
      // Add new activity to the list if provided
      if (event.detail && event.detail.activity) {
        const newActivity = {
          message: event.detail.activity,
          time: "just now",
          type: event.type.replace('Added', '').replace('Updated', '').replace('Deleted', '').toLowerCase()
        };
        
        setActivities(prevActivities => [newActivity, ...prevActivities.slice(0, 4)]);
      }
      
      // Refresh dashboard data
      loadDashboardData(true);
    };

    // Listen for various update events
    window.addEventListener('userAdded', handleDataUpdate);
    window.addEventListener('userUpdated', handleDataUpdate);
    window.addEventListener('userDeleted', handleDataUpdate);
    window.addEventListener('vehicleAdded', handleDataUpdate);
    window.addEventListener('vehicleUpdated', handleDataUpdate);
    window.addEventListener('vehicleDeleted', handleDataUpdate);
    window.addEventListener('driverAdded', handleDataUpdate);
    window.addEventListener('driverUpdated', handleDataUpdate);
    window.addEventListener('driverDeleted', handleDataUpdate);
    window.addEventListener('routeAdded', handleDataUpdate);
    window.addEventListener('routeUpdated', handleDataUpdate);
    window.addEventListener('routeDeleted', handleDataUpdate);

    return () => {
      window.removeEventListener('userAdded', handleDataUpdate);
      window.removeEventListener('userUpdated', handleDataUpdate);
      window.removeEventListener('userDeleted', handleDataUpdate);
      window.removeEventListener('vehicleAdded', handleDataUpdate);
      window.removeEventListener('vehicleUpdated', handleDataUpdate);
      window.removeEventListener('vehicleDeleted', handleDataUpdate);
      window.removeEventListener('driverAdded', handleDataUpdate);
      window.removeEventListener('driverUpdated', handleDataUpdate);
      window.removeEventListener('driverDeleted', handleDataUpdate);
      window.removeEventListener('routeAdded', handleDataUpdate);
      window.removeEventListener('routeUpdated', handleDataUpdate);
      window.removeEventListener('routeDeleted', handleDataUpdate);
    };
  }, [loadDashboardData]);

  // Fetch detailed KPI data
  const fetchKPIData = async (type) => {
    try {
      setKpiLoading(true);
      setSelectedKPI(type);
      setError('');

      let response;
      
      switch(type) {
        case 'users':
          response = await usersAPI.getAll();
          break;
        case 'vehicles':
          response = await vehiclesAPI.getAll();
          break;
        case 'drivers':
          response = await driversAPI.getAll();
          break;
        case 'routes':
          response = await routesAPI.getAll();
          break;
        default:
          throw new Error('Invalid KPI type');
      }

      if (response.success) {
        setKpiData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }

    } catch (error) {
      console.error(`Failed to fetch ${type} data:`, error);
      setError(`Failed to load ${type} data`);
      setKpiData([]);
    } finally {
      setKpiLoading(false);
    }
  };

  const closeKPIModal = () => {
    setSelectedKPI(null);
    setKpiData([]);
    setError('');
  };

  const kpiCards = [
    { 
      icon: "👥", 
      label: "Total Users", 
      value: stats.users.toLocaleString(), 
      change: "+12.5%",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      type: "users"
    },
    { 
      icon: "🚗", 
      label: "Active Vehicles", 
      value: stats.vehicles.toLocaleString(), 
      change: "+8.3%",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      type: "vehicles"
    },
    { 
      icon: "🧑‍✈️", 
      label: "Drivers Online", 
      value: stats.drivers.toLocaleString(), 
      change: "+15.7%",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
      type: "drivers"
    },
    { 
      icon: "🗺️", 
      label: "Active Routes", 
      value: stats.routes.toLocaleString(), 
      change: "+4.2%",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-600",
      type: "routes"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      try {
        const response = await usersAPI.delete(userId);
        if (response.success) {
          // Refresh the users list
          await fetchKPIData(selectedKPI);
          // Show success message
          window.dispatchEvent(new CustomEvent('userDeleted', { 
            detail: { 
              activity: `User ${userName} deleted successfully`,
              type: 'user'
            } 
          }));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  // Handle edit user with better UI feedback
  const handleEditUser = (user) => {
    // For now, just show an alert
    // In a real app, you would open a modal or navigate to edit page
    alert(`Edit user: ${user.name}\nID: ${user._id || user.id}`);
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle) => {
    // For now, just show an alert with vehicle details
    // In a real app, you would open a modal or navigate to edit page
    alert(`Edit vehicle:\nNumber: ${vehicle.number || 'N/A'}\nModel: ${vehicle.model || 'N/A'}\nID: ${vehicle._id || vehicle.id}`);
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicleId, vehicleNumber) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicleNumber}?`)) {
      try {
        // In a real app, you would call your API to delete the vehicle
        // const response = await vehiclesAPI.delete(vehicleId);
        // if (response.success) {
        //   // Refresh the vehicles list
        //   await fetchKPIData(selectedKPI);
        //   // Show success message
        //   window.dispatchEvent(new CustomEvent('vehicleDeleted', { 
        //     detail: { 
        //       activity: `Vehicle ${vehicleNumber} deleted successfully`,
        //       type: 'vehicle'
        //     } 
        //   }));
        // }
        
        // For now, just show a success message
        alert(`Vehicle ${vehicleNumber} (ID: ${vehicleId}) would be deleted in a real app`);
        
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        setError('Failed to delete vehicle');
      }
    }
  };

  // Handle edit driver
  const handleEditDriver = (driver) => {
    // For now, just show an alert with driver details
    // In a real app, you would open a modal or navigate to edit page
    alert(`Edit driver:\nName: ${driver.name || 'N/A'}\nLicense: ${driver.license || 'N/A'}\nID: ${driver._id || driver.id}`);
  };

  // Handle driver deletion
  const handleDeleteDriver = async (driverId, driverName) => {
    if (window.confirm(`Are you sure you want to delete driver ${driverName}?`)) {
      try {
        // In a real app, you would call your API to delete the driver
        // const response = await driversAPI.delete(driverId);
        // if (response.success) {
        //   // Refresh the drivers list
        //   await fetchKPIData(selectedKPI);
        //   // Show success message
        //   window.dispatchEvent(new CustomEvent('driverDeleted', { 
        //     detail: { 
        //       activity: `Driver ${driverName} deleted successfully`,
        //       type: 'driver'
        //     } 
        //   }));
        // }
        
        // For now, just show a success message
        alert(`Driver ${driverName} (ID: ${driverId}) would be deleted in a real app`);
        
      } catch (error) {
        console.error('Error deleting driver:', error);
        setError('Failed to delete driver');
      }
    }
  };

  // Handle edit route
  const handleEditRoute = (route) => {
    // For now, just show an alert with route details
    // In a real app, you would open a modal or navigate to edit page
    alert(`Edit route:\nName: ${route.name || 'N/A'}\nRoute No: ${route.routeNo || 'N/A'}\nID: ${route._id || route.id}`);
  };

  // Handle route deletion
  const handleDeleteRoute = async (routeId, routeName) => {
    if (window.confirm(`Are you sure you want to delete route ${routeName}?`)) {
      try {
        // In a real app, you would call your API to delete the route
        // const response = await routesAPI.delete(routeId);
        // if (response.success) {
        //   // Refresh the routes list
        //   await fetchKPIData(selectedKPI);
        //   // Show success message
        //   window.dispatchEvent(new CustomEvent('routeDeleted', { 
        //     detail: { 
        //       activity: `Route ${routeName} deleted successfully`,
        //       type: 'route'
        //     } 
        //   }));
        // }
        
        // For now, just show a success message
        alert(`Route ${routeName} (ID: ${routeId}) would be deleted in a real app`);
        
      } catch (error) {
        console.error('Error deleting route:', error);
        setError('Failed to delete route');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Transport Management System Overview</p>
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
            
            {/* Live Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-sm">Live Updates Active</span>
              </div>
              {isRefreshing && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700 font-medium text-sm">Syncing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <div 
              key={index} 
              onClick={() => fetchKPIData(kpi.type)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center text-xl`}>
                  {kpi.icon}
                </div>
                <span className={`text-sm font-semibold ${kpi.textColor} bg-gray-50 px-3 py-1 rounded-lg`}>
                  {kpi.change}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              
              <p className="text-gray-600 font-medium">{kpi.label}</p>
              <p className="text-gray-400 text-sm mt-1">Click to view details</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  Recent Activity
                  {isRefreshing && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h3>
                <p className="text-gray-500 mt-1">Latest system updates and user actions</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  {activities.length > 0 ? activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-150">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'booking' ? 'bg-blue-500' :
                        activity.type === 'success' ? 'bg-emerald-500' :
                        activity.type === 'warning' ? 'bg-amber-500' : 
                        activity.type === 'user' ? 'bg-purple-500' :
                        activity.type === 'vehicle' ? 'bg-green-500' :
                        activity.type === 'driver' ? 'bg-indigo-500' :
                        activity.type === 'route' ? 'bg-orange-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-gray-500 text-sm mt-1">{activity.time} ago</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">📋</div>
                      <p className="text-gray-500 text-lg font-medium">No recent activities</p>
                      <p className="text-gray-400 text-sm">Activities will appear here as users interact with the system</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Overview */}
          
        </div>
      </div>

      {/* KPI Details Modal */}
      {selectedKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 capitalize flex items-center gap-2">
                <span className="text-2xl">
                  {selectedKPI === 'users' && '👥'}
                  {selectedKPI === 'vehicles' && '🚗'}
                  {selectedKPI === 'drivers' && '🧑‍✈️'}
                  {selectedKPI === 'routes' && '🗺️'}
                </span>
                {selectedKPI} Details ({kpiData.length} records)
              </h2>
              <button 
                onClick={closeKPIModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {kpiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading {selectedKPI} data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-xl mb-2">❌</div>
                  <div className="text-red-600 font-medium mb-4">{error}</div>
                  <button 
                    onClick={() => fetchKPIData(selectedKPI)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : kpiData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-xl mb-2">📊</div>
                  <div className="text-gray-600 font-medium mb-2">No {selectedKPI} data found</div>
                  <p className="text-gray-500 text-sm">Start by adding some {selectedKPI} to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedKPI === 'users' && kpiData.map((user, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 shadow-sm transition-all duration-200"
                            title="Edit user"
                          >
                            <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user._id || user.id, user.name);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-red-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 shadow-sm transition-all duration-200"
                            title="Delete user"
                          >
                            <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div><strong>ID:</strong> {user.id || user._id}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                        <div><strong>Role:</strong> {user.role || 'User'}</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'vehicles' && kpiData.map((vehicle, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{vehicle.number || 'N/A'}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            vehicle.status === 'Available' ? 'bg-green-100 text-green-700' : 
                            vehicle.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {vehicle.status || 'Unknown'}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditVehicle(vehicle);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-blue-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 shadow-sm transition-all duration-200"
                              title="Edit vehicle"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVehicle(vehicle._id || vehicle.id, vehicle.number || 'this vehicle');
                              }}
                              className="inline-flex items-center px-3 py-1 border border-red-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 shadow-sm transition-all duration-200"
                              title="Delete vehicle"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div><strong>ID:</strong> {vehicle.id || vehicle._id}</div>
                        <div><strong>Model:</strong> {vehicle.model || 'N/A'}</div>
                        <div><strong>Type:</strong> {vehicle.type || 'N/A'}</div>
                        <div><strong>Created:</strong> {formatDate(vehicle.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'drivers' && kpiData.map((driver, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{driver.name || 'N/A'}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            driver.status === 'Available' ? 'bg-green-100 text-green-700' : 
                            driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {driver.status || 'Unknown'}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDriver(driver);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-blue-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 shadow-sm transition-all duration-200"
                              title="Edit driver"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDriver(driver._id || driver.id, driver.name || 'this driver');
                              }}
                              className="inline-flex items-center px-3 py-1 border border-red-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 shadow-sm transition-all duration-200"
                              title="Delete driver"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div><strong>ID:</strong> {driver.id || driver._id}</div>
                        <div><strong>License:</strong> {driver.license || 'N/A'}</div>
                        <div><strong>Phone:</strong> {driver.phone || 'N/A'}</div>
                        <div><strong>Experience:</strong> {driver.experience || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'routes' && kpiData.map((route, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{route.name || 'Unnamed Route'}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            route.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {route.status || 'Inactive'}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRoute(route);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-blue-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 shadow-sm transition-all duration-200"
                              title="Edit route"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoute(route._id || route.id, route.name || 'this route');
                              }}
                              className="inline-flex items-center px-3 py-1 border border-red-100 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 shadow-sm transition-all duration-200"
                              title="Delete route"
                            >
                              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div><strong>Route No:</strong> {route.routeNo || 'N/A'}</div>
                        <div><strong>Distance:</strong> {route.distance || 'N/A'}</div>
                        <div><strong>Duration:</strong> {route.duration || 'N/A'}</div>
                        <div><strong>Created:</strong> {formatDate(route.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}