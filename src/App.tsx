import React, { useState, useEffect, useRef } from 'react';
import { UserMode, UserProfile, RideOffer, RideRequest } from './types';
import { INITIAL_USERS, INITIAL_RIDES, INITIAL_REQUESTS } from './data/mockData';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { LandingHero } from './components/LandingHero';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { SafetySection } from './components/SafetySection';
import { RouteMatchModal } from './components/RouteMatchModal';
import { VerificationModal } from './components/VerificationModal';
import { SecurityRoadmapModal } from './components/SecurityRoadmapModal';
import { UserProfileModal } from './components/UserProfileModal';
import { 
  History, 
  Settings, 
  HelpCircle, 
  Edit3, 
  GraduationCap, 
  Briefcase,
  Trash2,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<UserMode>('passenger');
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  
  // Women-only mode should be false for male profiles
  const [womenOnlyMode, setWomenOnlyMode] = useState<boolean>(
    INITIAL_USERS[0].gender === 'female'
  );
  
  const [rides, setRides] = useState<RideOffer[]>(INITIAL_RIDES);
  const [requests, setRequests] = useState<RideRequest[]>(INITIAL_REQUESTS);

  // Active Tab: 'city' | 'history' | 'safety' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState<'city' | 'history' | 'safety' | 'settings' | 'help'>('city');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Search state
  const [searchCity, setSearchCity] = useState<string>('Islamabad');
  const [searchOrigin, setSearchOrigin] = useState<string>('');
  const [searchDest, setSearchDest] = useState<string>('');
  const ridesSectionRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedRideForMatch, setSelectedRideForMatch] = useState<RideOffer | null>(null);

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Initial Sync with Backend
  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      const [usersRes, ridesRes, reqsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/rides'),
        fetch('/api/requests'),
      ]);

      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (Array.isArray(uData) && uData.length > 0) setAllUsers(uData);
      }
      if (ridesRes.ok) {
        const rData = await ridesRes.json();
        if (Array.isArray(rData) && rData.length > 0) setRides(rData);
      }
      if (reqsRes.ok) {
        const qData = await reqsRes.json();
        if (Array.isArray(qData) && qData.length > 0) setRequests(qData);
      }
    } catch (e) {
      console.log('Backend sync fallback to local state:', e);
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    if (updatedUser.gender === 'male') {
      setWomenOnlyMode(false);
    }
    setAllUsers(allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    try {
      await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateNewUser = async (newUser: UserProfile) => {
    setAllUsers([newUser, ...allUsers]);
    setCurrentUser(newUser);
    if (newUser.gender === 'male') {
      setWomenOnlyMode(false);
    }

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostRide = async (newRideData: Omit<RideOffer, 'id' | 'driverId' | 'driverName' | 'driverGender' | 'driverAvatar' | 'driverRating' | 'isDriverVerified'>) => {
    const newRide: RideOffer = {
      ...newRideData,
      id: `ride_${Date.now()}`,
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverGender: currentUser.gender,
      driverAvatar: currentUser.avatar,
      driverRating: currentUser.rating,
      isDriverVerified: currentUser.verificationStatus === 'verified',
    };

    setRides([newRide, ...rides]);

    try {
      await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRide),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestRide = async (ride: RideOffer, note: string) => {
    const newReq: RideRequest = {
      id: `req_${Date.now()}`,
      rideId: ride.id,
      passengerId: currentUser.id,
      passengerName: currentUser.name,
      passengerGender: currentUser.gender,
      passengerAvatar: currentUser.avatar,
      isPassengerVerified: currentUser.verificationStatus === 'verified',
      pickupLocation: ride.origin,
      dropoffLocation: ride.destination,
      seatsRequested: 1,
      status: 'pending',
      matchPercentage: ride.routeMatchPercentage,
      fuelSharePkr: ride.costPerPersonPkr,
      requestTime: 'Just now',
      note,
    };

    setRequests([newReq, ...requests]);

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq),
      });
    } catch (e) {
      console.error(e);
    }

    alert(`Ride Request sent to ${ride.driverName}!`);
  };

  const handleAcceptRequest = async (reqId: string) => {
    setRequests(requests.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r)));
    try {
      await fetch(`/api/requests/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeclineRequest = async (reqId: string) => {
    setRequests(requests.filter((r) => r.id !== reqId));
    try {
      await fetch(`/api/requests/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined' }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelRequest = (reqId: string) => {
    setRequests(requests.filter((r) => r.id !== reqId));
  };

  const handleSearchFromHero = (city: string, origin: string, dest: string) => {
    setSearchCity(city);
    setSearchOrigin(origin);
    setSearchDest(dest);
    setMode('passenger');
  };

  const handleScrollToRides = () => {
    ridesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const driverRides = rides.filter((r) => r.driverId === currentUser.id);

  // User History: filtered to requests made by or for current user
  const userHistoryRequests = requests.filter(
    (r) => r.passengerId === currentUser.id || r.passengerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#132d20] flex flex-col font-sans selection:bg-[#115e3b] selection:text-white antialiased pb-12">
      
      {/* Sticky Header */}
      <Header
        mode={mode}
        setMode={setMode}
        currentUser={currentUser}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        womenOnlyMode={womenOnlyMode}
      />

      {/* Sidebar Navigation Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        mode={mode}
        setMode={setMode}
        womenOnlyMode={womenOnlyMode}
        setWomenOnlyMode={setWomenOnlyMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-4 space-y-6">
        
        {/* TAB 1: CITY (Search & Matches) */}
        {activeTab === 'city' && (
          <>
            <LandingHero
              mode={mode}
              setMode={setMode}
              currentUser={currentUser}
              womenOnlyMode={womenOnlyMode}
              setWomenOnlyMode={setWomenOnlyMode}
              onSearchSubmit={handleSearchFromHero}
              onScrollToRides={handleScrollToRides}
              onOpenVerification={() => setIsVerificationOpen(true)}
            />

            <div ref={ridesSectionRef} className="pt-2">
              {mode === 'driver' ? (
                <DriverView
                  currentUser={currentUser}
                  driverRides={driverRides}
                  rideRequests={requests}
                  onPostRide={handlePostRide}
                  onAcceptRequest={handleAcceptRequest}
                  onDeclineRequest={handleDeclineRequest}
                  womenOnlyMode={womenOnlyMode}
                />
              ) : (
                <PassengerView
                  currentUser={currentUser}
                  rides={rides}
                  womenOnlyMode={womenOnlyMode}
                  onSelectRideToMatch={(ride) => setSelectedRideForMatch(ride)}
                  onOpenVerification={() => setIsVerificationOpen(true)}
                  initialCity={searchCity}
                  initialOrigin={searchOrigin}
                  initialDest={searchDest}
                />
              )}
            </div>
          </>
        )}

        {/* TAB 2: REQUEST HISTORY (Real User Request History) */}
        {activeTab === 'history' && (
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#115e3b]" />
                <div>
                  <h2 className="text-xl font-black text-[#132d20]">Request History</h2>
                  <p className="text-xs text-neutral-500">Live requests for {currentUser.name}</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#e8f3ec] text-[#115e3b]">
                {userHistoryRequests.length} Requests
              </span>
            </div>

            {userHistoryRequests.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e8f3ec] text-[#115e3b] flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#132d20]">No ride requests made yet.</p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  When you request seats for matching rides, your live request history will appear here.
                </p>
                <button
                  onClick={() => setActiveTab('city')}
                  className="px-5 py-2.5 bg-[#115e3b] text-white font-bold text-xs rounded-2xl shadow-xs transition hover:bg-[#0e4d30] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Find Available Rides</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userHistoryRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-[#fbfcf9] border border-neutral-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={req.passengerAvatar || currentUser.avatar}
                          alt={req.passengerName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-[#115e3b]"
                        />
                        <span className="font-bold text-[#132d20]">{req.passengerName}</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-neutral-700 font-medium pt-1">
                      {req.pickupLocation} → {req.dropoffLocation}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/60 text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{req.requestTime || 'Just now'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#115e3b]">
                          Share: PKR {req.fuelSharePkr}
                        </span>

                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                          title="Remove request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAFETY */}
        {activeTab === 'safety' && (
          <SafetySection
            currentUser={currentUser}
            onOpenVerification={() => setIsVerificationOpen(true)}
            womenOnlyMode={womenOnlyMode}
            setWomenOnlyMode={setWomenOnlyMode}
          />
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 font-sans">
            <div className="px-1">
              <h1 className="text-3xl font-black text-[#132d20]">Settings</h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage your profile and preferences.
              </p>
            </div>

            {/* User Profile Summary Card */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#115e3b] shrink-0 bg-neutral-100"
                />

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#132d20] capitalize truncate">
                    {currentUser.name}
                  </h3>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    {currentUser.occupation === 'Employee' ? (
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span>
                      {currentUser.occupation || 'Student'} · {currentUser.gender === 'female' ? 'Female' : 'Male'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-4 py-2 bg-white border border-neutral-300 hover:border-[#115e3b] text-[#115e3b] font-bold text-xs rounded-2xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Logout / Switch Profile Card */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-4 shadow-xs text-center">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full py-2.5 text-xs font-bold text-[#115e3b] hover:text-[#0e4d30] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Change Name or Avatar</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: HELP */}
        {activeTab === 'help' && (
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#115e3b]" />
              <h2 className="text-xl font-black text-[#132d20]">Help & Support</h2>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <div className="p-3.5 bg-[#fbfcf9] rounded-2xl border border-neutral-200">
                <strong className="text-[#132d20] block mb-0.5">How does fuel split work?</strong>
                Commuters with matching routes split the actual fuel cost directly for shared rides.
              </div>
              <div className="p-3.5 bg-[#fbfcf9] rounded-2xl border border-neutral-200">
                <strong className="text-[#132d20] block mb-0.5">How to get Verified for Women-Only Mode?</strong>
                Self-declare as female and upload 1 identity document (Student ID Card, CNIC, or Employee Badge).
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="font-bold text-[#132d20]">EcoPool AI · Same direction. Half the fuel.</span>
          <span className="font-bold text-[#115e3b]">Split Petrol Fuel</span>
        </div>
      </footer>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleUpdateUser}
        onCreateNewProfile={handleCreateNewUser}
      />

      <RouteMatchModal
        isOpen={!!selectedRideForMatch}
        onClose={() => setSelectedRideForMatch(null)}
        ride={selectedRideForMatch}
        currentUser={currentUser}
        onRequestRide={handleRequestRide}
      />

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />

      <SecurityRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

    </div>
  );
}
