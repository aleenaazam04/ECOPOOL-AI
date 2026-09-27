export type UserMode = 'driver' | 'passenger';

export type Gender = 'female' | 'male';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  avatar: string;
  phone: string;
  rating: number;
  tripsCount: number;
  verificationStatus: VerificationStatus;
  occupation?: 'Student' | 'Employee';
  role?: string;
  documentType?: 'cnic' | 'student_id' | 'employee_id' | 'driving_license';
  documentImageName?: string;
  institutionalEmail?: string;
  isInstitutionalVerified?: boolean;
  vehicleModel?: string;
  vehicleNumber?: string;
  fuelEfficiencyKmL?: number;
  bio?: string;
}

export interface RideOffer {
  id: string;
  driverId: string;
  driverName: string;
  driverGender: Gender;
  driverAvatar: string;
  driverRating: number;
  isDriverVerified: boolean;
  vehicleModel: string;
  vehicleNumber: string;
  fuelEfficiencyKmL: number;
  petrolPricePkr: number;
  origin: string;
  destination: string;
  waypoints: string[];
  departureTime: string;
  departureDate: string;
  totalSeats: number;
  availableSeats: number;
  womenOnly: boolean;
  status: 'active' | 'in_progress' | 'completed' | 'cancelled';
  routeMatchPercentage: number;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  totalFuelCostPkr: number;
  costPerPersonPkr: number;
  driverNote?: string;
  city: string;
}

export interface RideRequest {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  passengerGender: Gender;
  passengerAvatar: string;
  isPassengerVerified: boolean;
  pickupLocation: string;
  dropoffLocation: string;
  seatsRequested: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  matchPercentage: number;
  fuelSharePkr: number;
  requestTime: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface RouteMatchAnalysis {
  matchPercentage: number;
  overlapDistanceKm: number;
  totalDistanceKm: number;
  detourDistanceKm: number;
  estimatedTimeMinutes: number;
  totalFuelLiters: number;
  totalFuelCostPkr: number;
  driverSharePkr: number;
  passengerSharePkr: number;
  recommendedPickup: string;
  recommendedDropoff?: string;
  aiInsights: string;
  co2SavedKg: number;
}
