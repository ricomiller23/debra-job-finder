import React from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle, Info, Lock } from 'lucide-react';
import { DailyQuotaState } from '../types/job';

interface DailyQuotaCardProps {
  quota: DailyQuotaState;
  onResetQuota: () => void;
  onTriggerSafetyWarning: () => void;
  onClearSafetyWarning: () => void;
}

export const DailyQuotaCard: React.FC<DailyQuotaCardProps> = ({
  quota,
  onResetQuota,
  onTriggerSafetyWarning,
  onClearSafetyWarning
}) => {
  const percent = Math.min(100, Math.round((quota.appliedCount / quota.maxPerDay) * 100));

  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700/80 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Quota Progress */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Daily Application Budget</span>
            </span>
            <span className="text-xs font-bold text-slate-100">
              {quota.appliedCount} of {quota.maxPerDay} Used ({percent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/70 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                quota.appliedCount >= quota.maxPerDay
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Limit: Strict 5 per day (Rule mandated)</span>
            {quota.appliedCount >= quota.maxPerDay ? (
              <span className="text-amber-400 font-semibold flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Daily Cap Reached — Auto-Halted</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">
                {quota.maxPerDay - quota.appliedCount} slots available today
              </span>
            )}
          </div>
        </div>

        {/* Center: Rules & Behavioral Guardrails */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-3 lg:pt-0 lg:pl-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Human Pacing Simulation:</span>
            <span className="text-slate-400">3–5s jitter delay between actions</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span className="text-slate-300 font-medium">First Session Gate:</span>
            <span className="text-slate-400">
              {quota.firstSessionReviewRemaining > 0
                ? `${quota.firstSessionReviewRemaining} approval reviews required`
                : 'Debra initial gate cleared'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-300 font-medium">Geographic Envelope:</span>
            <span className="text-slate-400">Phoenix & Scottsdale Metro Only</span>
          </div>
        </div>

        {/* Right: LinkedIn Safety Guard Status & Simulation */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-3 lg:pt-0 lg:pl-4">
          {quota.safetyWarningActive ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-xs text-red-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-red-400">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>LINKEDIN SAFETY HALT</span>
              </div>
              <p className="text-[11px] leading-tight">
                {quota.safetyWarningMessage || "Unusual activity / verification challenge detected. All automated actions halted immediately per standing instruction."}
              </p>
              <button
                onClick={onClearSafetyWarning}
                className="mt-1 text-[10px] font-semibold bg-red-600/30 hover:bg-red-600/50 text-red-200 px-2 py-0.5 rounded border border-red-500/40"
              >
                Clear Warning / Resume Agent
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LinkedIn Tripwire</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  NOMINAL
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-snug">
                Zero restrictions. Stops instantly on CAPTCHA, 2FA, or warning prompts.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onTriggerSafetyWarning}
                  className="text-[10px] text-slate-500 hover:text-amber-400 transition underline"
                  title="Simulate LinkedIn security trigger to verify instant halting logic"
                >
                  Test Tripwire
                </button>
                <button
                  onClick={onResetQuota}
                  className="text-[10px] text-slate-500 hover:text-sky-400 transition underline"
                  title="Reset daily counter for testing"
                >
                  Reset Counter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
