import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  BrainCircuit,
  Wrench,
  Gauge,
  GraduationCap,
  DollarSign,
  Trophy,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

export const HelpTutorial: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Game Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Welcome to Apex Grand Prix Manager
          </h3>
          <p>
            You are the Team Principal holding the fate of a world-class Formula racing team.
            Your mission is to manage all team departments: drivers, car engineering, pit wall strategy,
            pit stop crew, and global scouting network to capture World Championships and maximize team profits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#0e131b] p-4 rounded-xl border border-slate-800">
              <strong className="text-red-400 block font-racing text-base mb-1">1. Team Budget</strong>
              Available cash is used to sign drivers, hire strategists and mechanics, and develop car upgrades.
              If short on cash, click the <span className="text-emerald-400 font-bold font-mono">+</span> button in the top bar for a Budget Injection.
            </div>
            <div className="bg-[#0e131b] p-4 rounded-xl border border-slate-800">
              <strong className="text-amber-400 block font-racing text-base mb-1">2. Max 99 OVR Cap</strong>
              All overall and individual stats for drivers, strategists, pit crew, and car components have a strict ceiling of 99.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'drivers',
      title: 'Drivers & Market',
      icon: Users,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Drivers Management
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong className="text-white">Active Grid Drivers (Driver 1 & Driver 2):</strong> Compete on race days, earn championship points and prize money.</li>
            <li><strong className="text-white">Pace:</strong> Pure raw speed during qualifying and in clean air.</li>
            <li><strong className="text-white">Race Craft:</strong> Ability to overtake, defend positions, and manage tire wear.</li>
            <li><strong className="text-white">Experience:</strong> Consistency and lower risk of costly errors under pressure.</li>
            <li><strong className="text-white">Salary:</strong> Per-race wage deducted from race earnings.</li>
            <li><strong className="text-white">Available Drivers Market:</strong> Free agent candidates ready to be signed to replace Driver 1 or Driver 2.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'strategist',
      title: 'AI Race Strategist',
      icon: BrainCircuit,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Chief Race Strategist
          </h3>
          <p>
            Your strategist acts as the pit wall brain, evaluating tire degradation, track conditions, and rival pit windows.
          </p>
          <div className="bg-[#0e131b] p-4 rounded-xl border border-purple-500/30 space-y-2">
            <p><strong className="text-purple-300">Decisions:</strong> Real-time situational awareness and emergency pit calls.</p>
            <p><strong className="text-purple-300">Strategy:</strong> Optimal tire compound selection (Soft / Medium / Hard) and undercut opportunities.</p>
            <p className="text-xs text-slate-400">* During live simulation, your strategist sends tactical Radio Messages reacting to track events.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'pitcrew',
      title: 'Pit Stop Crew & QTE',
      icon: Wrench,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Pit Crew Execution & Quick Time Event (QTE)
          </h3>
          <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-xl space-y-2">
            <p className="text-amber-200">
              <strong>Quick Time Event (QTE) Arrows & Pit Crew Skill:</strong> During pit stops, follow the WASD / Arrow sequence accurately:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
              <li><strong className="text-emerald-400">Elite Crew = Fewer Arrows:</strong> Championship-grade crews (95+ OVR) require only 4 arrows, while rookie crews (&lt;55 OVR) require up to 10 arrows!</li>
              <li><strong className="text-amber-400">Faster Inputs = Shorter Stop:</strong> Each correct input instantly shaves off pit stop time (-0.35s) followed by a rocket safe release launch.</li>
              <li><strong className="text-cyan-400">Speed & Precision:</strong> Minimizes cross-thread nut jams and clocks lightning 1.8 - 2.2 second stationary stops.</li>
              <li><strong className="text-rose-400">500m Pit Entry Alert:</strong> Signage and telemetry distance alerts sound 500m before pit entrance. (If tires blow out, pit on the next lap for fresh rubber to restore 100% car condition).</li>
            </ul>
          </div>
          <div className="bg-cyan-950/20 border border-cyan-500/40 p-4 rounded-xl space-y-2 text-xs">
            <strong className="text-cyan-300 font-racing text-sm block">⚡ Shift to Nitro & Head-to-Head Racing:</strong>
            <p>
              • <strong>Press Shift or Spacebar:</strong> Deploy Turbo Nitro Boost to rocket up to 350 KM/H (standard cruise ~300 KM/H) with afterburner exhaust flames!
            </p>
            <p>
              • <strong>100% Cooldown Reload:</strong> Depleting Nitro to 0% locks the boost until the meter fully recharges to 100%. Manage your nitro strategically!
            </p>
            <p>
              • <strong>Competitive ±100m Racing:</strong> Rivals race at benchmark pace (~300 KM/H, nitro ~350 KM/H). Within ±100m, pace balances to enable thrilling slipstream drafting, wheel-to-wheel duels, and tactical counter-attacks!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'car',
      title: 'Car Engineering',
      icon: Gauge,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Car Development & Upgrades
          </h3>
          <p>
            Your Formula car consists of 5 core engineering systems: <strong>Engine, Aero, Brakes, Suspension, Chassis</strong>.
          </p>
          <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl space-y-2 text-xs">
            <strong className="text-red-400 font-racing text-sm block">Exponential R&D Cost Scaling:</strong>
            <p>
              As your car components reach higher levels, R&D costs increase exponentially.
              Prioritize upgrades strategically according to circuit demands.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'academy',
      title: 'Academy & Scouting',
      icon: GraduationCap,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Youth Academy & Global Scouts
          </h3>
          <ul className="space-y-2 text-xs list-disc list-inside">
            <li><strong className="text-white">Promote Button:</strong> Immediately promote an academy prodigy to race in Driver 1 or Driver 2.</li>
            <li><strong className="text-white">Potential:</strong> Click the question mark <HelpCircle className="w-3.5 h-3.5 inline text-amber-400" /> to check driver ceiling grades (S+, S, A, B).</li>
            <li><strong className="text-white">Scouting Network:</strong> Deploy scouts across 6 worldwide continents to uncover prospective talent.</li>
            <li><strong className="text-white">Scout Stars:</strong> 5-star scouts have up to a 40% chance of discovering 85+ OVR prodigies.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'economy',
      title: 'Championship Economy',
      icon: DollarSign,
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xl font-bold font-racing uppercase text-white">
            Financial Cycle & Prize Money
          </h3>
          <div className="space-y-3">
            <div className="bg-[#0e131b] p-4 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 font-racing font-bold block mb-1">
                Post-Race Prize Money Distribution
              </span>
              <p className="text-xs text-slate-300">
                Teams receive prize earnings based on finishing positions in each Grand Prix (P1 awards up to $18,000,000+).
                Driver, strategist, and pit crew salaries are automatically deducted, with net profit deposited into your Team Budget.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in">
      {/* Side Menu */}
      <div className="lg:col-span-1 bg-[#111722] p-3 rounded-2xl border border-slate-800 space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 px-3 py-2 block">
          TUTORIAL TOPICS
        </span>
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isSelected = selectedSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                sound.playClick();
                setSelectedSection(sec.id);
              }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 text-left font-racing font-bold text-sm transition cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-950'
                  : 'bg-[#151c28] hover:bg-[#192333] text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 bg-[#111722] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
        {sections.find((s) => s.id === selectedSection)?.content}
      </div>
    </div>
  );
};
