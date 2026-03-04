import React, { useState, useEffect } from 'react';
import MessageLayout from './MessageLayout';

const SendMessageContent = () => {
   const [message, setMessage] = useState('');
   const [recipientType, setRecipientType] = useState('all');
   const [selectedTheatres, setSelectedTheatres] = useState([]);
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [theatres, setTheatres] = useState([]);
   const [theatresLoading, setTheatresLoading] = useState(true);
   const [priority, setPriority] = useState('medium');
   const [messageType, setMessageType] = useState('info');

   useEffect(() => {
      const fetchTheatres = async () => {
         try {
            const response = await fetch('http://localhost:5000/api/theatres', {
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`
               }
            });
            
            if (response.ok) {
               const data = await response.json();
               setTheatres(data);
            } else {
               console.error('Failed to fetch theatres');
               // Fallback to dummy data if API fails
               setTheatres([
                  { _id: '1', name: 'PVR Cinemas', location: 'Mumbai' },
                  { _id: '2', name: 'INOX', location: 'Delhi' },
                  { _id: '3', name: 'Cinepolis', location: 'Bangalore' },
                  { _id: '4', name: 'Carnival', location: 'Chennai' },
                  { _id: '5', name: 'PVR', location: 'Kolkata' }
               ]);
            }
         } catch (err) {
            console.error('Error fetching theatres:', err);
            // Fallback to dummy data
            setTheatres([
               { _id: '1', name: 'PVR Cinemas', location: 'Mumbai' },
               { _id: '2', name: 'INOX', location: 'Delhi' },
               { _id: '3', name: 'Cinepolis', location: 'Bangalore' },
               { _id: '4', name: 'Carnival', location: 'Chennai' },
               { _id: '5', name: 'PVR', location: 'Kolkata' }
            ]);
         } finally {
            setTheatresLoading(false);
         }
      };

      // Test the admin message endpoint when component loads
      const testAdminMessage = async () => {
         try {
            console.log('Testing admin message creation...');
            const response = await fetch('http://localhost:5000/api/admin/test-message', {
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`
               }
            });
            
            if (response.ok) {
               const result = await response.json();
               console.log('Test message result:', result);
            } else {
               const errorText = await response.text();
               console.error('Test message error:', errorText);
            }
         } catch (err) {
            console.error('Test message fetch error:', err);
         }
      };

      fetchTheatres();
      testAdminMessage();
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
         let endpoint;
         let payload = {
            subject: 'Admin Notification',
            message,
            priority,
            messageType
         };

         if (recipientType === 'all') {
            endpoint = 'http://localhost:5000/api/admin/messages/send-all';
            console.log('Sending to all theatres');
         } else if (recipientType === 'specific' && selectedTheatres.length > 0) {
            endpoint = 'http://localhost:5000/api/admin/messages/send';
            // Find the selected theatre to get its owner ID
            const selectedTheatre = theatres.find(t => t._id === selectedTheatres[0]);
            if (selectedTheatre && selectedTheatre.owner) {
               payload.ownerId = selectedTheatre.owner; // Use actual owner ID from theatre
               payload.theatreId = selectedTheatres[0]; // Theatre ID
               console.log('Sending to specific theatre:', selectedTheatres[0], 'Owner:', selectedTheatre.owner);
            } else {
               throw new Error('Selected theatre not found or has no owner');
            }
         } else {
            throw new Error('Please select recipients');
         }

         console.log('Sending message with payload:', payload);
         console.log('Endpoint:', endpoint);

         const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'test-token'}`
            },
            body: JSON.stringify(payload)
         });

         console.log('Response status:', response.status);
         console.log('Response headers:', response.headers);

         if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`Failed to send message: ${response.status}`);
         }
         
         const result = await response.json();
         console.log('Message sent result:', result);
         
         setSuccess(true);
         setMessage('');
         setSelectedTheatres([]);
         
         setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
         console.error('Send message error:', err);
         setSuccess(false);
      } finally {
         setLoading(false);
      }
   };

   const handleTheatreToggle = (theatreId) => {
      setSelectedTheatres(prev => 
         prev.includes(theatreId) 
            ? prev.filter(id => id !== theatreId)
            : [...prev, theatreId]
      );
   };

   return (
      <div className="max-w-4xl mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-2">Send Message</h2>
            <p className="text-sm text-gray-400 uppercase tracking-widest">Broadcast to theatre owners</p>
         </div>

         {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
               <p className="text-sm font-black text-green-800 uppercase tracking-widest">Message sent successfully!</p>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Content */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#00898F] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#00898F]/20">
                  Message Content
               </h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Subject</label>
                     <input
                        type="text"
                        value="Admin Notification"
                        disabled
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Message Type</label>
                     <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                     >
                        <option value="info">Info</option>
                        <option value="notification">Notification</option>
                        <option value="warning">Warning</option>
                        <option value="alert">Alert</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Priority</label>
                     <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent"
                     >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-black text-gray-900 mb-2">Message *</label>
                     <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00898F] focus:border-transparent resize-none"
                        rows={6}
                        placeholder="Enter your message here..."
                        required
                     />
                  </div>
               </div>
            </section>

            {/* Recipient Selection */}
            <section className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-white bg-[#FF8C00] px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-[#FF8C00]/20">
                  Recipients
               </h3>
               <div className="space-y-4">
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input
                           type="radio"
                           value="all"
                           checked={recipientType === 'all'}
                           onChange={(e) => setRecipientType(e.target.value)}
                           className="w-4 h-4 text-[#00898F] focus:ring-[#00898F]"
                        />
                        <span className="text-sm font-black text-gray-900">All Theatre Owners</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input
                           type="radio"
                           value="specific"
                           checked={recipientType === 'specific'}
                           onChange={(e) => setRecipientType(e.target.value)}
                           className="w-4 h-4 text-[#00898F] focus:ring-[#00898F]"
                        />
                        <span className="text-sm font-black text-gray-900">Specific Theatres</span>
                     </label>
                  </div>

                  {recipientType === 'specific' && (
                     <div className="mt-4">
                        <p className="text-sm font-black text-gray-900 mb-3">Select Theatres</p>
                        {theatresLoading ? (
                           <div className="text-center py-4">
                              <p className="text-sm text-gray-400">Loading theatres...</p>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {theatres.map((theatre) => (
                                 <label key={theatre._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                       type="checkbox"
                                       checked={selectedTheatres.includes(theatre._id)}
                                       onChange={() => handleTheatreToggle(theatre._id)}
                                       className="w-4 h-4 text-[#00898F] focus:ring-[#00898F]"
                                    />
                                    <div>
                                       <p className="text-sm font-black text-gray-900">{theatre.name}</p>
                                       <p className="text-xs text-gray-400">{theatre.location || theatre.city || 'Unknown Location'}</p>
                                    </div>
                                 </label>
                              ))}
                           </div>
                        )}
                        {!theatresLoading && selectedTheatres.length === 0 && (
                           <p className="text-xs text-gray-400 mt-2">Please select at least one theatre</p>
                        )}
                     </div>
                  )}
               </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center">
               <button
                  type="submit"
                  disabled={loading || !message || (recipientType === 'specific' && selectedTheatres.length === 0)}
                  className="px-8 py-3 bg-[#00898F] text-white text-sm font-black rounded-lg uppercase tracking-widest hover:bg-[#00666B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? 'Sending...' : 'Send Message'}
               </button>
            </div>
         </form>
      </div>
   );
};

const SendMessage = () => {
   return (
      <MessageLayout>
         <SendMessageContent />
      </MessageLayout>
   );
};

export default SendMessage;
