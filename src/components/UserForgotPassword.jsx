import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!email.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
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
          Forgot Password
        </p>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-center">
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl text-center">
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}

        {/* Password Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F2C58B] mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/70"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F2C58B] mb-2 ml-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/70"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F2C58B] mb-2 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full bg-transparent border border-[#F2C58B] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] placeholder-[#F2C58B]/70"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] text-white py-4 rounded-full font-bold text-lg uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center border-t border-[#5A4B2C] pt-6">
          <Link
            to="/login"
            className="text-[#F2C58B] hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserForgotPassword;
