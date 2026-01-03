import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HSStaticMethods } from "preline";
import PreLoader from "../components/PreLoader";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRouteAdmin from "../components/ProtectedRouteAdmin";

// Admin Pages
import DashboardIndex from "./pages/dashboard/Index";
import NewsIndex from "./pages/news/Index";
import InternshipIndex from "./pages/internship/Index";
import LowonganKerjaIndex from "./pages/LowonganKerja";
import JobPositionsIndex from "./pages/job-positions/Index";
import ApplicantsIndex from "./pages/job-positions/ApplicantsIndex";
import ArticleList from "./pages/articles/Index";
import TaskList from "./pages/tasks/Index";
import EditLowonganKerja from "./home/EditLowonganKerja";
import SyaratLoker from "./pages/SyaratLoker";
import EditNavbar from "./home/EditNavbar";
import EditHeroSection from "./home/EditHeroSection";
import EditLink from "./home/EditLink";
import EditTentangKami from "./home/EditTentangKami";
import EditBisnisKami from "./home/EditBisnisKami";
import KontakFull from "./pages/KontakFull";
import Profil from "./settings/Profil";

function AdminApp() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        import("preline/preline");
    }, []);

    useEffect(() => {
        setTimeout(() => {
            HSStaticMethods.autoInit();
        }, 100);
    }, [loading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#111827]">
                <PreLoader />
            </div>
        );
    }

    // Admin section jadi hanya untuk admin routes
    return <AdminRoutes />;
}

function AdminRoutes() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <DashboardIndex />
                    </ProtectedRouteAdmin>
                } />

                {/* Kelola Berita (Artikel Writer) */}
                <Route path="/articles" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <ArticleList />
                    </ProtectedRouteAdmin>
                } />

                {/* Berita & Artikel (Admin Tasks) */}
                <Route path="/tasks" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <TaskList />
                    </ProtectedRouteAdmin>
                } />

                <Route path="/internships" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <InternshipIndex />
                    </ProtectedRouteAdmin>
                } />

                {/* Lowongan Kerja Group */}
                <Route path="/vacancies/content" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditLowonganKerja />
                    </ProtectedRouteAdmin>
                } />

                <Route path="/vacancies/positions" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <JobPositionsIndex />
                    </ProtectedRouteAdmin>
                } />

                <Route path="/vacancies/terms" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <SyaratLoker />
                    </ProtectedRouteAdmin>
                } />

                <Route path="/vacancies/applicants" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <ApplicantsIndex />
                    </ProtectedRouteAdmin>
                } />

                {/* Configuration Routes */}
                <Route path="/edit-navbar" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditNavbar />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/edit-hero" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditHeroSection />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/edit-socials" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditLink />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/edit-about" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditTentangKami />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/edit-business" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <EditBisnisKami />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/edit-contact" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <KontakFull />
                    </ProtectedRouteAdmin>
                } />
                <Route path="/profile" element={
                    <ProtectedRouteAdmin allowedRoles={["admin"]}>
                        <Profil />
                    </ProtectedRouteAdmin>
                } />

                {/* Legacy Routes (Redirect or Keep for compatibility) */}
                <Route path="/berita" element={<Navigate to="/articles" replace />} />
                <Route path="/kelola-berita" element={<Navigate to="/articles" replace />} />

                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
}

export default AdminApp;

