import React from 'react';
import {
  BrainCircuit,
  CloudRain,
  ShieldAlert,
  TrendingUp,
  Radio,
  Zap,
  CheckCircle,
  Activity,
} from 'lucide-react';

export const PitWallStrategistIllustrationSVG: React.FC<{ className?: string }> = ({
  className = 'w-full h-40',
}) => {
  return (
    <svg viewBox="0 0 400 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="telemetryLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Pit Wall Desk Base */}
      <rect x="25" y="130" width="350" height="35" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />

      {/* Screen 1: Live Race Telemetry & Gap to Leader (Left) */}
      <g>
        <rect x="35" y="25" width="100" height="95" rx="6" fill="url(#screenGrad)" stroke="#64748b" strokeWidth="2" />
        <rect x="38" y="28" width="94" height="14" fill="#1e293b" />
        <text x="85" y="38" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LIVE SECTOR DELTA</text>
        {/* Gap graphs */}
        <path d="M45 65 Q65 50 85 60 T125 45" stroke="url(#telemetryLine)" strokeWidth="2.5" fill="none" />
        <path d="M45 85 Q70 80 95 90 T125 78" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
        <text x="45" y="108" fill="#a855f7" fontSize="7" fontFamily="monospace">GAP: -0.428s (P1)</text>
      </g>

      {/* Screen 2: Doppler Weather Radar & Rain Cloud Simulation (Center) */}
      <g>
        <rect x="145" y="20" width="110" height="100" rx="6" fill="url(#screenGrad)" stroke="#a855f7" strokeWidth="2" />
        <rect x="148" y="23" width="104" height="14" fill="#581c87" />
        <text x="200" y="33" fill="#e9d5ff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DOPPLER WEATHER RADAR</text>
        {/* Radar concentric sweep circles */}
        <circle cx="200" cy="72" r="32" stroke="#4c1d95" strokeWidth="1" fill="none" />
        <circle cx="200" cy="72" r="20" stroke="#4c1d95" strokeWidth="1" fill="none" />
        {/* Rain Cloud Scan Cluster */}
        <ellipse cx="212" cy="65" rx="14" ry="10" fill="#38bdf8" opacity="0.6" filter="blur(2px)" />
        <ellipse cx="218" cy="68" rx="8" ry="6" fill="#22c55e" opacity="0.8" />
        {/* Radar needle */}
        <path d="M200 72 L225 50" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <text x="200" y="112" fill="#38bdf8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">RAIN IN 4 LAPS (90% CHANCE)</text>
      </g>

      {/* Screen 3: Tire Wear Degradation Curve & Undercut Window (Right) */}
      <g>
        <rect x="265" y="25" width="100" height="95" rx="6" fill="url(#screenGrad)" stroke="#64748b" strokeWidth="2" />
        <rect x="268" y="28" width="94" height="14" fill="#1e293b" />
        <text x="315" y="38" fill="#f59e0b" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TYRE LIFE MODEL</text>
        {/* Tyre degradation curve */}
        <path d="M275 52 C300 55 320 70 355 95" stroke="#ef4444" strokeWidth="2.5" fill="none" />
        {/* Optimal Pit Window Bracket */}
        <rect x="305" y="55" width="30" height="42" fill="#22c55e" opacity="0.2" rx="2" />
        <text x="320" y="75" fill="#22c55e" fontSize="6" fontFamily="monospace" textAnchor="middle">BOX LAP 24</text>
        <text x="315" y="108" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle">UNDERCUT WINDOW</text>
      </g>

      {/* Pit Wall Radio Headset & Mic on Desk */}
      <circle cx="90" cy="142" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M90 148 Q100 152 110 148" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

      {/* Safety Car Status Beacon Light */}
      <rect x="330" y="137" width="35" height="14" rx="3" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
      <circle cx="338" cy="144" r="3" fill="#22c55e" />
      <text x="350" y="148" fill="#e2e8f0" fontSize="7" fontFamily="monospace">GREEN</text>

      {/* Center Command Caption */}
      <text x="200" y="152" fill="#a855f7" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        PIT WALL TACTICAL COMMAND & REAL-TIME STRATEGY AI
      </text>
    </svg>
  );
};

export const STRATEGIST_IMPROVEMENTS = [
  {
    title: 'แซงในพิท (Undercut)',
    description: 'คำนวณรอบสลับยางใหม่ แซงคู่แข่งโดยไม่ต้องเสี่ยงชน',
    impact: 'โอกาสแซงในพิทสูงขึ้น',
    icon: '📊',
  },
  {
    title: 'พิทฟรีตอน Safety Car',
    description: 'สั่งเข้าพิททันทีที่ธงเหลืองขึ้น เสียเวลาน้อยกว่าปกติ',
    impact: 'กระโดดแซงหลายอันดับ',
    icon: '🚨',
  },
  {
    title: 'เรดาร์ฝนตกแม่นยำ',
    description: 'เตือนฝนตกล่วงหน้า สั่งใส่ยางฝนได้ถูกจังหวะ',
    impact: 'ไม่เสียเวลาบนแทร็กเปียก',
    icon: '🌧️',
  },
  {
    title: 'ตัดสินใจไม่ผิดพลาด',
    description: 'เลือกยางและวางแผนรอบเข้าพิทอย่างแม่นยำ',
    impact: 'แผนการแข่งรัดกุม',
    icon: '🧠',
  },
];
