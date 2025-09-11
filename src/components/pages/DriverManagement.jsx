// src/components/pages/DriverManagement.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    license: '',
    experience: '',
    status: true
  });
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const response = await fetch('http://localhost:5000/api/drivers');
    const data = await response.json();
    setDrivers(data);
  };

  const handleEdit = (driver) => {
    setEditingId(driver.id);
    setEditForm({
      name: driver.name,
      phone: driver.phone,
      license: driver.license,
      experience: driver.experience,
      status: driver.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/drivers/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        setEditingId(null);
        fetchDrivers();
        setIsSaveEnabled(false);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchDrivers();
      }
    }
  };

  useEffect(() => {
    if (editingId) {
      const currentDriver = drivers.find(d => d.id === editingId);
      if (currentDriver) {
        const hasChanges = 
          editForm.name !== currentDriver.name ||
          editForm.phone !== currentDriver.phone ||
          editForm.license !== currentDriver.license ||
          editForm.experience !== currentDriver.experience ||
          editForm.status !== currentDriver.status;
        
        setIsSaveEnabled(hasChanges);
      }
    }
  }, [editForm, editingId, drivers]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Driver Management</h2>
        {editingId && (
          <div className="space-x-2">
            <button
              onClick={handleSaveChanges}
              disabled={!isSaveEnabled}
              className={`px-4 py-2 rounded ${
                isSaveEnabled 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Apply Changes
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">License</th>
              <th className="px-4 py-2 border">Experience</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50">
                {editingId === driver.id ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="license"
                        value={editForm.license}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="experience"
                        value={editForm.experience}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="status"
                          checked={editForm.status}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Active
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <span className="text-gray-400">Editing...</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{driver.name}</td>
                    <td className="border px-4 py-2">{driver.phone}</td>
                    <td className="border px-4 py-2">{driver.license}</td>
                    <td className="border px-4 py-2">{driver.experience}</td>
                    <td className="border px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        driver.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {driver.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverManagement;