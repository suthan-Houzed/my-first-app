'use client';

import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUsers, deleteUser } = useFirebase();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getUsers]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Simplified role badge
  const getRoleBadge = (role: User['role']) => {
    const badges = {
      admin: 'bg-red-100 text-red-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return badges[role] || badges.user;
  };

  if (loading) {
    return <p className="text-gray-600 text-center py-4 font-medium">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-gray-600 text-center py-4 font-medium">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-base">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-800">Name</th>
            <th className="text-left p-3 font-semibold text-gray-800">Email</th>
            <th className="text-left p-3 font-semibold text-gray-800">Role</th>
            <th className="text-left p-3 font-semibold text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-gray-800 font-medium">{user.name}</td>
              <td className="p-3 text-gray-800">{user.email}</td>
              <td className="p-3">
                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/view-user/${user.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <Link
                    href={`/edit-user/${user.id}`}
                    className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 