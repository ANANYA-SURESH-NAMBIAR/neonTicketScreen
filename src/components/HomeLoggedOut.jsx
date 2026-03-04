import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeLoggedOut = () => {
   const [movies, setMovies] = useState([]);
   const [activeTab, setActiveTab] = useState('released');
   const [showAllReleased, setShowAllReleased] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   // Filter States
   const [selectedLanguages, setSelectedLanguages] = useState([]);
   const [selectedGenres, setSelectedGenres] = useState([]);

   useEffect(() => {
      // Fetch movies
      fetch('http://localhost:5000/api/movies')
         .then(res => res.json())
         .then(data => setMovies(data))
         .catch(console.error);
   }, []);

   const filteredMovies = movies.filter(m =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const upcomingMovies = filteredMovies.filter(m => m.status === 'upcoming');
   const ongoingMovies = filteredMovies.filter(m => m.status === 'ongoing');
   const otherMovies = filteredMovies.filter(m => m.status !== 'upcoming' && m.status !== 'ongoing');
   const releasedMovies = otherMovies.slice(0, 6); // Show more since cards are smaller

   // Filter Options & Logic
   const availableLanguages = ['Malayalam', 'Tamil', 'Hindi', 'English', 'Telugu'];
   const availableGenres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi'];

   const toggleFilter = (type, value) => {
      if (type === 'language') {
         setSelectedLanguages(prev => prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]);
      } else {
         setSelectedGenres(prev => prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]);
      }
   };

   const fullyFilteredMovies = movies.filter(movie => {
      const matchesLang = selectedLanguages.length === 0 || selectedLanguages.includes(movie.language);
      
      // Genre matching: Assuming movie.genre is a comma separated string like "Action, Thriller"
      const movieGenres = movie.genre ? movie.genre.split(',').map(g => g.trim()) : [];
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(g => movieGenres.includes(g));
      
      // Search matching
      const matchesSearch = searchQuery.trim() === '' || movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesLang && matchesGenre && matchesSearch;
   });

   return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col pb-20">
         {/* Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center">
               <span className="text-2xl font-black text-[#FF8C00] tracking-tighter mr-2 italic">S</span>
               <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Screenema</h1>
            </div>
            <div className="flex items-center space-x-4">
               <Link
                  to="/login"
                  className="bg-[#FF8C00] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#E67E00] transition-colors"
               >
                  Login
               </Link>
            </div>
         </header>

         {/* Navigation Tabs */}
         <div className="bg-white border-b border-gray-100">
            <div className="px-4 py-4">
               <div className="flex space-x-1 border-b border-gray-200 mb-4">
                  <button
                     onClick={() => setActiveTab('released')}
                     className={`pb-2 px-1 font-bold text-sm transition-colors ${
                        activeTab === 'released' 
                           ? 'text-[#FF8C00] border-[#FF8C00]' 
                           : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     Released this Week
                  </button>
                  {/* <button
                     onClick={() => setActiveTab('ongoing')}
                     className={`pb-2 px-1 font-bold text-sm transition-colors ${
                        activeTab === 'ongoing' 
                           ? 'text-[#FF8C00] border-[#FF8C00]' 
                           : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     Ongoing Hits
                  </button>
                  <button
                     onClick={() => setActiveTab('upcoming')}
                     className={`pb-2 px-1 font-bold text-sm transition-colors ${
                        activeTab === 'upcoming' 
                           ? 'text-[#FF8C00] border-[#FF8C00]' 
                           : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     Upcoming Movies
                  </button> */}
                  <button
                     onClick={() => setActiveTab('filter')}
                     className={`pb-2 px-1 font-bold text-sm transition-colors ${
                        activeTab === 'filter' 
                           ? 'text-[#FF8C00] border-[#FF8C00]' 
                           : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     Filter Movies
                  </button>
               </div>

               {/* Search Bar - Below Navigation */}
               <div className="mb-6">
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                     </span>
                     <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 outline-none border border-transparent focus:border-gray-200"
                     />
                  </div>
               </div>

               {/* Tab Content */}
               {activeTab === 'released' && (
                  <div className="mb-10">
                     <div className="flex justify-between items-end mb-6 px-4">
                        <h3 className="text-2xl font-black text-[#1A1A1A]">Released this Week</h3>
                        {otherMovies.length > 6 && (
                           <button
                              onClick={() => setShowAllReleased(!showAllReleased)}
                              className="text-[#FF8C00] font-bold text-sm flex items-center"
                           >
                              {showAllReleased ? 'Show Less' : 'See More'}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${showAllReleased ? 'rotate-180' : ''}`}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                              </svg>
                           </button>
                        )}
                     </div>

                     <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 px-4">
                        {(showAllReleased ? otherMovies : releasedMovies).map((movie) => (
                           <Link to={`/movies/${movie._id}/public`} key={movie._id} className="group cursor-pointer">
                              <div
                                 className="aspect-[2/3] rounded-lg overflow-hidden mb-1 relative shadow-sm transition-transform group-hover:scale-[1.02] bg-slate-800 bg-cover bg-center"
                                 style={{ backgroundImage: `url(${movie.poster_url})` }}
                              >
                                 <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded flex items-center">
                                    <span className="text-[#FFB800] text-[10px] mr-1">★</span>
                                    <span className="text-white text-[8px] font-bold">8.4</span>
                                 </div>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-0.5 text-xs line-clamp-1">{movie.title}</h4>
                              <p className="text-[10px] text-gray-500">{movie.genre}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'ongoing' && (
                  <div className="mb-10">
                     <div className="flex justify-between items-end mb-6 px-4">
                        <h3 className="text-2xl font-black text-[#1A1A1A]">Ongoing Hits</h3>
                     </div>

                     <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 px-4">
                        {ongoingMovies.map((movie) => (
                           <Link key={movie._id} to={`/movies/${movie._id}/public`} className="group cursor-pointer">
                              <div className="aspect-[2/3] rounded-lg overflow-hidden relative shadow-sm bg-slate-800 bg-cover bg-center transition-transform group-hover:scale-[1.02]" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                                 <div className="absolute top-1 left-1 bg-[#FF8C00] text-white text-[10px] font-black px-1.5 py-0.5 rounded">COMING SOON</div>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-0.5 text-xs line-clamp-1">{movie.title}</h4>
                              <p className="text-[10px] text-gray-500">{movie.genre}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'upcoming' && (
                  <div className="mb-10">
                     <div className="flex justify-between items-end mb-6 px-4">
                        <h3 className="text-2xl font-black text-[#1A1A1A]">Upcoming Movies</h3>
                     </div>

                     <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 px-4">
                        {upcomingMovies.map((movie) => (
                           <Link key={movie._id} to={`/movies/${movie._id}/public`} className="group cursor-pointer">
                              <div className="aspect-[2/3] rounded-lg overflow-hidden relative shadow-sm bg-slate-800 bg-cover bg-center transition-transform group-hover:scale-[1.02]" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                                 <div className="absolute top-1 left-1 bg-[#FF8C00] text-white text-[10px] font-black px-1.5 py-0.5 rounded">COMING SOON</div>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-0.5 text-xs line-clamp-1">{movie.title}</h4>
                              <p className="text-[10px] text-gray-500">{movie.genre}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'filter' && (
                  <div className="px-4 py-6">
                     <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2 text-[#FF8C00]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                           </svg>
                           Filter Movies
                        </h2>

                        <div className="mb-6">
                           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Language</h3>
                           <div className="flex flex-wrap gap-2">
                              {availableLanguages.map(lang => (
                                 <button
                                    key={lang}
                                    onClick={() => toggleFilter('language', lang)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedLanguages.includes(lang) ? 'bg-[#FF8C00] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                 >
                                    {lang}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Genre</h3>
                           <div className="flex flex-wrap gap-2">
                              {availableGenres.map(genre => (
                                 <button
                                    key={genre}
                                    onClick={() => toggleFilter('genre', genre)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedGenres.includes(genre) ? 'bg-indigo-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                 >
                                    {genre}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <h3 className="text-lg font-black text-gray-900 mb-4 px-2">Results ({fullyFilteredMovies.length})</h3>
                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
                        {fullyFilteredMovies.map(movie => (
                           <Link to={`/movies/${movie._id}/public`} key={movie._id} className="group cursor-pointer">
                              <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative shadow-md transition-transform group-hover:scale-[1.02] bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                                 <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center">
                                    <span className="text-[#FFB800] text-xs mr-1">★</span>
                                    <span className="text-white text-[9px] font-bold">8.4</span>
                                 </div>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1 text-sm line-clamp-1">{movie.title}</h4>
                              <p className="text-xs text-gray-500">{movie.genre}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Main Content */}
         <main className="flex-1">
            {/* Default content when no tab is selected */}
            {!activeTab && (
               <div className="px-4 py-8">
                  <div className="text-center">
                     <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Welcome to Screenema</h3>
                     <p className="text-gray-600 mb-8">Select a category above to explore movies</p>
                     
                     {/* Show some sample movies */}
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {movies.slice(0, 8).map((movie) => (
                           <Link key={movie._id} to={`/movies/${movie._id}/public`} className="group cursor-pointer">
                              <div className="aspect-[2/3] rounded-xl overflow-hidden relative shadow-md bg-slate-800 bg-cover bg-center transition-transform group-hover:scale-[1.02]" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                                 <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center">
                                    <span className="text-[#FFB800] text-xs mr-1">★</span>
                                    <span className="text-white text-[9px] font-bold">8.4</span>
                                 </div>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-0.5 text-sm line-clamp-1">{movie.title}</h4>
                              <p className="text-[10px] text-gray-500">{movie.genre}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
                  </div>
               )}
            </main>
         </div>

   );
};

export default HomeLoggedOut;