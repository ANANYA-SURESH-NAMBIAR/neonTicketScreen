 
import React from 'react';

const MovieListingSetup = () => {
  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Add New Movie</h1>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
           </svg>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white px-4 border-b border-gray-100 flex space-x-6 overflow-x-auto scrollbar-hide sticky top-[73px] z-40">
        {['Rankings', 'Graphs', 'Add Movie', 'Theatres'].map((item, idx) => (
          <button 
            key={item}
            className={`py-4 text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-all ${
              idx === 2 ? 'text-[#FF8C00] border-[#FF8C00]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="px-4 py-8 space-y-10">
         {/* Basic Info Card */}
         <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-2 border-l-4 border-[#FF8C00] pl-4">General Information</h3>
            
            <div>
               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Movie Title</label>
               <input type="text" placeholder="Enter movie name" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Duration</label>
                  <input type="text" placeholder="e.g. 2h 30m" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none" />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Rating</label>
                  <input type="text" placeholder="PG-13, R, etc." className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none" />
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">About the Movie</label>
               <textarea placeholder="Enter a brief synopsis..." className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none h-32" />
            </div>
         </section>

         {/* Media Assets */}
         <section className="bg-stone-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 border-l-4 border-[#FF8C00] pl-4">Media Assets</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="aspect-[4/5] bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-[#FF8C00]">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload Poster</span>
                  <span className="text-[8px] text-white/30 mt-1">Recommended: 2000 x 3000px</span>
               </div>

               <div className="aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-[#FF8C00]">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                     </svg>
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload Trailer</span>
                  <span className="text-[8px] text-white/30 mt-1">Video format: MP4, MOV</span>
               </div>
            </div>
         </section>

         {/* Cast & Crew Section (Simplified) */}
         <section className="bg-white p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest border-l-4 border-[#FF8C00] pl-4">Cast & Crew</h3>
               <button className="text-[#FF8C00] text-xs font-black uppercase tracking-widest">Add Member</button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
               {[1, 2, 3].map(i => (
                  <div key={i} className="flex-shrink-0 w-24">
                     <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 border-2 border-gray-50"></div>
                     <input type="text" placeholder="Name" className="w-full text-[9px] font-black text-center bg-transparent border-none outline-none uppercase placeholder-gray-300" />
                     <input type="text" placeholder="Role" className="w-full text-[8px] font-bold text-center bg-transparent border-none outline-none text-[#FF8C00] placeholder-[#FFD8A8]" />
                  </div>
               ))}
            </div>
         </section>

         <button className="w-full bg-[#FF8C00] text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#FF8C00]/30 active:scale-[0.98] transition-all">
            Publish Movie listing
         </button>
      </main>
    </div>
  );
};

export default MovieListingSetup;