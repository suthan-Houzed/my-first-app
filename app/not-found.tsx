import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Not Found</h1>
      <p className="text-xl text-gray-700 mb-8">
        The resource you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/roles"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Go to Role Management
      </Link>
    </div>
  );
} 