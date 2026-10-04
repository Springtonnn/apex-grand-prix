import React from 'react';
import { X, DollarSign, Sparkles, Building2, TrendingUp, Check } from 'lucide-react';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (amount: number, description: string, sponsorId?: string) => void;
  currentBudget: number;
  claimedSponsors?: string[];
}

export const SponsorModal: React.FC<SponsorModalProps> = ({
  isOpen,
  onClose,
  onAddFunds,
  currentBudget,
  claimedSponsors = [],
}) => {
  if (!isOpen) return null;

  const sponsorPackages = [
    {
      id: 'quick-grant',
      title: 'Board Emergency Grant',
      amount: 3_000_000,
      desc: 'Emergency working capital to bolster racing team liquidity.',
      icon: Building2,
      tag: 'Fast Cash',
    },
    {
      id: 'title-sponsor',
      title: 'Global Title Sponsor Agreement',
      amount: 10_000_000,
      desc: 'Global brand campaign rollout bonus with international commercial exposure.',
      icon: Sparkles,
      tag: 'Popular',
    },
    {
      id: 'investor-round',
      title: 'Private Investor Seed Round',
      amount: 25_000_000,
      desc: 'Substantial capital injection for car R&D and world-class personnel.',
      icon: TrendingUp,
      tag: 'Mega Budget',
    },
  ];

  const handleClaim = (pkgId: string, amount: number, label: string) => {
    if (claimedSponsors.includes(pkgId)) return;
    sound.playCash();
    onAddFunds(amount, label, pkgId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10151f] border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950/60 via-[#18212e] to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-racing tracking-wide">
                BUDGET INJECTION
              </h3>
              <p className="text-xs text-slate-400">
                Current Budget: <span className="text-emerald-400 font-mono font-bold">{formatMoney(currentBudget)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Claim commercial sponsorship packages (each package can be claimed only <strong>once per career</strong>):
            </p>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 shrink-0">
              Claimed {claimedSponsors.length}/{sponsorPackages.length}
            </span>
          </div>

          <div className="space-y-3">
            {sponsorPackages.map((pkg) => {
              const Icon = pkg.icon;
              const isClaimed = claimedSponsors.includes(pkg.id);

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    if (!isClaimed) {
                      handleClaim(pkg.id, pkg.amount, pkg.title);
                    }
                  }}
                  className={`p-4 rounded-xl flex items-center justify-between gap-4 transition border ${
                    isClaimed
                      ? 'bg-[#0d121a]/80 border-slate-800/80 opacity-60 cursor-not-allowed select-none'
                      : 'bg-[#141c28] hover:bg-[#182333] border-slate-800 hover:border-emerald-500/50 group cursor-pointer shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-lg border transition ${
                        isClaimed
                          ? 'bg-slate-900 border-slate-800 text-slate-600'
                          : 'bg-slate-800 group-hover:bg-emerald-950/50 text-emerald-400 border-slate-700/60 group-hover:border-emerald-500/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold text-sm font-racing ${
                            isClaimed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'
                          }`}
                        >
                          {pkg.title}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isClaimed
                              ? 'bg-slate-800 text-slate-500 border-slate-700/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {pkg.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{pkg.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isClaimed}
                    className={`px-3.5 py-2 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition shrink-0 ${
                      isClaimed
                        ? 'bg-slate-800/90 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60 cursor-pointer active:scale-95'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-500" /> Claimed
                      </>
                    ) : (
                      `+${formatMoney(pkg.amount)}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2 bg-[#17202d] hover:bg-[#1f2b3d] border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-racing font-bold tracking-wider transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
