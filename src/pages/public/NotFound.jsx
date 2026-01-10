import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Page Not Found" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
