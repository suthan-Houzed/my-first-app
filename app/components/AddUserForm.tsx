'use client';

import React, { useState } from 'react';

type UserRole = 'admin' | 'agent' | 'user' | 'buyer';

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      role: 'user' as UserRole,
    });
    setIsFormOpen(false);
  };

  if (!isFormOpen) {
    return (
      <button
        onClick={() => setIsFormOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded hover:bg-blue-700"
      >
        + Add User
      </button>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full p-2.5 border border-gray-300 rounded text-gray-900 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              className="w-full p-2.5 border border-gray-300 rounded text-gray-900 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded text-gray-900 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="user">User</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 