 
import React from 'react';

const TheatreOwnerGraphs = () => {
  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter uppercase">Theatre Graphs</h1>
        <div className="w-10 h-10 rounded-full bg-[#E5EEEE] flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00898F]">
             <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
           </svg>
        </div>
      </header>

      {/* Simplified Top Nav */}
      <nav className="bg-white px-4 border-b border-gray-100 flex space-x-8 sticky top-[73px] z-40">
        <button className="py-4 text-xs font-black uppercase tracking-widest text-gray-400 border-b-2 border-transparent">Rankings</button>
        <button className="py-4 text-xs font-black uppercase tracking-widest text-[#00898F] border-b-2 border-[#00898F]">Graphs</button>
      </nav>

      <main className="px-4 py-8 space-y-8">
        {/* Performance Graph Card */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm">
           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Weekly Occupancy</h3>
           <div className="aspect-video bg-gray-50 rounded-2xl flex items-end justify-between px-6 pb-4">
              {[30, 45, 80, 55, 90, 100, 75].map((val, i) => (
                 <div key={i} className="w-4 bg-[#00898F] rounded-t-full" style={{ height: `${val}%` }}></div>
              ))}
           </div>
           <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-gray-300">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}
           </div>
        </section>

        {/* Revenue Distribution */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm">
           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 text-center">Revenue Source</h3>
           <div className="flex justify-center mb-8">
              <div className="w-40 h-40 rounded-full border-[15px] border-[#FF8C00] relative">
                 <div className="absolute inset-0 border-[15px] border-[#00898F] rounded-full border-t-transparent border-l-transparent"></div>
              </div>
           </div>
           <div className="flex justify-around">
              <div className="text-center">
                 <div className="w-3 h-3 bg-[#00898F] rounded-full mx-auto mb-2"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase">Tickets (65%)</span>
              </div>
              <div className="text-center">
                 <div className="w-3 h-3 bg-[#FF8C00] rounded-full mx-auto mb-2"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase">F&B (35%)</span>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default TheatreOwnerGraphs;