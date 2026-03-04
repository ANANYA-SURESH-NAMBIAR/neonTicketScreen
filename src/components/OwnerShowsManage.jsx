import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const OwnerShowsManage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movie');

  const token = useMemo(() => localStorage.getItem('ownerToken'), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/owner/login');
      return;
    }
    if (!movieId) {
      setError('Missing movie id.');
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const [movieRes, showsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/owner/movies/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/owner/movies/${movieId}/shows`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const movieData = await movieRes.json();
        if (!movieRes.ok) throw new Error(movieData.msg || 'Failed to load movie');

        const showsData = await showsRes.json();
        if (!showsRes.ok) throw new Error(showsData.msg || 'Failed to load shows');

        setMovie(movieData.movie);
        setShows(Array.isArray(showsData) ? showsData : []);
      } catch (e) {
        setError(e.message || 'Failed to load shows');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [movieId, navigate, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm w-full max-w-lg text-center">
          <p className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">
            {error}
          </p>
          <Link to="/owner/movies" className="text-[#FF8C00] font-black uppercase text-xs tracking-widest underline">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-7 h-7 bg-[#00898F] rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-[#00898F]/20">
              <span className="text-white font-black italic text-sm">S</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Shows</h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                {movie?.title || 'Movie'}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/owner/movies/details/${movieId}`}
          className="px-4 py-2 bg-[#F0F5F5] text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors"
        >
          Movie Details
        </Link>
      </header>

      <main className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total shows</p>
            <p className="text-2xl font-black text-[#FF8C00] leading-none">{shows.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Scope</p>
            <p className="text-sm font-black text-gray-900">This theatre only</p>
          </div>
        </div>

        {shows.length === 0 ? (
          <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">🎟️</div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No shows found</p>
            <p className="text-xs text-gray-400 mt-2">Add shows for this movie to make it visible to users.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shows.map((show) => {
              const date = show.date ? new Date(show.date) : null;
              return (
                <div
                  key={show._id}
                  className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {show.screen?.name ? `Screen ${show.screen.name}` : 'Screen'}
                    </p>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                      {date ? date.toLocaleDateString() : '—'} • {show.time || '—'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">
                      Price: Rs. {show.price ?? '—'} • Available seats: {show.available_seats ?? '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F0F5F5] text-[#00898F] text-[9px] font-black uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="px-6 py-10 text-center">
        <p className="text-gray-300 text-[8px] font-bold uppercase tracking-[0.3em]">
          © 2024 Screenema Manager • Management Suite
        </p>
      </footer>
    </div>
  );
};

export default OwnerShowsManage;

