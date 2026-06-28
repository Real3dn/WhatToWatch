import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-red-600 tracking-wider">404</h1>
      <h2 className="text-2xl font-bold mt-4 mb-2">Lost in Space?</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Let's get you back to the home screen.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md transition duration-200"
      >
        Go Home
      </Link>
    </div>
  );
}
