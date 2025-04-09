import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import { FirebaseProvider } from "./context/FirebaseContext";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "User Management App",
  description: "A simple user management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <FirebaseProvider>
      <UserProvider>
      <body className={inter.className}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
      </UserProvider>
      </FirebaseProvider>
    </html>
  );
}
