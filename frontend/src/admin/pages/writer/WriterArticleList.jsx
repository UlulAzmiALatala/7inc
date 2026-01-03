import React, { useState, useEffect } from "react";
import { api } from "../../../api/client.js";
import { Link } from "react-router-dom";

const WriterArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get("/api/writer/articles");
            setArticles(res.data.data);
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

        try {
            await api.delete(`/api/writer/articles/${id}`);
            setArticles(articles.filter(a => a.id !== id));
        } catch (err) {
            alert("Gagal menghapus artikel: " + (err.response?.data?.message || "Error"));
        }
    };

    const handleSubmit = async (id) => {
        try {
            await api.post(`/api/writer/articles/${id}/submit`);
            fetchArticles();
        } catch (err) {
            alert("Gagal submit artikel: " + (err.response?.data?.message || "Error"));
        }
    };

    const filteredArticles = filter === "all"
        ? articles
        : articles.filter(a => a.status === filter);

    const getStatusBadge = (status) => {
        const badges = {
            draft: "badge-warning",
            pending: "badge-info",
            published: "badge-success",
            rejected: "badge-error",
        };
        return badges[status] || "badge-ghost";
    };

    if (loading) {
        return <div className="text-white p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Artikel Saya</h1>
                <Link to="/writer/articles/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Buat Artikel Baru
                </Link>
            </div>

            <div className="mb-4 flex gap-2">
                {["all", "draft", "pending", "published", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded ${filter === status ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full text-white">
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => (
                            <tr key={article.id}>
                                <td className="max-w-xs truncate">{article.title}</td>
                                <td>{article.category?.name || "-"}</td>
                                <td>
                                    <span className={`badge ${getStatusBadge(article.status)}`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td>{new Date(article.created_at).toLocaleDateString("id-ID")}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link to={`/writer/articles/${article.id}`} className="btn btn-xs btn-info">
                                            Edit
                                        </Link>
                                        {article.status === "draft" && (
                                            <button
                                                onClick={() => handleSubmit(article.id)}
                                                className="btn btn-xs btn-success"
                                            >
                                                Submit
                                            </button>
                                        )}
                                        {article.status === "draft" && (
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredArticles.length === 0 && (
                <p className="text-center text-gray-400 py-8">Tidak ada artikel</p>
            )}
        </div>
    );
};

export default WriterArticleList;

