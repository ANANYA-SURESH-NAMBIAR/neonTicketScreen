
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const inputCls = "w-full bg-white rounded-xl p-3 text-sm border border-gray-200 focus:ring-2 focus:ring-[#00898F]/20 outline-none";
const labelCls = "text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1";

const SectionHeader = ({ title, icon, onAdd, addLabel }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">{title}</h3>
        </div>
        {onAdd && (
            <button onClick={onAdd} className="px-3 py-1.5 bg-[#00898F] text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-[#007A80] transition-colors flex items-center gap-1">
                <span>+</span> {addLabel || 'Add'}
            </button>
        )}
    </div>
);

const OwnerTheatreDetails = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('ownerToken');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageTab, setActiveImageTab] = useState('exterior');

    // Add-form visibility
    const [showAddAccess, setShowAddAccess] = useState(false);
    const [showAddImage, setShowAddImage] = useState(false);
    const [showAddRefreshment, setShowAddRefreshment] = useState(false);
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [showAddSeat, setShowAddSeat] = useState(false);

    // Add-form field values
    const [accessDetail, setAccessDetail] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgTag, setImgTag] = useState('exterior');
    const [imgFile, setImgFile] = useState(null);
    const [imgMode, setImgMode] = useState('file');
    const [imgUploading, setImgUploading] = useState(false);
    const [refName, setRefName] = useState('');
    const [refPrice, setRefPrice] = useState('');
    const [screenName, setScreenName] = useState('');
    const [screenRows, setScreenRows] = useState([{ row: '', seats: '' }]);
    const [seatScreenId, setSeatScreenId] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [seatRow, setSeatRow] = useState('');
    const [seatCol, setSeatCol] = useState('');
    const [seatType, setSeatType] = useState('regular');
    const [seatPrice, setSeatPrice] = useState('');
    const [submitMsg, setSubmitMsg] = useState('');

    const getHeaders = () => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' });

    const fetchData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/details`, { headers: getHeaders() });
            if (!res.ok) throw new Error('Unauthorized');
            const d = await res.json();
            setData(d);
        } catch (err) {
            console.error(err);
            navigate('/owner/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) navigate('/owner/login');
        else fetchData();
        // eslint-disable-next-line
    }, []);

    const showSuccess = (msg) => { setSubmitMsg(msg); setTimeout(() => setSubmitMsg(''), 2500); };

    const handleAddAccessibility = async () => {
        if (!accessDetail.trim()) return;
        await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/accessibility`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ detail: accessDetail }) });
        setAccessDetail(''); setShowAddAccess(false); showSuccess('Accessibility detail added!'); fetchData();
    };

    const handleAddImage = async () => {
        if (imgMode === 'file' && !imgFile) return;
        if (imgMode === 'url' && !imgUrl.trim()) return;
        setImgUploading(true);
        try {
            if (imgMode === 'file') {
                const formData = new FormData();
                formData.append('image', imgFile);
                formData.append('tag', imgTag);
                await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/images`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
            } else {
                await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/images`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ img_url: imgUrl, tag: imgTag })
                });
            }
            setImgUrl(''); setImgFile(null); setShowAddImage(false); showSuccess('Image uploaded!'); fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setImgUploading(false);
        }
    };

    const handleAddRefreshment = async () => {
        if (!refName.trim() || !refPrice) return;
        await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/refreshments`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ name: refName, price: Number(refPrice) }) });
        setRefName(''); setRefPrice(''); setShowAddRefreshment(false); showSuccess('Refreshment added!'); fetchData();
    };

    const handleAddScreen = async () => {
        if (!screenName.trim()) return;
        const validRows = screenRows.filter(r => r.row.trim() && Number(r.seats) > 0);
        const totalSeats = validRows.reduce((sum, r) => sum + Number(r.seats), 0);
        await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/screens`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name: screenName, totalSeats, seatLayout: validRows.map(r => ({ row: r.row, seats: Number(r.seats) })) })
        });
        setScreenName(''); setScreenRows([{ row: '', seats: '' }]); setShowAddScreen(false); showSuccess('Screen added!'); fetchData();
    };

    const handleAddSeat = async () => {
        if (!seatScreenId || !seatNumber.trim() || !seatPrice || !seatRow || !seatCol) return;
        await fetch(`${import.meta.env.VITE_API_URL}/api/owner/theatre/seats`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ screenId: seatScreenId, seat_number: seatNumber, seat_type: seatType, price: Number(seatPrice), row: seatRow, col: Number(seatCol) })
        });
        setSeatNumber(''); setSeatPrice(''); setSeatRow(''); setSeatCol(''); setShowAddSeat(false); showSuccess('Seat added!'); fetchData();
    };

    // Screen rows helpers
    const addScreenRow = () => setScreenRows(prev => [...prev, { row: '', seats: '' }]);
    const removeScreenRow = (idx) => setScreenRows(prev => prev.filter((_, i) => i !== idx));
    const updateScreenRow = (idx, field, value) => {
        setScreenRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
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

    if (!data) return null;

    const { theatre, exteriorImages, interiorImages, accessibilityDetails, screens, seats, refreshments } = data;
    const activeImages = activeImageTab === 'exterior' ? exteriorImages : interiorImages;

    // Group seats by screen
    const seatsByScreen = {};
    seats.forEach(s => {
        const sid = s.screen?.toString() || s.screen;
        if (!seatsByScreen[sid]) seatsByScreen[sid] = [];
        seatsByScreen[sid].push(s);
    });

    return (
        <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
            {/* Header */}
            <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center">
                    <button onClick={() => navigate('/owner/dashboard')} className="mr-3 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Theatre Details</h1>
                </div>
                <div className="w-8 h-8 bg-[#00898F] rounded-lg flex items-center justify-center shadow-lg shadow-[#00898F]/20">
                    <span className="text-white font-black italic text-sm">S</span>
                </div>
            </header>

            {/* Success toast */}
            {submitMsg && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#00BC66] text-white text-sm font-black rounded-xl shadow-xl animate-bounce">
                    {submitMsg}
                </div>
            )}

            {/* Theatre Hero */}
            <div className="px-4 mt-6">
                <div className="bg-gradient-to-br from-[#00898F] to-[#00666B] p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">{theatre.name}</h2>
                        <p className="text-white/60 text-sm font-bold mb-1">{theatre.address || 'Address not available'}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {theatre.theatre_type && (
                                <span className="px-3 py-1 bg-white/10 text-white/80 text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                                    {theatre.theatre_type}
                                </span>
                            )}
                            {theatre.rating && (
                                <span className="px-3 py-1 bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-black rounded-full uppercase tracking-widest border border-[#FFB800]/20">
                                    ★ {theatre.rating}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-4 mt-6">

                {/* Types of Theatre (READ-ONLY) */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Types of Theatre" icon="🏗️" />
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <span className="text-sm font-bold text-gray-800">{theatre.theatre_type || 'Standard'}</span>
                        <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Read-only • Set by admin</span>
                    </div>
                </div>

                {/* Accessibility */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Accessibility" icon="♿" onAdd={() => setShowAddAccess(true)} addLabel="Add" />
                    {accessibilityDetails.length > 0 ? (
                        <ul className="space-y-2">
                            {accessibilityDetails.map((a, i) => (
                                <li key={a._id || i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                                    <span className="text-[#5D7BFF] mt-0.5">•</span>
                                    <span className="text-sm text-gray-700 font-medium">{a.detail}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-xl text-center">No accessibility details added</p>
                    )}
                    {showAddAccess && (
                        <div className="mt-3 p-4 bg-[#F5FBFB] rounded-xl border border-[#00898F]/20 space-y-3">
                            <div><label className={labelCls}>Detail</label><input value={accessDetail} onChange={e => setAccessDetail(e.target.value)} className={inputCls} placeholder="e.g. Wheelchair accessible ramps" /></div>
                            <div className="flex gap-2">
                                <button onClick={handleAddAccessibility} className="px-4 py-2 bg-[#00898F] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Add Detail</button>
                                <button onClick={() => setShowAddAccess(false)} className="px-4 py-2 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Refreshments */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Refreshments" icon="🍿" onAdd={() => setShowAddRefreshment(true)} addLabel="Add" />
                    {refreshments.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {refreshments.map(item => (
                                <div key={item._id} className="bg-[#F5F8F8] rounded-xl p-4 border border-gray-50">
                                    <span className="text-sm font-bold text-gray-800">{item.name}</span>
                                    <span className="block text-xs font-black text-[#00898F] mt-1">Rs. {item.price}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-xl text-center">No refreshments added</p>
                    )}
                    {showAddRefreshment && (
                        <div className="mt-3 p-4 bg-[#F5FBFB] rounded-xl border border-[#00898F]/20 space-y-3">
                            <div><label className={labelCls}>Name</label><input value={refName} onChange={e => setRefName(e.target.value)} className={inputCls} placeholder="e.g. Popcorn Large" /></div>
                            <div><label className={labelCls}>Price (Rs.)</label><input type="number" value={refPrice} onChange={e => setRefPrice(e.target.value)} className={inputCls} placeholder="150" /></div>
                            <div className="flex gap-2">
                                <button onClick={handleAddRefreshment} className="px-4 py-2 bg-[#00898F] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Add Item</button>
                                <button onClick={() => setShowAddRefreshment(false)} className="px-4 py-2 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Screens */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Screens" icon="🖥️" onAdd={() => setShowAddScreen(true)} addLabel="Add Screen" />
                    {screens.length > 0 ? (
                        <div className="space-y-3">
                            {screens.map(scr => (
                                <div key={scr._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-800">{scr.name}</span>
                                        <span className="text-[10px] font-black text-[#00898F] bg-[#00898F]/10 px-2 py-1 rounded-lg">{scr.totalSeats} seats</span>
                                    </div>
                                    {scr.seatLayout && scr.seatLayout.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {scr.seatLayout.map((row, i) => (
                                                <span key={i} className="text-[9px] bg-white text-gray-500 font-bold px-2 py-1 rounded-lg border border-gray-100">Row {row.row}: {row.seats} seats</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-xl text-center">No screens added</p>
                    )}
                    {showAddScreen && (
                        <div className="mt-3 p-4 bg-[#F5FBFB] rounded-xl border border-[#00898F]/20 space-y-3">
                            <div><label className={labelCls}>Screen Name</label><input value={screenName} onChange={e => setScreenName(e.target.value)} className={inputCls} placeholder="e.g. Screen 1 - IMAX" /></div>
                            <div>
                                <label className={labelCls}>Rows & Seats</label>
                                <div className="space-y-2">
                                    {screenRows.map((r, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input value={r.row} onChange={e => updateScreenRow(idx, 'row', e.target.value)} className={inputCls} placeholder="Row (e.g. A)" style={{ flex: 1 }} />
                                            <input type="number" value={r.seats} onChange={e => updateScreenRow(idx, 'seats', e.target.value)} className={inputCls} placeholder="Seats" style={{ flex: 1 }} />
                                            {screenRows.length > 1 && (
                                                <button onClick={() => removeScreenRow(idx)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 text-lg font-bold flex-shrink-0">×</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addScreenRow} className="mt-2 text-[9px] font-black text-[#00898F] uppercase tracking-widest hover:underline">+ Add Row</button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleAddScreen} className="px-4 py-2 bg-[#00898F] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Add Screen</button>
                                <button onClick={() => { setShowAddScreen(false); setScreenRows([{ row: '', seats: '' }]); }} className="px-4 py-2 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Seating Details with Prices */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Seating Details & Prices" icon="💺" onAdd={() => setShowAddSeat(true)} addLabel="Add Seat" />
                    {screens.length > 0 ? (
                        <div className="space-y-4">
                            {screens.map(scr => {
                                const scrSeats = seatsByScreen[scr._id?.toString()] || [];
                                const byType = {};
                                scrSeats.forEach(s => {
                                    if (!byType[s.seat_type]) byType[s.seat_type] = { count: 0, price: s.price };
                                    byType[s.seat_type].count++;
                                });
                                return (
                                    <div key={scr._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-sm font-bold text-gray-800 block mb-2">{scr.name}</span>
                                        {Object.keys(byType).length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.entries(byType).map(([type, info]) => (
                                                    <div key={type} className="bg-white rounded-lg p-3 text-center border border-gray-50">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block">{type}</span>
                                                        <span className="text-sm font-black text-[#00898F]">Rs. {info.price}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold block">{info.count} seats</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">No seats added for this screen</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-xl text-center">Add screens first to manage seats</p>
                    )}
                    {showAddSeat && (
                        <div className="mt-3 p-4 bg-[#F5FBFB] rounded-xl border border-[#00898F]/20 space-y-3">
                            <div>
                                <label className={labelCls}>Screen</label>
                                <select value={seatScreenId} onChange={e => setSeatScreenId(e.target.value)} className={inputCls}>
                                    <option value="">Select screen</option>
                                    {screens.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className={labelCls}>Row</label><input value={seatRow} onChange={e => setSeatRow(e.target.value)} className={inputCls} placeholder="A" /></div>
                                <div><label className={labelCls}>Column</label><input type="number" value={seatCol} onChange={e => setSeatCol(e.target.value)} className={inputCls} placeholder="1" /></div>
                            </div>
                            <div><label className={labelCls}>Seat Number</label><input value={seatNumber} onChange={e => setSeatNumber(e.target.value)} className={inputCls} placeholder="A1" /></div>
                            <div>
                                <label className={labelCls}>Type</label>
                                <select value={seatType} onChange={e => setSeatType(e.target.value)} className={inputCls}>
                                    <option value="regular">Regular</option>
                                    <option value="premium">Premium</option>
                                    <option value="recliner">Recliner</option>
                                </select>
                            </div>
                            <div><label className={labelCls}>Price (Rs.)</label><input type="number" value={seatPrice} onChange={e => setSeatPrice(e.target.value)} className={inputCls} placeholder="150" /></div>
                            <div className="flex gap-2">
                                <button onClick={handleAddSeat} className="px-4 py-2 bg-[#00898F] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Add Seat</button>
                                <button onClick={() => setShowAddSeat(false)} className="px-4 py-2 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theatre Gallery */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                    <SectionHeader title="Theatre Gallery" icon="📷" onAdd={() => setShowAddImage(true)} addLabel="Add Image" />
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setActiveImageTab('exterior')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeImageTab === 'exterior' ? 'bg-[#00898F] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                            Exterior ({exteriorImages.length})
                        </button>
                        <button onClick={() => setActiveImageTab('interior')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeImageTab === 'interior' ? 'bg-[#00898F] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                            Interior ({interiorImages.length})
                        </button>
                    </div>
                    {activeImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {activeImages.slice(0, 10).map((img, idx) => (
                                <div key={img._id || idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                                    <img src={img.img_url} alt={`${activeImageTab} ${idx + 1}`} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 font-medium p-6 bg-gray-50 rounded-xl text-center">No {activeImageTab} images</p>
                    )}
                    {showAddImage && (
                        <div className="mt-3 p-4 bg-[#F5FBFB] rounded-xl border border-[#00898F]/20 space-y-3">
                            <div className="flex gap-2 mb-2">
                                <button onClick={() => setImgMode('file')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${imgMode === 'file' ? 'bg-[#00898F] text-white' : 'bg-gray-100 text-gray-400'}`}>Upload File</button>
                                <button onClick={() => setImgMode('url')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${imgMode === 'url' ? 'bg-[#00898F] text-white' : 'bg-gray-100 text-gray-400'}`}>Paste URL</button>
                            </div>
                            {imgMode === 'file' ? (
                                <div>
                                    <label className={labelCls}>Choose Image</label>
                                    <label className="flex flex-col items-center justify-center w-full h-28 bg-white border-2 border-dashed border-[#00898F]/30 rounded-xl cursor-pointer hover:border-[#00898F]/60 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#00898F]/40 mb-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-[10px] font-bold text-gray-400">{imgFile ? imgFile.name : 'Click to select image'}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files[0])} />
                                    </label>
                                </div>
                            ) : (
                                <div><label className={labelCls}>Image URL</label><input value={imgUrl} onChange={e => setImgUrl(e.target.value)} className={inputCls} placeholder="https://res.cloudinary.com/..." /></div>
                            )}
                            <div>
                                <label className={labelCls}>Tag</label>
                                <select value={imgTag} onChange={e => setImgTag(e.target.value)} className={inputCls}>
                                    <option value="exterior">Exterior</option>
                                    <option value="interior">Interior</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleAddImage} disabled={imgUploading} className="px-4 py-2 bg-[#00898F] text-white text-[10px] font-black rounded-lg uppercase tracking-widest disabled:opacity-50">
                                    {imgUploading ? 'Uploading...' : 'Add Image'}
                                </button>
                                <button onClick={() => { setShowAddImage(false); setImgFile(null); }} className="px-4 py-2 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Cancel</button>
                            </div>
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

export default OwnerTheatreDetails;
