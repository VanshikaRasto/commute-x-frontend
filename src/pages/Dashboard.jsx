// src/pages/Dashboard.jsx - Updated with API integration
import React, { useState, useEffect } from 'react';
import { dashboardAPI, usersAPI, vehiclesAPI, driversAPI, routesAPI } from '../services/api';

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

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
        users: 25,
        vehicles: 8,
        drivers: 12,
        routes: 5,
        activeRequests: 3
      });
      
      setActivities([
        { message: "API connection failed - showing mock data", time: "now", type: "warning" },
        { message: "Please start the backend server", time: "now", type: "info" }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
      label: "Users", 
      value: stats.users.toString(), 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      type: "users"
    },
    { 
      icon: "🚗", 
      label: "Vehicles", 
      value: stats.vehicles.toString(), 
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200", 
      textColor: "text-emerald-700",
      type: "vehicles"
    },
    { 
      icon: "🧑‍✈️", 
      label: "Drivers", 
      value: stats.drivers.toString(), 
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      type: "drivers"
    },
    { 
      icon: "🗺️", 
      label: "Routes", 
      value: stats.routes.toString(), 
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      type: "routes"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            {error && (
              <p className="text-red-600 text-sm mt-1">⚠️ {error}</p>
            )}
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <div className="p-8">
        {/* Clickable KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiCards.map((kpi, index) => (
            <div 
              key={index} 
              onClick={() => fetchKPIData(kpi.type)}
              className={`${kpi.bgColor} ${kpi.borderColor} border-2 p-6 rounded-2xl hover:shadow-lg transition-all duration-200 group cursor-pointer transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {kpi.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">{kpi.value}</p>
              <p className={`text-base font-medium ${kpi.textColor}`}>{kpi.label}</p>
              <div className="mt-2 text-xs text-slate-500">Click to view details</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
          
          {/* Live System Status */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  🖥️ System Status
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Online
                  </span>
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="text-lg font-semibold text-green-800">Database</div>
                    <div className="text-sm text-green-600">Connected</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="text-lg font-semibold text-blue-800">API Server</div>
                    <div className="text-sm text-blue-600">Running</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-lg font-semibold text-purple-800">Real-time Data</div>
                    <div className="text-sm text-purple-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                🕐 Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.length > 0 ? activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'booking' ? 'bg-blue-500' :
                      activity.type === 'success' ? 'bg-emerald-500' :
                      activity.type === 'warning' ? 'bg-amber-500' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                      <p className="text-xs text-slate-500">{activity.time} ago</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-slate-500">
                    No recent activities
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Integration Status */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              🔗 Backend Integration Status
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                Connected
              </span>
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-green-800">User Management</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-green-800">Vehicle Tracking</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-green-800">Route Management</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-green-800">Booking System</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Details Modal */}
      {selectedKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 capitalize flex items-center gap-3">
                <span className="text-3xl">
                  {selectedKPI === 'users' && '👥'}
                  {selectedKPI === 'vehicles' && '🚗'}
                  {selectedKPI === 'drivers' && '🧑‍✈️'}
                  {selectedKPI === 'routes' && '🗺️'}
                </span>
                {selectedKPI} Details ({kpiData.length} records)
              </h2>
              <button 
                onClick={closeKPIModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {kpiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading {selectedKPI} data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-lg mb-2">❌ {error}</div>
                  <button 
                    onClick={() => fetchKPIData(selectedKPI)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : kpiData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-500 text-lg">No {selectedKPI} data found</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedKPI === 'users' && kpiData.map((user, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone}</div>
                        <div><strong>Distance:</strong> {user.distance} km</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'vehicles' && kpiData.map((vehicle, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{vehicle.number}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          vehicle.status === 'Available' ? 'bg-green-100 text-green-700' : 
                          vehicle.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div><strong>ID:</strong> {vehicle.id}</div>
                        <div><strong>Model:</strong> {vehicle.model}</div>
                        <div><strong>Type:</strong> {vehicle.type}</div>
                        <div><strong>Created:</strong> {formatDate(vehicle.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'drivers' && kpiData.map((driver, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{driver.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          driver.status === 'Available' ? 'bg-green-100 text-green-700' : 
                          driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {driver.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div><strong>ID:</strong> {driver.id}</div>
                        <div><strong>License:</strong> {driver.license}</div>
                        <div><strong>Phone:</strong> {driver.phone}</div>
                        <div><strong>Experience:</strong> {driver.experience}</div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedKPI === 'routes' && kpiData.map((route, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{route.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          route.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {route.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div><strong>Route No:</strong> {route.routeNo}</div>
                        <div><strong>Distance:</strong> {route.distance}</div>
                        <div><strong>Duration:</strong> {route.duration}</div>
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