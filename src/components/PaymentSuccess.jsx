
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {};

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F5F5]">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">No Booking Found</h2>
                    <button onClick={() => navigate('/home')} className="px-8 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase tracking-widest">Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F5F5] font-sans pb-20">
            {/* Success Header */}
            <div className="bg-[#00898F] pt-24 pb-40 px-4 text-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#00898F" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Booking Confirmed!</h1>
                    <p className="text-[#E5EEEE] font-bold text-sm uppercase tracking-[0.3em]">Your journey begins here</p>
                </div>
            </div>

            {/* Ticket Card */}
            <div className="px-4 -mt-24 relative z-20">
                <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Movie</span>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-tight">{booking.movieTitle}</h2>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                                <span className="px-3 py-1 bg-[#F0FBF5] text-[#00BC66] text-[10px] font-black rounded-full uppercase tracking-widest border border-[#00BC66]/20">Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-10 mb-10">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Theatre</span>
                                <p className="text-sm font-black text-gray-900">{booking.theatreName}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{booking.theatreLocation}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Showtime</span>
                                <p className="text-sm font-black text-gray-900 italic">{booking.showTime}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tickets</span>
                                <p className="text-sm font-black text-gray-900">{booking.seats.length} Person(s)</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Paid</span>
                                <p className="text-lg font-black text-[#00898F]">Rs. {booking.totalAmount}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t-2 border-dashed border-gray-100 relative">
                            {/* Punch Holes for Ticket Aesthetic */}
                            <div className="absolute -left-12 -top-4 w-8 h-8 bg-[#F0F5F5] rounded-full"></div>
                            <div className="absolute -right-12 -top-4 w-8 h-8 bg-[#F0F5F5] rounded-full"></div>

                            <div className="bg-[#1A1A1A] p-6 rounded-3xl flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Booking ID</span>
                                    <span className="text-xs font-mono font-bold text-white uppercase">{booking._id?.slice(-8)}</span>
                                </div>
                                <div className="w-16 h-16 bg-white p-2 rounded-xl">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
                                        <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <path d="M6 6H8V8H6V6Z" fill="currentColor" />
                                        <path d="M16 6H18V8H16V6Z" fill="currentColor" />
                                        <path d="M6 16H8V18H6V16Z" fill="currentColor" />
                                        <path d="M11 6H13V18H11V6Z" fill="currentColor" />
                                        <path d="M16 11H18V18H16V11Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-12 text-center">
                <button
                    onClick={() => navigate('/home')}
                    className="w-full max-w-md bg-white text-[#1A1A1A] py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-black/5"
                >
                    Back to Home
                </button>
                <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
                    Please show this digital ticket at the entrance
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
