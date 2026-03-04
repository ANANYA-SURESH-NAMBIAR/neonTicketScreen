
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const MovieDetailsLoggedOut = () => {
   const { movieId } = useParams();
   const [movie, setMovie] = useState(null);

   useEffect(() => {
      fetch(`http://localhost:5000/api/movie/${movieId}`)
         .then(res => res.json())
         .then(data => setMovie(data))
         .catch(console.error);
   }, [movieId]);

   if (!movie) return <div className="min-h-screen bg-white font-sans flex items-center justify-center">Loading...</div>;

   return (
      <div className="min-h-screen bg-white font-sans pb-20">
         {/* Header */}
         <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-50">
            <div className="flex items-center">
               <span className="text-[#FF8C00] font-black text-2xl mr-2 italic">S</span>
               <h1 className="text-xl font-bold tracking-tight">Screenema</h1>
            </div>
            <Link to="/login" className="text-[#FF8C00] font-bold text-sm">Login</Link>
         </header>

         {/* Main Content */}
         <main>
            {/* Movie Hero Section */}
            <div className="px-4 py-8">
               <div className="flex flex-col md:flex-row gap-8">
                  <div
                     className="w-full md:w-72 aspect-[2/3] bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden group bg-cover bg-center"
                     style={{ backgroundImage: `url(${movie.poster_url})` }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                     {movie.trailer_url && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <a href={movie.trailer_url} target="_blank" rel="noreferrer" className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40 cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                              </svg>
                           </a>
                        </div>
                     )}
                  </div>

                  <div className="flex-1 py-4">
                     <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tighter">{movie.title}</h2>

                     <div className="flex items-center mb-8">
                        <div className="flex text-[#FFB800] mr-3">
                           {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
                        </div>
                        <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">9.2 / 10</span>
                     </div>

                     <div className="space-y-4 mb-10">
                        <div className="flex items-center text-sm">
                           <span className="w-24 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Duration</span>
                           <span className="text-gray-900 font-bold italic">{movie.duration}m</span>
                        </div>
                        <div className="flex items-center text-sm">
                           <span className="w-24 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Genre</span>
                           <span className="text-gray-900 font-bold">{movie.genre}</span>
                        </div>
                        <div className="flex items-center text-sm">
                           <span className="w-24 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Languages</span>
                           <span className="text-gray-900 font-bold">{movie.language}</span>
                        </div>
                     </div>

                     <button className="w-full md:w-72 bg-[#FF8C00] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF8C00]/30 hover:bg-[#E67E00] transition-all active:scale-95">
                        Book Tickets
                     </button>
                     <p className="text-center md:text-left mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Login to book tickets & save history
                     </p>
                  </div>
               </div>
            </div>

            {/* About Section */}
            <section className="px-4 py-12 bg-gray-50">
               <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest border-l-4 border-[#FF8C00] pl-4">About the Movie</h3>
               <p className="text-gray-500 text-sm leading-relaxed italic font-medium">
                  {movie.description}
               </p>
            </section>

            {/* Cast & Crew Placeholder */}
            {/* <section className="px-4 py-12 space-y-10">
               <div>
                  <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">Top Cast</h3>
                  <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-shrink-0 text-center">
                           <div className="w-20 h-20 rounded-full bg-gray-100 mb-3 border-4 border-white shadow-md mx-auto"></div>
                           <p className="text-[10px] font-black text-gray-900 uppercase">Actor Name</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section> */}
         </main>

         {/* Simplified Footer */}
         <footer className="px-6 py-12 bg-[#00666B] text-white/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-4">© 2026 Screenema</p>
         </footer>
      </div>
   );
};

export default MovieDetailsLoggedOut;