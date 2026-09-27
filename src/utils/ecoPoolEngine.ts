export interface EcoPoolRoutingResult {
  driver_name: string;
  match_percentage: number;
  route_deviation_mins: number;
  suggested_fuel_split: string;
  intersecting_corridor?: string;
  pickup?: string;
  dropoff?: string;
}

export interface RouteCalculationDetails {
  distanceKm: number;
  durationMins: number;
  totalFuelLiters: number;
  petrolPricePkr: number;
  totalFuelCostPkr: number;
  passengerSharePkr: number;
  driverSharePkr: number;
  corridorName: string;
}

/**
 * Calculates realistic travel distance, duration, and fuel costs for Pakistan (Islamabad, Rawalpindi, Taxila)
 * Taxila -> Islamabad: Total PKR 1200 / Split PKR 600
 */
export function calculateRealisticPakistanRoute(
  originStr: string = '',
  destStr: string = '',
  mileageKmL: number = 13.5,
  petrolRatePkr: number = 282
): RouteCalculationDetails {
  const o = (originStr || '').toLowerCase();
  const d = (destStr || '').toLowerCase();

  const isTaxilaO = o.includes('taxila') || o.includes('hmc') || o.includes('uet') || o.includes('faisal shaheed') || o.includes('museum') || o.includes('wah');
  const isTaxilaD = d.includes('taxila') || d.includes('hmc') || d.includes('uet') || d.includes('faisal shaheed') || d.includes('museum') || d.includes('wah');

  const isIslooO = o.includes('islamabad') || o.includes('zero point') || o.includes('markaz') || o.includes('blue area') || o.includes('nust') || o.includes('fast') || o.includes('comsats') || o.includes('qau') || o.includes('dha phase 2') || o.includes('pwd') || o.includes('e-11') || o.includes('f-') || o.includes('g-') || o.includes('i-');
  const isIslooD = d.includes('islamabad') || d.includes('zero point') || d.includes('markaz') || d.includes('blue area') || d.includes('nust') || d.includes('fast') || d.includes('comsats') || d.includes('qau') || d.includes('dha phase 2') || d.includes('pwd') || d.includes('e-11') || d.includes('f-') || d.includes('g-') || d.includes('i-');

  const isPindiO = o.includes('rawalpindi') || o.includes('saddar') || o.includes('commercial market') || o.includes('chandni chowk') || o.includes('rehmanabad') || o.includes('sixth road') || o.includes('chaklala') || o.includes('bahria phase 1') || o.includes('adyala') || o.includes('raja bazar');
  const isPindiD = d.includes('rawalpindi') || d.includes('saddar') || d.includes('commercial market') || d.includes('chandni chowk') || d.includes('rehmanabad') || d.includes('sixth road') || d.includes('chaklala') || d.includes('bahria phase 1') || d.includes('adyala') || d.includes('raja bazar');

  let distanceKm = 21.5;
  let durationMins = 28;
  let totalFuelCostPkr = 600;
  let corridorName = 'Srinagar Highway Corridor';

  if ((isTaxilaO && isIslooD) || (isIslooO && isTaxilaD)) {
    // Taxila <-> Islamabad: ~38.5 km, ~45 minutes, Total Fare PKR 1200 / Split PKR 600
    distanceKm = 38.5;
    durationMins = 45;
    totalFuelCostPkr = 1200;
    corridorName = 'GT Road -> Srinagar Highway Interchange';
  } else if ((isTaxilaO && isPindiD) || (isPindiO && isTaxilaD)) {
    // Taxila <-> Rawalpindi: ~29 km, ~35 minutes, Total Fare PKR 900 / Split PKR 450
    distanceKm = 29.0;
    durationMins = 35;
    totalFuelCostPkr = 900;
    corridorName = 'GT Road -> Peshawar Road Corridor';
  } else if ((isIslooO && isPindiD) || (isPindiO && isIslooD)) {
    // Islamabad <-> Rawalpindi: ~21.5 km, ~28 minutes, Total Fare PKR 600 / Split PKR 300
    distanceKm = 21.5;
    durationMins = 28;
    totalFuelCostPkr = 600;
    corridorName = 'Islamabad Expressway / IJP Road';
  } else if (isTaxilaO && isTaxilaD) {
    // Intra Taxila: ~8.5 km, ~12 minutes, Total Fare PKR 300 / Split PKR 150
    distanceKm = 8.5;
    durationMins = 12;
    totalFuelCostPkr = 300;
    corridorName = 'Faisal Shaheed Road Taxila';
  } else if (isIslooO && isIslooD) {
    // Intra Islamabad: ~16 km, ~22 minutes, Total Fare PKR 500 / Split PKR 250
    distanceKm = 16.0;
    durationMins = 22;
    totalFuelCostPkr = 500;
    corridorName = 'Islamabad Highway / Srinagar Highway';
  } else if (isPindiO && isPindiD) {
    // Intra Rawalpindi: ~14 km, ~20 minutes, Total Fare PKR 500 / Split PKR 250
    distanceKm = 14.0;
    durationMins = 20;
    totalFuelCostPkr = 500;
    corridorName = 'Murree Road / Peshawar Road';
  }

  const fuelLiters = Number((distanceKm / mileageKmL).toFixed(2));
  const passengerSharePkr = Math.round(totalFuelCostPkr / 2);
  const driverSharePkr = totalFuelCostPkr - passengerSharePkr;

  return {
    distanceKm,
    durationMins,
    totalFuelLiters: fuelLiters,
    petrolPricePkr: petrolRatePkr,
    totalFuelCostPkr,
    passengerSharePkr,
    driverSharePkr,
    corridorName
  };
}

export function calculateEcoPoolEngineOutput(
  passengerPickup: string,
  passengerDropoff: string,
  driverName: string = 'Ayesha Khan',
  driverRoute: string = 'Islamabad Expressway -> Srinagar Highway'
): EcoPoolRoutingResult {
  const route = calculateRealisticPakistanRoute(passengerPickup, passengerDropoff, 13.5, 282);

  return {
    driver_name: driverName,
    match_percentage: 92,
    route_deviation_mins: 4,
    suggested_fuel_split: `PKR ${route.passengerSharePkr}`,
    intersecting_corridor: route.corridorName,
    pickup: passengerPickup || 'UET Taxila Campus',
    dropoff: passengerDropoff || 'F-8 Markaz, Islamabad'
  };
}
