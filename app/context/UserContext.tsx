'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user type
export type UserRole = 'admin' | 'agent' | 'user' | 'buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define context type
interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updatedUser: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

// Create context with initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create provider component
export function UserProvider({ children }: { children: ReactNode }) {
  // Initial dummy user data
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'agent' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'buyer' },
  ]);

  // Add new user
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Date.now().toString(), // Simple ID generation
    };
    setUsers([...users, newUser]);
  };

  // Update existing user
  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
    );
  };

  // Delete user
  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 