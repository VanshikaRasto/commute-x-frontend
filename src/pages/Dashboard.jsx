import React, { useState } from 'react';

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate database fetch function
  const fetchKPIData = async (type) => {
    setLoading(true);
    setSelectedKPI(type);
    
    // Simulate API call delay
    setTimeout(() => {
      let data = [];
      
      switch(type) {
        case 'users':
          data = [
            { id: 'USR001', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91-9876543210', status: 'Active', joinDate: '2024-01-15' },
            { id: 'USR002', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91-9876543211', status: 'Active', joinDate: '2024-02-20' },
            { id: 'USR003', name: 'Amit Singh', email: 'amit@email.com', phone: '+91-9876543212', status: 'Inactive', joinDate: '2024-03-10' },
            { id: 'USR004', name: 'Neha Gupta', email: 'neha@email.com', phone: '+91-9876543213', status: 'Active', joinDate: '2024-04-05' },
            { id: 'USR005', name: 'Vikash Yadav', email: 'vikash@email.com', phone: '+91-9876543214', status: 'Active', joinDate: '2024-05-12' }
          ];
          break;
          
        case 'vehicles':
          data = [
            { id: 'VEH001', number: 'DL-1C-1234', model: 'Maruti Swift', capacity: 4, status: 'Available' },
            { id: 'VEH002', number: 'DL-2B-5678', model: 'Hyundai i20', capacity: 4, status: 'On Trip' },
            { id: 'VEH003', number: 'DL-3A-9012', model: 'Toyota Innova', capacity: 7, status: 'Available' },
            { id: 'VEH004', number: 'DL-4D-3456', model: 'Honda City', capacity: 4, status: 'Maintenance' },
            { id: 'VEH005', number: 'DL-5E-7890', model: 'Maruti Ertiga', capacity: 6, status: 'On Trip' }
          ];
          break;
          
        case 'drivers':
          data = [
            { id: 'DRV001', name: 'Rajesh Kumar', license: 'DL-123456789', phone: '+91-9876543210', experience: '5 years', status: 'Available' },
            { id: 'DRV002', name: 'Amit Singh', license: 'DL-987654321', phone: '+91-9876543211', experience: '3 years', status: 'On Trip' },
            { id: 'DRV003', name: 'Suresh Yadav', license: 'DL-456789123', phone: '+91-9876543212', experience: '7 years', status: 'Available' },
            { id: 'DRV004', name: 'Mohan Lal', license: 'DL-789123456', phone: '+91-9876543213', experience: '4 years', status: 'On Trip' },
            { id: 'DRV005', name: 'Vikash Sharma', license: 'DL-321654987', phone: '+91-9876543214', experience: '6 years', status: 'Off Duty' }
          ];
          break;
          
        case 'routes':
          data = [
            { id: 'RT001', name: 'Gurgaon → Connaught Place', distance: '25 km', duration: '45 mins', status: 'Active' },
            { id: 'RT002', name: 'Dwarka → Nehru Place', distance: '30 km', duration: '60 mins', status: 'Active' },
            { id: 'RT003', name: 'Noida → Karol Bagh', distance: '35 km', duration: '50 mins', status: 'Active' },
            { id: 'RT004', name: 'Faridabad → Gurgaon', distance: '40 km', duration: '65 mins', status: 'Inactive' },
            { id: 'RT005', name: 'Ghaziabad → Delhi Gate', distance: '28 km', duration: '55 mins', status: 'Active' }
          ];
          break;
          
        default:
          data = [];
      }
      
      setKpiData(data);
      setLoading(false);
    }, 1000); // 1 second delay to simulate API call
  };

  const closeKPIModal = () => {
    setSelectedKPI(null);
    setKpiData([]);
  };

  const kpiCards = [
    { 
      icon: "👥", 
      label: "Users", 
      value: "70", 
      //change: "+12%",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      changeColor: "bg-emerald-100 text-emerald-700",
      type: "users"
    },
    { 
      icon: "🚗", 
      label: "Vehicles", 
      value: "10", 
      //change: "+3",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200", 
      textColor: "text-emerald-700",
      changeColor: "bg-emerald-100 text-emerald-700",
      type: "vehicles"
    },
    { 
      icon: "🧑‍✈️", 
      label: "Drivers", 
      value: "15", 
      //change: "94%",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      changeColor: "bg-slate-100 text-slate-700",
      type: "drivers"
    },
    { 
      icon: "🗺️", 
      label: "Routes", 
      value: "7", 
      //change: "+2",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      changeColor: "bg-emerald-100 text-emerald-700",
      type: "routes"
    }
  ];

  const trips = [
    { id: "CAB-012", route: "Gurgaon → CP", driver: "Rajesh K.", status: "on-time", passengers: 4, eta: "12m" },
    { id: "CAB-008", route: "Dwarka → Nehru Place", driver: "Amit S.", status: "delayed", passengers: 3, eta: "18m" },
    { id: "CAB-015", route: "Noida → Karol Bagh", driver: "Suresh Y.", status: "on-time", passengers: 5, eta: "8m" },
    { id: "CAB-003", route: "Faridabad → Gurgaon", driver: "Vikash S.", status: "boarding", passengers: 2, eta: "5m" },
    { id: "CAB-019", route: "Ghaziabad → Delhi", driver: "Mohan L.", status: "on-time", passengers: 3, eta: "15m" },
    { id: "CAB-025", route: "Sector 18 → CP", driver: "Ravi P.", status: "delayed", passengers: 4, eta: "22m" }
  ];

  const todayStats = [
    { label: "Completed Trips", value: "147", color: "text-emerald-600" },
    { label: "Active Bookings", value: "23", color: "text-blue-600" },
    { label: "Avg Trip Time", value: "28 mins", color: "text-slate-600" }
  ];

  const activities = [
    { message: "New booking assigned to CAB-021", time: "2m", type: "booking" },
    { message: "Trip CAB-007 completed successfully", time: "5m", type: "success" },
    { message: "Traffic delay reported on Route 15", time: "8m", type: "warning" },
    { message: "CAB-045 scheduled for maintenance", time: "15m", type: "info" }
  ];

  const filteredTrips = activeFilter === 'all' ? trips : trips.filter(trip => trip.status === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Clean Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
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
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${kpi.changeColor}`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">{kpi.value}</p>
              <p className={`text-base font-medium ${kpi.textColor}`}>{kpi.label}</p>
              <div className="mt-2 text-xs text-slate-500">Click to view details</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid - No bottom margin */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Live Trips Section */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    🚗 Live Trip Monitoring
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                      {filteredTrips.length} Active
                    </span>
                  </h2>
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    {['all', 'on-time', 'delayed', 'boarding'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 capitalize font-medium ${
                          activeFilter === filter
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter === 'all' ? 'All Trips' : filter.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {filteredTrips.map((trip, index) => (
                    <TripCard key={index} trip={trip} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                📊 Today's Overview
              </h3>
              <div className="space-y-4">
                {todayStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                    <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                🕐 Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Map Section - Reduced top margin */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              🗺️ Live Fleet Tracking
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Real-time
              </span>
            </h2>
          </div>
          <div className="p-8">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-80 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center">
                <div className="text-6xl mb-4 text-slate-400">🗺️</div>
                <p className="text-slate-700 font-semibold text-xl">Interactive Map</p>
                <p className="text-slate-500 text-base mt-2">Real-time vehicle tracking integration</p>
                <button className="mt-6 px-6 py-3 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  Setup Map Integration
                </button>
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
                {selectedKPI} Details
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading {selectedKPI} data...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedKPI === 'users' && (
                    <div className="grid gap-4">
                      {kpiData.map((user, index) => (
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
                            <div><strong>Joined:</strong> {user.joinDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedKPI === 'vehicles' && (
                    <div className="grid gap-4">
                      {kpiData.map((vehicle, index) => (
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
                            <div><strong>Capacity:</strong> {vehicle.capacity} seats</div>
                            <div><strong>Driver:</strong> {vehicle.driver}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedKPI === 'drivers' && (
                    <div className="grid gap-4">
                      {kpiData.map((driver, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">{driver.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-yellow-600">⭐ {driver.rating}</span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                driver.status === 'Available' ? 'bg-green-100 text-green-700' : 
                                driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {driver.status}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div><strong>ID:</strong> {driver.id}</div>
                            <div><strong>License:</strong> {driver.license}</div>
                            <div><strong>Phone:</strong> {driver.phone}</div>
                            <div><strong>Experience:</strong> {driver.experience}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedKPI === 'routes' && (
                    <div className="grid gap-4">
                      {kpiData.map((route, index) => (
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
                            <div><strong>ID:</strong> {route.id}</div>
                            <div><strong>Distance:</strong> {route.distance}</div>
                            <div><strong>Duration:</strong> {route.duration}</div>
                           
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'on-time':
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          dot: 'bg-emerald-500', 
          label: 'On Time' 
        };
      case 'delayed':
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200', 
          dot: 'bg-amber-500', 
          label: 'Delayed' 
        };
      case 'boarding':
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          dot: 'bg-blue-500', 
          label: 'Boarding' 
        };
      default:
        return { 
          color: 'bg-slate-50 text-slate-700 border-slate-200', 
          dot: 'bg-slate-500', 
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(trip.status);

  return (
    <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-200">
            <span className="text-base font-bold text-slate-700">{trip.id.split('-')[1]}</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{trip.id}</h4>
            <p className="text-sm text-slate-600">{trip.driver}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusConfig.color} flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
          {statusConfig.label}
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-900 font-semibold text-base">{trip.route}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6 text-slate-600">
            <span className="flex items-center gap-1">
              <span className="font-medium">{trip.passengers}</span> passengers
            </span>
            <span className="flex items-center gap-1">
              ETA: <span className="font-medium text-slate-900">{trip.eta}</span>
            </span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium">
            Track Live
          </button>
        </div>
      </div>
    </div>
  );
}