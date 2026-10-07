import React from 'react';

interface JhotiDividerProps {
  className?: string;
}

export const JhotiDivider: React.FC<JhotiDividerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center my-6 ${className}`}>
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#B8001F]/40 to-transparent flex-1" />
      <div className="px-4 flex items-center gap-2 text-[#B8001F]">
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
          <circle cx="50" cy="50" r="45" stroke="#B8001F" strokeWidth="3" strokeDasharray="4 4"/>
          <circle cx="50" cy="50" r="32" stroke="#D4AF37" strokeWidth="3"/>
          <circle cx="50" cy="50" r="18" fill="#B8001F" stroke="#FFD700" strokeWidth="2"/>
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="#D4AF37" strokeWidth="2" opacity="0.7"/>
          <circle cx="50" cy="50" r="6" fill="#FFD700" />
        </svg>
        <span className="text-xs font-serif-royal tracking-widest text-[#8B0000] font-extrabold uppercase drop-shadow-xs">
          Jharapada Durga Puja 2026
        </span>
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
          <circle cx="50" cy="50" r="45" stroke="#B8001F" strokeWidth="3" strokeDasharray="4 4"/>
          <circle cx="50" cy="50" r="32" stroke="#D4AF37" strokeWidth="3"/>
          <circle cx="50" cy="50" r="18" fill="#B8001F" stroke="#FFD700" strokeWidth="2"/>
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="#D4AF37" strokeWidth="2" opacity="0.7"/>
          <circle cx="50" cy="50" r="6" fill="#FFD700" />
        </svg>
      </div>
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#B8001F]/40 to-transparent flex-1" />
    </div>
  );
};
