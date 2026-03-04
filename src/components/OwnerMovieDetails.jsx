import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const OwnerMovieDetails = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movie, setMovie] = useState(null);
  const [showCount, setShowCount] = useState(0);

  const token = useMemo(() => localStorage.getItem('ownerToken'), []);

  useEffect(() => {
    if (!token) {
      navigate('/owner/login');
      return;
    }

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/owner/movies/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to load movie details');
        setMovie(data.movie);
        setShowCount(data.showCount || 0);
      } catch (e) {
        setError(e.message || 'Failed to load movie details');
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
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm w-full max-w-lg text-center">
          <p className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">
            {error || 'Movie not found'}
          </p>
          <Link to="/owner/movies" className="text-[#FF8C00] font-black uppercase text-xs tracking-widest underline">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  const releaseDate = movie.release_date ? new Date(movie.release_date) : null;

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
            <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Movie Details</h1>
          </div>
        </div>
        <Link
          to={`/owner/shows/manage?movie=${movie._id}`}
          className="px-4 py-2 bg-[#FF8C00] text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-[#FF8C00]/20 hover:bg-[#E67E00] transition-colors"
        >
          Manage Shows
        </Link>
      </header>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white rounded-[2.5rem] p-5 border border-gray-100 shadow-sm">
          <div className="flex gap-5">
            <div
              className="w-28 aspect-[2/3] rounded-2xl bg-gray-100 bg-cover bg-center shadow-md flex-shrink-0"
              style={{ backgroundImage: movie.poster_url ? `url(${movie.poster_url})` : undefined }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-2">
                {movie.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.language && (
                  <span className="px-3 py-1 rounded-full bg-[#F0F5F5] text-[#00898F] text-[10px] font-black uppercase tracking-widest">
                    {movie.language}
                  </span>
                )}
                {movie.genre && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest">
                    {movie.genre}
                  </span>
                )}
                {movie.duration != null && (
                  <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
                    {movie.duration} min
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F0F5F5] rounded-2xl p-4 border border-gray-50">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Shows in your theatre</p>
                  <p className="text-2xl font-black text-[#FF8C00] leading-none">{showCount}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Release date</p>
                  <p className="text-sm font-black text-gray-900">
                    {releaseDate ? releaseDate.toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {movie.description || 'No description provided.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {movie.trailer_url && (
              <a
                href={movie.trailer_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#FF8C00] transition-colors"
              >
                Open Trailer
              </a>
            )}
            <Link
              to={`/owner/shows/manage?movie=${movie._id}`}
              className="px-4 py-2 bg-[#F0F5F5] text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              View Shows
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-10 text-center">
        <p className="text-gray-300 text-[8px] font-bold uppercase tracking-[0.3em]">
          © 2026 Screenema Manager • Management Suite
        </p>
      </footer>
    </div>
  );
};

export default OwnerMovieDetails;

