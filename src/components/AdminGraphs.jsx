 
import React from 'react';

const AdminGraphs = () => {
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
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Data Visualizations</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FFE8CC] flex items-center justify-center">
           <span className="text-[#FF8C00] font-black text-xs">AD</span>
        </div>
      </header>

      {/* Top Navigation */}
      <nav className="bg-white px-4 border-b border-gray-100 flex space-x-6 overflow-x-auto scrollbar-hide sticky top-[73px] z-40">
        {['Rankings', 'Graphs', 'Add Movie', 'Theatres'].map((item, idx) => (
          <button 
            key={item}
            className={`py-4 text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-all ${
              idx === 1 ? 'text-[#FF8C00] border-[#FF8C00]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="px-4 py-8 space-y-8">
        {/* Revenue Over Time Chart Placeholder */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Revenue Trends</h3>
              <select className="bg-gray-50 border-none rounded-lg text-[10px] font-black uppercase px-2 py-1 outline-none text-[#FF8C00]">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           
           <div className="aspect-[16/9] w-full bg-[#F5F8F8] rounded-2xl flex items-end justify-between px-4 pb-4">
              {[40, 65, 45, 90, 55, 75, 60].map((h, i) => (
                 <div key={i} className="w-6 bg-[#FF8C00] rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       ${(h * 150).toLocaleString()}
                    </div>
                 </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 px-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                 <span key={d} className="text-[10px] font-black text-gray-300">{d}</span>
              ))}
           </div>
        </section>

        {/* Occupancy Ratios Placeholder */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm">
           <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Occupancy Ratios</h3>
           <div className="flex justify-center py-4">
              <div className="w-48 h-48 rounded-full border-[12px] border-gray-100 relative flex items-center justify-center">
                 <div className="absolute inset-0 border-[12px] border-[#00898F] rounded-full border-t-transparent border-l-transparent -rotate-45"></div>
                 <div className="text-center">
                    <span className="text-3xl font-black text-gray-900">74%</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sold Out</p>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center">
                 <div className="w-3 h-3 bg-[#00898F] rounded-sm mr-2"></div>
                 <span className="text-xs font-bold text-gray-600">Reserved Seats</span>
              </div>
              <div className="flex items-center">
                 <div className="w-3 h-3 bg-gray-100 rounded-sm mr-2"></div>
                 <span className="text-xs font-bold text-gray-600">Available Seats</span>
              </div>
           </div>
        </section>

        {/* Refreshment Expenses vs Revenue */}
        <section className="bg-[#1A1A1A] p-8 rounded-[3rem] shadow-2xl">
           <h3 className="text-xl font-black text-white tracking-tighter mb-2">Ancillary Revenue</h3>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">F&B Performance Metrics</p>
           
           <div className="space-y-6">
              {[
                { label: 'Popcorn & Snacks', val: 65 },
                { label: 'Beverages', val: 85 },
                { label: 'Combos', val: 40 }
              ].map(item => (
                <div key={item.label}>
                   <div className="flex justify-between text-white text-[10px] font-black uppercase mb-2">
                      <span>{item.label}</span>
                      <span>{item.val}% Target</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF8C00] rounded-full" style={{ width: `${item.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
};

export default AdminGraphs;