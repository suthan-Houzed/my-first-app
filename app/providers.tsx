import { ClerkProvider ,ClerkLoading,ClerkLoaded } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClerkLoading>
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-t-transparent border-solid rounded-full animate-spin border-blue-500 border-8"></div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
} 