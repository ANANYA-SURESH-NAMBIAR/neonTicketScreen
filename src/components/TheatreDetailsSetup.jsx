 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TheatreDetailsSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('ownerToken');
      const response = await fetch('http://localhost:5000/api/owner/theatre/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create theatre');
      }

      setSuccess('Theatre created successfully!');
      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">Theatre Setup</h1>
        <div className="w-10 h-10 rounded-full bg-[#00898F]/10 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#00898F]">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
           </svg>
        </div>
      </header>

      <main className="px-4 py-8 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl text-center">
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest border-l-4 border-[#FF8C00] pl-4">Theatre Info</h3>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Name of Theatre *</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Enter theatre name" 
                     className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none" 
                     disabled={loading}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Address *</label>
                   <textarea 
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     placeholder="Full address of the theatre..." 
                     className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 outline-none h-24" 
                     disabled={loading}
                   />
                </div>
             </div>
          </section>

          <section className="bg-stone-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
             <h3 className="text-lg font-black text-white uppercase tracking-widest border-l-4 border-[#FF8C00] pl-4">Amenities & Configuration</h3>
             
             <div className="grid grid-cols-1 gap-4">
                {['Accessibility Accommodations', 'Refreshments Available', 'Types of Screen Available'].map(item => (
                  <div key={item} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/10">
                     <span className="text-sm font-bold text-white/80">{item}</span>
                     <button type="button" className="text-[#FF8C00] font-black text-[10px] uppercase tracking-widest">+ Add New</button>
                  </div>
                ))}
             </div>
          </section>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Theatre...' : 'Submit Theatre Details'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default TheatreDetailsSetup;