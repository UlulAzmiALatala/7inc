import React, { useState, useEffect } from "react";
import { api } from "../api/client.js";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [role, setRole] = useState("writer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (token && userRole) {
            if (userRole === "admin") navigate("/admin");
            else if (userRole === "writer") navigate("/writer");
            else navigate("/");
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password !== passwordConfirmation) {
            setError("Password dan konfirmasi password tidak sama");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/api/auth/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role,
            });

            if (res.data.success) {
                setSuccess("Registrasi berhasil! Silakan login.");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            let msg = "Terjadi kesalahan saat registrasi";
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                msg = Object.values(errors)[0][0];
            } else if (err.response?.data?.message) {
                msg = err.response.data.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-[24px] font-bold mb-4 text-center text-white">Register</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

                <form className="space-y-3" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-white text-sm mb-1">Nama</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded border border-gray-300 text-black"
                            placeholder="Nama lengkap"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 rounded border border-gray-300 text-black"
                            placeholder="mail@site.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Role</label>
                        <select
                            className="w-full p-2 rounded border border-gray-300 text-black"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="writer">Writer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded border border-gray-300 text-black"
                            placeholder="Minimal 8 karakter"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded border border-gray-300 text-black"
                            placeholder="Ulangi password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-white text-white font-semibold py-2 rounded transition hover:bg-black hover:border-black hover:text-white cursor-pointer"
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">
                    Sudah punya akun? <a href="/login" className="text-blue-400 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterAdmin;

