
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeLoggedOut = () => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('released');
  const [showAllReleased, setShowAllReleased] = useState(false);
  const [showAllOngoing, setShowAllOngoing] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter States
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(console.error);
  }, []);

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingMovies = filteredMovies.filter(m => m.title === 'Jana Nayagan');
  const otherMovies = filteredMovies.filter(m => m.title !== 'Jana Nayagan');
  const releasedMovies = otherMovies.slice(0, 4);
  const ongoingMovies = otherMovies.slice(4);

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

    return matchesLang && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col pb-20">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <span className="text-2xl font-black text-[#FF8C00] tracking-tighter mr-2 italic">S</span>
          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Screenema</h1>
        </div>
        <Link
          to="/login"
          className="bg-[#FF8C00] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#E67E00] transition-colors"
        >
          Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Bar Placeholder */}
        {activeTab !== 'filter' && (
          <div className="px-4 py-4 bg-white mb-6">
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
        )}

        {activeTab !== 'filter' && (
          <>
            {/* Hero Banner */}
            <div className="px-4 mb-10">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-black">
                <div className="absolute inset-0 opacity-60">
                  {/* Placeholder for Movie Still */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900"></div>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="bg-[#FF8C00] text-white text-[10px] font-black px-2 py-1 rounded w-fit mb-2">NOW SHOWING</span>
                  <h2 className="text-3xl font-black text-white leading-tight mb-4">The Galactic Odyssey</h2>
                  <button className="bg-[#FF8C00] text-white py-3 rounded-xl font-bold w-full md:w-48 shadow-lg shadow-[#FF8C00]/30 transition-transform active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Released This Week Section */}
            <section className="mb-10 px-4">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-black text-[#1A1A1A]">Released this Week</h3>
                {otherMovies.length > 4 && (
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

              <div className="grid grid-cols-2 gap-4">
                {(showAllReleased ? otherMovies : releasedMovies).map((movie) => (
                  <Link to={`/movies/${movie._id}/public`} key={movie._id} className="group cursor-pointer">
                    <div
                      className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 relative shadow-md transition-transform group-hover:scale-[1.02] bg-slate-800 bg-cover bg-center"
                      style={{ backgroundImage: `url(${movie.poster_url})` }}
                    >
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center">
                        <span className="text-[#FFB800] text-xs mr-1">★</span>
                        <span className="text-white text-[10px] font-bold">8.4</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-0.5 line-clamp-1">{movie.title}</h4>
                    <p className="text-[11px] text-gray-500">{movie.genre}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Ongoing Hits Section (Darker BG) */}
            <section className="mb-10 py-10 bg-[#F5F1EB]">
              <div className="px-4">
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-2xl font-black text-[#1A1A1A]">Ongoing Hits</h3>
                  {ongoingMovies.length > 4 && (
                    <button
                      onClick={() => setShowAllOngoing(!showAllOngoing)}
                      className="text-[#FF8C00] font-bold text-sm flex items-center"
                    >
                      {showAllOngoing ? 'Show Less' : 'See More'}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${showAllOngoing ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-10 gap-x-4">
                  {ongoingMovies.map((movie) => (
                    <Link to={`/movies/${movie._id}/public`} key={movie._id} className="group">
                      <div
                        className="aspect-[2/3] rounded-2xl overflow-hidden mb-4 relative shadow-lg bg-gray-900 bg-cover bg-center transition-all group-hover:shadow-[#FF8C00]/10"
                        style={{ backgroundImage: `url(${movie.poster_url})` }}
                      >
                      </div>
                      <h4 className="font-bold text-gray-900 mb-0.5">{movie.title}</h4>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{movie.genre}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Upcoming Section */}
            <section className="mb-16 px-4">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-black text-[#1A1A1A]">Upcoming</h3>
                {upcomingMovies.length > 1 && (
                  <button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="text-[#FF8C00] font-bold text-sm flex items-center"
                  >
                    {showAllUpcoming ? 'Show Less' : 'See More'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${showAllUpcoming ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {upcomingMovies.length > 0 ? (showAllUpcoming ? upcomingMovies : upcomingMovies.slice(0, 1)).map(movie => (
                  <Link key={movie._id} to={`/movies/${movie._id}/public`} className="block relative aspect-[21/9] rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                    <div className="absolute inset-0 bg-stone-800/60 transition-colors group-hover:bg-stone-800/40"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="bg-[#FF8C00] text-white text-[9px] font-black px-2 py-1 rounded w-fit mb-1">COMING SOON</span>
                      <h4 className="text-xl font-bold text-white mb-1">{movie.title}</h4>
                      <p className="text-white/80 text-xs">{new Date(movie.release_date).toLocaleDateString()}</p>
                    </div>
                  </Link>
                )) : (
                  <div className="p-6 text-center text-gray-500 text-sm">No upcoming movies</div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Filter Page */}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {fullyFilteredMovies.map(movie => (
                <Link to={`/movies/${movie._id}/public`} key={movie._id} className="group cursor-pointer">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 relative shadow-md transition-transform group-hover:scale-[1.02] bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center">
                      <span className="text-[#FFB800] text-xs mr-1">★</span>
                      <span className="text-white text-[10px] font-bold">8.4</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{movie.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{movie.language} • {movie.genre?.split(',')[0]}</p>
                </Link>
              ))}
              {fullyFilteredMovies.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500 font-medium">No movies match these exact filters.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Simplified Footer */}
      <footer className="px-6 py-12 bg-white border-t border-gray-100">
        <div className="flex items-center mb-6">
          <span className="text-[#FF8C00] mr-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M18,3H6C4.9,3,4,3.9,4,5v14c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V5C20,3.9,19.1,3,18,3z M18,19H6V5h12V19z M8,17h8v-2H8V17z M8,13h8v-2H8V13z M8,9h8V7H8V9z" />
            </svg>
          </span>
          <span className="text-xl font-black text-gray-900">Screenema</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your one-stop destination for all movie tickets, theater shows, and exclusive cinematic events in your city.
        </p>

        <div className="flex space-x-6 mb-10">
          {['facebook', 'instagram', 'youtube'].map(social => (
            <div key={social} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              {/* Icon placeholder */}
              <div className="w-3 h-3 bg-current rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Help & Support</h5>
          <Link to="/contact" className="block text-gray-500 text-sm hover:text-[#FF8C00]">Contact Us</Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">© 2024 Screenema. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 grid grid-cols-4 gap-1 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {[
          { key: 'released', icon: 'released', label: 'Released this week' },
          { key: 'ongoing', icon: 'hits', label: 'Ongoing hits' },
          { key: 'upcoming', icon: 'upcoming', label: 'Upcoming' },
          { key: 'filter', icon: 'filter', label: 'Filter movies' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.key)}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === item.key ? 'text-[#FF8C00] scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className={`w-6 h-6 mb-1 rounded-lg ${activeTab === item.key ? 'bg-[#FF8C00]/10' : 'bg-gray-100'}`}></div>
            <span className="text-[9px] font-bold text-center leading-tight uppercase tracking-tighter">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HomeLoggedOut;