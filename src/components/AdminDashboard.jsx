import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('rankings');
   const navigate = useNavigate();

   const handleLogout = () => {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
   };
   const location = useLocation();

   const tabs = [
      { id: 'rankings', label: 'Rankings', icon: '🏆', path: '/admin/dashboard' },
      { id: 'message', label: 'Send Message', icon: '📧', path: '/admin/message' },
      { id: 'movie', label: 'Add New Movie', icon: '🎬', path: '/admin/dashboard/add-movie' }
   ];

   // Update active tab based on current location
   React.useEffect(() => {
      const currentPath = location.pathname;
      if (currentPath === '/admin/dashboard') {
         setActiveTab('rankings');
      } else if (currentPath === '/admin/message') {
         setActiveTab('message');
      } else if (currentPath === '/admin/dashboard/add-movie') {
         setActiveTab('movie');
      }
   }, [location]);

   const handleTabClick = (tab) => {
      setActiveTab(tab.id);
      navigate(tab.path);
   };

   return (
      <div className="min-h-screen bg-[#F0F5F5] font-sans flex flex-col">
         {/* Header */}
         <header className="px-4 py-4 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
               <div className="flex items-center">
                  <h1 className="text-xl font-black text-gray-900 uppercase tracking-wider">Admin Dashboard</h1>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-400">Administrator</span>
                     <div className="w-8 h-8 bg-[#00898F] rounded-full flex items-center justify-center text-white text-xs font-black">
                        A
                     </div>
                  </div>
                  <button
                     onClick={handleLogout}
                     className="px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-lg uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                     Logout
                  </button>
               </div>
            </div>
         </header>

         {/* Navigation Tabs */}
         <div className="bg-white border-b border-gray-100 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4">
               <div className="flex space-x-8">
                  {tabs.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                           activeTab === tab.id
                              ? 'border-[#00898F] text-[#00898F]'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                     >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Content */}
         <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 py-8">
               <Outlet />
            </div>
         </main>

         {/* Footer */}
         <footer className="px-4 py-6 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="max-w-7xl mx-auto text-center">
               <p className="text-sm text-gray-400 uppercase tracking-widest">Screenema 2026</p>
            </div>
         </footer>
      </div>
   );
};

export default AdminDashboard;
