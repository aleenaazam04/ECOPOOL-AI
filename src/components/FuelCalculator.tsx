import React, { useState } from 'react';
import { Calculator, Fuel, Coins, Leaf } from 'lucide-react';

interface FuelCalculatorProps {
  initialDistance?: number;
  initialMileage?: number;
  initialRate?: number;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({
  initialDistance = 16.5,
  initialMileage = 14.5,
  initialRate = 282,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(initialDistance);
  const [mileageKmL, setMileageKmL] = useState<number>(initialMileage);
  const [petrolRate, setPetrolRate] = useState<number>(initialRate);
  const [splitCount, setSplitCount] = useState<number>(2);

  const fuelLiters = distanceKm / mileageKmL;
  const totalCostPkr = Math.round(fuelLiters * petrolRate);
  const costPerPersonPkr = Math.round(totalCostPkr / splitCount);

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 md:p-6 shadow-xs font-sans">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e8f3ec] text-[#115e3b] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#132d20]">50/50 Fuel Split Calculator</h3>
            <p className="text-xs text-neutral-500">Transparent petrol cost sharing based on real mileage</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#e8f3ec] text-[#115e3b]">
          PKR {petrolRate}/L
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-neutral-700 mb-1">
              <span>Trip Distance</span>
              <span className="text-[#115e3b]">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              step={0.5}
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-[#115e3b] cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-neutral-700 mb-1">
              <span>Vehicle Mileage (km/L)</span>
              <span className="text-[#115e3b]">{mileageKmL} km/L</span>
            </div>
            <input
              type="range"
              min={8}
              max={24}
              step={0.5}
              value={mileageKmL}
              onChange={(e) => setMileageKmL(parseFloat(e.target.value))}
              className="w-full accent-[#115e3b] cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1">Petrol Price (PKR/L)</label>
              <input
                type="number"
                value={petrolRate}
                onChange={(e) => setPetrolRate(Number(e.target.value))}
                className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-[#132d20] focus:outline-none focus:border-[#115e3b] font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1">Split Ratio</label>
              <select
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
                className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-[#132d20] focus:outline-none focus:border-[#115e3b]"
              >
                <option value={2}>2 Riders (50/50 Split)</option>
                <option value={3}>3 Riders (33% Each)</option>
                <option value={4}>4 Riders (25% Each)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#fbfcf9] border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Total Petrol Required:</span>
              <span className="font-mono font-bold text-[#132d20]">{fuelLiters.toFixed(2)} Liters</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Total Trip Petrol Cost:</span>
              <span className="font-mono font-bold text-[#132d20]">PKR {totalCostPkr}</span>
            </div>

            <div className="my-2 border-t border-neutral-200" />

            <div className="bg-[#e8f3ec] border border-[#c4e3d0] rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-[#115e3b] block uppercase tracking-wider mb-1">
                Your Even {splitCount === 2 ? '50/50' : `${Math.round(100/splitCount)}%`} Share
              </span>
              <div className="text-2xl font-black text-[#115e3b] font-mono">
                PKR {costPerPersonPkr}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
