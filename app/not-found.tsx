// app/404.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="mb-6 text-center max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-primary-700 text-white rounded hover:bg-primary-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
