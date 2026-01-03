import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api/client.js";

const WriterArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        featured_image: "",
        category_id: "",
        status: "draft",
    });

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchArticle();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/categories");
            setCategories(res.data.data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/writer/articles/${id}`);
            const article = res.data.data;
            setFormData({
                title: article.title,
                content: article.content,
                excerpt: article.excerpt || "",
                featured_image: article.featured_image || "",
                category_id: article.category_id || "",
                status: article.status,
            });
        } catch (err) {
            alert("Gagal memuat artikel");
            navigate("/writer/articles");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (submitStatus = null) => {
        const data = {
            ...formData,
            status: submitStatus || formData.status,
        };

        try {
            setSaving(true);
            if (isEdit) {
                await api.put(`/api/writer/articles/${id}`, data);
            } else {
                await api.post("/api/writer/articles", data);
            }
            navigate("/writer/articles");
        } catch (err) {
            const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0] || "Error";
            alert("Gagal menyimpan artikel: " + msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-white">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">
                {isEdit ? "Edit Artikel" : "Buat Artikel Baru"}
            </h1>

            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="space-y-4">
                    <div>
                        <label className="block text-white mb-2">Judul</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="Judul artikel"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Kategori</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="Ringkasan artikel (max 500 karakter)"
                            maxLength={500}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Gambar Utama (URL)</label>
                        <input
                            type="url"
                            name="featured_image"
                            value={formData.featured_image}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Konten</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="Konten artikel..."
                            rows={10}
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => handleSubmit("draft")}
                            disabled={saving}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
                        >
                            {saving ? "Menyimpan..." : "Simpan Draft"}
                        </button>

                        {formData.status === "draft" && (
                            <button
                                onClick={() => handleSubmit("pending")}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                            >
                                Submit untuk Review
                            </button>
                        )}

                        <button
                            onClick={() => navigate("/writer/articles")}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriterArticleForm;

