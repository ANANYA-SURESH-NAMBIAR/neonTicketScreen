import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TheatreAnalytics = () => {
   const navigate = useNavigate();
   const [analyticsData, setAnalyticsData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('ownerToken');
      if (!token) { navigate('/owner/login'); return; }

      const fetchAnalytics = async () => {
         try {
            console.log('Fetching theatre analytics data...');
            
            // First test the simple endpoint
            const testResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/analytics/test`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Owner test response status:', testResponse.status);
            
            if (testResponse.ok) {
               const testData = await testResponse.json();
               console.log('Owner test data received:', testData);
            } else {
               const errorText = await testResponse.text();
               console.error('Owner test error response:', errorText);
            }
            
            // Now try the real analytics endpoint
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/analytics`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Owner analytics response status:', response.status);
            
            if (!response.ok) {
               const errorText = await response.text();
               console.error('Owner analytics error response:', errorText);
               throw new Error(`Failed to fetch analytics: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Owner analytics data received:', data);
            setAnalyticsData(data);
         } catch (err) {
            console.error('Owner analytics fetch error:', err);
            // Don't navigate away on error, just show the error
            setAnalyticsData(null);
         } finally {
            setLoading(false);
         }
      };

      fetchAnalytics();
   }, [navigate]);

   if (loading) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
            <div className="text-center">
               <div className="w-10 h-10 border-4 border-[#00898F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading analytics...</p>
            </div>
         </div>
      );
   }

   if (!analyticsData) {
      return (
         <div className="min-h-screen bg-[#F0F5F5] flex items-center justify-center">
            <div className="text-center">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">No analytics data available</p>
               <p className="text-xs text-gray-500 mb-4">Please check if the backend server is running on port 5000</p>
               <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-[#00898F] text-white text-xs font-black rounded-lg uppercase tracking-widest hover:bg-[#00666B] transition-colors"
               >
                  Retry
               </button>
               <p className="text-xs text-gray-400 mt-4">Check browser console for detailed error information</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
         {/* Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center">
               <Link to="/owner/dashboard" className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00898F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
               </Link>
               <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">Theatre Analytics</h1>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black text-gray-900 uppercase">All-Time Analytics</p>
               {/* <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Demo Data</p> */}
            </div>
         </header>

         <main className="px-4 py-6 space-y-6">
            {/* Top Movies */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  Top Movies
               </h3>
               <div className="space-y-3">
                  {analyticsData.topMovies?.map((movie, index) => (
                     <div key={movie._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-black text-sm">
                              {index + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900">{movie.title}</p>
                              <p className="text-xs text-gray-400">{movie.bookings} bookings</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-[#00898F]">₹{movie.revenue.toLocaleString()}</p>
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

            {/* Top Earning Screen Types */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Top Earning Screen Types
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {analyticsData.topScreenTypes?.map((screen, index) => (
                     <div key={screen.type} className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-[#00898F] rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-3">
                           {index + 1}
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase">{screen.type}</p>
                        <p className="text-xs text-gray-400 mb-2">{screen.shows} shows</p>
                        <p className="text-lg font-black text-[#FF8C00]">₹{screen.revenue.toLocaleString()}</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Revenue</p>
                     </div>
                  )) || (
                     <div className="col-span-3 p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No screen data available</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Most Sold Time Slots */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  Most Sold Time Slots
               </h3>
               <div className="space-y-3">
                  {analyticsData.topTimeSlots?.map((slot, index) => (
                     <div key={slot.time} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-black text-sm">
                              {index + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900">{slot.time}</p>
                              <p className="text-xs text-gray-400">{slot.screens} screens</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-[#00898F]">{slot.occupancy}%</p>
                           <p className="text-xs text-gray-400">Occupancy</p>
                        </div>
                     </div>
                  )) || (
                     <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No time slot data available</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Top Selling Refreshments */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Top Selling Refreshments
               </h3>
               <div className="space-y-3">
                  {analyticsData.topRefreshments?.map((refreshment, index) => (
                     <div key={refreshment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-[#00898F] rounded-full flex items-center justify-center text-white font-black text-sm">
                              {index + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900">{refreshment.name}</p>
                              <p className="text-xs text-gray-400">{refreshment.quantity} sold</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-[#FF8C00]">₹{refreshment.revenue.toLocaleString()}</p>
                           <p className="text-xs text-gray-400">Revenue</p>
                        </div>
                     </div>
                  )) || (
                     <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No refreshment data available</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Revenue & Profit Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
                  <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                     Total Revenue
                  </h3>
                  <div className="text-center">
                     <p className="text-3xl font-black text-[#00898F] mb-2">₹{analyticsData.todayRevenue?.toLocaleString() || 0}</p>
                     <p className="text-xs text-gray-400 uppercase tracking-widest">Total Revenue</p>
                     <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                           <span className="text-gray-400">Tickets:</span>
                           <span className="font-black text-gray-900">₹{analyticsData.ticketRevenue?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-gray-400">Refreshments:</span>
                           <span className="font-black text-gray-900">₹{analyticsData.refreshmentRevenue?.toLocaleString() || 0}</span>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
                  <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                     Total Profit
                  </h3>
                  <div className="text-center">
                     <p className="text-3xl font-black text-[#FF8C00] mb-2">₹{analyticsData.todayProfit?.toLocaleString() || 0}</p>
                     <p className="text-xs text-gray-400 uppercase tracking-widest">Net Profit</p>
                     <div className="mt-4">
                        <div className="flex justify-between text-xs">
                           <span className="text-gray-400">Margin:</span>
                           <span className="font-black text-gray-900">{analyticsData.profitMargin || 0}%</span>
                        </div>
                     </div>
                  </div>
               </section>
            </div>

            {/* Screens Seat Ratio */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  All Screens - Seat Occupancy
               </h3>
               <div className="space-y-4">
                  {analyticsData.screenOccupancy?.map((screen) => (
                     <div key={screen._id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-sm font-black text-gray-900">{screen.name}</p>
                           <p className="text-xs text-gray-400">{screen.type}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                 <div 
                                    className="bg-[#00898F] h-3 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                                    style={{ width: `${screen.occupancyPercentage}%` }}
                                 >
                                    {screen.occupancyPercentage}%
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black text-gray-900">
                                 {screen.soldSeats}/{screen.totalSeats}
                              </p>
                              <p className="text-[8px] text-gray-400">Sold/Total</p>
                           </div>
                        </div>
                     </div>
                  )) || (
                     <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No screen occupancy data available</p>
                     </div>
                  )}
               </div>
            </section>
         </main>
      
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

export default TheatreAnalytics;
