
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomeLoggedIn = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('released');
  const [movies, setMovies] = useState([]);

  const [showAllRecommended, setShowAllRecommended] = useState(false);
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
  const recommendedMovies = otherMovies.slice(0, 3);
  const releasedMovies = otherMovies.slice(3, 7);
  const ongoingMovies = otherMovies.slice(7);

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

  const handleLogout = () => {
    // Clear auth token (if present) and go back to login
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans flex flex-col pb-20">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center">
          <span className="text-2xl font-black text-[#FF8C00] tracking-tighter mr-2 italic">S</span>
          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Screenema</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* City Dropdown Selection */}
          {/* <div className="flex items-center text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 cursor-pointer">
            <span>Kochi</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div> */}

          {/* Profile Avatar & Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-[#FF8C00]/10 border-2 border-[#FF8C00] flex items-center justify-center overflow-hidden transition-transform active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FF8C00]">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <button onClick={() => { setIsMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center">
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-[#FF4D4D] hover:bg-red-50 flex items-center border-t border-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Input */}
        {activeTab !== 'filter' && (
          <div className="px-4 py-5 bg-white mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for movies in Kochi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F8F8] border-none rounded-2xl pl-12 pr-4 py-4 text-base focus:ring-2 focus:ring-[#FF8C00]/20 outline-none transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        )}

        {/* Movie sections driven by bottom navigation */}
        {activeTab === 'released' && (
          <>
            {/* Recommended for You (Darkest Background) */}
            <section className="bg-[#00898F] py-10 mb-2">
              <div className="px-4 flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black text-white leading-none">Recommended for You</h2>
                <button
                  onClick={() => setShowAllRecommended(!showAllRecommended)}
                  className="text-white/80 font-bold text-xs uppercase tracking-widest border-b border-white/20 pb-1"
                >
                  {showAllRecommended ? 'Show Less' : 'See More'}
                </button>
              </div>

              <div className="flex space-x-5 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {(showAllRecommended ? otherMovies : recommendedMovies).map((movie) => (
                  <Link to={`/movies/${movie._id}`} key={movie._id} className="flex-shrink-0 w-44">
                    <div
                      className="aspect-[2/3] rounded-3xl mb-4 shadow-2xl relative overflow-hidden group bg-[#2D3E40] bg-cover bg-center"
                      style={{ backgroundImage: `url(${movie.poster_url})` }}
                    >
                      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl px-2 py-1 rounded-xl flex items-center border border-white/20">
                        <span className="text-[#FFB800] text-xs mr-1">★</span>
                        <span className="text-white text-[10px] font-black">8.4</span>
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{movie.title}</h3>
                    <div className="flex space-x-1">
                      <span className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">{movie.genre}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Released This Week */}
            <section className="bg-white py-10 mb-2">
              <div className="px-4 flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black text-[#1A1A1A] leading-none">Released this Week</h2>
                <button
                  onClick={() => setShowAllReleased(!showAllReleased)}
                  className="text-[#FF8C00] font-bold text-xs uppercase tracking-widest border-b border-[#FF8C00]/20 pb-1"
                >
                  {showAllReleased ? 'Show Less' : 'See More'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-4">
                {(showAllReleased ? otherMovies : releasedMovies).map((movie) => (
                  <Link to={`/movies/${movie._id}`} key={movie._id} className="flex flex-col">
                    <div
                      className="aspect-[2/3] rounded-3xl mb-4 shadow-xl bg-indigo-950 bg-cover bg-center transition-transform active:scale-[0.98]"
                      style={{ backgroundImage: `url(${movie.poster_url})` }}
                    ></div>
                    <h3 className="font-bold text-gray-900 leading-tight">{movie.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'ongoing' && (
          <section className="bg-[#E5EEEE] py-10 mb-2">
            <div className="px-4 flex justify-between items-end mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A] leading-none">Ongoing Hits</h2>
              <button
                onClick={() => setShowAllOngoing(!showAllOngoing)}
                className="text-gray-500 font-bold text-xs uppercase tracking-widest border-b border-gray-300 pb-1"
              >
                {showAllOngoing ? 'Show Less' : 'See More'}
              </button>
            </div>

            <div className="flex space-x-5 overflow-x-auto px-4 pb-4 scrollbar-hide">
              {(showAllOngoing ? otherMovies : ongoingMovies).map((movie) => (
                <Link to={`/movies/${movie._id}`} key={movie._id} className="flex-shrink-0 w-40">
                  <div
                    className="aspect-[2/3] rounded-3xl bg-gray-400 mb-4 shadow-lg border border-white/50 bg-cover bg-center"
                    style={{ backgroundImage: `url(${movie.poster_url})` }}
                  ></div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight text-center">{movie.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'upcoming' && (
          <section className="bg-white py-10 mb-2">
            <div className="px-4 flex justify-between items-end mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A] leading-none">Upcoming Movies</h2>
              <button
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                className="text-[#FF8C00] font-bold text-xs uppercase tracking-widest border-b border-[#FF8C00]/20 pb-1"
              >
                {showAllUpcoming ? 'Show Less' : 'See More'}
              </button>
            </div>

            <div className="space-y-6 px-4">
              {upcomingMovies.length > 0 ? (showAllUpcoming ? upcomingMovies : upcomingMovies.slice(0, 1)).map((movie) => (
                <Link to={`/movies/${movie._id}`} key={movie._id} className="block relative aspect-[21/9] rounded-2xl overflow-hidden shadow-md bg-cover bg-center group" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                  <div className="absolute inset-0 bg-stone-800/60 transition-colors group-hover:bg-stone-800/40"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="bg-[#FF8C00] text-white text-[9px] font-black px-2 py-1 rounded w-fit mb-1">
                      COMING SOON
                    </span>
                    <h4 className="text-xl font-bold text-white mb-1">{movie.title}</h4>
                    <p className="text-white/80 text-xs">{new Date(movie.release_date).toLocaleDateString()}</p>
                  </div>
                </Link>
              )) : (
                <div className="text-center text-gray-500 font-bold p-8">No upcoming movies</div>
              )}
            </div>
          </section>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {fullyFilteredMovies.map(movie => (
                <Link to={`/movies/${movie._id}`} key={movie._id} className="group cursor-pointer">
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

      {/* Footer (Simplified) */}
      <footer className="bg-[#00666B] px-6 py-12 text-white/60">
        <div className="flex items-center mb-8">
          <span className="text-white font-black text-2xl tracking-tighter italic mr-2">S</span>
          <span className="text-white font-bold text-xl uppercase tracking-widest">Screenema</span>
        </div>
{/* 
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <h5 className="text-white font-black text-xs uppercase tracking-widest mb-4">Support</h5>
            <button className="block text-sm font-medium hover:text-white transition-colors">Help Center</button>
            <button className="block text-sm font-medium hover:text-white transition-colors">Contact Details</button>
          </div>
        </div> */}

        <div className="flex space-x-6 mb-12 border-t border-white/10 pt-10">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <div className="w-4 h-4 bg-current rounded-sm opacity-50"></div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <div className="w-4 h-4 bg-current rounded-full opacity-50"></div>
          </div>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center opacity-30">
          © 2026 Screenema Entertainment
        </p>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 grid grid-cols-4 gap-1 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {[
          { key: 'released', icon: 'star', label: 'Released' },
          { key: 'ongoing', icon: 'fire', label: 'Ongoing' },
          { key: 'upcoming', icon: 'calendar', label: 'Upcoming' },
          { key: 'filter', icon: 'search', label: 'Filter' },
        ].map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center justify-center py-1 transition-all ${isActive ? 'text-[#FF8C00] scale-110' : 'text-gray-400 opacity-60'
                }`}
            >
              <div
                className={`w-6 h-6 mb-1 rounded-xl transition-colors ${isActive ? 'bg-[#FF8C00]/10' : 'bg-gray-100'
                  }`}
              ></div>
              <span className="text-[9px] font-black text-center leading-tight uppercase tracking-tighter">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default HomeLoggedIn;