import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function WriterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    published: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userRole = localStorage.getItem('role');

    if (userRole !== 'writer') {
      navigate('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate loading stats from API
    setTimeout(() => {
      setStats({
        total: 5,
        draft: 1,
        pending: 1,
        published: 3,
        rejected: 0,
      });
      setLoading(false);
    }, 500);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">7Inc</h1>
            <p className="text-sm text-gray-600">Dashboard Penulis</p>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Writer'}</p>
                <p className="text-xs text-gray-600">Writer</p>
              </div>
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <div className="p-4 border-b">
                  <p className="text-sm font-semibold text-gray-900">{user?.email || 'user@example.com'}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/writer');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/writer/articles');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Artikel Saya
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/writer/articles/create');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Buat Artikel Baru
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Do nothing, just close menu
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                >
                  Pengaturan
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t font-semibold"
                >
                  Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Penulis
          </h1>
          <p className="text-gray-600 mt-2">
            Selamat datang, {user?.name || 'Writer'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Artikel"
            value={stats.total}
            color="bg-blue-500"
          />
          <StatCard
            label="Draft"
            value={stats.draft}
            color="bg-gray-500"
          />
          <StatCard
            label="Menunggu Persetujuan"
            value={stats.pending}
            color="bg-yellow-500"
          />
          <StatCard
            label="Dipublikasikan"
            value={stats.published}
            color="bg-green-500"
          />
          <StatCard
            label="Ditolak"
            value={stats.rejected}
            color="bg-red-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ActionCard
            title="Buat Artikel Baru"
            description="Mulai menulis artikel baru dalam format draft"
            buttonText="Buat Artikel"
            onClick={() => navigate('/writer/articles/create')}
            color="bg-blue-600"
          />
          <ActionCard
            title="Kelola Artikel"
            description="Lihat, edit, dan kelola semua artikel Anda"
            buttonText="Kelola Artikel"
            onClick={() => navigate('/writer/articles')}
            color="bg-indigo-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            <ActivityItem
              action="Artikel disetujui"
              title="Tips Karir 2025"
              time="2 hari lalu"
              status="approved"
            />
            <ActivityItem
              action="Artikel dibuat"
              title="Tech Trends 2026"
              time="5 hari lalu"
              status="draft"
            />
            <ActivityItem
              action="Artikel ditolak"
              title="Marketing Strategy"
              time="1 minggu lalu"
              status="rejected"
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-2">
            Cara Kerja Workflow Artikel
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Buat artikel baru (status: Draft)</li>
            <li>Edit artikel sesuai kebutuhan</li>
            <li>Submit artikel untuk persetujuan admin (status: Pending)</li>
            <li>Tunggu admin review dan approval</li>
            <li>Jika disetujui, artikel akan dipublikasikan</li>
            <li>Jika ditolak, Anda bisa edit ulang dan submit lagi</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Komponen Card untuk Stats
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-white font-bold text-xl">{value}</span>
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

// Komponen Card untuk Action
function ActionCard({ title, description, buttonText, onClick, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button
        onClick={onClick}
        className={`${color} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition`}
      >
        {buttonText}
      </button>
    </div>
  );
}

// Komponen untuk Activity Item
function ActivityItem({ action, title, time, status }) {
  const statusColor = {
    approved: 'text-green-600 bg-green-50',
    draft: 'text-gray-600 bg-gray-50',
    rejected: 'text-red-600 bg-red-50',
    pending: 'text-yellow-600 bg-yellow-50',
  };

  return (
    <div className="flex items-start justify-between pb-4 border-b last:border-b-0">
      <div>
        <p className="text-gray-900 font-medium">{action}</p>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[status] || 'text-gray-600 bg-gray-50'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}
