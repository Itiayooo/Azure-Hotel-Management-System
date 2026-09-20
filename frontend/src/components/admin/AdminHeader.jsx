import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between pb-6 pt-2 font-['Mona_Sans',sans-serif]">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-72">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white border border-gray-100 rounded-full pl-10 pr-4 py-2 text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D46]/20 shadow-sm"
          />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#8C6D46] text-white flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-left leading-tight pr-2">
            <p className="text-xs font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>

        {/* Action Icons */}
        <button className="w-9 h-9 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
          </svg>
        </button>

        <button className="w-9 h-9 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;