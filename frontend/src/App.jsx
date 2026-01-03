import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { HSStaticMethods } from "preline";

import PreLoader from "./components/PreLoader";
import LandingContent from "./components/LandingContent";
import LoginUnified from "./masuk/LoginUnified";
import Register from "./masuk/Register";
import Logout from "./masuk/Logout";
import AdminApp from "./admin/AdminApp";
import WriterDashboard from "./writer/WriterDashboard";

// Protected route untuk roles tertentu
function ProtectedRoute({ children, allowedRoles }) {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect ke dashboard sesuai role yang tersimpan
        if (role === "admin") return <Navigate to="/admin" replace />;
        if (role === "writer") return <Navigate to="/writer" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
}

// Route untuk auth pages (login/register) - auto redirect jika sudah login
function AuthRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
        // Jika sudah login, redirect ke dashboard sesuai role
        if (role === "admin") return <Navigate to="/admin" replace state={{ from: location }} />;
        if (role === "writer") return <Navigate to="/writer" replace state={{ from: location }} />;
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}

function AppRoutes() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Simulate loading time
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Initialize Preline components
    useEffect(() => {
        import("preline/preline");
    }, []);

    useEffect(() => {
        setTimeout(() => {
            HSStaticMethods.autoInit();
        }, 100);
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1E222A]">
                <PreLoader />
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingContent />} />

            {/* Auth Routes */}
            <Route path="/login" element={
                <AuthRoute>
                    <LoginUnified />
                </AuthRoute>
            } />

            <Route path="/register" element={
                <AuthRoute>
                    <Register />
                </AuthRoute>
            } />

            <Route path="/logout" element={<Logout />} />

            {/* Writer Routes */}
            <Route path="/writer" element={
                <ProtectedRoute allowedRoles={["writer"]}>
                    <WriterDashboard />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminApp />
                </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return <AppRoutes />;
}

export default App;

