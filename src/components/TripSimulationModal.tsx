import React, { useState } from 'react';
import { RideOffer, UserProfile, ChatMessage } from '../types';
import { Navigation, Send, CheckCircle2, MapPin, Fuel, ShieldCheck, Phone, X, Sparkles, MessageSquare, Receipt, Download } from 'lucide-react';

interface TripSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideOffer;
  currentUser: UserProfile;
}

export const TripSimulationModal: React.FC<TripSimulationModalProps> = ({
  isOpen,
  onClose,
  ride,
  currentUser,
}) => {
  const [tripStep, setTripStep] = useState<number>(2); // Default Step 2: En Route
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      rideId: ride.id,
      senderId: ride.driverId,
      senderName: ride.driverName,
      text: `Hi! I have started the car. See you at ${ride.origin} in ~8 minutes!`,
      timestamp: '08:12 AM',
    },
    {
      id: 'm2',
      rideId: ride.id,
      senderId: 'sys',
      senderName: 'SafarPair System',
      text: 'AI Route Match active. 50/50 Petrol Split locked at PKR ' + ride.costPerPersonPkr + ' per person.',
      timestamp: '08:12 AM',
      isSystem: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');

  if (!isOpen || !ride) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      rideId: ride.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputMessage,
      timestamp: '08:15 AM',
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Live Trip & GPS Simulation</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 animate-pulse">
                    ACTIVE RIDE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {ride.origin} → {ride.destination}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Visual */}
          <div className="my-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-300">Journey Progression</span>
              <span className="font-mono text-emerald-400">Step {tripStep} of 4</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <button
                onClick={() => setTripStep(1)}
                className={`p-2 rounded-lg border font-semibold transition ${
                  tripStep >= 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                1. Seat Booked
              </button>
              <button
                onClick={() => setTripStep(2)}
                className={`p-2 rounded-lg border font-semibold transition ${
                  tripStep >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                2. Driver En Route
              </button>
              <button
                onClick={() => setTripStep(3)}
                className={`p-2 rounded-lg border font-semibold transition ${
                  tripStep >= 3 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                3. Onboard (In Transit)
              </button>
              <button
                onClick={() => setTripStep(4)}
                className={`p-2 rounded-lg border font-semibold transition ${
                  tripStep >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                4. Split Completed
              </button>
            </div>
          </div>

          {/* Simulated Map Visualizer */}
          <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 relative overflow-hidden my-4 min-h-[160px] flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 flex justify-between items-center text-xs">
              <span className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> GPS Track: {ride.origin}
              </span>
              <span className="bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full font-semibold">
                Dest: {ride.destination}
              </span>
            </div>

            {/* Simulated Route Progress Bar */}
            <div className="relative my-6 z-10">
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(tripStep / 4) * 100}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 -ml-3 transition-all duration-500"
                style={{ left: `${(tripStep / 4) * 100}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  🚗
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Distance: {ride.totalDistanceKm} km</span>
              <span>Vehicle: {ride.vehicleModel}</span>
              <span className="text-amber-400 font-bold">Fare: PKR {ride.costPerPersonPkr}</span>
            </div>
          </div>

          {/* Real-time Ride Chat Box */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs text-white font-bold">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> In-App Coordination Chat
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl ${
                    msg.isSystem
                      ? 'bg-slate-800/60 border border-slate-700/60 text-slate-300 text-center text-[11px]'
                      : msg.senderId === currentUser.id
                      ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 ml-auto max-w-[80%]'
                      : 'bg-slate-800 text-slate-200 mr-auto max-w-[80%]'
                  }`}
                >
                  {!msg.isSystem && (
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      {msg.senderName} · {msg.timestamp}
                    </span>
                  )}
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Message driver/passenger..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Receipt Summary */}
        {tripStep === 4 && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 space-y-2 animate-fadeIn">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4" /> 50/50 Split Payment Complete
              </span>
              <span className="font-mono text-sm font-black">PKR {ride.costPerPersonPkr}</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Payment confirmed via EasyPaisa / JazzCash / Cash. Environmental savings: ~{Number((ride.totalDistanceKm * 0.12).toFixed(1))} kg CO₂ offset!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
