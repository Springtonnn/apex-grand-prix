import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface MarketTimerBadgeProps {
  expiresAt?: number;
  onExpireOrRefresh?: () => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const MarketTimerBadge: React.FC<MarketTimerBadgeProps> = ({
  expiresAt,
  onExpireOrRefresh,
  label = 'Refreshes in',
  className = '',
  size = 'md',
}) => {
  // Always calculate remaining seconds accurately from expiresAt
  const calculateSecondsLeft = (): number => {
    if (!expiresAt) return 300;
    const now = Date.now();
    return Math.max(0, Math.ceil((expiresAt - now) / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateSecondsLeft);

  // Keep ref to callback so timer interval always uses latest callback without resetting interval
  const onExpireRef = useRef(onExpireOrRefresh);
  onExpireRef.current = onExpireOrRefresh;

  // Track the exact expiry timestamp that has fired to avoid duplicate fires or firing sibling cards
  const firedExpiryRef = useRef<number | null>(null);

  useEffect(() => {
    // When expiresAt changes to a new timestamp, sync secondsLeft immediately
    const initialDiff = calculateSecondsLeft();
    setSecondsLeft(initialDiff);

    if (expiresAt && firedExpiryRef.current !== expiresAt) {
      firedExpiryRef.current = null;
    }

    const intervalId = setInterval(() => {
      if (!expiresAt) return;

      const diff = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(diff);

      // Trigger ONLY when countdown naturally reaches 0 and has not already fired for this specific expiresAt
      if (diff <= 0) {
        if (firedExpiryRef.current !== expiresAt) {
          firedExpiryRef.current = expiresAt;
          if (onExpireRef.current) {
            onExpireRef.current();
          }
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  // Percentage of 300s
  const percent = Math.min(100, Math.max(0, (secondsLeft / 300) * 100));

  return (
    <div
      className={`inline-flex items-center gap-2 bg-[#0c1017]/90 border border-slate-700/80 px-2.5 py-1 rounded-lg font-mono text-xs shadow-sm select-none ${
        secondsLeft < 30 ? 'border-red-500/50 text-red-400' : 'text-slate-300'
      } ${className}`}
      title={`Countdown until automatic market refresh: ${timeFormatted}`}
    >
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${secondsLeft < 30 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
        <span className="text-[10px] uppercase text-slate-400 hidden sm:inline">{label}</span>
        <span className={`font-bold tracking-wider ${secondsLeft < 30 ? 'text-red-400 font-black' : 'text-amber-300'}`}>
          {timeFormatted}
        </span>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden xs:block">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            secondsLeft < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
