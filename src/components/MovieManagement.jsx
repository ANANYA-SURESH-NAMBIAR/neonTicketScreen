
import React, { useState, useEffect } from 'react';

const MovieManagement = () => {
   const [movies, setMovies] = useState([]);

   useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/movies`)
         .then(res => res.json())
         .then(data => setMovies(data))
         .catch(console.error);
   }, []);
   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
            <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Manage Movies</h1>
         </header>

         <main className="px-4 py-8 space-y-8">
            {/* Admin Movie Selection */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Select from Admin List</h3>
               <div className="relative mb-6">
                  <input type="text" placeholder="Search movies..." className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 outline-none border border-transparent focus:border-gray-200" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                     <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
               </div>

               <div className="space-y-4">
                  {movies.map(movie => (
                     <div key={movie._id} className="flex items-center p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer">
                        <div
                           className="w-12 h-16 bg-stone-200 rounded-lg mr-4 bg-cover bg-center"
                           style={{ backgroundImage: `url(${movie.poster_url})` }}
                        ></div>
                        <div className="flex-1">
                           <h4 className="font-bold text-gray-900 text-sm">{movie.title}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{movie.duration}m • {movie.genre}</p>
                        </div>
                        <button className="text-[#FF8C00] font-black text-[10px] uppercase">Select</button>
                     </div>
                  ))}
               </div>
            </section>

            {/* Setup Schedule Placeholder */}
            <section className="bg-stone-900 p-8 rounded-[2.5rem] shadow-2xl text-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#FF8C00]">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
               </div>
               <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Schedule Movies</h3>
               <p className="text-white/40 text-xs mb-8">Select a movie first to begin scheduling showtimes for your theatre.</p>
               <button className="w-full bg-white/10 text-white/30 py-4 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed">
                  Configure Times
               </button>
            </section>
         </main>
      </div>
   );
};

export default MovieManagement;