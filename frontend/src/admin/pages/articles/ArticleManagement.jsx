import React, { useState, useEffect } from "react";
import { api } from "../../../api/client.js";

const ArticleManagement = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchArticles();
    }, [activeTab]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            let endpoint = "/api/admin/articles/pending";
            if (activeTab === "published") endpoint = "/api/admin/articles/published";
            else if (activeTab === "rejected") endpoint = "/api/admin/articles/rejected";
            else if (activeTab === "drafts") endpoint = "/api/admin/articles/drafts";
            else if (activeTab === "all") endpoint = "/api/admin/articles";

            const res = await api.get(endpoint);
            setArticles(res.data.data);

            if (activeTab === "pending") {
                setPendingCount(res.data.count || 0);
            }
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (article) => {
        try {
            await api.post(`/api/admin/articles/${article.id}/approve`, {
                is_hero: false,
                is_featured: false,
                display_order: 0,
            });
            setShowModal(false);
            setSelectedArticle(null);
            fetchArticles();
        } catch (err) {
            alert("Gagal approve artikel: " + (err.response?.data?.message || "Error"));
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert("Alasan penolakan wajib diisi");
            return;
        }

        try {
            await api.post(`/api/admin/articles/${selectedArticle.id}/reject`, {
                rejection_reason: rejectReason,
            });
            setShowModal(false);
            setSelectedArticle(null);
            setRejectReason("");
            fetchArticles();
        } catch (err) {
            alert("Gagal reject artikel: " + (err.response?.data?.message || "Error"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

        try {
            await api.delete(`/api/admin/articles/${id}`);
            fetchArticles();
        } catch (err) {
            alert("Gagal menghapus artikel: " + (err.response?.data?.message || "Error"));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: "badge-warning",
            pending: "badge-info",
            published: "badge-success",
            rejected: "badge-error",
        };
        return badges[status] || "badge-ghost";
    };

    const tabs = [
        { id: "pending", label: "Pending Approval", count: pendingCount },
        { id: "published", label: "Published" },
        { id: "rejected", label: "Rejected" },
        { id: "drafts", label: "Drafts" },
        { id: "all", label: "Semua" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Kelola Berita</h1>

            <div className="tabs tabs-boxed bg-gray-800 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 badge badge-primary">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full text-white">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td className="max-w-xs truncate">{article.title}</td>
                                    <td>{article.author?.name || article.author_id}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(article.status)}`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td>
                                        {article.published_at
                                            ? new Date(article.published_at).toLocaleDateString("id-ID")
                                            : new Date(article.created_at).toLocaleDateString("id-ID")}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {article.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(article)}
                                                        className="btn btn-xs btn-success"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedArticle(article);
                                                            setShowModal(true);
                                                        }}
                                                        className="btn btn-xs btn-error"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="btn btn-xs btn-ghost text-red-400"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {articles.length === 0 && !loading && (
                <p className="text-center text-gray-400 py-8">Tidak ada artikel</p>
            )}

            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Tolak Artikel</h3>
                        <p className="mb-4">Alasan penolakan:</p>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Jelaskan mengapa artikel ditolak..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                        />
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                Batal
                            </button>
                            <button className="btn btn-error" onClick={handleReject}>
                                Tolak
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
                </div>
            )}
        </div>
    );
};

export default ArticleManagement;

