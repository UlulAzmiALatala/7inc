import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/client.js";

const DashboardIndex = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingArticles: 0,
    publishedArticles: 0,
    rejectedArticles: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch pending articles
      const pendingRes = await api.get("/api/admin/articles/review/pending");
      const pendingData = pendingRes.data;
      
      // Fetch published articles
      const publishedRes = await api.get("/api/admin/articles?status=published");
      const publishedData = publishedRes.data;

      // Fetch rejected articles  
      const rejectedRes = await api.get("/api/admin/articles?status=rejected");
      const rejectedData = rejectedRes.data;

      setStats({
        totalArticles: (pendingData.articles?.length || 0) + (publishedData.articles?.length || 0) + (rejectedData.articles?.length || 0),
        pendingArticles: pendingData.articles?.length || 0,
        publishedArticles: publishedData.articles?.length || 0,
        rejectedArticles: rejectedData.articles?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Articles */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Artikel</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalArticles}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Articles */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.pendingArticles}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Published Articles */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Dipublikasikan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.publishedArticles}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Rejected Articles */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ditolak</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.rejectedArticles}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/articles")}
            className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <i className="ri-eye-line mr-2"></i>
            Review Artikel
          </button>
          <button
            onClick={() => navigate("/admin/articles")}
            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <i className="ri-edit-line mr-2"></i>
            Kelola Artikel
          </button>
          <button
            onClick={() => navigate("/admin/articles")}
            className="inline-flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <i className="ri-newspaper-line mr-2"></i>
            Kelola Berita
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-900">Sistem siap digunakan</p>
              <p className="text-xs text-gray-600">Selamat datang di dashboard admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
