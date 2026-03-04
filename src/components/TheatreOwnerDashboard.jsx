
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TheatreOwnerDashboard = () => {
   const navigate = useNavigate();
   const [theatre, setTheatre] = useState(null);
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(true);
   const [needsTheatre, setNeedsTheatre] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem('ownerToken');
      if (!token) { navigate('/owner/login'); return; }

      const fetchData = async () => {
         try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [dashRes, msgRes] = await Promise.all([
               fetch('http://localhost:5000/api/owner/dashboard', { headers }),
               fetch('http://localhost:5000/api/owner/messages', { headers })
            ]);
            
            if (!dashRes.ok) throw new Error('Unauthorized');
            
            const dashData = await dashRes.json();
            const msgData = msgRes.ok ? await msgRes.json() : [];
            
            setTheatre(dashData.theatre);
            setMessages(msgData);
            
            // If no theatre exists, show a message or redirect
            if (dashData.needsTheatre) {
               setNeedsTheatre(true);
            }
         } catch (err) {
            console.error(err);
            localStorage.removeItem('ownerToken');
            navigate('/owner/login');
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [navigate]);

   const markAsRead = async (msgId) => {
      const token = localStorage.getItem('ownerToken');
      try {
         await fetch(`http://localhost:5000/api/owner/messages/${msgId}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
         });
         setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isRead: true } : m));
      } catch (err) { console.error(err); }
   };

   const handleLogout = () => {
      localStorage.removeItem('ownerToken');
      navigate('/owner/login');
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
            <div className="text-center">
               <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading dashboard...</p>
            </div>
         </div>
      );
   }

   // Show setup screen if no theatre exists
   if (needsTheatre || !theatre) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center font-sans px-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 text-center">
               <div className="w-16 h-16 bg-[#00898F] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00898F]/20">
                  <span className="text-white font-black text-2xl italic">S</span>
               </div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-3">Welcome to Screenema</h1>
               <p className="text-[#00898F] text-[10px] font-black uppercase tracking-[0.3em] mb-6">Theatre Owner Portal</p>
               
               <div className="bg-[#FFF8F0] border border-[#FF8C00]/20 rounded-xl p-4 mb-6">
                  <p className="text-sm font-bold text-gray-700 mb-2">No Theatre Found</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                     You need to create a theatre profile before accessing the dashboard. Let's get your theatre set up!
                  </p>
               </div>
               
               <Link
                  to="/owner/theatre/create"
                  className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#FF8C00]/20 hover:bg-[#E67E00] transition-colors block"
               >
                  Create Your Theatre
               </Link>
               
               <button
                  onClick={handleLogout}
                  className="w-full mt-3 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
               >
                  Logout
               </button>
            </div>
         </div>
      );
   }

   const priorityColors = { high: 'bg-red-500', medium: 'bg-[#FF8C00]', low: 'bg-gray-400' };
   const typeIcons = { warning: '⚠️', alert: '🚨', notification: '🔔', info: 'ℹ️' };

   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
         {/* Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center">
               <div className="w-8 h-8 bg-[#00898F] rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-[#00898F]/20">
                  <span className="text-white font-black italic">S</span>
               </div>
               <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Screenema Manager</h1>
            </div>
            <div className="flex items-center space-x-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-gray-900 uppercase">{theatre?.name || 'Theatre'}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Theatre Owner</p>
               </div>
               <button onClick={handleLogout} className="px-3 py-1.5 bg-red-50 text-red-500 text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-red-100 transition-colors">
                  Logout
               </button>
            </div>
         </header>

         {/* Sub-header */}
         <div className="px-4 py-6 bg-white border-b border-gray-100 mb-6">
            <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase">Theatre Dashboard</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Management Hub</p>
         </div>

         <main className="px-4 space-y-6">
            {/* Quick Actions Grid — compact buttons */}
            <div className="grid grid-cols-2 gap-3">
               {[
                  { label: 'View Theatre Details', to: '/owner/theatre/details', icon: '🏛️' },
                  { label: 'Theatre Analytics', to: '/owner/analytics', icon: '📊' },
                  { label: 'View Available Movies', to: '/owner/movies', icon: '🎬' },
                  { label: 'Add New Movies', to: '/owner/movies/add', icon: '➕' }
               ].map((action) => (
                  <Link
                     key={action.label}
                     to={action.to}
                     className="bg-[#FF8C00] p-4 rounded-2xl shadow-lg shadow-[#FF8C00]/10 flex items-center gap-3 group active:scale-95 transition-all"
                  >
                     <span className="text-xl">{action.icon}</span>
                     <span className="text-white font-black text-[10px] uppercase leading-tight tracking-wider">
                        {action.label}
                     </span>
                  </Link>
               ))}
            </div>

            {/* Admin Messages */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Messages from Admin
               </h3>
               <div className="space-y-3">
                  {messages.length > 0 ? messages.map((msg) => (
                     <div
                        key={msg._id}
                        onClick={() => !msg.isRead && markAsRead(msg._id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${msg.isRead
                              ? 'bg-gray-50 border-gray-100'
                              : 'bg-[#FFF8F0] border-[#FF8C00]/20 shadow-sm'
                           }`}
                     >
                        <div className="flex items-start justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <span className="text-sm">{typeIcons[msg.messageType] || 'ℹ️'}</span>
                              <span className="text-sm font-black text-gray-900">{msg.subject}</span>
                              {!msg.isRead && <span className="w-2 h-2 bg-[#FF8C00] rounded-full"></span>}
                           </div>
                           <span className={`px-2 py-0.5 text-[8px] font-black text-white rounded-full uppercase ${priorityColors[msg.priority] || 'bg-gray-400'}`}>
                              {msg.priority}
                           </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{msg.message}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-2">
                           {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                     </div>
                  )) : (
                     <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No messages</p>
                     </div>
                  )}
               </div>
            </section>
         </main>

         {/* Footer */}
         <footer className="px-6 py-10 bg-[#00666B] mt-10">
            <div className="flex items-center mb-6">
               <span className="text-white font-black text-2xl tracking-tighter italic mr-2">S</span>
               <span className="text-white font-bold text-xl uppercase tracking-widest">Screenema</span>
            </div>
            {/* <div className="grid grid-cols-2 gap-6 mb-8 text-white/60 text-[10px] font-bold uppercase tracking-widest">
               <div className="space-y-3">
                  <p className="text-white mb-2">Support</p>
                  <p>Help Center</p>
                  <p>Contact Details</p>
               </div>
               <div className="space-y-3">
                  <p className="text-white mb-2">Legal</p>
                  <p>Privacy Policy</p>
                  <p>Terms of Use</p>
               </div>
            </div> */}
            <p className="text-white/20 text-[8px] font-bold uppercase tracking-[0.3em] text-center pt-8 border-t border-white/5">
               2026 Screenema Manager • All Rights Reserved
            </p>
         </footer>
      </div>
   );
};

export default TheatreOwnerDashboard;