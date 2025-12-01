import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import Container from "../components/Container";

const API_BASE = "http://127.0.0.1:8000/api";

const IsiBerita = () => {
  const { slug } = useParams(); // Ambil slug dari URL: /news/:slug
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil halaman sebelumnya untuk tombol "Kembali"
  const prevPage = location.state?.page || 1;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Jika slug ada, fetch detailnya
        // (Pastikan route di main.jsx adalah /news/:slug yang mengarah ke komponen ini)
        // Jika route Anda masih /isi-berita tanpa parameter, kita butuh penyesuaian.
        // Asumsi: Anda akan mengubah route menjadi /news/:slug

        // Fallback: Jika diakses lewat state (klik dari list) tanpa slug di URL (cara lama)
        if (!slug && location.state?.newsData) {
          setNews(location.state.newsData);
          setLoading(false);
          return;
        }

        if (!slug) {
          throw new Error("Artikel tidak ditemukan (Slug missing).");
        }

        const res = await axios.get(`${API_BASE}/news/${slug}`);
        if (res.data.status) {
          setNews(res.data.data);
        } else {
          throw new Error("Berita tidak ditemukan.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat berita.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug, location.state]);

  // --- FORMATTER ---
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoString));
  };

  // --- RENDER ---
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center bg-white pt-[100px]">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>
      </Layout>
    );
  }

  if (error || !news) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-white pt-[100px] text-center px-4">
          <div className="text-6xl mb-4 text-gray-300">
            <i className="ri-file-warning-line"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "Berita yang Anda cari tidak ditemukan."}
          </p>
          <button
            onClick={() => navigate("/berita")}
            className="btn btn-outline btn-error"
          >
            Kembali ke Berita
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white text-gray-800 pt-[130px] pb-20">
        <Container>
          {/* Header: Judul & Tanggal */}
          <div className="max-w-[1000px] mx-auto text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {news.author || "News"}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <i className="ri-calendar-line"></i>{" "}
                {formatDate(news.published_at)}
              </span>
            </div>

            <h1 className="text-gray-900 font-bold leading-tight text-[28px] md:text-[40px] mb-6">
              {news.title}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="w-full max-w-[1000px] aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative">
              {news.cover_url ? (
                <img
                  src={news.cover_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="ri-image-line text-6xl"></i>
                </div>
              )}
            </div>
          </div>

          {/* Content Body */}
          <article className="max-w-[800px] mx-auto">
            {/* Excerpt / Lead Paragraph */}
            {news.excerpt && (
              <div className="text-lg md:text-xl font-medium text-gray-600 mb-8 leading-relaxed border-l-4 border-red-500 pl-4 italic">
                {news.excerpt}
              </div>
            )}

            {/* Main Body (Whitespace Pre-Line untuk menjaga paragraf) */}
            <div className="prose prose-lg prose-red max-w-none text-gray-800 leading-loose text-justify whitespace-pre-line">
              {news.body}
            </div>

            {/* Author Info / Footer Artikel */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <i className="ri-user-fill"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Ditulis Oleh
                  </p>
                  <p className="font-bold text-gray-900">
                    {news.author || "Admin Redaksi"}
                  </p>
                </div>
              </div>

              {/* Share Button (Opsional) */}
              <button
                className="btn btn-circle btn-ghost text-gray-400 hover:text-blue-600"
                title="Bagikan"
              >
                <i className="ri-share-forward-line text-xl"></i>
              </button>
            </div>
          </article>

          {/* Navigation Back */}
          <div className="mt-16 max-w-[800px] mx-auto">
            <button
              onClick={() => navigate("/berita", { state: { page: prevPage } })}
              className="group flex items-center gap-3 text-gray-500 hover:text-red-600 transition-colors px-4 py-3 rounded-lg hover:bg-red-50 w-fit"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-200 flex items-center justify-center transition-colors">
                <i className="ri-arrow-left-line group-hover:text-red-700"></i>
              </div>
              <span className="font-medium text-lg">
                Kembali ke Daftar Berita
              </span>
            </button>
          </div>
        </Container>
      </div>
      <Footer />
    </Layout>
  );
};

export default IsiBerita;
