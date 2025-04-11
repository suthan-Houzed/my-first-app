'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '../../context/FirebaseContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function EditUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { getUserById, updateUser } = useFirebase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        if (userData) {
          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        } else {
          router.push('/roles');
        }
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router, getUserById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      await updateUser(userId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      router.push('/roles');
    } catch (updateError: unknown) {
      if (updateError instanceof Error) {
        setError(updateError.message);
      } else {
        setError('Failed to update user');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto text-center">
        <p className="text-gray-600 text-lg font-medium">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
        <Link 
          href="/roles" 
          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded"
        >
          Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-2.5 border ${
                error && !formData.name.trim() ? 'border-red-500' : 'border-gray-300'
              } rounded text-gray-900 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
              className={`w-full p-2.5 border ${
                error && !formData.email.trim() ? 'border-red-500' : 'border-gray-300'
              } rounded text-gray-900 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 