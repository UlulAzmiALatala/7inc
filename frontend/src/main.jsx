import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
// import "cally"; // Uncomment jika digunakan

// --- ADMIN DASHBOARD ---
import AdminApp from "./admin/AdminApp.jsx";

// --- ADMIN PAGES ---
import AdminTentangKamiFull from "./admin/pages/TentangKamiFull.jsx";
import AdminBisnisKamiFull from "./admin/pages/BisnisKamiFull.jsx";
import AdminKontakFull from "./admin/pages/KontakFull.jsx";
import AdminLowonganKerja from "./admin/pages/LowonganKerja.jsx";
import AdminLowonganKerjaFull from "./admin/pages/LowonganKerjaFull.jsx";
import AdminSyaratLoker from "./admin/pages/SyaratLoker.jsx";
import AdminIsiBerita from "./admin/pages/IsiBerita.jsx";

// --- ADMIN SETTINGS & HOME EDITORS ---
import AdminProfil from "./admin/settings/Profil.jsx";
import AdminDashboard from "./admin/home/EditNavbar.jsx";
import AdminEditTentangKami from "./admin/home/EditTentangKami.jsx";
import AdminEditLowonganKerja from "./admin/home/EditLowonganKerja.jsx";
import AdminEditBisnisKami from "./admin/home/EditBisnisKami.jsx";
import AdminLink from "./admin/home/EditLink.jsx";
import AdminEditHeroSection from "./admin/home/EditHeroSection.jsx";

// --- MODULE BARU (REFACTORED - Feature First) ---
import AdminJobPositionsIndex from "./admin/pages/job-positions/Index.jsx";
import AdminNewsIndex from "./admin/pages/news/Index.jsx";

// --- NEW ADMIN MODULES (GENERATED) ---
import AdminArticleList from "./admin/pages/articles/Index.jsx";
import AdminTaskList from "./admin/pages/tasks/Index.jsx";
import AdminVacancyApplicants from "./admin/pages/vacancies/Applicants.jsx";
import AdminVacancyContent from "./admin/pages/vacancies/Content.jsx";
import AdminVacancyTerms from "./admin/pages/vacancies/Terms.jsx";

// [PERBAIKAN] Mengarah ke folder 'internship/Index.jsx' (Dashboard Modal), BUKAN 'Internship.jsx' (File Lama)
import AdminInternshipIndex from "./admin/pages/internship/Index.jsx";

// --- USER (PUBLIC) PAGES ---
import App from "./App.jsx";
import TentangKamiFull from "./pages/TentangKamiFull.jsx";
import BisnisKamiFull from "./pages/BisnisKamiFull.jsx";
import Internship from "./pages/Internship.jsx"; // Halaman Publik (Landing Page User)
import LowonganKerja from "./pages/LowonganKerja.jsx";
import LowonganKerjaFull from "./pages/LowonganKerjaFull.jsx";
import KontakFull from "./pages/KontakFull.jsx";
import Berita from "./pages/Berita.jsx";
import SyaratLoker from "./pages/SyaratLoker.jsx";
import IsiBerita from "./pages/IsiBerita.jsx";

// --- AUTH & SECURITY ---
import LoginUnified from "./masuk/LoginUnified.jsx";
import RegisterUnified from "./masuk/RegisterUnified.jsx";
import Logout from "./masuk/Logout.jsx";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin.jsx";
import WriterDashboard from "./writer/WriterDashboard.jsx";

// --- PLUGINS ---
import "remixicon/fonts/remixicon.css";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "./api/setupAxios";

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* =========================================
            1. ROUTE PUBLIC (USER / CUSTOMER)
           ========================================= */}
        <Route path="/" element={<App />} />
        <Route path="/tentang-kami" element={<TentangKamiFull />} />
        <Route path="/bisnis-kami" element={<BisnisKamiFull />} />
        <Route path="/internship" element={<Internship />} />
        <Route path="/lowongan-kerja" element={<LowonganKerja />} />
        <Route path="/lowongan-full" element={<LowonganKerjaFull />} />
        <Route path="/kontak" element={<KontakFull />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/isi-berita" element={<IsiBerita />} />
        <Route path="/syarat-loker" element={<SyaratLoker />} />

        {/* =========================================
            2. ROUTE LOGIN & REGISTER (UNIFIED)
           ========================================= */}
        <Route path="/login" element={<LoginUnified />} />
        <Route path="/admin/login" element={<LoginUnified />} />
        <Route path="/register" element={<RegisterUnified />} />
        <Route path="/logout" element={<Logout />} />

        {/* =========================================
            3. ROUTE ADMIN (PROTECTED)
           ========================================= */}

        {/* Writer Dashboard */}
        <Route
          path="/writer"
          element={
            <ProtectedRouteAdmin allowedRoles={["writer"]}>
              <WriterDashboard />
            </ProtectedRouteAdmin>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminApp />
            </ProtectedRouteAdmin>
          }
        />

        {/* --- NEW ADMIN ROUTES (WORKFLOW) --- */}
        <Route
          path="/admin/articles"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminArticleList />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminTaskList />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/internships"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminInternshipIndex />
            </ProtectedRouteAdmin>
          }
        />
        
        {/* Module Vacancies (New Structure) */}
        <Route
          path="/admin/vacancies/applicants"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminVacancyApplicants />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/vacancies/content"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminVacancyContent />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/vacancies/positions"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminJobPositionsIndex />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/vacancies/terms"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminVacancyTerms /> 
            </ProtectedRouteAdmin>
          }
        />

        {/* Module Berita */}
        <Route
          path="/admin/berita"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminNewsIndex />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-berita"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminNewsIndex />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/news/:slug"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminIsiBerita />
            </ProtectedRouteAdmin>
          }
        />

        {/* Module Lowongan Kerja */}
        <Route
          path="/admin/lowongan-kerja"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminLowonganKerja />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/lowongan-full"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminLowonganKerjaFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/syarat-loker"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminSyaratLoker />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-loker"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminEditLowonganKerja />
            </ProtectedRouteAdmin>
          }
        />

        {/* Module Posisi Pekerjaan */}
        <Route
          path="/admin/edit-posisi-pekerjaan"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminJobPositionsIndex />
            </ProtectedRouteAdmin>
          }
        />

        {/* Module Internship (PERBAIKAN) */}
        {/* Menggunakan AdminInternshipIndex yang baru */}
        <Route
          path="/admin/internship"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminInternshipIndex />
            </ProtectedRouteAdmin>
          }
        />
        {/* Route edit lama kita arahkan ke index baru juga agar aman */}
        <Route
          path="/admin/edit-internship"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminInternshipIndex />
            </ProtectedRouteAdmin>
          }
        />

        {/* --- SETTINGS (SUPER ADMIN) --- */}
        <Route
          path="/admin/profil"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminProfil />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/tentang-kami"
          element={
            <ProtectedRouteAdmin allowedRoles={["admin"]}>
              <AdminTentangKamiFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-info"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminEditTentangKami />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/bisnis-kami"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminBisnisKamiFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-bisnis-kami"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminEditBisnisKami />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/kontak"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminKontakFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminDashboard />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-appearance"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminEditHeroSection />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-link"
          element={
            <ProtectedRouteAdmin allowedRoles={["super_admin"]}>
              <AdminLink />
            </ProtectedRouteAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
