'use client';

import { FirebaseProvider } from './context/FirebaseContext';
import { UserProvider } from './context/UserContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </FirebaseProvider>
  );
}