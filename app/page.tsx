import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mt-8 mb-6">Welcome to User Management System</h1>
      <p className="text-xl mb-8">Manage users and their roles efficiently</p>
      
      <div className="flex justify-center space-x-4">
        <Link 
          href="/roles" 
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Role Management
        </Link>
      </div>
    </div>
  );
}
