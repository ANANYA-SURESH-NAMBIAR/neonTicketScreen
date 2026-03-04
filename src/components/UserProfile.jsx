
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [profileRes, bookingsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/users/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/users/bookings', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!profileRes.ok) throw new Error('Failed to fetch profile');

                const profileData = await profileRes.json();
                const bookingsData = await bookingsRes.json();

                setProfile(profileData);
                setBookings(bookingsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
            {/* Header */}
            <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">My Profile</h1>
                </div>
                <div className="flex items-center">
                    <span className="text-2xl font-black text-[#FF8C00] tracking-tighter italic">S</span>
                </div>
            </header>

            {/* Profile Card */}
            <div className="px-4 mt-6">
                <div className="bg-gradient-to-br from-[#00898F] to-[#00666B] p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl font-black text-white">
                                {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">{profile?.username || 'User'}</h2>
                            <p className="text-white/60 text-sm font-bold mt-1">{profile?.email || 'No email'}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-white/10 text-white/80 text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                                {profile?.role || 'User'}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Username</span>
                            <span className="text-sm font-black text-white">{profile?.username || '-'}</span>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Total Bookings</span>
                            <span className="text-sm font-black text-white">{bookings.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking History */}
            <div className="px-4 mt-8">
                <h3 className="text-xl font-black text-[#1A1A1A] tracking-tighter mb-5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#FF8C00]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                    </svg>
                    Booking History
                </h3>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No bookings yet</p>
                        <button onClick={() => navigate('/home')} className="mt-4 px-6 py-2 bg-[#FF8C00] text-white rounded-xl text-sm font-bold">
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                                {/* Movie Title */}
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Movie</span>
                                        <h4 className="text-lg font-black text-[#1A1A1A] tracking-tight leading-tight">{booking.movieTitle || 'Unknown Movie'}</h4>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${booking.status === 'Booked'
                                            ? 'bg-[#F0FBF5] text-[#00BC66] border border-[#00BC66]/20'
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        {booking.status || 'Booked'}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Theatre</span>
                                        <p className="text-sm font-bold text-gray-800">{booking.theatreName || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Showtime</span>
                                        <p className="text-sm font-bold text-gray-800">{booking.showTime || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Seats</span>
                                        <div className="flex flex-wrap gap-1">
                                            {booking.seats && booking.seats.length > 0 ? (
                                                booking.seats.map((seat, idx) => (
                                                    <span key={idx} className="bg-[#F0F5F5] text-[#00898F] px-2 py-0.5 rounded-lg text-[10px] font-black">
                                                        {seat.seat_number}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Paid</span>
                                        <p className="text-lg font-black text-[#00898F]">Rs. {booking.totalAmount || 0}</p>
                                    </div>
                                </div>

                                {/* Booking date */}
                                {booking.createdAt && (
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-[10px] font-bold text-gray-400">
                                            Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="px-6 py-10 bg-[#00666B] mt-10">
                <div className="flex items-center mb-6">
                    <span className="text-white font-black text-2xl tracking-tighter italic mr-2">S</span>
                    <span className="text-white font-bold text-xl uppercase tracking-widest">Screenema</span>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                    © 2026 Screenema Entertainment
                </p>
            </footer>
        </div>
    );
};

export default UserProfile;
