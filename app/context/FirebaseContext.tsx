  'use client';

  import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';

  import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    deleteUser as deleteAuthUser,
  } from 'firebase/auth';

  import { auth, db } from '@/app/config/firebase';

  import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    deleteDoc,
    updateDoc,
  } from 'firebase/firestore';

  interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt?: string;
  }

  interface FirebaseContextType {
    user: UserData | null;
    loading: boolean;
    register: (email: string, password: string, name: string, role: string) => Promise<string | null>;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
    getUsers: () => Promise<UserData[]>;
    getUserById: (userId: string) => Promise<UserData | null>;
    updateUser: (userId: string, data: Partial<UserData>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
  }

  const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

  export function FirebaseProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!auth) return;
      console.log('auth',auth.currentUser)
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log('firebaseUser',firebaseUser)
        if (firebaseUser) {
          getUserById(firebaseUser.uid).then((userData) => {
            setUser(userData);
            console.log('userData22222',userData)
          });
        } else {
          setUser(null);
          console.log('userData1',user)
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);

    const register = async (email: string, password: string, name: string, role: string) => {
      if (!auth || !db) throw new Error("Firebase not initialized");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });
      const userData = await getUserById(user.uid);
      setUser(userData);
      return token;
    };

    const login = async (email: string, password: string) => {
      if (!auth) throw new Error("Firebase not initialized");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      const userData = await getUserById(user.uid);
      setUser(userData);
      return token;
    };

    const logout = async () => {
      if (!auth) throw new Error("Firebase not initialized");
      await signOut(auth);
      setUser(null);  
    };

    const getUsers = async () => {
      if (!db) throw new Error("Firebase not initialized");
      const users = await getDocs(collection(db, 'users'));
      return users.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    };

    const getUserById = async (userId: string) => {
      if (!db) throw new Error("Firebase not initialized");
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists()
        ? ({ id: userDoc.id, ...userDoc.data() } as UserData)
        : null;
    };

    const updateUser = async (userId: string, data: Partial<UserData>) => {
      if (!db) throw new Error("Firebase not initialized");
      await updateDoc(doc(db, 'users', userId), data);
    };

    const deleteUser = async (userId: string) => {
      if (!db) throw new Error("Firebase not initialized");
      await deleteDoc(doc(db, 'users', userId));
      if (user?.id === userId && auth) {
        const userData = await getUserById(userId); 
        if (userData) {
          await deleteAuthUser(userData.id as unknown as User);
        }
      } else {
        throw new Error("User not found");
      } 
    };

    return (
      <FirebaseContext.Provider
        value={{
          user,
          loading,
          register,
          login,
          logout,
          getUsers,
          getUserById,
          updateUser,
          deleteUser,
        }}
      >
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
