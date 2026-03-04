
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TheatreInfo = () => {
    const navigate = useNavigate();
    const { theatreId } = useParams();
    const [theatre, setTheatre] = useState(null);
    const [refreshments, setRefreshments] = useState([]);
    const [exteriorImages, setExteriorImages] = useState([]);
    const [interiorImages, setInteriorImages] = useState([]);
    const [accessibilityDetails, setAccessibilityDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageTab, setActiveImageTab] = useState('exterior');

    useEffect(() => {
        fetch(`http://localhost:5000/api/theatre/${theatreId}`)
            .then(res => res.json())
            .then(data => {
                setTheatre(data.theatre);
                setRefreshments(data.refreshments || []);
                setExteriorImages(data.exteriorImages || []);
                setInteriorImages(data.interiorImages || []);
                setAccessibilityDetails(data.accessibilityDetails || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [theatreId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading theatre info...</p>
                </div>
            </div>
        );
    }

    if (!theatre) {
        return (
            <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Theatre Not Found</h2>
                    <button onClick={() => navigate(-1)} className="px-8 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase tracking-widest">Go Back</button>
                </div>
            </div>
        );
    }

    const activeImages = activeImageTab === 'exterior' ? exteriorImages : interiorImages;

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
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Theatre Info</h1>
                </div>
                <div className="flex items-center">
                    <span className="text-2xl font-black text-[#FF8C00] tracking-tighter italic">S</span>
                </div>
            </header>

            {/* Theatre Hero */}
            <div className="px-4 mt-6">
                <div className="bg-gradient-to-br from-[#00898F] to-[#00666B] p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">{theatre.name}</h2>
                        <p className="text-white/60 text-sm font-bold mb-1">{theatre.address || 'Address not available'}</p>
                        {theatre.theatre_type && (
                            <span className="inline-block mt-2 px-3 py-1 bg-white/10 text-white/80 text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                                {theatre.theatre_type}
                            </span>
                        )}
                        {theatre.rating && (
                            <span className="inline-block mt-2 ml-2 px-3 py-1 bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-black rounded-full uppercase tracking-widest border border-[#FFB800]/20">
                                ★ {theatre.rating}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Accessibility */}
            <div className="px-4 mt-6">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#5D7BFF]/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#5D7BFF]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Accessibility</h3>
                    </div>
                    {accessibilityDetails.length > 0 ? (
                        <ul className="space-y-2">
                            {accessibilityDetails.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-[#5D7BFF] mt-1">•</span>
                                    <span className="text-sm text-gray-600 font-medium leading-relaxed">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium">Accessibility information not available</p>
                    )}
                </div>
            </div>

            {/* Refreshments */}
            <div className="px-4 mt-4">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-[#FF8C00]/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#FF8C00]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Refreshments Available</h3>
                    </div>

                    {refreshments.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {refreshments.map((item) => (
                                <div key={item._id} className="bg-[#F5F8F8] rounded-xl p-4 border border-gray-50">
                                    <span className="text-sm font-bold text-gray-800">{item.name}</span>
                                    <span className="block text-xs font-black text-[#00898F] mt-1">Rs. {item.price}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#F5F8F8] rounded-xl p-6 text-center">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Refreshment info not available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Theatre Images */}
            <div className="px-4 mt-4">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-[#00898F]/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#00898F]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5M3.75 3h16.5M3.75 3a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5m16.5-18a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Theatre Gallery</h3>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-5">
                        <button
                            onClick={() => setActiveImageTab('exterior')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeImageTab === 'exterior'
                                ? 'bg-[#00898F] text-white shadow-lg shadow-[#00898F]/20'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            Exterior ({exteriorImages.length})
                        </button>
                        <button
                            onClick={() => setActiveImageTab('interior')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeImageTab === 'interior'
                                ? 'bg-[#00898F] text-white shadow-lg shadow-[#00898F]/20'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            Interior ({interiorImages.length})
                        </button>
                    </div>

                    {/* Images Grid */}
                    {activeImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {activeImages.slice(0, 10).map((imgUrl, idx) => (
                                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                                    <img
                                        src={imgUrl}
                                        alt={`${activeImageTab} view ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#F5F8F8] rounded-xl p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-gray-300 mx-auto mb-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5M3.75 3h16.5M3.75 3a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5m16.5-18a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5" />
                            </svg>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                No {activeImageTab} images available
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="px-6 py-10 bg-[#00666B] mt-10">
                <div className="flex items-center mb-6">
                    <span className="text-white font-black text-2xl tracking-tighter italic mr-2">S</span>
                    <span className="text-white font-bold text-xl uppercase tracking-widest">Screenema</span>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                    © 2024 Screenema Entertainment
                </p>
            </footer>
        </div>
    );
};

export default TheatreInfo;
