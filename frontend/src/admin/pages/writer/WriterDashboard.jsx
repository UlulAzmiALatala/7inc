import React, { useState, useEffect } from "react";
import { api } from "../../../api/client.js";

const WriterDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        draft: 0,
        pending: 0,
        published: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/api/writer/articles");
            const articles = res.data.data;

            setStats({
                total: articles.length,
                draft: articles.filter(a => a.status === 'draft').length,
                pending: articles.filter(a => a.status === 'pending').length,
                published: articles.filter(a => a.status === 'published').length,
                rejected: articles.filter(a => a.status === 'rejected').length,
            });
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Writer Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Artikel</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Draft</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.draft}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Pending Approval</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.pending}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Published</p>
                    <p className="text-3xl font-bold text-green-400">{stats.published}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Rejected</p>
                    <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
                </div>
            </div>

            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <a href="/writer/articles/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Buat Artikel Baru
                    </a>
                    <a href="/writer/articles" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Kelola Artikel
                    </a>
                </div>
            </div>
        </div>
    );
};

export default WriterDashboard;

