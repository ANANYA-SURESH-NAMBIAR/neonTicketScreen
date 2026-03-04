import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setSuccess('');

    if (!formData.email || !formData.username || !formData.password) {
      setError('Please fill in email, username and password.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'User',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Sign up failed');
      }

      setSuccess('Successfully signed up! You can go back to login.');
      setFormData({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
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
        <div className="flex items-center mb-8">
          <button
            type="button"
            className="mr-4 text-[#F2C58B]/80 hover:text-white"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome</h1>
        </div>

        <div className="flex justify-center mb-10 border-b border-[#5A4B2C]">
          <Link
            to="/login"
            className="px-8 py-3 text-[#D1B38A] hover:text-white transition-colors font-semibold text-lg"
          >
            LOGIN
          </Link>
          <button className="px-8 py-3 text-white border-b-2 border-[#FF8C00] font-semibold text-lg">
            SIGNUP
          </button>
        </div>

        <form className="space-y-5 max-w-md mx-auto" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/80"
              aria-label="Full Name"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/80"
              aria-label="Email"
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/80"
              aria-label="Username"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/80"
              aria-label="Password"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat the password"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/80"
              aria-label="Repeat password"
            />
          </div>

          {error && (
            <p className="text-center text-red-300 text-sm">
              {error}
            </p>
          )}

          {success && (
            <div className="text-center text-sm space-y-2">
              <p className="text-green-300 font-semibold">
                {success}
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="underline text-[#F2C58B] hover:text-white"
              >
                Go back to Login
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] hover:bg-[#E67E00] disabled:bg-[#e0a45c] disabled:cursor-not-allowed text-[#3D321A] font-bold py-3 rounded-full transition-all shadow-lg active:scale-95 text-lg uppercase tracking-wider mt-4"
          >
            {loading ? 'SIGNING UP...' : 'CONFIRM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;