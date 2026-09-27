import React from 'react';
import { UserProfile, UserMode } from '../types';
import { 
  X, 
  MapPin, 
  History, 
  ShieldCheck, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  Car,
  Edit3
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  mode: UserMode;
  setMode: (m: UserMode) => void;
  womenOnlyMode: boolean;
  setWomenOnlyMode: (val: boolean) => void;
  activeTab: 'city' | 'history' | 'safety' | 'settings' | 'help';
  setActiveTab: (tab: 'city' | 'history' | 'safety' | 'settings' | 'help') => void;
  onOpenVerification: () => void;
  onOpenProfileModal: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  womenOnlyMode,
  setWomenOnlyMode,
  activeTab,
  setActiveTab,
  onOpenVerification,
  onOpenProfileModal,
}) => {
  if (!isOpen) return null;

  const handleTabClick = (tab: 'city' | 'history' | 'safety' | 'settings' | 'help') => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-80 max-w-[85vw] bg-[#181818] text-white h-full flex flex-col shadow-2xl z-10 border-r border-neutral-800 animate-slideRight">
        
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between border-b border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0e5d3e] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              ECOPOOL <span className="text-[#36b37e]">AI</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card (No fake names dropdown) */}
        <div className="p-5 border-b border-neutral-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0e5d3e] bg-neutral-800"
              />

              <div>
                <div className="text-base font-bold text-white capitalize">{currentUser.name}</div>
                <div className="text-xs text-neutral-400 capitalize">
                  {currentUser.occupation || 'Commuter'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenProfileModal();
              }}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 rounded-lg border border-neutral-700 transition flex items-center gap-1 cursor-pointer shrink-0"
              title="Edit custom name & details"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Quick Women Verification Status */}
          {currentUser.gender === 'female' && (
            <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-pink-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Women Verification
              </span>
              {currentUser.verificationStatus === 'verified' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Verified ✓
                </span>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVerification();
                  }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700 hover:bg-pink-900 transition cursor-pointer"
                >
                  Verify Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          
          <button
            onClick={() => handleTabClick('city')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === 'city'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-neutral-400" />
              <span>City</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <button
            onClick={() => handleTabClick('history')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-neutral-400" />
              <span>Request history</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <button
            onClick={() => handleTabClick('safety')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-400" />
              <span>Safety</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-neutral-400" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <button
            onClick={() => handleTabClick('help')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === 'help'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-neutral-400" />
              <span>Help</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Bottom Women-Only Toggle Card */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs font-bold text-pink-200">🌸 Women-Only Mode</span>
            </div>

            <button
              onClick={() => {
                if (currentUser.gender !== 'female' && !womenOnlyMode) {
                  alert('Women-Only Mode is reserved for female profiles.');
                  return;
                }
                setWomenOnlyMode(!womenOnlyMode);
              }}
              className={`px-3 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                womenOnlyMode
                  ? 'bg-pink-500 text-white shadow'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {womenOnlyMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
