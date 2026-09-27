import React, { useState } from 'react';
import { RideOffer, RideRequest, UserProfile } from '../types';
import { 
  PlusCircle, 
  Car, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Coins
} from 'lucide-react';

interface DriverViewProps {
  currentUser: UserProfile;
  driverRides: RideOffer[];
  rideRequests: RideRequest[];
  onPostRide: (newRide: Omit<RideOffer, 'id' | 'driverId' | 'driverName' | 'driverGender' | 'driverAvatar' | 'driverRating' | 'isDriverVerified'>) => void;
  onAcceptRequest: (reqId: string) => void;
  onDeclineRequest: (reqId: string) => void;
  womenOnlyMode: boolean;
}

export const DriverView: React.FC<DriverViewProps> = ({
  currentUser,
  driverRides,
  rideRequests,
  onPostRide,
  onAcceptRequest,
  onDeclineRequest,
  womenOnlyMode,
}) => {
  const [showPostForm, setShowPostForm] = useState<boolean>(false);

  const [origin, setOrigin] = useState<string>('Zero Point, Islamabad');
  const [destination, setDestination] = useState<string>('NUST H-12 Campus');
  const [departureTime, setDepartureTime] = useState<string>('08:30 AM');
  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [fareType, setFareType] = useState<'auto' | 'custom'>('auto');
  const [customFare, setCustomFare] = useState<string>('250');
  const [womenOnly, setWomenOnly] = useState<boolean>(womenOnlyMode || currentUser.gender === 'female');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFarePkr = fareType === 'custom' && Number(customFare) > 0 ? Number(customFare) : 220;

    onPostRide({
      vehicleModel: currentUser.vehicleModel || 'Honda City / Toyota Vitz',
      vehicleNumber: currentUser.vehicleNumber || 'LEB-8921',
      fuelEfficiencyKmL: 14.5,
      petrolPricePkr: 282,
      origin,
      destination,
      waypoints: ['Corridor Highway', 'Signal Interchange'],
      departureTime,
      departureDate: 'Today',
      totalSeats: availableSeats,
      availableSeats,
      womenOnly: currentUser.gender === 'female' ? womenOnly : false,
      status: 'active',
      routeMatchPercentage: 94,
      totalDistanceKm: 21.5,
      estimatedDurationMin: 28,
      totalFuelCostPkr: finalFarePkr * 2,
      costPerPersonPkr: finalFarePkr,
      driverNote: `Drive offered by ${currentUser.name}. Fare: PKR ${finalFarePkr} per seat.`,
      city: 'Islamabad',
    });
    setShowPostForm(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 font-sans">
      
      {/* Driver Header Card */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#132d20]">Driver Dashboard</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Offer a ride, set your custom fare per seat, and match co-riders.
          </p>
        </div>

        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="px-4 py-2.5 rounded-2xl bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>{showPostForm ? 'Close' : 'Offer Ride'}</span>
        </button>
      </div>

      {/* Post Drive Form */}
      {showPostForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs space-y-4 animate-fadeIn">
          <h3 className="text-base font-bold text-[#132d20] flex items-center gap-2">
            <Car className="w-5 h-5 text-[#115e3b]" />
            <span>Offer a Drive Route</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-bold mb-1">Pickup Point</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20] focus:outline-none focus:border-[#115e3b]"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-bold mb-1">Dropoff Point</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20] focus:outline-none focus:border-[#115e3b]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-bold mb-1">Departure Time</label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-bold mb-1">Available Seats</label>
                <select
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(Number(e.target.value))}
                  className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20]"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                </select>
              </div>
            </div>

            {/* Custom Fare Selector */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <label className="block text-neutral-700 font-bold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#115e3b]" />
                <span>Fare / Petrol Cost Share Option</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFareType('auto')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    fareType === 'auto'
                      ? 'bg-[#115e3b] text-white border-[#115e3b]'
                      : 'bg-[#fbfcf9] text-neutral-600 border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  Auto 50/50 Petrol Split
                </button>

                <button
                  type="button"
                  onClick={() => setFareType('custom')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    fareType === 'custom'
                      ? 'bg-[#115e3b] text-white border-[#115e3b]'
                      : 'bg-[#fbfcf9] text-neutral-600 border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  Custom Fare (PKR)
                </button>
              </div>

              {fareType === 'custom' && (
                <div className="pt-1">
                  <label className="block text-neutral-500 text-[11px] mb-1 font-semibold">
                    Enter Fare Amount Per Passenger (PKR):
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    step={10}
                    value={customFare}
                    onChange={(e) => setCustomFare(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-sm text-[#132d20] font-mono font-bold focus:outline-none focus:border-[#115e3b]"
                  />
                </div>
              )}
            </div>
          </div>

          {currentUser.gender === 'female' && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={womenOnly}
                onChange={(e) => setWomenOnly(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 accent-pink-500"
              />
              <span className="text-xs font-semibold text-pink-700">🌸 Women-Only Passengers Only</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer"
          >
            Publish Drive & Start Matching
          </button>
        </form>
      )}

      {/* Pending Seat Requests for Driver */}
      {rideRequests.length > 0 && (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#132d20]">Pending Seat Requests ({rideRequests.length})</h3>

          <div className="space-y-3">
            {rideRequests.map((req) => (
              <div key={req.id} className="p-3.5 bg-[#fbfcf9] border border-neutral-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={req.passengerAvatar} alt={req.passengerName} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#115e3b]/20 bg-neutral-100" />
                  <div>
                    <div className="font-bold text-[#132d20]">{req.passengerName}</div>
                    <div className="text-neutral-500 text-[11px]">{req.pickupLocation} → {req.dropoffLocation}</div>
                    <div className="text-[#115e3b] font-bold text-[10px]">Fare Share: PKR {req.fuelSharePkr}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => onAcceptRequest(req.id)} className="px-3.5 py-1.5 bg-[#115e3b] text-white font-bold text-xs rounded-xl hover:bg-[#0e4d30] transition cursor-pointer">
                    Accept
                  </button>
                  <button onClick={() => onDeclineRequest(req.id)} className="px-3.5 py-1.5 bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-300 transition cursor-pointer">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posted Rides */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#132d20]">Your Posted Drives ({driverRides.length})</h3>

        {driverRides.length === 0 ? (
          <div className="p-6 bg-white border border-neutral-200 rounded-3xl text-center text-xs text-neutral-500">
            You have not offered any rides yet. Click <strong>Offer Ride</strong> to post your route!
          </div>
        ) : (
          driverRides.map((ride) => (
            <div key={ride.id} className="p-4 bg-white border border-neutral-200/90 rounded-3xl shadow-xs flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#132d20]">{ride.origin} → {ride.destination}</div>
                <div className="text-neutral-500 mt-0.5">{ride.departureTime} · {ride.availableSeats} seats left · <strong className="text-[#115e3b]">Fare: PKR {ride.costPerPersonPkr} / seat</strong></div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e8f3ec] text-[#115e3b]">
                Active Drive
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
