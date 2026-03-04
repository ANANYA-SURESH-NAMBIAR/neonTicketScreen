 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/home');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans px-4 py-12 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, #FFC94A 0, #FF8C00 35%, #F97316 70%, #EA580C 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(#FFB347 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 w-full max-w-xl bg-[#3A260F]/90 rounded-[28px] shadow-2xl px-10 py-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 tracking-tight">
          Screenema
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Welcomes You!
        </p>

        <div className="flex justify-center mb-10 border-b border-[#5A4B2C]">
          <button className="px-8 py-3 text-white border-b-2 border-[#FF8C00] font-semibold text-lg">
            LOGIN
          </button>
          <Link
            to="/signup"
            className="px-8 py-3 text-[#D1B38A] hover:text-white transition-colors font-semibold text-lg"
          >
            SIGNUP
          </Link>
        </div>

        <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/70"
              aria-label="Email or Username"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/70"
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F2C58B]/80 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                // Eye with slash (hide)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.41 0 2.754-.27 3.98-.777M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L9 9m6 6l2.25 2.25M9 9a3 3 0 014.243 4.243M9 9l6 6"
                  />
                </svg>
              ) : (
                // Regular eye (show)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-300 text-sm">
              {error}
            </p>
          )}

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-[#F2C58B] hover:text-white text-sm transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] hover:bg-[#E67E00] disabled:bg-[#e0a45c] disabled:cursor-not-allowed text-[#3D321A] font-bold py-3 rounded-full transition-all shadow-lg active:scale-95 text-lg uppercase tracking-wider"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;