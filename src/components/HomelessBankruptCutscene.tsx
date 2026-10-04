import React, { useEffect } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Skull,
  TrendingDown,
  Flame,
  DollarSign,
  HeartCrack,
  Sparkles,
} from 'lucide-react';
import { TeamState } from '../types/game';
import { sound } from '../utils/audio';
import homelessBossImage from '../assets/images/homeless_boss_bench_1791014774586.jpg';

interface HomelessBankruptCutsceneProps {
  teamState: TeamState;
  onResetCareer: () => void;
  onSimulateDismiss?: () => void; // Optional for testing/development
}

export const HomelessBankruptCutscene: React.FC<HomelessBankruptCutsceneProps> = ({
  teamState,
  onResetCareer,
  onSimulateDismiss,
}) => {
  const crashesCount = teamState.totalCarCrashesCount || 0;
  const p12Count = teamState.totalP12FinishesCount || 0;

  const isCrashesReason =
    teamState.bankruptHomelessReason === 'crashes' || crashesCount >= 20;

  useEffect(() => {
    // Play dramatic heavy crash impact / defeat sound
    sound.playCrashImpact();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-700">
      {/* Dark Ambient Vignette Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-950/40 via-black to-slate-950/80" />

      {/* Main Cutscene Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#090d15] border-2 border-red-700/80 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(220,38,38,0.35)] flex flex-col lg:flex-row my-auto">
        
        {/* =================================================================== */}
        {/* LEFT / CENTER: GRAPHIC ARTWORK OF HOMELESS EX-BOSS ON PARK BENCH   */}
        {/* =================================================================== */}
        <div className="lg:w-3/5 relative min-h-[300px] sm:min-h-[420px] lg:min-h-[580px] bg-neutral-950 overflow-hidden flex items-center justify-center">
          <img
            src={homelessBossImage}
            alt="Homeless Former F1 Team Boss on Park Bench"
            className="w-full h-full object-cover object-center filter contrast-105 brightness-95 scale-100 hover:scale-105 transition-transform duration-1000 select-none"
          />

          {/* Gradients on artwork to blend with the modal */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d15] via-transparent to-black/40" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#090d15] hidden lg:block" />

          {/* Floating Cinematic Story Badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-black/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-red-500/50 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
              <HeartCrack className="w-4 h-4 text-red-500 animate-pulse" />
              <span>FALL FROM GRACE • จากจุดสูงสุดสู่คนไร้บ้าน</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-thai leading-relaxed">
              &quot;จากผู้จัดการทีม F1 ที่เคยยืนสั่งการอยู่ในพิทเลนระดับโลก... วันนี้ทุกอย่างสูญสิ้น
              เหลือเพียงม้านั่งไม้ตัวเก่าในสวนสาธารณะ กับกระเป๋าผ้าใส่ของใช้ส่วนตัวใบสุดท้าย&quot;
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT PANEL: BANKRUPTCY DOSSIER & RESET UI                         */}
        {/* =================================================================== */}
        <div className="lg:w-2/5 p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-[#0a0f19] border-t lg:border-t-0 lg:border-l border-slate-800">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/50 animate-pulse">
                <Skull className="w-5 h-5 text-red-400" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
                  CAREER TERMINATED • โดนปลดถาวร
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-racing uppercase tracking-wide text-white">
                  BANKRUPTCY & RUIN
                </h2>
              </div>
            </div>

            {/* Failure Reason Announcement Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/90 to-[#180d12] border border-red-500/70 shadow-lg shadow-red-950/60">
              <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase mb-1">
                {isCrashesReason ? (
                  <>
                    <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                    <span>สาเหตุ: ทำรถแข่งพังเกินโควตา 20 ครั้ง</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />
                    <span>สาเหตุ: จบอันดับ 12 (บ๊วย) ครบ 3 ครั้ง</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-200 font-thai leading-snug">
                {isCrashesReason
                  ? `คุณทำรถแข่งชนพังยับเยินสะสมไปถึง ${crashesCount} ครั้ง ค่าซ่อมบานปลายจนทีมล้มละลาย โดน FIA และเจ้าหนี้ยึดโรงงานและรถแข่งทั้งหมด กลายเป็นคนไร้บ้านสิ้นเนื้อประดาตัว!`
                  : `คุณพาทีมเข้าเส้นชัยอันดับที่ 12 (บ๊วยสุดของกริด) ครบ ${p12Count} ครั้ง สปอนเซอร์ทุกรายฉีกสัญญาทิ้งทันที บอร์ดบริหารขับไล่ออกและฟ้องล้มละลายจนหมดตัว!`
                }
              </p>
            </div>
          </div>

          {/* Dossier Statistics Grid */}
          <div className="bg-[#0f1624] p-3.5 rounded-2xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>TEAM FINANCIAL & CAREER RUIN REPORT</span>
              <span className="text-red-400">DEFICIT</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">อดีตทีมที่ล้มละลาย:</span>
              <strong className="text-white truncate max-w-[150px]">{teamState.teamName}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">สถิติรถพังสะสม:</span>
              <strong className={crashesCount >= 20 ? 'text-red-400 font-bold' : 'text-amber-400'}>
                {crashesCount} / 20 ครั้ง {crashesCount >= 20 ? '🔥 (เกินโควตา)' : ''}
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">อันดับที่ 12 (บ๊วย):</span>
              <strong className={p12Count >= 3 ? 'text-red-400 font-bold' : 'text-amber-400'}>
                {p12Count} / 3 ครั้ง {p12Count >= 3 ? '📉 (โดนฉีกสัญญา)' : ''}
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">เงินในบัญชีคงเหลือ:</span>
              <strong className="text-red-400 font-bold">0 ฿ (หนี้สินท่วมตัว)</strong>
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">ที่พักอาศัยปัจจุบัน:</span>
              <span className="text-amber-300 font-thai text-[11px]">ม้านั่งในสวนสาธารณะ</span>
            </div>
          </div>

          {/* Action Buttons: START NEW CAREER (RESET ALL) */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                sound.playCash();
                onResetCareer();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-950/80 flex items-center justify-center gap-2.5 cursor-pointer transition active:scale-95 border-2 border-red-400/80 animate-pulse"
            >
              <RotateCcw className="w-5 h-5 text-white" />
              <span>เริ่มเกมใหม่ทั้งหมด (START NEW GAME) →</span>
            </button>

            {onSimulateDismiss && (
              <button
                onClick={onSimulateDismiss}
                className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs font-mono transition text-center underline cursor-pointer"
              >
                [Dev/Test: ปิดหน้าต่างนี้ชั่วคราวเพื่อดูหน้าจออื่น]
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
