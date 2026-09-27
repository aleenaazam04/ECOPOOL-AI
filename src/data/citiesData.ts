export interface CityAreas {
  city: string;
  areas: string[];
}

export const PAKISTAN_CITIES_DATA: Record<string, string[]> = {
  Islamabad: [
    'Zero Point, Islamabad',
    'F-6 Markaz, Islamabad',
    'F-7 Jinnah Super, Islamabad',
    'F-8 Markaz, Islamabad',
    'F-10 Markaz, Islamabad',
    'F-11 Markaz, Islamabad',
    'Blue Area, Islamabad',
    'G-9 Markaz, Islamabad',
    'G-11 Markaz, Islamabad',
    'I-8 Markaz, Islamabad',
    'I-9 Industrial Area, Islamabad',
    'I-10 Markaz, Islamabad',
    'E-11 Sector, Islamabad',
    'NUST H-12 Campus, Islamabad',
    'FAST-NUCES H-11, Islamabad',
    'COMSATS Park Road, Islamabad',
    'Quaid-i-Azam University, Islamabad',
    'Peshawar Mor, Islamabad',
    'Faizabad Interchange, Islamabad',
    'Islamabad Expressway (Khanna Pul)',
    'Srinagar Highway Interchange',
    'DHA Phase 2, Islamabad',
    'PWD Housing Scheme, Islamabad',
    'Bahria Town Phase 7, Islamabad'
  ],
  Rawalpindi: [
    'Saddar, Rawalpindi',
    'Commercial Market, Rawalpindi',
    'Chandni Chowk, Rawalpindi',
    'Rehmanabad Metro, Rawalpindi',
    'Sixth Road, Rawalpindi',
    'Chaklala Scheme 3, Rawalpindi',
    'Bahria Town Phase 1-6, Rawalpindi',
    'DHA Phase 1, Rawalpindi',
    'Adyala Road, Rawalpindi',
    'Peshawar Road, Rawalpindi',
    'IJP Road / Double Road Junction',
    'Faizabad Metro Stop, Rawalpindi',
    'Raja Bazar, Rawalpindi',
    'Westridge, Rawalpindi',
    'Gulraiz Housing Scheme, Rawalpindi'
  ],
  Taxila: [
    'UET Taxila Campus',
    'Heavy Mechanical Complex (HMC), Taxila',
    'Museum Chowk, Taxila',
    'Faisal Shaheed Road, Taxila',
    'HIT Cantt, Taxila',
    'Taxila Bypass / GT Road Junction',
    'Wah Cantt Junction, Taxila',
    'Station Road, Taxila'
  ]
};

// Strictly 3 cities on different lines
export const CITIES_LIST = ['Islamabad', 'Rawalpindi', 'Taxila'];

// Combined stops across Islamabad, Rawalpindi, and Taxila for flexible cross-city commuting
export const ALL_PAKISTAN_STOPS = Object.values(PAKISTAN_CITIES_DATA).flat();
