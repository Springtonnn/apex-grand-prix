import React from 'react';
import {
  Wrench,
  Clock,
  Target,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const PitCrewBoxIllustrationSVG: React.FC<{ className?: string }> = ({
  className = 'w-full h-40',
}) => {
  return (
    <svg viewBox="0 0 400 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pitFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="gunGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Pit Box Floor Markings & Chevron Lines */}
      <rect x="20" y="30" width="360" height="125" rx="10" fill="url(#pitFloor)" stroke="#334155" strokeWidth="1.5" />
      {/* Yellow Box Perimeter */}
      <rect x="35" y="42" width="330" height="100" rx="6" stroke="#eab308" strokeWidth="2" strokeDasharray="10 6" fill="none" opacity="0.7" />
      <path d="M40 92 H360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

      {/* Center F1 Car Silhouette (Top View in Box) */}
      <g opacity="0.9">
        {/* Main Nose & Monocoque */}
        <path d="M70 92 L140 82 L240 80 L310 82 L330 92 L310 102 L240 104 L140 102 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
        {/* Cockpit */}
        <ellipse cx="200" cy="92" rx="20" ry="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
        {/* Front Wing */}
        <path d="M60 70 V114" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        {/* Rear Wing */}
        <path d="M335 65 V119" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        {/* 4 F1 Wheels */}
        {/* Front Left */}
        <rect x="110" y="52" width="28" height="16" rx="4" fill="#020617" stroke="#eab308" strokeWidth="2" />
        {/* Front Right */}
        <rect x="110" y="116" width="28" height="16" rx="4" fill="#020617" stroke="#eab308" strokeWidth="2" />
        {/* Rear Left */}
        <rect x="270" y="50" width="32" height="18" rx="4" fill="#020617" stroke="#eab308" strokeWidth="2" />
        {/* Rear Right */}
        <rect x="270" y="116" width="32" height="18" rx="4" fill="#020617" stroke="#eab308" strokeWidth="2" />
      </g>

      {/* 4x High-Speed Wheel Gun Operators (Pneumatic Torque Guns) */}
      <g fill="#f59e0b">
        {/* Front Left Gunner */}
        <circle cx="124" cy="38" r="6" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M124 44 L124 52" stroke="url(#gunGlow)" strokeWidth="2.5" />
        {/* Front Right Gunner */}
        <circle cx="124" cy="146" r="6" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M124 140 L124 132" stroke="url(#gunGlow)" strokeWidth="2.5" />
        {/* Rear Left Gunner */}
        <circle cx="286" cy="36" r="6" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M286 42 L286 50" stroke="url(#gunGlow)" strokeWidth="2.5" />
        {/* Rear Right Gunner */}
        <circle cx="286" cy="148" r="6" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M286 142 L286 134" stroke="url(#gunGlow)" strokeWidth="2.5" />
      </g>

      {/* Front Jack Man (Front of Car Nose) */}
      <circle cx="42" cy="92" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M49 92 L60 92" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

      {/* Rear Jack Man (Back of Car) */}
      <circle cx="355" cy="92" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M348 92 L338 92" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

      {/* Overhead Pit Gantry Lollipop & LED Release Signal */}
      <g>
        <rect x="180" y="10" width="40" height="16" rx="4" fill="#020617" stroke="#22c55e" strokeWidth="2" />
        {/* Green Release LED Lights */}
        <circle cx="190" cy="18" r="4" fill="#22c55e" />
        <circle cx="200" cy="18" r="4" fill="#22c55e" />
        <circle cx="210" cy="18" r="4" fill="#22c55e" />
      </g>

      {/* Tech Annotations */}
      <text x="42" y="112" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">FRONT JACK</text>
      <text x="355" y="112" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">REAR JACK</text>
      <text x="200" y="27" fill="#22c55e" fontSize="7" fontFamily="monospace" textAnchor="middle">AUTO-RELEASE LIGHT</text>
      <text x="200" y="166" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        18-PERSON SYNCHRONIZED PIT CREW DIVISION
      </text>
    </svg>
  );
};

export const PIT_CREW_IMPROVEMENTS = [
  {
    title: 'เปลี่ยนยางเร็วขึ้น',
    description: 'จอดเปลี่ยนยางสั้นลงเหลือ ~2.1 - 2.4 วินาที',
    impact: 'ประหยัดเวลาแซงในพิท',
    icon: '⏱️',
  },
  {
    title: 'แม่นยำ ไม่ติดขัด',
    description: 'ขันน็อตล้อเป๊ะ ลดความเสี่ยงล้อติด/น็อตหวาน',
    impact: 'ความผิดพลาดแทบเป็น 0%',
    icon: '🎯',
  },
  {
    title: 'พิทซ้อน 2 คันต่อเนื่อง',
    description: 'เข้าพิทพร้อมกันทั้งสองคันได้โดยไม่เสียเวลา',
    impact: 'ได้เปรียบตอน Safety Car',
    icon: '⚡',
  },
  {
    title: 'เปลี่ยนปีกหน้าฉุกเฉินไว',
    description: 'เปลี่ยนปีกหน้าและยางใหม่ได้ทันทีหากมีอุบัติเหตุ',
    impact: 'กลับสู่การแข่งได้รวดเร็ว',
    icon: '🔧',
  },
];
