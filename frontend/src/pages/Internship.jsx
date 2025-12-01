import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import Container from "../components/Container";

// Base URL API
const API_BASE = "http://127.0.0.1:8000/api";

// Konstanta slider
const AUTO_MS = 5000;
const CARD_W = 302;
const CARD_GAP = 52;
const VISIBLE = 2;

const Internship = () => {
  // --- STATE DATA ---
  const [hero, setHero] = useState(null);
  const [coreValues, setCoreValues] = useState({ header: {}, cards: [] });
  const [terms, setTerms] = useState({ header: {}, items: [] });
  const [formation, setFormation] = useState({ header: {}, cards: [] });
  const [facilities, setFacilities] = useState({ header: {}, items: [] });

  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch semua data secara paralel agar lebih cepat
        const [heroRes, coreRes, termsRes, formRes, facRes] = await Promise.all(
          [
            axios.get(`${API_BASE}/internship/hero`),
            axios.get(`${API_BASE}/internship/core-values`),
            axios.get(`${API_BASE}/internship/terms`),
            axios.get(`${API_BASE}/internship/formations`),
            axios.get(`${API_BASE}/internship/facilities`),
          ]
        );

        if (heroRes.data.status) setHero(heroRes.data.data);
        if (coreRes.data.status) setCoreValues(coreRes.data.data);
        if (termsRes.data.status) setTerms(termsRes.data.data);
        if (formRes.data.status) setFormation(formRes.data.data);
        if (facRes.data.status) setFacilities(facRes.data.data);
      } catch (error) {
        console.error("Gagal memuat data internship:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- SLIDER LOGIC (Core Values) ---
  const [startIndex, setStartIndex] = useState(0);
  const coreCards = coreValues.cards || []; // Fallback array kosong
  const isFirst = startIndex === 0;
  const isLast = startIndex + VISIBLE >= coreCards.length;

  // auto-slide + pause
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || coreCards.length === 0) return;
    const id = setInterval(() => {
      setStartIndex((prev) =>
        prev + VISIBLE >= coreCards.length ? 0 : prev + 1
      );
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, coreCards.length]);

  // prev/next
  const onPrev = () => {
    if (!isFirst) setStartIndex((p) => p - 1);
  };
  const onNext = () => {
    if (!isLast) setStartIndex((p) => p + 1);
  };

  // drag/swipe
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef(null);
  const SWIPE_THRESHOLD = 60;

  const onPointerDown = (e) => {
    setPaused(true);
    setIsDragging(true);
    startXRef.current = e.clientX ?? (e.touches && e.touches[0]?.clientX);
  };
  const onPointerMove = (e) => {
    if (!isDragging || startXRef.current == null) return;
    const currentX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (currentX == null) return;
    setDragX(currentX - startXRef.current);
  };
  const endDrag = () => {
    if (!isDragging) return;
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      if (dragX < 0 && !isLast) setStartIndex((p) => p + 1);
      if (dragX > 0 && !isFirst) setStartIndex((p) => p - 1);
    }
    setIsDragging(false);
    setDragX(0);
    setPaused(false);
    startXRef.current = null;
  };

  // posisi track
  const baseTranslate = -(startIndex * (CARD_W + CARD_GAP));
  const trackTranslate = isDragging ? baseTranslate + dragX : baseTranslate;

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center bg-white">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white text-gray-800 pt-[130px] pb-24">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="w-full md:w-[58%]">
              <h3 className="text-[20px] tracking-[0.46em] uppercase text-gray-700 mb-3 font-regular">
                {hero?.subtitle || "INTERNSHIP"}
              </h3>
              <h1 className="text-[36px] md:text-[40px] font-bold text-gray-900 leading-snug mb-4 whitespace-pre-line">
                {hero?.title || "Temukan Kesempatan, Bangun Masa Depan."}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <img
                src={hero?.image_url || "/assets/img/Internship.png"}
                alt="Hero Internship"
                className="max-w-[679px] h-[453px] w-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Core Value Section */}
          <div className="mt-[74px] flex flex-col md:flex-row justify-between gap-10">
            {/* Kiri: Header Core Values */}
            <div className="md:w-1/2 flex flex-col justify-center mt-10">
              <h2 className="uppercase tracking-[0.45em] text-gray-600 text-[20px] mb-3">
                {coreValues.header?.core_title || "CORE VALUE PERUSAHAAN"}
              </h2>
              <h3 className="text-[32px] font-bold text-gray-900 mb-4 leading-snug whitespace-pre-line">
                {coreValues.header?.core_headline ||
                  "Prinsip Utama yang Menjadi Dasar Tumbuh Bersama"}
              </h3>
              <p className="text-gray-600 text-[16px] mb-5 leading-relaxed whitespace-pre-line">
                {coreValues.header?.core_paragraph}
              </p>

              <div className="flex items-center gap-12">
                <button
                  onClick={onPrev}
                  disabled={isFirst}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  className={`w-14 h-14 rounded-full border border-red-500 transition cursor-pointer flex items-center justify-center ${
                    isFirst ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <i className="ri-arrow-left-s-line text-red-500 text-[60px] relative right-[1px]"></i>
                </button>
                <button
                  onClick={onNext}
                  disabled={isLast}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  className={`w-14 h-14 rounded-full border border-red-500 transition cursor-pointer flex items-center justify-center ${
                    isLast ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <i className="ri-arrow-right-s-line text-red-500 text-[60px] relative left-[2px]"></i>
                </button>
              </div>
            </div>

            {/* Kanan: Slider Viewport + Track */}
            <div
              className="md:w-[50%] w-full ml-auto select-none pr-[660px]" // padding-right trik agar card terakhir terlihat sebagian
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => !isDragging && setPaused(false)}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={endDrag}
              style={{ touchAction: "pan-y" }}
            >
              <div
                className="overflow-hidden"
                style={{
                  width: `${VISIBLE * CARD_W + (VISIBLE - 1) * CARD_GAP}px`,
                  marginLeft: "auto",
                }}
              >
                <div
                  className="flex items-start"
                  style={{
                    gap: `${CARD_GAP}px`,
                    transform: `translateX(${trackTranslate}px)`,
                    transition: isDragging ? "none" : "transform 500ms ease",
                    willChange: "transform",
                  }}
                >
                  {coreCards.map((card, index) => (
                    <div
                      key={card.id || index}
                      className="group border border-gray-300 rounded-xl shadow hover:shadow-md transition text-center flex-none bg-white"
                      style={{ width: `${CARD_W}px`, height: "555px" }}
                    >
                      <div className="flex flex-col items-center h-full pt-14">
                        <div className="w-[143px] h-[143px] rounded-full border border-gray-100 bg-gray-100 group-hover:bg-red-600 transition duration-300 flex items-center justify-center mb-[30px] overflow-hidden">
                          <img
                            src={card.image_url}
                            alt={`Icon ${card.title}`}
                            className={`object-contain ${
                              card.style_type === 2
                                ? "w-[90px] h-[90px] ml-[13px]"
                                : "w-[100px] h-[100px] mt-2"
                            } group-hover:invert`}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <h4
                          className="font-semibold text-gray-950 mb-[31px]"
                          style={{ fontSize: "20px" }}
                        >
                          {card.title}
                        </h4>
                        <p
                          className="text-gray-600 leading-relaxed px-6"
                          style={{
                            width: "300px",
                            fontSize: "16px",
                            lineHeight: "30px",
                          }}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Syarat & Ketentuan Section */}
          <div className="mt-[74px] flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2 flex flex-col justify-center mt-8">
              <h2 className="uppercase tracking-[0.45em] text-gray-600 text-[20px] mb-3">
                {terms.header?.subtitle || "SYARAT & KETENTUAN"}
              </h2>
              <h3 className="text-[32px] font-bold text-gray-900 leading-snug whitespace-pre-line">
                {terms.header?.headline ||
                  "Persiapkan Dirimu, Tumbuh Bersama Kami."}
              </h3>
            </div>

            <div className="md:w-[55%]">
              <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-[16px] leading-relaxed w-full">
                {(terms.items || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Formasi Section */}
          <div className="mt-[74px] text-center max-w-[900px] mx-auto">
            <h2 className="tracking-[0.6em] uppercase text-gray-600 text-[20px] mb-3">
              {formation.header?.subtitle || "FORMASI INTERNSHIP"}
            </h2>
            <h3 className="text-[32px] font-bold text-gray-900 mb-4 whitespace-pre-line">
              {formation.header?.headline}
            </h3>
          </div>
          <p className="text-gray-600 text-[16px] leading-relaxed text-center whitespace-pre-line">
            {formation.header?.paragraph}
          </p>

          {/* Grid 18 posisi */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {(formation.cards || []).map((item, index) => (
              <div
                key={item.id || index}
                className="h-[137px] flex flex-col items-center justify-center bg-white rounded-lg shadow border border-gray-200 w-full group transition-all duration-300 hover:bg-red-500"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-10 h-10 mb-2 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                ) : (
                  <div className="w-10 h-10 mb-2 flex items-center justify-center text-gray-300 transition-all duration-300 group-hover:text-white">
                    <i className="ri-image-line text-2xl"></i>
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-800 text-center px-2 transition-all duration-300 group-hover:text-white line-clamp-2">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* Fasilitas Section */}
          <div className="mt-[74px] flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2 flex flex-col justify-center mt-8">
              <h2 className="uppercase tracking-[0.45em] text-gray-600 text-[20px] mb-3">
                {facilities.header?.subtitle || "FASILITAS"}
              </h2>
              <h3 className="text-[32px] font-bold text-gray-900 leading-snug whitespace-pre-line">
                {facilities.header?.headline}
              </h3>
            </div>

            <div className="md:w-[55%]">
              <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-[16px] leading-relaxed w-full">
                {(facilities.items || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>

      {/* Banner Section (Statis karena tidak ada di API controller yang diupload) */}
      <Container>
        <div className="relative h-[360px] mt-[64px] mb-[64px]">
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 left-0 h-full w-[810px] bg-[#D43026] z-0" />
            <img
              src="/assets/img/Chevron.png"
              alt="Chevron Arrows"
              className="absolute right-0 top-0 translate-x-[40px] w-[670px] h-full object-cover z-10"
              draggable={false}
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-once="true"
            />
            <div className="absolute top-1/2 left-[100px] -translate-y-1/2 z-20 text-white">
              <p
                className="uppercase tracking-[0.4em] text-[20px] font-medium mb-4"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Bergabunglah Sekarang
              </p>
              <h2
                className="text-white font-bold text-[20px] md:text-[32px] mb-6"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                Kesempatan Berkembang
                <br />
                Bersama Seven INC.
              </h2>
              <button
                className="relative overflow-hidden group rounded-4xl font-medium tracking-[0.05em] text-[20px] w-[220px] h-[60px] bg-white text-black transition-all duration-300 cursor-pointer border border-transparent"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <span className="absolute inset-0 bg-[#D43026] rounded-4xl translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-400 ease-in-out z-0" />
                <span className="relative z-10 flex items-center justify-center h-full w-full group-hover:text-white transition-colors duration-300">
                  Daftar Sekarang
                </span>
              </button>
            </div>
          </div>

          <img
            src="/assets/img/Hero2.png"
            alt="Business Person"
            className="absolute right-[49px] bottom-10 w-[440px] z-20"
            draggable={false}
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-once="true"
          />
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

export default Internship;
