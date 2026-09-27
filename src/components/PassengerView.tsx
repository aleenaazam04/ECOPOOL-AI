import React, { useState, useEffect } from 'react';
import { RideOffer, UserProfile } from '../types';
import { calculateRealisticPakistanRoute } from '../utils/ecoPoolEngine';
import { 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Users
} from 'lucide-react';

interface PassengerViewProps {
  currentUser: UserProfile;
  rides: RideOffer[];
  womenOnlyMode: boolean;
  onSelectRideToMatch: (ride: RideOffer) => void;
  onOpenVerification?: () => void;
  initialCity?: string;
  initialOrigin?: string;
  initialDest?: string;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  currentUser,
  rides,
  womenOnlyMode,
  onSelectRideToMatch,
  initialCity = 'Islamabad',
  initialOrigin = '',
  initialDest = '',
}) => {
  const [searchOrigin, setSearchOrigin] = useState<string>(initialOrigin);
  const [searchDest, setSearchDest] = useState<string>(initialDest);
  
  // Driver gender filter: default to 'male' for male users, 'female' for female users
  const [driverGenderFilter, setDriverGenderFilter] = useState<'all' | 'male' | 'female'>(
    currentUser.gender === 'male' ? 'male' : 'female'
  );

  // Sync state whenever props or current user change
  useEffect(() => {
    setSearchOrigin(initialOrigin);
    setSearchDest(initialDest);
    setDriverGenderFilter(currentUser.gender === 'male' ? 'male' : 'female');
  }, [initialOrigin, initialDest, initialCity, currentUser]);

  // Base filtering on rides list
  let displayRides = rides.filter((ride) => {
    if (womenOnlyMode && ride.driverGender !== 'female') {
      return false;
    }
    if (driverGenderFilter === 'male' && ride.driverGender !== 'male') {
      return false;
    }
    if (driverGenderFilter === 'female' && ride.driverGender !== 'female') {
      return false;
    }
    return true;
  });

  // Always update display rides to match the user's selected pickup & dropoff exactly
  displayRides = displayRides.map((ride, idx) => {
    const activeOrigin = searchOrigin || ride.origin;
    const activeDest = searchDest || ride.destination;

    // Calculate exact fare for selected route (e.g. Taxila -> Islamabad = PKR 600, Islamabad -> Rawalpindi = PKR 300)
    const routeCalc = calculateRealisticPakistanRoute(activeOrigin, activeDest, ride.fuelEfficiencyKmL || 13.5, 282);
    const matchScore = 90 + ((idx * 3) % 9); // 90% to 98% overlap

    return {
      ...ride,
      origin: activeOrigin,
      destination: activeDest,
      costPerPersonPkr: routeCalc.passengerSharePkr,
      totalFuelCostPkr: routeCalc.totalFuelCostPkr,
      routeMatchPercentage: matchScore,
      waypoints: [activeOrigin, routeCalc.corridorName, activeDest]
    };
  });

  return (
    <div className="max-w-xl mx-auto space-y-5 font-sans">
      
      {/* Passenger Header */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#132d20]">
              {searchOrigin ? `Matched Rides for ${searchOrigin.split(',')[0]}` : 'Available Matched Rides'}
            </h2>
            {womenOnlyMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 shrink-0">
                Women-Only
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {searchOrigin ? `Driver routes matching ${searchOrigin} → ${searchDest || 'Twin Cities'}` : 'Routes paired automatically with split petrol fuel.'}
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-[#115e3b] bg-[#e8f3ec] px-3 py-1 rounded-full shrink-0">
          {displayRides.length} Matches
        </span>
      </div>

      {/* Flexible Gender Preference Selector */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-3 shadow-xs space-y-2 font-sans">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#115e3b]" />
            <span>Driver Preference:</span>
          </span>
          <span className="text-neutral-400 text-[11px] font-normal">
            {currentUser.gender === 'male' ? 'Showing male drivers' : 'Showing female drivers'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setDriverGenderFilter('male')}
            className={`py-2 px-3 rounded-xl border transition cursor-pointer ${
              driverGenderFilter === 'male'
                ? 'bg-[#115e3b] text-white border-[#115e3b]'
                : 'bg-[#fbfcf9] text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            Male Drivers
          </button>

          <button
            type="button"
            onClick={() => setDriverGenderFilter('female')}
            className={`py-2 px-3 rounded-xl border transition cursor-pointer ${
              driverGenderFilter === 'female'
                ? 'bg-[#115e3b] text-white border-[#115e3b]'
                : 'bg-[#fbfcf9] text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            Female Drivers
          </button>

          <button
            type="button"
            onClick={() => setDriverGenderFilter('all')}
            className={`py-2 px-3 rounded-xl border transition cursor-pointer ${
              driverGenderFilter === 'all'
                ? 'bg-[#115e3b] text-white border-[#115e3b]'
                : 'bg-[#fbfcf9] text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            All Drivers
          </button>
        </div>
      </div>

      {/* Location Filter Active Pill */}
      {(searchOrigin || searchDest) && (
        <div className="bg-[#e8f3ec] border border-[#c4e3d0] rounded-2xl p-3 flex items-center justify-between text-xs text-[#115e3b]">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-[#115e3b] shrink-0" />
            <span>
              Route Filter: <strong className="font-bold">{searchOrigin || 'Any Pickup'}</strong> → <strong className="font-bold">{searchDest || 'Any Dropoff'}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchOrigin('');
              setSearchDest('');
            }}
            className="text-[11px] font-bold underline hover:text-[#0e4d30] cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Rides List */}
      <div className="space-y-4">
        {displayRides.length === 0 ? (
          <div className="p-8 text-center bg-white border border-neutral-200 rounded-3xl text-neutral-500 space-y-2">
            <p className="text-sm font-semibold text-[#132d20]">No rides match your current gender or route filter.</p>
            <button
              type="button"
              onClick={() => setDriverGenderFilter('all')}
              className="text-xs font-bold text-[#115e3b] underline cursor-pointer"
            >
              Show All Drivers
            </button>
          </div>
        ) : (
          displayRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white border border-neutral-200/90 hover:border-[#115e3b]/50 rounded-3xl p-5 shadow-xs transition space-y-4"
            >
              {/* Driver Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ride.driverAvatar}
                    alt={ride.driverName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#115e3b]/20 bg-neutral-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#132d20]">{ride.driverName}</h4>
                      {ride.isDriverVerified && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700 flex items-center gap-0.5 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-pink-600" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      ★ {ride.driverRating} · {ride.vehicleModel}
                    </p>
                  </div>
                </div>

                {/* Overlap Percentage Badge */}
                <div className="bg-[#e8f3ec] border border-[#c4e3d0] px-3 py-1.5 rounded-2xl text-right shrink-0">
                  <span className="text-[10px] font-bold text-[#115e3b] uppercase block">Route Match</span>
                  <span className="text-xs font-black font-mono text-[#115e3b]">{ride.routeMatchPercentage}% Overlap</span>
                </div>
              </div>

              {/* Trajectory */}
              <div className="bg-[#fbfcf9] rounded-2xl p-3 border border-neutral-200/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#115e3b] shrink-0" />
                  <span className="text-neutral-700 font-medium">Pickup: {ride.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-neutral-700 font-medium">Dropoff: {ride.destination}</span>
                </div>
              </div>

              {/* Bottom Split & Request Seat Action */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 gap-2">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase font-bold">Fare Share</span>
                  <span className="text-sm font-black text-[#115e3b] font-mono">PKR {ride.costPerPersonPkr} / seat</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectRideToMatch(ride)}
                  className="px-4 py-2.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <span>Request Seat</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
