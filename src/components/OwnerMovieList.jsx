
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const OwnerMovieList = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('ownerToken');
        if (!token) {
            navigate('/owner/login');
            return;
        }

        const fetchMovies = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/owner/movies', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch movies');
                const data = await res.json();
                setMovies(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [navigate]);

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading movies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
            {/* Header */}
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
                        <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Available Movies</h1>
                    </div>
                </div>
                <Link to="/owner/movies/add" className="w-8 h-8 bg-[#FF8C00] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF8C00]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </Link>
            </header>

            {/* Sub-header */}
            <div className="px-4 py-6 bg-white border-b border-gray-100 mb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase">Current Listings</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Movies in your theatre</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[2rem] font-black text-[#FF8C00] leading-none">{movies.length}</span>
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Active Titles</p>
                    </div>
                </div>
            </div>

            <main className="px-4 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title or genre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-2xl pl-12 pr-4 py-4 shadow-sm border border-gray-50 outline-none focus:border-[#FF8C00]/30 transition-all font-medium text-sm"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>

                {/* Movie List */}
                <div className="space-y-4">
                    {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
                        <div key={movie._id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 flex gap-4 items-center group hover:border-[#FF8C00]/20 transition-all">
                            <div
                                className="w-20 aspect-[2/3] bg-gray-100 rounded-xl bg-cover bg-center shadow-md overflow-hidden flex-shrink-0"
                                style={{ backgroundImage: `url(${movie.poster_url})` }}
                            >
                                {!movie.poster_url && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-2xl">🎬</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-black text-gray-900 text-base leading-tight uppercase tracking-tight">{movie.title}</h3>
                                    <button className="text-gray-300 hover:text-[#FF8C00] transition-colors leading-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 bg-[#F0F5F5] text-[#00898F] text-[8px] font-black rounded uppercase tracking-widest">{movie.genre}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">•</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{movie.duration} min</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/owner/movies/details/${movie._id}`}
                                        className="px-4 py-2 bg-gray-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-[#FF8C00] transition-colors shadow-lg shadow-black/5"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/owner/shows/manage?movie=${movie._id}`}
                                        className="px-4 py-2 bg-[#F0F5F5] text-gray-900 text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                    >
                                        Shows
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">🍿</div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No movies found</p>
                            <Link to="/owner/movies/add" className="mt-4 text-[#FF8C00] text-xs font-black uppercase tracking-widest border-b-2 border-[#FF8C00]/20 pb-0.5 hover:border-[#FF8C00] transition-all">
                                Add your first movie
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer - simplified for subpages */}
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

export default OwnerMovieList;
