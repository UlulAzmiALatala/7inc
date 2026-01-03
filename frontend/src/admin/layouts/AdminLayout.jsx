import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import Sidebar from "../components/Sidebar.jsx";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      
      // Redirect to login
      navigate("/login", { replace: true });
    }
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "Admin";
    if (role === "writer") return "Writer";
    return role;
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform translate-x-0">
        <Sidebar />
      </div>

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ml-64">
        <header
          className={`sticky top-0 z-30 flex items-center justify-between w-full px-6 py-4 bg-white/80 backdrop-blur-md transition-all duration-200 ${scrolled ? "shadow-sm" : ""}`}
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-poppins">
              {user?.role === "writer" ? "Writer Panel" : "Admin Dashboard"}
            </h2>
            <p className="text-xs text-gray-500">
              Selamat Datang, <span className="font-semibold text-blue-600">{user?.name || "User"}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${user?.role === "admin" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-blue-100 text-blue-700 border border-blue-200"}`}>
              {getRoleLabel(user?.role)}
            </div>

            <div className="h-8 w-[1px] bg-gray-300 mx-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200"
              title="Keluar dari Aplikasi"
            >
              <i className="ri-logout-box-r-line text-lg"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="w-full px-6 py-8 mx-auto">
          <div className="min-h-[80vh]">
            {children}
          </div>

          <footer className="mt-10 text-center text-xs text-gray-400 pb-4">
            &copy; {new Date().getFullYear()} Seven INC. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

