import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TheatreOwnerSignup = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleSignup = async (e) => {
      e.preventDefault();
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
         setError('Please fill in all fields');
         return;
      }
      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }
      if (password.length < 6) {
         setError('Password must be at least 6 characters');
         return;
      }
      setError('');
      setLoading(true);
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
               email, 
               password, 
               role: 'TheatreOwner',
               username: email.split('@')[0] // Use email prefix as username
            })
         });
         const data = await res.json();
         if (!res.ok) throw new Error(data.msg || 'Signup failed');
         // Auto login after successful signup
         const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email, password })
         });
         const loginData = await loginRes.json();
         if (!loginRes.ok) throw new Error(loginData.msg || 'Auto login failed');
         localStorage.setItem('ownerToken', loginData.token);
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
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Join Screenema</h1>
               <p className="text-[#00898F] text-[10px] font-black uppercase tracking-[0.3em]">Theatre Owner Portal</p>
            </div>

            <div className="flex justify-center mb-10 border-b border-gray-100">
               <Link to="/owner/login" className="px-6 py-3 text-gray-300 hover:text-gray-600 transition-colors font-black text-xs uppercase tracking-widest">Login</Link>
               <button className="px-6 py-3 text-[#00898F] border-b-2 border-[#00898F] font-black text-xs uppercase tracking-widest">Signup</button>
            </div>

            {error && (
               <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center">
                  {error}
               </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
               <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                     type="email" 
                     value={email} 
                     onChange={e => setEmail(e.target.value)} 
                     className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all" 
                     placeholder="owner@theatre.com"
                     required
                  />
               </div>

               <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                     <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all pr-12" 
                        placeholder="••••••••"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                     >
                        {showPassword ? (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                           </svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                        )}
                     </button>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                     <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all pr-12" 
                        placeholder="••••••••"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                     >
                        {showConfirmPassword ? (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                           </svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                        )}
                     </button>
                  </div>
               </div>

               <button type="submit" disabled={loading} className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50">
                  {loading ? 'Creating Account...' : 'Create Account'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default TheatreOwnerSignup;
