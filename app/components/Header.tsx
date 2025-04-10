'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFirebase } from '../context/FirebaseContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useFirebase();

  const logoutHandler = async () => { 
    await logout();
    // Optionally, you can redirect the user after logout
    await fetch('/api/auth/redirect', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },  
    });
  }

  
  // Check if we're on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register';
  // console.log('isAuthPage',isAuthPage)
  // console.log('user',user)
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">User Management</span>
            </div>
            {!isAuthPage && user ? (
              <nav className="ml-6 flex space-x-8">
                <Link 
                  href="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/roles"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/roles' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Role Management
                </Link>
              </nav>
            ) : !isAuthPage && !user ? (
              <nav className="ml-6 flex space-x-8">
                <Link 
                  href="/login"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/login' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/register' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Register
                </Link>
              </nav>
            ) : null}
          </div>
          {!isAuthPage && user && (
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user.email}</span>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 