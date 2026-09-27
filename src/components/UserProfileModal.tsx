import React, { useState } from 'react';
import { UserProfile, Gender } from '../types';
import { DEFAULT_AVATARS, GIRL_AVATAR_1, BOY_AVATAR_1 } from '../data/avatars';
import { 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Check, 
  Camera, 
  X
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onCreateNewProfile: (newProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>(currentUser.name || '');
  const [occupation, setOccupation] = useState<'Student' | 'Employee'>(currentUser.occupation || 'Student');
  const [gender, setGender] = useState<Gender>(currentUser.gender || 'female');
  const [avatar, setAvatar] = useState<string>(currentUser.avatar || GIRL_AVATAR_1);
  const [phone, setPhone] = useState<string>(currentUser.phone || '');
  const [vehicleModel, setVehicleModel] = useState<string>(currentUser.vehicleModel || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    const finalName = name.trim() || 'Commuter';
    const updated: UserProfile = {
      ...currentUser,
      name: finalName,
      occupation,
      gender,
      avatar,
      phone: phone || '+92 300 0000000',
      vehicleModel,
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="bg-white border border-neutral-200/90 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Top Header Logo */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#115e3b] flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#181818]">
              ECOPOOL <span className="text-[#115e3b]">AI</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-[#115e3b]' : 'bg-neutral-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-[#115e3b]' : 'bg-neutral-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-[#115e3b]' : 'bg-neutral-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 4 ? 'bg-[#115e3b]' : 'bg-neutral-200'}`} />
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#115e3b] block mb-1">
          STEP {step} OF 4
        </span>

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-[#132d20]">
                What should we call you?
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                This name shows on your ride listings.
              </p>
            </div>

            <div>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-2xl px-4 py-3.5 text-sm text-[#132d20] font-medium focus:outline-none focus:ring-2 focus:ring-[#115e3b]/20 focus:border-[#115e3b] transition"
              />
            </div>

            <button
              onClick={() => {
                if (!name.trim()) return;
                setStep(2);
              }}
              disabled={!name.trim()}
              className={`w-full py-3.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Student or Employee */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-[#132d20]">
                Are you a student or employee?
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                This helps pair you with people on the same commute.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOccupation('Student')}
                className={`p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  occupation === 'Student'
                    ? 'bg-[#e8f3ec] border-[#115e3b] text-[#115e3b] ring-2 ring-[#115e3b]/20 font-bold'
                    : 'bg-[#fbfcf9] border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <GraduationCap className="w-8 h-8 text-[#115e3b]" />
                <span className="text-sm font-bold">Student</span>
                {occupation === 'Student' && <Check className="w-4 h-4 text-[#115e3b]" />}
              </button>

              <button
                type="button"
                onClick={() => setOccupation('Employee')}
                className={`p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  occupation === 'Employee'
                    ? 'bg-[#e8f3ec] border-[#115e3b] text-[#115e3b] ring-2 ring-[#115e3b]/20 font-bold'
                    : 'bg-[#fbfcf9] border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <Briefcase className="w-8 h-8 text-[#115e3b]" />
                <span className="text-sm font-bold">Employee</span>
                {occupation === 'Employee' && <Check className="w-4 h-4 text-[#115e3b]" />}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-2xl transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Gender (Female / Male) */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-[#132d20]">
                Your gender
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Self-declared. Females can enable women-only matching.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setGender('female');
                  if (!avatar || avatar === BOY_AVATAR_1) setAvatar(GIRL_AVATAR_1);
                }}
                className={`py-4 rounded-2xl border text-center text-sm font-bold transition cursor-pointer ${
                  gender === 'female'
                    ? 'bg-[#e8f3ec] border-[#115e3b] text-[#115e3b] ring-2 ring-[#115e3b]/20'
                    : 'bg-[#fbfcf9] border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                🌸 Female
              </button>

              <button
                type="button"
                onClick={() => {
                  setGender('male');
                  if (!avatar || avatar === GIRL_AVATAR_1) setAvatar(BOY_AVATAR_1);
                }}
                className={`py-4 rounded-2xl border text-center text-sm font-bold transition cursor-pointer ${
                  gender === 'male'
                    ? 'bg-[#e8f3ec] border-[#115e3b] text-[#115e3b] ring-2 ring-[#115e3b]/20'
                    : 'bg-[#fbfcf9] border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                ♂ Male
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-2xl transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-2/3 py-3.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Illustrated Avatar Selection & Photo Upload */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-[#132d20]">
                Select Avatar or Upload Photo
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pick a larka/larki avatar or upload a picture.
              </p>
            </div>

            {/* Profile Avatar Selection */}
            <div className="flex flex-col items-center justify-center gap-3 py-1">
              <div className="relative group">
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[#115e3b] bg-neutral-100"
                />

                <label className="absolute bottom-0 right-0 bg-[#115e3b] hover:bg-[#0e4d30] text-white p-2 rounded-full cursor-pointer shadow-md transition">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset Illustrated Vector Avatars (Larka / Larki) */}
              <div className="flex items-center gap-3 pt-1">
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.url)}
                    className={`w-10 h-10 rounded-full border-2 transition p-0.5 ${
                      avatar === av.url ? 'border-[#115e3b] ring-2 ring-[#115e3b]/30 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title={av.name}
                  >
                    <img src={av.url} alt={av.name} className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-neutral-600 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-bold mb-1">Vehicle Model (Optional if Driver)</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Suzuki Alto / Toyota Vitz"
                  className="w-full bg-[#fbfcf9] border border-neutral-300 rounded-xl px-3 py-2 text-[#132d20]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-2xl transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-2/3 py-3.5 bg-[#115e3b] hover:bg-[#0e4d30] text-white font-bold text-sm rounded-2xl shadow-xs transition cursor-pointer"
              >
                Save Profile ✓
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
