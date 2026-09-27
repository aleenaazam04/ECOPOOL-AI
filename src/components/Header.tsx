import React from 'react';
import { UserMode, UserProfile } from '../types';
import { Menu, MapPin } from 'lucide-react';

interface HeaderProps {
  mode: UserMode;
  setMode: (m: UserMode) => void;
  currentUser: UserProfile;
  onOpenSidebar: () => void;
  womenOnlyMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  onOpenSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-neutral-200/80 px-4 py-3 font-sans transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* Left Hamburger Button */}
        <button
          onClick={onOpenSidebar}
          className="w-11 h-11 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-[#115e3b] transition shadow-2xs cursor-pointer active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Brand Logo - ECOPOOL AI */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#115e3b] flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#181818] font-sans flex items-center gap-1">
            ECOPOOL <span className="text-[#115e3b]">AI</span>
          </span>
        </div>

        {/* Right Active Mode Pill */}
        <button
          onClick={() => setMode(mode === 'driver' ? 'passenger' : 'driver')}
          className="px-4 py-2 rounded-full bg-[#e8f3ec] hover:bg-[#dbeee1] text-[#115e3b] text-xs font-semibold tracking-wide transition flex items-center gap-1.5 border border-[#c4e3d0]/60 active:scale-95 cursor-pointer"
          title="Click to toggle Driver / Passenger Mode"
        >
          <span className="capitalize">{mode === 'driver' ? 'Driver' : 'Passenger'}</span>
        </button>

      </div>
    </header>
  );
};
