 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
   const [formData, setFormData] = useState({
      identifier: '',
      password: ''
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
         const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg || 'Login failed');
         }

         // Check if user is admin
         if (data.token) {
            // Store token
            localStorage.setItem('adminToken', data.token);
            
            // Navigate to admin dashboard
            navigate('/admin/dashboard');
         }
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#E5EEEE] flex flex-col items-center justify-center font-sans px-4">
         {/* Decorative Film Strip Background Component */}
         <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-10 w-40 h-[200%] border-x-8 border-dashed border-gray-400 -rotate-12"></div>
            <div className="absolute top-0 right-10 w-40 h-[200%] border-x-8 border-dashed border-gray-400 -rotate-12"></div>
         </div>

         <div className="w-full max-w-sm bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl p-8 relative z-10 border border-white/5">
            <div className="text-center mb-10">
               <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Admin</h1>
               <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Screenema Central Control</p>
            </div>

            {error && (
               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 text-xs font-bold">{error}</p>
               </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
               <input 
                  type="text" 
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Username or Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none transition-all placeholder-white/20" 
                  required
               />
               <div className="relative">
                  <input 
                     type="password" 
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     placeholder="Password" 
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none transition-all placeholder-white/20" 
                     required
                  />
               </div>

               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#FF8C00] text-[#1A1A1A] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF8C00]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? 'Logging in...' : 'Login as Admin'}
               </button>
            </form>

            <div className="mt-6 text-center">
               <Link to="/owner/login" className="text-white/30 text-[9px] font-bold uppercase tracking-widest hover:text-[#FF8C00] transition-colors">
                  Theatre Owner Login
               </Link>
            </div>
         </div>
      </div>
   );
};

export default AdminLogin;