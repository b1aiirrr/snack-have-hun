import React from 'react';

export default function Logo({ className }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
        <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
    </div>
  );
}