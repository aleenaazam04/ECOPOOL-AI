import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  ShieldCheck, 
  Share2, 
  PhoneCall, 
  Lock, 
  AlertTriangle, 
  Check,
  ExternalLink
} from 'lucide-react';

interface SafetySectionProps {
  currentUser: UserProfile;
  onOpenVerification: () => void;
  womenOnlyMode: boolean;
  setWomenOnlyMode: (val: boolean) => void;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  currentUser,
  onOpenVerification,
  womenOnlyMode,
  setWomenOnlyMode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShareLocation = () => {
    const trackingText = `EcoPool AI Live Location Safety Share: I am currently on my carpool commute. Live tracking link: https://api.whatsapp.com/send?text=EcoPool%20Live%20Location`;
    
    if (navigator.share) {
      navigator.share({
        title: 'EcoPool AI Live Trip Location',
        text: 'Sharing my EcoPool AI carpool ride live location for safety.',
        url: window.location.href,
      }).catch(() => {
        // Fallback to WhatsApp link
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(trackingText)}`, '_blank');
      });
    } else {
      // Direct WhatsApp share
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(trackingText)}`, '_blank');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      
      {/* Safety Page Header */}
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#e8f3ec] border border-[#c4e3d0] flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-[#115e3b] stroke-[2.2]" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-[#132d20]">Safety</h1>
          <p className="text-sm text-neutral-600 mt-0.5">
            How EcoPool AI helps you ride with confidence.
          </p>
        </div>
      </div>

      {/* Safety Cards Stack */}
      <div className="space-y-4">
        
        {/* Card 1: Clickable Share Live Location card (WhatsApp & Native Share) */}
        <div 
          onClick={handleShareLocation}
          className="bg-white border-2 border-[#115e3b]/30 hover:border-[#115e3b] rounded-3xl p-5 shadow-xs space-y-3 transition cursor-pointer active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#e8f3ec] group-hover:bg-[#115e3b] group-hover:text-white transition flex items-center justify-center text-[#115e3b]">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-[#e8f3ec] text-[#115e3b] font-bold text-xs flex items-center gap-1 group-hover:bg-[#115e3b] group-hover:text-white transition">
              {copied ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share to WhatsApp'}</span>
            </span>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#132d20] group-hover:text-[#115e3b] transition">
              Share Live Location to anyone for safety
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed mt-1">
              Click here to send your live GPS tracking link directly to family or friends via WhatsApp or messaging before setting off.
            </p>
          </div>
        </div>

        {/* Card 2: Keep your phone charged */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#e8f3ec] flex items-center justify-center">
            <PhoneCall className="w-5 h-5 text-[#115e3b]" />
          </div>
          <h2 className="text-base font-bold text-[#132d20]">
            Keep your phone charged
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Stay reachable so your co-rider can coordinate pickup and drop-off points.
          </p>
        </div>

        {/* Card 3: Meet in public spots */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#e8f3ec] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#115e3b]" />
          </div>
          <h2 className="text-base font-bold text-[#132d20]">
            Meet in public spots
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Choose well-lit stops along the corridor for your first meeting.
          </p>
        </div>

        {/* Card 4: Report concerns */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#e8f3ec] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-[#115e3b]" />
          </div>
          <h2 className="text-base font-bold text-[#132d20]">
            Report concerns
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Flag any unsafe behavior directly from the trip page.
          </p>
        </div>

        {/* Card 5: Women-Only Mode */}
        <div className="bg-gradient-to-br from-pink-50/80 to-pink-100/40 border border-pink-200/90 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-pink-950">
                  🌸 Women-Only Mode
                </h2>
                <span className="text-[10px] font-extrabold text-pink-700 uppercase tracking-wider">
                  Verified Safe Pool
                </span>
              </div>
            </div>

            {currentUser.gender === 'female' && (
              <button
                onClick={() => setWomenOnlyMode(!womenOnlyMode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  womenOnlyMode ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'
                }`}
              >
                {womenOnlyMode ? 'ON' : 'OFF'}
              </button>
            )}
          </div>

          <p className="text-xs text-pink-900/80 leading-relaxed">
            Both sides must self-declare female and submit one ID document for verified matching.
          </p>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-pink-900">
              Status: {currentUser.verificationStatus === 'verified' ? '✓ Verified Female' : 'Unverified'}
            </span>

            {currentUser.verificationStatus !== 'verified' && currentUser.gender === 'female' && (
              <button
                onClick={onOpenVerification}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Upload ID Document
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
