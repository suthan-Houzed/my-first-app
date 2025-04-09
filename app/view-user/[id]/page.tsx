'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '../../context/FirebaseContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function ViewUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const userId = params.id as string;
  const { getUserById } = useFirebase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, getUserById]);

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto text-center">
        <p className="text-gray-600 text-lg font-medium">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 max-w-5xl mx-auto text-center">
        <p className="text-red-500 text-lg font-medium mb-2">User not found</p>
        <Link href="/roles" className="text-blue-600 hover:underline font-medium">
          Back to users
        </Link>
      </div>
    );
  }

  // Role badge class
  const getRoleBadge = (role: User['role']) => {
    const badges = {
      admin: 'bg-red-100 text-red-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return badges[role] || badges.user;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/edit-user/${userId}`}
            className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded"
          >
            Edit
          </Link>
          <Link 
            href="/roles" 
            className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded"
          >
            Back
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> 
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Details</h2>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
            <p className="text-gray-900 text-base">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Role</p>
            <p>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getRoleBadge(user.role)}`}>
                {user.role}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">User ID</p>
            <p className="text-gray-700 text-sm">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 