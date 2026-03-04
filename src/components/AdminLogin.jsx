 
import React from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
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

        <div className="flex justify-center mb-10 border-b border-white/10">
           <button className="px-6 py-3 text-[#FF8C00] border-b-2 border-[#FF8C00] font-black text-xs uppercase tracking-widest">Login</button>
           <Link to="/signup" className="px-6 py-3 text-white/30 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">Signup</Link>
        </div>

        <form className="space-y-5">
           <input 
             type="text" 
             placeholder="Username" 
             className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none transition-all placeholder-white/20" 
           />
           <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none transition-all placeholder-white/20" 
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                 </svg>
              </button>
           </div>

           <div className="text-center py-2">
              <button type="button" className="text-white/30 text-[9px] font-bold uppercase tracking-widest hover:text-[#FF8C00] transition-colors">Forgot Password?</button>
           </div>

           <button className="w-full bg-[#FF8C00] text-[#1A1A1A] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF8C00]/20 active:scale-[0.98] transition-all">
              Login as Admin
           </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;