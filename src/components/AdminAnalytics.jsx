 
import React from 'react';
import { Link } from 'react-router-dom';

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-10">
      {/* Admin Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#FF8C00] rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-[#FF8C00]/20">
               <span className="text-white font-black italic">S</span>
            </div>
            <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Screenema Admin</h1>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Analytics Dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
           <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
           <div className="w-10 h-10 rounded-full bg-[#FFE8CC] border border-[#FFD8A8] flex items-center justify-center">
              <span className="text-[#FF8C00] font-black text-xs">AD</span>
           </div>
        </div>
      </header>

      {/* Top Navigation Bar */}
      <nav className="bg-white px-4 border-b border-gray-100 flex space-x-6 overflow-x-auto scrollbar-hide sticky top-[73px] z-40">
        {['Rankings', 'Graphs', 'Add Movie', 'Theatres'].map((item, idx) => (
          <button 
            key={item}
            className={`py-4 text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-all ${
              idx === 0 ? 'text-[#FF8C00] border-[#FF8C00]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Today's Revenue", value: "$42,500", trend: "+12.5%", color: "text-emerald-500" },
            { label: "Today's Profits", value: "$12,800", trend: "+5.2%", color: "text-emerald-500" },
            { label: "Avg Ratings", value: "4.8", trend: "-0.2%", color: "text-rose-500" }
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{kpi.value}</h3>
               </div>
               <div className={`px-3 py-1 rounded-full text-[10px] font-black bg-opacity-10 ${kpi.color.replace('text', 'bg')} ${kpi.color}`}>
                  {kpi.trend}
               </div>
            </div>
          ))}
        </div>

        {/* Top Movies List */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-gray-900 tracking-tighter">Today's Top Movies</h4>
              <button className="text-[#FF8C00] text-xs font-black uppercase tracking-widest">View All</button>
           </div>
           
           <div className="space-y-6">
              {[
                { name: 'Cosmic Drift', revenue: '$12,450', occupancy: '88%', genre: 'Sci-Fi • 2h 15m' },
                { name: 'Midnight Pulse', revenue: '$9,820', occupancy: '72%', genre: 'Thriller • 1h 45m' }
              ].map((movie) => (
                <div key={movie.name} className="flex items-center">
                   <div className="w-12 h-16 bg-gray-100 rounded-xl mr-4 flex-shrink-0"></div>
                   <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-sm">{movie.name}</h5>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{movie.genre}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">{movie.revenue}</p>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                         <div className="h-full bg-[#FF8C00]" style={{ width: movie.occupancy }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Alerts & Feedback */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-gray-900 tracking-tighter">Alerts & Feedback</h4>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-black">3 NEW</span>
           </div>
           
           <div className="space-y-4">
              {[
                { type: 'Critical', title: 'AC System Failure', msg: 'Screen 4 at Metro Cineplex reporting temperature issues.', time: '10m ago' },
                { type: 'Warning', title: 'Negative Review', msg: '"Restrooms were not clean during the interval." - Theatre ID #24', time: '2h ago' }
              ].map((alert, idx) => (
                <div key={idx} className={`pl-4 border-l-4 ${alert.type === 'Critical' ? 'border-red-500' : 'border-amber-400'}`}>
                   <div className="flex justify-between items-center mb-1">
                      <h5 className="font-bold text-gray-900 text-xs">{alert.title}</h5>
                      <span className="text-[9px] font-bold text-gray-400">{alert.time}</span>
                   </div>
                   <p className="text-[11px] text-gray-500 italic leading-tight">{alert.msg}</p>
                </div>
              ))}
           </div>
           
           <button className="w-full border-2 border-[#FFD8A8] text-[#FF8C00] py-3 rounded-xl font-black uppercase tracking-widest text-[10px] mt-8 hover:bg-[#FFF4E6] transition-colors">
              Resolve All Alerts
           </button>
        </section>
      </main>
    </div>
  );
};

export default AdminAnalytics;