import React, { useState } from 'react';

const AddNewMovie = () => {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      duration: '',
      genre: '',
      releaseDate: '',
      language: '',
      poster: null,
      trailerUrl: '',
      rating: ''
   });
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);

   const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation'];
   const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];
   const ratings = ['U', 'U/A', 'A', 'S'];

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handlePosterChange = (e) => {
      setFormData(prev => ({
         ...prev,
         poster: e.target.files[0]
      }));
   };


   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
         console.log('Form data being submitted:', formData);
         
         const formDataToSend = new FormData();
         Object.keys(formData).forEach(key => {
            if (key === 'poster' && formData[key]) {
               formDataToSend.append(key, formData[key]);
               console.log('Adding poster file:', formData[key]);
            } else if (key !== 'poster') {
               formDataToSend.append(key, formData[key]);
               console.log(`Adding field ${key}:`, formData[key]);
            }
         });

         console.log('FormData contents:');
         for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
         }

         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-movie`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`
            },
            body: formDataToSend
         });

         console.log('Response status:', response.status);
         console.log('Response headers:', response.headers);

         if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`Failed to add movie: ${response.status}`);
         }
         
         const result = await response.json();
         console.log('Movie added result:', result);
         
         setSuccess(true);
         setFormData({
            title: '',
            description: '',
            duration: '',
            genre: '',
            releaseDate: '',
            language: '',
            poster: null,
            trailerUrl: '',
            rating: ''
         });
         
         setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
         console.error('Add movie error:', err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-2">Add New Movie</h2>
            <p className="text-sm text-gray-400 uppercase tracking-widest">Add new movie to the database</p>
         </div>

         {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
               <p className="text-sm font-black text-green-800 uppercase tracking-widest">Movie added successfully!</p>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  Basic Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Title *</label>
                     <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        placeholder="Enter movie title"
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Duration (minutes) *</label>
                     <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        placeholder="120"
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Genre *</label>
                     <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        required
                     >
                        <option value="">Select genre</option>
                        {genres.map(genre => (
                           <option key={genre} value={genre}>{genre}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Language *</label>
                     <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        required
                     >
                        <option value="">Select language</option>
                        {languages.map(lang => (
                           <option key={lang} value={lang}>{lang}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Release Date *</label>
                     <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Rating *</label>
                     <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                        required
                     >
                        <option value="">Select rating</option>
                        {ratings.map(rating => (
                           <option key={rating} value={rating}>{rating}</option>
                        ))}
                     </select>
                  </div>
               </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Description
               </h3>
               <div>
                  <label className="block text-sm font-black text-gray-900 mb-2">Movie Description *</label>
                  <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent resize-none"
                     rows={4}
                     placeholder="Enter movie description..."
                     required
                  />
               </div>
            </section>

            {/* Trailer URL */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#4CAF50] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#4CAF50]/20">
                  Trailer URL
               </h3>
               <div>
                  <label className="block text-sm font-black text-gray-900 mb-2">Trailer URL</label>
                  <input
                     type="url"
                     name="trailerUrl"
                     value={formData.trailerUrl}
                     onChange={handleChange}
                     className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                     placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-400 mt-2">Enter YouTube or other video platform URL for movie trailer</p>
               </div>
            </section>

            {/* Poster */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#9C27B0] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#9C27B0]/20">
                  Movie Poster
               </h3>
               <div>
                  <label className="block text-sm font-black text-gray-900 mb-2">Movie Poster</label>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handlePosterChange}
                     className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-2">Upload movie poster image (JPG, PNG, etc.). Will be stored securely in Cloudinary cloud storage.</p>
               </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center">
               <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#00898F] text-white text-sm font-black rounded-lg uppercase tracking-widest hover:bg-[#00666B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? 'Adding Movie...' : 'Add Movie'}
               </button>
            </div>
         </form>
      </div>
   );
};

export default AddNewMovie;
