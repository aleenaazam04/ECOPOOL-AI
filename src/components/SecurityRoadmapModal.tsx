import React from 'react';
import { ShieldCheck, Mail, Camera, FileSearch, Lock, CheckCircle2, X, Sparkles } from 'lucide-react';

interface SecurityRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityRoadmapModal: React.FC<SecurityRoadmapModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Trust, Safety & Security Framework</h3>
              <p className="text-xs text-slate-400">Active protection layers and technical security roadmap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-6">
          
          {/* Section 1: Active In-App Features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                1. Active Security Implementations (Live Now)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Single-Doc Female ID Verification</span>
                </div>
                <p className="text-xs text-slate-300">
                  Female users self-declare gender + upload 1 official ID (CNIC, University Card, Work Badge or License) to activate the 🌸 Women-Only Carpool Filter.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Institutional Email OTP</span>
                </div>
                <p className="text-xs text-slate-300">
                  Seamless 1-minute email OTP verification for university students (@nust.edu.pk, @lums.edu.pk) and verified corporate employees.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs mb-1">
                  <Lock className="w-4 h-4" />
                  <span>AI 50/50 Cost Transparency</span>
                </div>
                <p className="text-xs text-slate-300">
                  Fair petrol calculation prevents overcharging or awkward fare negotiations. Exact distance and vehicle mileage used for split.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dual Profile Privacy Isolation</span>
                </div>
                <p className="text-xs text-slate-300">
                  Seamless toggle between Driver and Passenger profiles with explicit ride controls and trip simulation tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Future Roadmap Items */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                2. Technical Roadmap (Planned Upgrades)
              </h4>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 opacity-90 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Live Face-Match Verification (Biometric Selfie)</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">Phase 2 Roadmap</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time liveness camera check comparing user selfie against uploaded ID document photo before initiating trip.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 opacity-90 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <FileSearch className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">CNIC NADRA Verification & Multi-Doc OCR</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">Phase 3 Roadmap</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Automated multi-document OCR extraction with cross-agency CNIC record checks and criminal background filter integration.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
