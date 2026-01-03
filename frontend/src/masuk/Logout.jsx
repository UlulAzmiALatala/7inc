import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService2';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error (non-critical):', error);
        // Tetap lanjut dengan logout meski server error
      } finally {
        // Redirect ke home
        navigate('/', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logout...</p>
      </div>
    </div>
  );
}
