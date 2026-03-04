
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const MovieDetailsLoggedIn = () => {
   const { movieId } = useParams();
   const navigate = useNavigate();
   const [movie, setMovie] = useState(null);
   const [reviews, setReviews] = useState([]);
   const [showAllReviews, setShowAllReviews] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   // New Review States
   const [newRating, setNewRating] = useState(0);
   const [newReviewText, setNewReviewText] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');

   useEffect(() => {
      // Fetch Movie Details
      fetch(`${import.meta.env.VITE_API_URL}/api/movie/${movieId}`)
         .then(res => res.json())
         .then(data => setMovie(data))
         .catch(console.error);

      // Fetch Movie Reviews
      fetch(`${import.meta.env.VITE_API_URL}/api/movie/${movieId}/reviews`)
         .then(res => res.json())
         .then(data => setReviews(data))
         .catch(console.error);
   }, [movieId]);

   const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
   };

   const handleReviewSubmit = async () => {
      if (!newRating) {
         setSubmitError('Please select a rating before submitting.');
         return;
      }

      setIsSubmitting(true);
      setSubmitError('');

      try {
         const token = localStorage.getItem('token');
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/reviews`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
               movie: movieId,
               rating: newRating,
               review_text: newReviewText
            })
         });

         if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to submit review');
         }

         const addedReview = await response.json();
         // Prepend the new review to the list
         setReviews([addedReview, ...reviews]);
         setNewRating(0);
         setNewReviewText('');
      } catch (err) {
         setSubmitError(err.message);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (!movie) return <div className="min-h-screen bg-[#F0F5F5] font-sans flex items-center justify-center">Loading...</div>;

   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
         {/* Navigation Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center">
               <span className="text-2xl font-black text-[#FF8C00] tracking-tighter mr-2 italic">S</span>
               <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Screenema</h1>
            </div>
            <div className="flex items-center space-x-4">
               <div className="text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Kochi
               </div>

               {/* Profile Avatar & Menu Toggle */}
               <div className="relative">
                  <button
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     className="w-10 h-10 rounded-full bg-[#FF8C00]/10 border-2 border-[#FF8C00] flex items-center justify-center overflow-hidden transition-transform active:scale-90"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FF8C00]">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                     </svg>
                  </button>

                  {isMenuOpen && (
                     <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                        <button className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center">
                           Profile
                        </button>
                        <button
                           onClick={handleLogout}
                           className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center border-t border-gray-50"
                        >
                           Logout
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </header>

         {/* Breadcrumbs */}
         <nav className="px-4 py-3 bg-[#E5EEEE] text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center">
            <Link to="/home" className="hover:text-[#FF8C00]">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link to="/home" className="hover:text-[#FF8C00]">Movies</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-[#FF8C00]">{movie.title}</span>
         </nav>

         {/* Hero Section */}
         <section className="px-4 py-6 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
               {/* Poster */}
               <div
                  className="w-full md:w-64 aspect-[2/3] bg-stone-900 rounded-3xl shadow-2xl flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${movie.poster_url})` }}
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>

               {/* Details */}
               <div className="flex-1">
                  <h2 className="text-4xl font-black text-[#1A1A1A] leading-tight mb-2 tracking-tighter">{movie.title}</h2>

                  <div className="flex items-center mb-6">
                     <div className="flex text-[#FFB800] mr-2">
                        {[...Array(4)].map((_, i) => <span key={i} className="text-xl">★</span>)}
                        <span className="text-xl text-gray-200">★</span>
                     </div>
                     <span className="text-sm font-black text-gray-400">4.2/5.0</span>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                        <span className="font-bold text-gray-800 italic">{movie.duration}m</span>
                     </div>
                     <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Genres</span>
                        <span className="font-bold text-gray-800">{movie.genre}</span>
                     </div>
                     <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Language</span>
                        <span className="font-bold text-gray-800 underline decoration-[#FF8C00] decoration-2">{movie.language}</span>
                     </div>
                  </div>

                  <button onClick={() => navigate(`/book/${movieId}`)} className="w-full md:w-64 bg-[#FF8C00] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#FF8C00]/30 hover:bg-[#E67E00] transition-all active:scale-95 uppercase tracking-widest">
                     Book Tickets
                  </button>
               </div>
            </div>
         </section>

         {/* Trailer Section */}
         {movie.trailer_url && (
            <section className="px-4 py-10">
               <h3 className="text-xl font-black text-[#1A1A1A] mb-6 uppercase tracking-widest border-l-4 border-[#FF8C00] pl-4">Official Trailer</h3>
               <a href={movie.trailer_url} target="_blank" rel="noreferrer" className="block aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster_url})` }}>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                           <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.522-2.333 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.257.69-2.78-.217-2.78-1.642V5.653Z" clipRule="evenodd" />
                        </svg>
                     </div>
                  </div>
               </a>
            </section>
         )}

         {/* About The Movie */}
         <section className="px-4 py-10 bg-white border-y border-gray-100">
            <h3 className="text-xl font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">About the Movie</h3>
            <p className="text-gray-500 leading-relaxed text-sm italic">
               "{movie.description}"
            </p>
         </section>

         {/* Cast and Crew */}
         <section className="px-4 py-10 space-y-12">
            <div>
               <h3 className="text-xl font-black text-[#1A1A1A] mb-8 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-[#FF8C00] rounded-full mr-3"></span>
                  Cast
               </h3>
               <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                  {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex-shrink-0 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 border-4 border-white shadow-md mx-auto"></div>
                        <p className="text-[10px] font-black text-gray-900 uppercase">Actor Name</p>
                     </div>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="text-xl font-black text-[#1A1A1A] mb-8 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Crew
               </h3>
               <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 mb-3 border-2 border-dashed border-gray-200 mx-auto"></div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Director</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Reviews Section */}
         <section className="px-4 py-12 bg-[#E5EEEE] rounded-t-[3rem]">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tighter">Top Reviews</h3>
               {reviews.length > 2 && (
                  <button
                     onClick={() => setShowAllReviews(!showAllReviews)}
                     className="text-[#FF8C00] font-black text-xs uppercase tracking-widest underline decoration-2 offset-4"
                  >
                     {showAllReviews ? 'Show Less' : 'See More'}
                  </button>
               )}
            </div>

            <div className="space-y-6 mb-12">
               {reviews.length > 0 ? (
                  (showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                     <div key={review._id} className="bg-white p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#FF8C00]/10 mr-3"></div>
                              <span className="font-bold text-gray-900 text-sm italic">{review.user ? review.user.username : 'Anonymous'}</span>
                           </div>
                           <div className="text-[#FFB800] text-xs">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                           </div>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">
                           "{review.review_text}"
                        </p>
                     </div>
                  ))
               ) : (
                  <p className="text-center text-gray-500 font-bold italic py-8">no ratings or review till now</p>
               )}
            </div>

            {/* Add Review Component (Logged In Only) */}
            <div className="bg-[#B3D1D4] p-8 rounded-[2.5rem] border border-white/30 shadow-inner">
               <h4 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest text-center">Share your thoughts</h4>

               {submitError && (
                  <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-bold mb-4">
                     {submitError}
                  </div>
               )}

               <div className="flex justify-center space-x-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-3xl transition-colors ${star <= newRating ? 'text-[#FFB800]' : 'text-white/50 hover:text-[#FFB800]/70'}`}
                     >
                        ★
                     </button>
                  ))}
               </div>
               <textarea
                  placeholder="Write your review here..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-white/50 border border-white/50 rounded-2xl p-4 text-sm focus:bg-white outline-none transition-all h-32 mb-6"
               />
               <button
                  onClick={handleReviewSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
               >
                  {isSubmitting ? 'Posting...' : 'Post Review'}
               </button>
            </div>
         </section>
      </div>
   );
};

export default MovieDetailsLoggedIn;