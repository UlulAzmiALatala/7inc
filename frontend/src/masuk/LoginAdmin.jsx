import React, { useState, useEffect } from "react";
import { api } from "../api/client.js";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role) {
            if (role === "admin") navigate("/admin");
            else if (role === "writer") navigate("/writer");
            else navigate("/");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                setSuccess("Login berhasil!");

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("userData", JSON.stringify(res.data.user));

                setTimeout(() => {
                    const role = res.data.user.role;
                    if (role === "admin") navigate("/admin");
                    else if (role === "writer") navigate("/writer");
                    else navigate("/");
                }, 1000);
            }
        } catch (err) {
            const msg = err.response?.data?.message ||
                        err.response?.data?.errors?.email?.[0] ||
                        "Terjadi kesalahan saat login";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="p-6 rounded-lg shadow-lg w-[350px]">
                <h2 className="text-[24px] font-bold mb-4 text-center text-white">Login</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

                <form className="space-y-3" onSubmit={handleLogin}>
                    <div>
                        <label className="input validator mb-1">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                type="email"
                                placeholder="mail@site.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="input validator mb-1">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-white text-white font-semibold py-2 rounded transition hover:bg-black hover:border-black hover:text-white cursor-pointer"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">
                    Belum punya akun? <a href="/register" className="text-blue-400 hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginAdmin;

