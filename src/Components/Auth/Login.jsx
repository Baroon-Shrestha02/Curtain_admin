import React, { useState } from "react";
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
      });

      if (user?.role === "admin") {
        navigate("/", { replace: true });
      } else {
        setError("This account does not have admin access.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* ── Mobile background image (only shows below lg) ── */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614590302821-3d96b26788ec?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80 opacity-70" />
      </div>

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
        {/* Background image — swap src with your own image path */}
        <img
          src="https://images.unsplash.com/photo-1614590302821-3d96b26788ec?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark red overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-70" />

        {/* Top: logo */}
        <div className="relative z-10 p-10">
          <div className="w-48 h-14 overflow-hidden rounded-lg bg-white">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Center: headline */}
        <div className="relative z-10 px-10 pb-4">
          <p className="text-[#5D1126] text-sm font-medium tracking-widest uppercase mb-4">
            <span className="bg-white p-2 rounded-md">Admin Portal</span>
          </p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-6">
            Manage your system with
            <br />
            confidence.
          </h1>
          <p className="text-red-100 text-sm leading-relaxed max-w-xs opacity-80">
            Secure, role-based access to your dashboard, orders, and settings —
            all in one place.
          </p>
        </div>

        {/* Bottom: trust badges */}
        <div className="relative z-10 p-10 flex items-center gap-6">
          <div className="flex items-center gap-2 text-red-100 text-xs">
            <ShieldCheck className="w-4 h-4" />
            SSL Encrypted
          </div>
          <div className="w-px h-4 bg-white opacity-20" />
          <div className="flex items-center gap-1.5 text-red-100 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            System Online
          </div>
          <div className="w-px h-4 bg-white opacity-20" />
          <span className="text-red-200 text-xs opacity-60">v1.0.4</span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10 lg:bg-white">
        {/* Card wrapper — solid white card on mobile, plain on desktop */}
        <div className="w-full max-w-sm relative z-10 bg-white rounded-2xl shadow-xl p-8 lg:bg-transparent lg:rounded-none lg:shadow-none lg:p-0">
          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-40 h-12 overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-gray-900 text-2xl font-bold mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to your admin account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@cozycurtain.com"
                  className="w-full pl-10 pr-4 h-11 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D1126] focus:border-transparent disabled:opacity-50 transition-all"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 h-11 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D1126] focus:border-transparent disabled:opacity-50 transition-all"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 mt-2 inline-flex items-center justify-center rounded-lg text-sm font-semibold text-white bg-[#5D1126] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Mobile footer */}
          <div className="lg:hidden mt-8 flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              System Online
            </div>
            <div>SSL Secure</div>
            <span>v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
