
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TheatreSeatSelection = () => {
   const navigate = useNavigate();
   const { movieId } = useParams();
   const [movie, setMovie] = useState(null);
   const [shows, setShows] = useState([]);
   const [theatres, setTheatres] = useState([]);
   const [selectedTheatreId, setSelectedTheatreId] = useState(null);
   const [selectedShow, setSelectedShow] = useState(null);
   const [seats, setSeats] = useState([]);
   const [selectedSeats, setSelectedSeats] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      // Fetch Movie Details
      fetch(`http://localhost:5000/api/movie/${movieId}`)
         .then(res => res.json())
         .then(data => setMovie(data))
         .catch(console.error);

      // Fetch Shows and Group by Theatre
      fetch(`http://localhost:5000/api/movie/${movieId}/shows`)
         .then(res => res.json())
         .then(data => {
            console.log('Shows for movie:', movieId, data);
            setShows(data);
            const grouped = data.reduce((acc, show) => {
               if (!show.theatre || !show.movie) return acc; // Filter out partial data
               const theatreId = show.theatre._id;
               if (!acc[theatreId]) {
                  acc[theatreId] = {
                     ...show.theatre,
                     shows: []
                  };
               }
               acc[theatreId].shows.push(show);
               return acc;
            }, {});
            setTheatres(Object.values(grouped));
            setIsLoading(false);
         })
         .catch(err => {
            console.error(err);
            setIsLoading(false);
         });
   }, [movieId]);

   // Fetch Seats when a Show is selected
   useEffect(() => {
      if (selectedShow) {
         fetch(`http://localhost:5000/api/show/${selectedShow._id}`)
            .then(res => res.json())
            .then(data => {
               setSeats(data.seats);
               setSelectedSeats([]); // Reset selection on show change
            })
            .catch(console.error);
      } else {
         setSeats([]);
      }
   }, [selectedShow]);

   const toggleSeat = (seatId) => {
      if (selectedSeats.includes(seatId)) {
         setSelectedSeats(selectedSeats.filter(s => s !== seatId));
      } else {
         setSelectedSeats([...selectedSeats, seatId]);
      }
   };

   const calculateTotal = () => {
      return selectedSeats.reduce((acc, seatId) => {
         const seat = seats.find(s => s._id === seatId);
         return acc + (seat ? seat.price : 0);
      }, 0);
   };

   const handleProceed = () => {
      if (!selectedShow || selectedSeats.length === 0) return;
      navigate(`/booking/${selectedShow._id}/payment`, {
         state: {
            showId: selectedShow._id,
            selectedSeats,
            totalAmount: calculateTotal(),
            movieTitle: movie.title,
            theatreName: selectedShow.theatre.name,
            time: selectedShow.time
         }
      });
   };

   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans pb-32">
         {/* Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center">
               <button onClick={() => navigate(-1)} className="mr-3 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
               </button>
               <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Theatre & Seats</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/20 flex items-center justify-center">
               <span className="text-[10px] font-black text-[#FF8C00]">KOC</span>
            </div>
         </header>

         {/* Breadcrumbs */}
         <nav className="px-4 py-3 bg-[#E5EEEE] text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <span>Path to this page</span>
            <span className="mx-2 text-gray-300">/</span>
            <span>{movie ? movie.title : 'Loading...'}</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-[#FF8C00]">Ticket Booking</span>
         </nav>

         {/* Theatre Selection Section */}
         <section className="px-4 py-6 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tighter">Select Theatre</h2>
            </div>

            <div className="space-y-3">
               {theatres.length > 0 ? (
                  theatres.map((theatre) => (
                     <div
                        key={theatre._id}
                        onClick={() => setSelectedTheatreId(theatre._id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedTheatreId === theatre._id ? 'border-[#00898F] bg-[#F5FBFB]' : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                           }`}
                     >
                        <div className="flex items-start justify-between">
                           <div>
                              <h3 className={`font-bold text-sm mb-0.5 ${selectedTheatreId === theatre._id ? 'text-[#00898F]' : 'text-gray-900'}`}>{theatre.name}</h3>
                              <p className="text-[10px] text-gray-400 font-medium mb-3 uppercase tracking-wider">{theatre.location || theatre.address || 'Kochi'}</p>
                           </div>
                           <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/theatre/${theatre._id}/info`); }}
                              className="w-8 h-8 rounded-full bg-[#00898F]/10 border border-[#00898F]/20 flex items-center justify-center flex-shrink-0 hover:bg-[#00898F]/20 transition-colors"
                              title="Theatre Info"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#00898F]">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                              </svg>
                           </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                           {theatre.shows.map((show) => (
                              <button
                                 key={show._id}
                                 onClick={(e) => { e.stopPropagation(); setSelectedShow(show); setSelectedTheatreId(theatre._id); }}
                                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedShow?._id === show._id
                                    ? 'bg-[#00898F] text-white shadow-lg shadow-[#00898F]/20'
                                    : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                                    }`}
                              >
                                 {show.time}
                              </button>
                           ))}
                        </div>
                     </div>
                  ))
               ) : !isLoading ? (
                  <div className="py-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No shows currently available for this movie</p>
                  </div>
               ) : (
                  <div className="py-10 text-center animate-pulse">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Searching available shows...</p>
                  </div>
               )}
            </div>
         </section>

         {/* Seat Selection Section */}
         {selectedShow ? (
            <section className="mt-2 py-10 bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="px-4 mb-10 flex justify-between items-end">
                  <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">Choose Seats</h2>
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Available</span>
                     </div>
                     <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 bg-[#FF4D4D] rounded-sm"></div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Booked</span>
                     </div>
                     <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 bg-[#00D1FF] rounded-sm"></div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Selected</span>
                     </div>
                  </div>
               </div>

               {/* Interactive Seat Map */}
               <div className="px-4 overflow-x-auto pb-6 scrollbar-hide">
                  <div className="min-w-[400px] flex flex-col items-center">
                     {/* Screen Indicator */}
                     <div className="w-2/3 h-1 bg-gray-100 rounded-full mb-16 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-300 uppercase tracking-[0.5em]">Screen This Way</div>
                     </div>

                     <div className="space-y-2">
                        {/* Rows are dynamically grouped by seat property 'row' */}
                        {Array.from(new Set(seats.map(s => s.row))).sort().map((row) => (
                           <div key={row} className="flex items-center space-x-2">
                              <span className="w-4 text-[10px] font-black text-gray-300">{row}</span>
                              <div className="flex space-x-1">
                                 {seats.filter(s => s.row === row).sort((a, b) => a.col - b.col).map((seat) => {
                                    const isReserved = seat.booked;
                                    const isSelected = selectedSeats.includes(seat._id);

                                    return (
                                       <button
                                          key={seat._id}
                                          disabled={isReserved}
                                          onClick={() => toggleSeat(seat._id)}
                                          title={seat.seat_number}
                                          className={`w-4 h-5 rounded-sm transition-all duration-200 ${isReserved ? 'bg-[#FF4D4D]/20 cursor-not-allowed border border-[#FF4D4D]/40' :
                                             isSelected ? 'bg-[#00D1FF] shadow-lg shadow-[#00D1FF]/30 scale-110' :
                                                'bg-gray-100 hover:bg-gray-200'
                                             }`}
                                       />
                                    );
                                 })}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Price Info Box */}
               <div className="px-4 mt-8">
                  <div className="bg-[#F5F8F8] border border-gray-100 p-4 rounded-2xl flex justify-between items-center">
                     <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Selection</span>
                        <span className="font-black text-gray-900">{selectedSeats.length} Tickets</span>
                     </div>
                     <div className="text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Deluxe Class</span>
                        <span className="text-lg font-black text-[#00898F]">Rs. {calculateTotal()}</span>
                     </div>
                  </div>
               </div>
            </section>
         ) : (
            <section className="mt-8 py-20 bg-white text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F0F5F5] rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#00898F]">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M21.75 12H19.5m-.166 5.834-1.591-1.591M12 19.5v2.25m-5.834-.166 1.591-1.591M2.25 12h2.25m.166-5.834 1.591 1.591" />
                  </svg>
               </div>
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-2">Select theatre and time slot</h3>
               <p className="text-xs text-gray-400 font-medium px-10">Choose your preferred cinema and timings to view the available seat layout</p>
            </section>
         )}

         {/* Action Bar */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
            <button
               onClick={handleProceed}
               disabled={!selectedShow || selectedSeats.length === 0}
               className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center ${!selectedShow || selectedSeats.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#1A1A1A] text-white shadow-[#1A1A1A]/20'
                  }`}
            >
               Proceed to Payment
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
               </svg>
            </button>
         </div>
      </div>
   );
};

export default TheatreSeatSelection;
