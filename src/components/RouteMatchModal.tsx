import React, { useState, useEffect } from 'react';
import { RideOffer, UserProfile, RouteMatchAnalysis } from '../types';
import { calculateRealisticPakistanRoute } from '../utils/ecoPoolEngine';
import { Sparkles, MapPin, X, CheckCircle2, ShieldCheck, Navigation, RefreshCw } from 'lucide-react';

interface RouteMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideOffer | null;
  currentUser: UserProfile;
  onRequestRide: (ride: RideOffer, note: string) => void;
}

export const RouteMatchModal: React.FC<RouteMatchModalProps> = ({
  isOpen,
  onClose,
  ride,
  currentUser,
  onRequestRide,
}) => {
  const [passengerOrigin, setPassengerOrigin] = useState<string>('');
  const [passengerDest, setPassengerDest] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<RouteMatchAnalysis | null>(null);
  const [requestNote, setRequestNote] = useState<string>('Hi! My commute route matches yours. Would love to share the fuel cost!');

  useEffect(() => {
    if (ride && isOpen) {
      setPassengerOrigin(ride.origin);
      setPassengerDest(ride.destination);
      fetchRouteMatch(ride.origin, ride.destination);
    }
  }, [ride, isOpen]);

  const fetchRouteMatch = async (origin: string = passengerOrigin, dest: string = passengerDest) => {
    if (!ride) return;
    setLoadingAi(true);

    const calculated = calculateRealisticPakistanRoute(
      origin || ride.origin,
      dest || ride.destination,
      ride.fuelEfficiencyKmL || 13.5,
      282
    );

    try {
      const response = await fetch('/api/match-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverRoute: { origin: ride.origin, destination: ride.destination },
          passengerRoute: { origin: origin || ride.origin, destination: dest || ride.destination },
          vehicleEfficiency: ride.fuelEfficiencyKmL || 13.5,
          petrolPrice: 282,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({
          matchPercentage: data.matchPercentage || 94,
          overlapDistanceKm: calculated.distanceKm,
          totalDistanceKm: calculated.distanceKm,
          detourDistanceKm: 1.2,
          estimatedTimeMinutes: calculated.durationMins,
          totalFuelLiters: calculated.totalFuelLiters,
          totalFuelCostPkr: calculated.totalFuelCostPkr,
          driverSharePkr: calculated.driverSharePkr,
          passengerSharePkr: calculated.passengerSharePkr,
          recommendedPickup: `Near ${origin || ride.origin}`,
          aiInsights: `${data.aiInsights || `Route intersects ${calculated.corridorName}.`}`,
          co2SavedKg: 0,
        });
      } else {
        throw new Error('API Fallback');
      }
    } catch (err) {
      setAnalysis({
        matchPercentage: ride.routeMatchPercentage || 92,
        overlapDistanceKm: calculated.distanceKm,
        totalDistanceKm: calculated.distanceKm,
        detourDistanceKm: 1.2,
        estimatedTimeMinutes: calculated.durationMins,
        totalFuelLiters: calculated.totalFuelLiters,
        totalFuelCostPkr: calculated.totalFuelCostPkr,
        driverSharePkr: calculated.driverSharePkr,
        passengerSharePkr: calculated.passengerSharePkr,
        recommendedPickup: `Near ${origin || ride.origin}`,
        aiInsights: `Intersects ${calculated.corridorName}. Estimated trip duration is ~${calculated.durationMins} mins.`,
        co2SavedKg: 0,
      });
    } finally {
      setLoadingAi(false);
    }
  };

  if (!isOpen || !ride) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Route Match & Fuel Split Calculation</h3>
              <p className="text-xs text-slate-400">Islamabad - Rawalpindi - Taxila Route Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Snapshot */}
        <div className="my-4 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ride.driverAvatar}
              alt={ride.driverName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40 bg-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{ride.driverName}</span>
                {ride.isDriverVerified && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-pink-400" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {ride.vehicleModel}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure</span>
            <span className="text-xs font-bold text-emerald-400">{ride.departureTime}</span>
          </div>
        </div>

        {/* Route Inputs / Match Trigger */}
        <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Pickup Location</label>
              <input
                type="text"
                value={passengerOrigin}
                onChange={(e) => setPassengerOrigin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Dropoff Location</label>
              <input
                type="text"
                value={passengerDest}
                onChange={(e) => setPassengerDest(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={() => fetchRouteMatch(passengerOrigin, passengerDest)}
            disabled={loadingAi}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {loadingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Recalculate Travel Minutes & Fuel Split</span>
          </button>
        </div>

        {/* Analysis Output Card */}
        {loadingAi ? (
          <div className="py-8 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Calculating exact route distance & travel duration...</p>
          </div>
        ) : analysis ? (
          <div className="mt-4 space-y-4">
            
            {/* Overlap Match Percentage Pill */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">AI Route Overlap</span>
                <span className="text-2xl font-black text-white font-mono">{analysis.matchPercentage}% Overlap</span>
                <p className="text-xs text-emerald-200/80 mt-0.5">{analysis.aiInsights}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-mono font-black text-emerald-300 text-lg shadow-inner">
                {analysis.matchPercentage}%
              </div>
            </div>

            {/* Split Metrics Grid (2 Columns - CO2 Saved removed) */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Trip Distance</span>
                <span className="font-bold font-mono text-white text-sm">{analysis.overlapDistanceKm} km</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3">
                <span className="text-[10px] text-emerald-400 block font-extrabold uppercase">Est. Duration</span>
                <span className="font-black font-mono text-emerald-300 text-base">{analysis.estimatedTimeMinutes} mins</span>
              </div>
            </div>

            {/* 50/50 Cost Split Box */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Route Fuel Fare:</span>
                <span className="font-mono font-black text-amber-400 text-sm">PKR {analysis.totalFuelCostPkr}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                <div className="bg-slate-900 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Driver Share (50%)</span>
                  <span className="text-base font-bold text-slate-200 font-mono">PKR {analysis.driverSharePkr}</span>
                </div>

                <div className="bg-emerald-950/80 p-3 rounded-xl text-center border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-300 block font-extrabold uppercase">Your Passenger Share (50%)</span>
                  <span className="text-base font-black text-emerald-400 font-mono">PKR {analysis.passengerSharePkr}</span>
                </div>
              </div>
            </div>

            {/* Recommended Pickup Spot */}
            <div className="flex items-center gap-2.5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Recommended Meeting Spot:</span>
                <span className="font-bold text-white">{analysis.recommendedPickup}</span>
              </div>
            </div>

            {/* Note Input & Request Button */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Message to Driver</label>
              <textarea
                rows={2}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => {
                onRequestRide(ride, requestNote);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Request Seat & Split PKR {analysis.passengerSharePkr}</span>
            </button>

          </div>
        ) : null}

      </div>
    </div>
  );
};
