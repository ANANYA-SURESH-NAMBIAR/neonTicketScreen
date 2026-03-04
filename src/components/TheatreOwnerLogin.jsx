
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TheatreOwnerLogin = () => {
   const navigate = useNavigate();
   const [identifier, setIdentifier] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleLogin = async (e) => {
      e.preventDefault();
      if (!identifier.trim() || !password.trim()) {
         setError('Please fill in all fields');
         return;
      }
      setError('');
      setLoading(true);
      try {
         const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
         });
         const data = await res.json();
         if (!res.ok) throw new Error(data.msg || 'Login failed');
         localStorage.setItem('ownerToken', data.token);
         navigate('/owner/dashboard');
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#F0F5F5] flex flex-col items-center justify-center font-sans px-4">
         <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-10">
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Welcome Owner</h1>
               <p className="text-[#00898F] text-[10px] font-black uppercase tracking-[0.3em]">Screenema Partner Portal</p>
            </div>

            <div className="flex justify-center mb-10 border-b border-gray-100">
               <button className="px-6 py-3 text-[#00898F] border-b-2 border-[#00898F] font-black text-xs uppercase tracking-widest">Login</button>
               <Link to="/signup" className="px-6 py-3 text-gray-300 hover:text-gray-600 transition-colors font-black text-xs uppercase tracking-widest">Signup</Link>
            </div>

            {error && (
               <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center">
                  {error}
               </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Username or Email</label>
                  <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all" />
               </div>

               <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all" />
               </div>

               <div className="text-center py-2">
                  <button type="button" className="text-gray-400 text-[9px] font-bold uppercase tracking-widest hover:text-[#00898F]">Forgot Credentials?</button>
               </div>

               <button type="submit" disabled={loading} className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50">
                  {loading ? 'Logging in...' : 'Enter Dashboard'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default TheatreOwnerLogin;