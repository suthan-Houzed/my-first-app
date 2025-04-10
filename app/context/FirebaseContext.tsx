'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser as deleteAuthUser
} from 'firebase/auth';
import { auth, db } from '@/app/config/firebase';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUsers: () => Promise<UserData[]>;
  getUserById: (userId: string) => Promise<UserData | null>;
  updateUser: (userId: string, data: Partial<UserData>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getUsers = async () => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      const users = await getDocs(collection(db, 'users'));
      return users.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  };

  const getUserById = async (userId: string) => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, data: Partial<UserData>) => {
    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete user from Firestore
      if (!auth || !db) throw new Error("Firebase not initialized");
      await deleteDoc(doc(db, 'users', userId));

      // If the user is the current user, delete from auth
      if (user?.uid === userId) {
        await deleteAuthUser(user);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      getUsers,
      getUserById,
      updateUser,
      deleteUser
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
} 