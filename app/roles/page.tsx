import React from 'react';
import UserTable from '../components/UserTable';

export default function RolesPage() {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-4">User Management</h1>
      
      <div className="bg-white p-4 rounded shadow">
        <UserTable />
      </div>
    </div>
  );
} 