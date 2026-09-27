import React, { useState } from 'react';
import { UserMode, UserProfile } from '../types';
import { CITIES_LIST, PAKISTAN_CITIES_DATA, ALL_PAKISTAN_STOPS } from '../data/citiesData';
import { 
  ArrowRightLeft, 
  MapPin, 
  ArrowDownUp, 
  Search
} from 'lucide-react';

interface LandingHeroProps {
  mode: UserMode;
  setMode: (m: UserMode) => void;
  currentUser: UserProfile;
  womenOnlyMode: boolean;
  setWomenOnlyMode: (val: boolean) => void;
  onSearchSubmit: (city: string, origin: string, dest: string) => void;
  onScrollToRides: () => void;
  onOpenVerification: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  mode,
  setMode,
  currentUser,
  womenOnlyMode,
  setWomenOnlyMode,
  onSearchSubmit,
  onScrollToRides,
}) => {
  const [selectedCityRegion, setSelectedCityRegion] = useState<string>('Islamabad');
  const [pickupArea, setPickupArea] = useState<string>('Zero Point, Islamabad');
  const [dropoffArea, setDropoffArea] = useState<string>('Saddar, Rawalpindi');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('08:30 AM');

  // Pickup areas based strictly on selected city
  const regionStops = PAKISTAN_CITIES_DATA[selectedCityRegion] || PAKISTAN_CITIES_DATA['Islamabad'];

  const handleSwapLocations = () => {
    const temp = pickupArea;
    setPickupArea(dropoffArea);
    setDropoffArea(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(selectedCityRegion, pickupArea, dropoffArea);
    onScrollToRides();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      
      {/* Hero Header Text */}
      <div className="pt-2 px-1">
        <h1 className="text-4xl sm:text-5xl font-black text-[#132d20] tracking-tight leading-[1.12] mb-3">
          Same direction.<br />
          <span className="text-[#187a4d]">Half the fuel.</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
          Post a drive or find a seat. Routes with matching corridors in Islamabad, Rawalpindi, and Taxila are automatically paired.
        </p>
      </div>

      {/* Dual Mode Switcher Card */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-3 shadow-xs space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('driver')}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'driver'
                ? 'bg-[#115e3b] text-white shadow-md shadow-[#115e3b]/20'
                : 'bg-transparent text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 stroke-[2.2]" />
            <span>Driver mode</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('passenger')}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'passenger'
                ? 'bg-[#115e3b] text-white shadow-md shadow-[#115e3b]/20'
                : 'bg-transparent text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <MapPin className="w-4 h-4 stroke-[2.2]" />
            <span>Passenger mode</span>
          </button>
        </div>

        <div className="text-center text-xs text-neutral-500 py-0.5">
          Switch anytime. Your routes stay in each mode.
        </div>
      </div>

      {/* 01 / YOUR ROUTE Card */}
      <form onSubmit={handleSearch} className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#115e3b] block mb-1">
            01 / YOUR ROUTE
          </span>
          <h2 className="text-2xl font-black text-[#132d20]">
            Where are you going?
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Pick your city (Islamabad, Rawalpindi, or Taxila) and route stops.
          </p>
        </div>

        {/* City Selection - Strictly Islamabad, Rawalpindi, Taxila on separate lines */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
            CITY
          </label>
          <select
            value={selectedCityRegion}
            onChange={(e) => {
              const newCity = e.target.value;
              setSelectedCityRegion(newCity);
              const newStops = PAKISTAN_CITIES_DATA[newCity] || [];
              if (newStops.length > 0) {
                const newPickup = newStops[0];
                setPickupArea(newPickup);
                onSearchSubmit(newCity, newPickup, dropoffArea);
              }
            }}
            className="w-full bg-[#fbfcf9] border border-neutral-300 hover:border-[#115e3b] rounded-2xl px-4 py-3.5 text-sm text-[#132d20] font-semibold focus:outline-none focus:ring-2 focus:ring-[#115e3b]/20 focus:border-[#115e3b] transition cursor-pointer"
          >
            {CITIES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* FROM · PICKUP Area Dropdown */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
            FROM · PICKUP ({selectedCityRegion})
          </label>
          <select
            value={pickupArea}
            onChange={(e) => {
              const val = e.target.value;
              setPickupArea(val);
              onSearchSubmit(selectedCityRegion, val, dropoffArea);
            }}
            className="w-full bg-[#fbfcf9] border border-neutral-300 hover:border-[#115e3b] rounded-2xl px-4 py-3.5 text-sm text-[#132d20] focus:outline-none focus:ring-2 focus:ring-[#115e3b]/20 focus:border-[#115e3b] transition cursor-pointer"
          >
            {regionStops.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2">
          <button
            type="button"
            onClick={handleSwapLocations}
            className="w-10 h-10 rounded-full bg-[#e8f3ec] hover:bg-[#d5ebd9] border border-[#c4e3d0] flex items-center justify-center text-[#115e3b] transition shadow-xs cursor-pointer active:scale-90"
            title="Swap pickup & dropoff"
          >
            <ArrowDownUp className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* TO · DROP-OFF Area Dropdown */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
            TO · DROP-OFF
          </label>
          <select
            value={dropoffArea}
            onChange={(e) => {
              const val = e.target.value;
              setDropoffArea(val);
              onSearchSubmit(selectedCityRegion, pickupArea, val);
            }}
            className="w-full bg-[#fbfcf9] border border-neutral-300 hover:border-[#115e3b] rounded-2xl px-4 py-3.5 text-sm text-[#132d20] focus:outline-none focus:ring-2 focus:ring-[#115e3b]/20 focus:border-[#115e3b] transition cursor-pointer"
          >
            <optgroup label={`${selectedCityRegion} Stops`}>
              {regionStops.map((area) => (
                <option key={`region_${area}`} value={area}>
                  {area}
                </option>
              ))}
            </optgroup>
            <optgroup label="Cross-City Twin Cities Corridor Stops">
              {ALL_PAKISTAN_STOPS.filter(s => !regionStops.includes(s)).map((area) => (
                <option key={`all_${area}`} value={area}>
                  {area}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Departure Date & Time Selection */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              DEPARTURE DATE
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-[#fbfcf9] border border-neutral-300 hover:border-[#115e3b] rounded-2xl px-3 py-3 text-xs text-[#132d20] focus:outline-none focus:border-[#115e3b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              DEPARTURE TIME
            </label>
            <select
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-[#fbfcf9] border border-neutral-300 hover:border-[#115e3b] rounded-2xl px-3 py-3 text-xs text-[#132d20] focus:outline-none focus:border-[#115e3b]"
            >
              <option value="08:00 AM">08:00 AM</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="05:30 PM">05:30 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>
        </div>

        {/* Women-Only Filter Checkbox */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={womenOnlyMode}
              onChange={(e) => {
                if (currentUser.gender !== 'female' && e.target.checked) {
                  alert('Women-Only rides require a female profile.');
                  return;
                }
                setWomenOnlyMode(e.target.checked);
              }}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 accent-pink-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-pink-700 flex items-center gap-1">
              Women-Only Rides Only
            </span>
          </label>

          <span className="text-[11px] font-bold text-[#115e3b] bg-[#e8f3ec] px-2.5 py-1 rounded-full">
            Split Petrol Fuel
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-sm rounded-2xl shadow-md shadow-[#115e3b]/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>{mode === 'driver' ? 'Save Drive →' : 'Find Matching Rides →'}</span>
        </button>

      </form>

    </div>
  );
};
