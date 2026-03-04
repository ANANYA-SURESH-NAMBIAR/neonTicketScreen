import React, { useState, useEffect } from 'react';

const Rankings = () => {
   const [rankingsData, setRankingsData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRankings = async () => {
         try {
            console.log('Fetching admin rankings data...');
            
            // First test the simple endpoint
            const testResponse = await fetch('http://localhost:5000/api/admin/test', {
               headers: { 
                  'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`,
                  'Content-Type': 'application/json'
               }
            });
            console.log('Test response status:', testResponse.status);
            
            if (testResponse.ok) {
               const testData = await testResponse.json();
               console.log('Test data received:', testData);
            } else {
               const errorText = await testResponse.text();
               console.error('Test error response:', errorText);
            }
            
            // Now try the real rankings endpoint
            const response = await fetch('http://localhost:5000/api/admin/rankings', {
               headers: { 
                  'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`,
                  'Content-Type': 'application/json'
               }
            });
            console.log('Rankings response status:', response.status);
            
            if (!response.ok) {
               const errorText = await response.text();
               console.error('Error response:', errorText);
               throw new Error(`Failed to fetch rankings: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Rankings data received:', data);
            setRankingsData(data);
         } catch (err) {
            console.error('Rankings fetch error:', err);
            setRankingsData(null);
         } finally {
            setLoading(false);
         }
      };

      fetchRankings();
   }, []);

   if (loading) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
            <div className="text-center">
               <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading rankings...</p>
            </div>
         </div>
      );
   }

   if (!rankingsData) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
            <div className="text-center">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">No rankings data available</p>
               <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-[#00898F] text-white text-xs font-black rounded-lg uppercase tracking-widest hover:bg-[#00666B] transition-colors"
               >
                  Retry
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-2">Today's Rankings</h2>
            <p className="text-sm text-gray-400 uppercase tracking-widest">Real-time performance metrics</p>
         </div>

         {/* Top Movies */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
               Today's Top Movies
            </h3>
            <div className="space-y-4">
               {rankingsData.topMovies?.map((movie, index) => (
                  <div key={movie._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#00898F] rounded-full flex items-center justify-center text-white text-xs font-black">
                           {index + 1}
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900">{movie.title}</p>
                           <p className="text-xs text-gray-400">{movie.bookings} bookings</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-[#00898F]">₹{movie.revenue?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-400">Revenue</p>
                     </div>
                  </div>
               )) || (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No movie data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Top Screen Types */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
               Today's Top Earning Screen Types
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {rankingsData.topScreenTypes?.map((screenType, index) => (
                  <div key={screenType.type} className="bg-gray-50 rounded-xl p-4 text-center">
                     <div className="w-12 h-12 bg-[#FF8C00] rounded-full flex items-center justify-center text-white text-lg font-black mx-auto mb-3">
                        {index + 1}
                     </div>
                     <p className="text-sm font-black text-gray-900">{screenType.type}</p>
                     <p className="text-xs text-gray-400">{screenType.shows} shows</p>
                     <p className="text-lg font-black text-[#FF8C00] mt-2">₹{screenType.revenue?.toLocaleString() || 0}</p>
                  </div>
               )) || (
                  <div className="col-span-3 p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No screen type data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Top Selling Refreshments */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#4CAF50] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#4CAF50]/20">
               Today's Top Selling Refreshments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
               {rankingsData.topRefreshments?.map((refreshment, index) => (
                  <div key={refreshment._id} className="bg-gray-50 rounded-xl p-4 text-center">
                     <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center text-white text-xs font-black mx-auto mb-2">
                        {index + 1}
                     </div>
                     <p className="text-xs font-black text-gray-900 truncate">{refreshment.name}</p>
                     <p className="text-xs text-gray-400">{refreshment.quantity} units</p>
                     <p className="text-sm font-black text-[#4CAF50] mt-1">₹{refreshment.revenue?.toLocaleString() || 0}</p>
                  </div>
               )) || (
                  <div className="col-span-2 sm:col-span-5 p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No refreshment data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Most Sold Time Slots */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#9C27B0] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#9C27B0]/20">
               Today's Most Sold Time Slots
            </h3>
            <div className="space-y-3">
               {rankingsData.topTimeSlots?.map((timeSlot, index) => (
                  <div key={timeSlot.time} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#9C27B0] rounded-full flex items-center justify-center text-white text-xs font-black">
                           {index + 1}
                        </div>
                        <p className="text-sm font-black text-gray-900">{timeSlot.time}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-400">{timeSlot.screens} screens</p>
                        <div className="text-right">
                           <p className="text-sm font-black text-[#9C27B0]">{timeSlot.occupancy}%</p>
                           <p className="text-xs text-gray-400">Occupancy</p>
                        </div>
                     </div>
                  </div>
               )) || (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No time slot data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Best Performing Theatres */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#2196F3] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#2196F3]/20">
               Today's Best Performing Theatres
            </h3>
            <div className="space-y-4">
               {rankingsData.topTheatres?.map((theatre, index) => (
                  <div key={theatre._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#2196F3] rounded-full flex items-center justify-center text-white text-xs font-black">
                           {index + 1}
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900">{theatre.name}</p>
                           <p className="text-xs text-gray-400">{theatre.location}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-[#2196F3]">₹{theatre.revenue?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-400">{theatre.occupancy}% occupancy</p>
                     </div>
                  </div>
               )) || (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No theatre data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Theatre Occupancy */}
         <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
            <h3 className="text-[10px] font-black text-white bg-[#FF5722] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF5722]/20">
               All Theatres Today's Sold:Unsold Seats Ratio
            </h3>
            <div className="space-y-4">
               {rankingsData.theatreOccupancy?.map((theatre) => (
                  <div key={theatre._id} className="bg-gray-50 rounded-xl p-4">
                     <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-black text-gray-900">{theatre.name}</p>
                        <p className="text-xs text-gray-400">{theatre.location}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="flex-1">
                           <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                 className="bg-[#FF5722] h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                                 style={{ width: `${theatre.occupancyPercentage}%` }}
                              >
                                 {theatre.occupancyPercentage}%
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black text-gray-900">
                              {theatre.soldSeats}/{theatre.totalSeats}
                           </p>
                           <p className="text-[8px] text-gray-400">Sold/Total</p>
                        </div>
                     </div>
                  </div>
               )) || (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No occupancy data available</p>
                  </div>
               )}
            </div>
         </section>

         {/* Revenue & Profit Overview */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  Today's Revenue
               </h3>
               <div className="text-center">
                  <p className="text-3xl font-black text-[#00898F] mb-2">₹{rankingsData.todayRevenue?.toLocaleString() || 0}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Total Revenue</p>
                  <div className="mt-4 space-y-2">
                     <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Ticket Revenue</span>
                        <span className="font-black text-gray-900">₹{rankingsData.ticketRevenue?.toLocaleString() || 0}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Refreshment Revenue</span>
                        <span className="font-black text-gray-900">₹{rankingsData.refreshmentRevenue?.toLocaleString() || 0}</span>
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Today's Profits
               </h3>
               <div className="text-center">
                  <p className="text-3xl font-black text-[#FF8C00] mb-2">₹{rankingsData.todayProfit?.toLocaleString() || 0}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Total Profit</p>
                  <div className="mt-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF8C00]/10 rounded-full">
                        <span className="text-xs font-black text-[#FF8C00]">{rankingsData.profitMargin || 0}%</span>
                        <span className="text-xs text-gray-400">Profit Margin</span>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
   );
};

export default Rankings;
