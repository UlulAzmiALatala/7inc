import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import Container from "../components/Container";

const API_BASE = "http://127.0.0.1:8000/api";

const Berita = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [newsList, setNewsList] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- EFFECT: Handle URL State & Fetch Data ---
  useEffect(() => {
    // Cek jika ada state page dari navigasi sebelumnya (misal tombol 'back')
    if (location.state?.page) {
      setCurrentPage(location.state.page);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch News dengan Pagination (per_page=9 agar pas grid 3x3)
        const res = await axios.get(
          `${API_BASE}/news?page=${currentPage}&per_page=9`
        );

        if (res.data.status) {
          const { featured: featData, list, meta } = res.data.data;

          // Set Featured News (Berita Utama di Header)
          // Jika di page 1, ambil dari API. Jika page > 1, pertahankan featured yang sudah ada (opsional)
          if (currentPage === 1 && featData) {
            setFeatured(featData);
          }

          setNewsList(list);
          setTotalPages(meta.last_page);
        }
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Scroll ke atas setiap ganti halaman
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // --- HANDLER ---
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Update URL state agar saat di-refresh/back tetap di halaman yang sama (opsional)
      navigate(".", { state: { page } });
    }
  };

  const goToDetail = (newsItem) => {
    // Navigasi ke detail berita dengan Slug
    navigate(`/news/${newsItem.slug}`);
  };

  // --- FORMAT DATE HELPER ---
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <Layout>
      <div className="bg-white text-gray-800">
        {/* Hero Section (Static Banner) */}
        <div className="relative w-full max-w-[1440px] h-[510px] mx-auto">
          <img
            src="/assets/img/Banner3.png"
            alt="Header Berita"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />{" "}
          {/* Overlay sedikit gelap */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
            <h3 className="uppercase tracking-[0.5em] text-[18px] mb-4 font-light">
              List Berita
            </h3>
            <h1 className="font-bold text-[36px] md:text-[40px] leading-snug drop-shadow-md">
              Berita & Artikel Terbaru
            </h1>
          </div>
        </div>

        <Container>
          <div className="relative z-10 pb-24">
            {/* LOADING STATE */}
            {loading && (
              <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
              </div>
            )}

            {/* CONTENT (Jika tidak loading) */}
            {!loading && (
              <>
                {/* 1. FEATURED NEWS (Berita Utama - Paling Baru) */}
                {/* Tampilkan hanya di halaman 1 agar eksklusif */}
                {currentPage === 1 && featured && (
                  <div className="mt-[-130px] flex justify-center mb-20 animate__animated animate__fadeInUp">
                    <div
                      className="w-full max-w-[1266px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row group cursor-pointer"
                      onClick={() => goToDetail(featured)}
                    >
                      {/* Image Featured */}
                      <div className="md:w-[480px] h-[320px] overflow-hidden">
                        <img
                          src={featured.cover_url || "/assets/img/news.png"}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Content Featured */}
                      <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">
                            TERBARU
                          </span>
                          <span className="text-gray-400 text-sm">
                            {formatDate(featured.published_at)}
                          </span>
                        </div>

                        <h2 className="text-gray-900 font-bold text-2xl md:text-3xl leading-snug mb-4 group-hover:text-red-600 transition-colors line-clamp-3">
                          {featured.title}
                        </h2>

                        <p className="text-gray-500 mb-6 line-clamp-2">
                          {featured.excerpt ||
                            "Baca selengkapnya untuk mengetahui informasi terbaru dari Seven Inc..."}
                        </p>

                        <button className="flex items-center gap-2 text-red-500 font-semibold group/btn w-fit">
                          <span className="group-hover/btn:underline">
                            Baca Selengkapnya
                          </span>
                          <i className="ri-arrow-right-line transition-transform group-hover/btn:translate-x-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Jika tidak ada featured (misal data kosong), beri spacer */}
                {currentPage === 1 && !featured && (
                  <div className="mt-20"></div>
                )}

                {/* Jika Halaman > 1, beri margin atas karena tidak ada featured card yang menimpa banner */}
                {currentPage > 1 && <div className="mt-20"></div>}

                {/* 2. NEWS LIST GRID */}
                {newsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {newsList.map((news) => (
                      <div
                        key={news.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer border border-gray-100"
                        onClick={() => goToDetail(news)}
                      >
                        {/* Card Image */}
                        <div className="h-[240px] overflow-hidden relative">
                          <img
                            src={news.cover_url || "/assets/img/news.png"}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                            {formatDate(news.published_at)}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                            {news.excerpt ||
                              "Klik untuk membaca selengkapnya..."}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <i className="ri-user-line"></i>{" "}
                              {news.author || "Admin"}
                            </span>
                            <span className="text-red-500 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read More <i className="ri-arrow-right-line"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                      <i className="ri-newspaper-line text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">
                      Belum ada berita
                    </h3>
                    <p className="text-gray-500">
                      Nantikan update terbaru dari kami.
                    </p>
                  </div>
                )}

                {/* 3. PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16">
                    <div className="join shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="join-item btn btn-md bg-white border-none hover:bg-gray-50 text-gray-600"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="ri-arrow-left-s-line text-lg"></i>
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`join-item btn btn-md border-none ${
                              currentPage === page
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        className="join-item btn btn-md bg-white border-none hover:bg-gray-50 text-gray-600"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="ri-arrow-right-s-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </Layout>
  );
};

export default Berita;
