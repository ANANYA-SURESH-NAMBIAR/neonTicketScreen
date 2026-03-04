import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OwnerAddMovies = () => {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('ownerToken'), []);

  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // form fields (applied when adding any movie)
  const [search, setSearch] = useState('');
  const [screenId, setScreenId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/owner/login');
      return;
    }

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [screensRes, moviesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/owner/screens`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/owner/movies/available`, { headers }),
        ]);

        const screensData = await screensRes.json();
        if (!screensRes.ok) throw new Error(screensData.msg || 'Failed to load screens');

        const moviesData = await moviesRes.json();
        if (!moviesRes.ok) throw new Error(moviesData.msg || 'Failed to load movies');

        setScreens(Array.isArray(screensData) ? screensData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);

        if (!screenId && Array.isArray(screensData) && screensData.length > 0) {
          setScreenId(screensData[0]._id);
        }
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token]);

  const filteredMovies = movies.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (m.title || '').toLowerCase().includes(q) ||
      (m.genre || '').toLowerCase().includes(q) ||
      (m.language || '').toLowerCase().includes(q)
    );
  });

  const addShowForMovie = async (movieId) => {
    setSuccess('');
    setError('');

    if (!screenId) {
      setError('Please select a screen first.');
      return;
    }
    if (!time.trim()) {
      setError('Please enter a start time.');
      return;
    }

    setSubmittingId(movieId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/shows`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          screenId,
          date,
          time: time.trim(),
          price: price === '' ? undefined : Number(price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to add show');

      // remove movie from available list (it is now in this theatre)
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
      setSuccess('Show added successfully.');
    } catch (e) {
      setError(e.message || 'Failed to add show');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <Link to="/owner/dashboard" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex items-center">
            <div className="w-7 h-7 bg-[#00898F] rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-[#00898F]/20">
              <span className="text-white font-black italic text-sm">S</span>
            </div>
            <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Add New Movies</h1>
          </div>
        </div>
        <Link
          to="/owner/movies"
          className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#FF8C00] transition-colors shadow-lg shadow-black/5"
        >
          Current Listings
        </Link>
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
            Add Show Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Search new movies</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, genre, language..."
                className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Screen</label>
              <select
                value={screenId}
                onChange={(e) => setScreenId(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all"
              >
                <option value="">Select a screen</option>
                {screens.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (Seats: {s.totalSeats})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Start time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (optional)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 180"
                className="w-full bg-gray-50 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-[#00898F]/20 outline-none transition-all"
              />
            </div>
          </div>

          {(error || success) && (
            <div className="mt-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl text-center">
                  {success}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Available Movies</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                Movies not currently in this theatre
              </p>
            </div>
            <div className="text-right">
              <span className="text-[2rem] font-black text-[#FF8C00] leading-none">{filteredMovies.length}</span>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Titles</p>
            </div>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="py-16 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No movies found</p>
              <p className="text-xs text-gray-400 mt-2">
                Either all movies are already listed in your theatre, or the search has no matches.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMovies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex gap-4 items-center"
                >
                  <div
                    className="w-16 aspect-[2/3] bg-gray-100 rounded-xl bg-cover bg-center shadow-md overflow-hidden flex-shrink-0"
                    style={{ backgroundImage: movie.poster_url ? `url(${movie.poster_url})` : undefined }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight">{movie.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      {movie.language || '—'} • {movie.genre || '—'}
                    </p>
                  </div>
                  <button
                    onClick={() => addShowForMovie(movie._id)}
                    disabled={submittingId === movie._id}
                    className="px-4 py-2 bg-[#FF8C00] text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-[#FF8C00]/20 hover:bg-[#E67E00] transition-colors disabled:opacity-60"
                  >
                    {submittingId === movie._id ? 'Adding...' : 'Add Movie'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

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
                    © 2026 Screenema Manager • All Rights Reserved
                </p>
            </footer>
        </div>
  );
};

export default OwnerAddMovies;

