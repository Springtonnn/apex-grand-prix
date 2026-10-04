import React from 'react';
import {
  Zap,
  Wind,
  Shield,
  Gauge,
  Activity,
  Flame,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Layers,
  Cpu,
} from 'lucide-react';
import { CarStatKey } from '../types/game';

interface ComponentSpecInfo {
  key: CarStatKey;
  code: string;
  name: string;
  thaiName: string;
  primaryBenefit: string;
  keyEffects: {
    icon: string;
    text: string;
    tag: string;
  }[];
}

export const CAR_COMPONENT_SPECS: Record<CarStatKey, ComponentSpecInfo> = {
  engine: {
    key: 'engine',
    code: 'PU-V6T',
    name: 'POWER UNIT',
    thaiName: 'เครื่องยนต์ V6 เทอร์โบ',
    primaryBenefit: 'วิ่งทางตรงเร็วขึ้น & เร่งแซงไว',
    keyEffects: [
      { icon: '🚀', text: 'เพิ่มความเร็วสูงสุดบนทางตรงยาว', tag: '+Top Speed' },
      { icon: '⚡', text: 'เร่งออกจากโค้งได้ฉับไว ไม่อืด', tag: '0-200 เร็วขึ้น' },
      { icon: '🎯', text: 'แซงใน DRS Zone ง่ายขึ้น', tag: 'แซงทางตรง' },
      { icon: '⏱️', text: 'เวลาต่อรอบเร็วขึ้นในสนามทางตรง', tag: 'ลดเวลา/รอบ' },
    ],
  },
  aero: {
    key: 'aero',
    code: 'AERO-GE',
    name: 'AERODYNAMICS',
    thaiName: 'อากาศพลศาสตร์ & ปีกหน้า-หลัง',
    primaryBenefit: 'เกาะถนนในโค้ง & ขับจี้ท้ายคันหน้า',
    keyEffects: [
      { icon: '🌪️', text: 'เพิ่มแรงกดตัวถัง เข้าโค้งเร็วไม่หลุด', tag: 'Downforce' },
      { icon: '🛡️', text: 'วิ่งจี้ท้ายคันหน้าได้นิ่ง ไม่ส่าย', tag: 'ต้านลมป่วน' },
      { icon: '💨', text: 'เปิดปีก DRS แซงคู่แข่งได้เฉียบขาด', tag: 'DRS Boost' },
      { icon: '⏱️', text: 'ทำเวลาได้ดีมากในสนามโค้งเยอะ', tag: 'ลดเวลาในโค้ง' },
    ],
  },
  brakes: {
    key: 'brakes',
    code: 'BRK-CC',
    name: 'BRAKE SYSTEM',
    thaiName: 'ระบบเบรกคาร์บอนเซรามิก',
    primaryBenefit: 'เบรกลึกแซงเข้าโค้ง & ล้อไม่ล็อก',
    keyEffects: [
      { icon: '🛑', text: 'เบรกได้ลึกกว่าคู่แข่ง แซงจังหวะเข้าโค้ง', tag: 'เบรกลึก' },
      { icon: '🔒', text: 'ลดโอกาสเบรกล้อล็อก ไถลหลุดโค้ง', tag: 'ล้อไม่ล็อก' },
      { icon: '🔥', text: 'ระบายความร้อนดี เบรกไม่เฟด', tag: 'เบรกทนทาน' },
      { icon: '🛡️', text: 'เบรกป้องกันคันหลังแซงในโค้งหักศอก', tag: 'กันถูกแซง' },
    ],
  },
  suspension: {
    key: 'suspension',
    code: 'SUSP-PR',
    name: 'SUSPENSION',
    thaiName: 'ระบบกันสะเทือน & ช่วงล่าง',
    primaryBenefit: 'ยางสึกช้าลง & ปีนเคิร์บไม่หมุน',
    keyEffects: [
      { icon: '🛞', text: 'ยางสึกช้าลง วิ่งได้นานขึ้นหลายรอบ', tag: 'ถนอมยาง' },
      { icon: '📐', text: 'ปีนขอบทางเคิร์บตัดโค้ง รถไม่สะบัด', tag: 'ปีนเคิร์บเนียน' },
      { icon: '🌧️', text: 'คุมรถง่ายขึ้นตอนฝนตกแทร็กลื่น', tag: 'เกาะแทร็กเปียก' },
      { icon: '🔄', text: 'พลิกตัวรถในโค้งสลับได้ฉับไว', tag: 'เลี้ยวคล่องตัว' },
    ],
  },
  chassis: {
    key: 'chassis',
    code: 'CHAS-MONO',
    name: 'CHASSIS MONOCOQUE',
    thaiName: 'แชสซีตัวถังคาร์บอน & HALO',
    primaryBenefit: 'บาลานซ์รถนิ่ง & ลดความเสี่ยงรถพัง',
    keyEffects: [
      { icon: '⚖️', text: 'กระจายน้ำหนักสมดุล เข้าโค้งนิ่ง', tag: 'บาลานซ์สมบูรณ์' },
      { icon: '🔧', text: 'โครงสร้างทนทาน ลดความเสี่ยงรถพัง (DNF)', tag: 'ทนทาน' },
      { icon: '🛡️', text: 'โครงสร้างนิรภัย Halo ปลอดภัยสูง', tag: 'มั่นใจทุกโค้ง' },
      { icon: '🏎️', text: 'ยกระดับคะแนนสมรรถนะรวมของรถ', tag: '+Car OVR' },
    ],
  },
};

/**
 * High-fidelity Vector Component Illustrations
 */
export const ComponentIllustrationSVG: React.FC<{
  statKey: CarStatKey;
  className?: string;
}> = ({ statKey, className = 'w-full h-36' }) => {
  switch (statKey) {
    case 'engine':
      return (
        <svg viewBox="0 0 320 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="engGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="engMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id="turboSparks" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background Lines */}
          <path d="M10 90 H310 M80 20 V160 M160 20 V160 M240 20 V160" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

          {/* Engine Block Main Silhouette */}
          <rect x="90" y="55" width="140" height="75" rx="10" fill="url(#engMetal)" stroke="#64748b" strokeWidth="2" />
          <path d="M110 55 V40 H210 V55" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

          {/* 6 Cylinder Heads / Cam Covers */}
          <g fill="#475569">
            <rect x="120" y="44" width="18" height="8" rx="2" stroke="#94a3b8" strokeWidth="1" />
            <rect x="150" y="44" width="18" height="8" rx="2" stroke="#94a3b8" strokeWidth="1" />
            <rect x="180" y="44" width="18" height="8" rx="2" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* Turbocharger Housing with Glowing Turbine */}
          <circle cx="65" cy="85" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="65" cy="85" r="18" fill="url(#turboSparks)" />
          {/* Turbine Blades */}
          <path d="M65 67 L65 103 M47 85 L83 85 M52 72 L78 98 M52 98 L78 72" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

          {/* Turbo Air Inlet & Intercooler Pipe */}
          <path d="M35 85 C35 75 45 65 65 65 H90" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <path d="M65 105 C65 125 90 125 105 125 H120" stroke="#38bdf8" strokeWidth="3" fill="none" strokeDasharray="4 2" />

          {/* Exhaust Manifolds Glowing Hot Red-Orange */}
          <path d="M200 80 Q230 75 260 90 T285 95" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M200 95 Q230 90 260 102 T285 105" stroke="#f97316" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M200 110 Q230 105 260 115 T285 115" stroke="#fbbf24" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Exhaust Tailpipe Flame Glow */}
          <circle cx="290" cy="105" r="14" fill="#f59e0b" opacity="0.3" filter="blur(4px)" />
          <polygon points="285,100 310,105 285,110" fill="#fbbf24" opacity="0.9" />

          {/* MGU-K Hybrid Electric Unit */}
          <rect x="130" y="95" width="55" height="26" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M152 101 L147 110 H155 L150 119" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Badges / Tech Labels */}
          <text x="160" y="32" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1.6L V6 TURBO HYBRID ERS</text>
          <text x="65" y="125" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">150,000 RPM</text>
          <text x="158" y="132" fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle">MGU-K 120kW</text>
        </svg>
      );

    case 'aero':
      return (
        <svg viewBox="0 0 320 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aeroStream" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wingCarbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Wind Tunnel Streamlines */}
          <g stroke="url(#aeroStream)" strokeWidth="1.5" strokeDasharray="16 8">
            <path d="M10 40 C70 40 120 28 180 32 C230 35 270 48 310 50" />
            <path d="M10 60 C80 60 130 50 170 52 C220 54 260 70 310 75" />
            <path d="M10 85 C90 85 140 80 180 82 C230 85 270 100 310 105" />
            <path d="M10 120 C100 120 150 125 190 128 C240 132 270 135 310 135" />
            <path d="M10 145 C90 145 150 142 200 142 C250 142 280 150 310 155" />
          </g>

          {/* F1 Car Profile Side Silhouette for Airflow Context */}
          <path
            d="M35 125 L75 122 Q120 118 150 95 Q180 75 210 78 Q240 82 275 80 L285 80 L285 125 Z"
            fill="url(#wingCarbon)"
            stroke="#475569"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Front Wing Elements with Multi-Tier Flaps */}
          <g stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
            <path d="M30 128 L60 125" />
            <path d="M32 124 L58 120" />
            <path d="M35 119 L55 115" />
            {/* Front Endplate */}
            <path d="M30 115 V133" stroke="#38bdf8" strokeWidth="2.5" />
          </g>

          {/* Rear Wing Structure + DRS Actuator */}
          <g>
            {/* Endplate */}
            <rect x="270" y="45" width="22" height="45" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Main Plane */}
            <path d="M260 65 H292" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
            {/* DRS Flap (Upper Wing) */}
            <path d="M260 52 H292" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            {/* DRS Hydraulic Pod */}
            <circle cx="276" cy="58" r="3.5" fill="#f59e0b" />
          </g>

          {/* Floor Venturi Tunnels & Diffuser (Ground Effect) */}
          <path d="M120 128 Q180 128 230 132 L275 120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M225 130 L250 148 M240 128 L265 146" stroke="#06b6d4" strokeWidth="2" />

          {/* Downforce Arrows (Pushing down into track) */}
          <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
            <path d="M50 85 V105 M46 100 L50 105 L54 100" />
            <path d="M180 45 V65 M176 60 L180 65 L184 60" />
            <path d="M276 25 V45 M272 40 L276 45 L280 40" />
          </g>

          {/* Labels */}
          <text x="50" y="80" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">FRONT WING</text>
          <text x="180" y="40" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">VORTEX VANE</text>
          <text x="276" y="20" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">DRS WING</text>
          <text x="200" y="165" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">VENTURI GROUND EFFECT DIFFUSER</text>
        </svg>
      );

    case 'brakes':
      return (
        <svg viewBox="0 0 320 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brakeHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.5" />
            </radialGradient>
            <linearGradient id="caliperMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <path d="M10 90 H310 M160 10 V170" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

          {/* Outer Wheel Rim Guide */}
          <circle cx="160" cy="90" r="76" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

          {/* Carbon Disc Rotor Base */}
          <circle cx="160" cy="90" r="56" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
          {/* Carbon Heat Glowing Ring */}
          <circle cx="160" cy="90" r="46" fill="url(#brakeHeat)" stroke="#f97316" strokeWidth="2" opacity="0.85" />
          <circle cx="160" cy="90" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />

          {/* Central Hub & Wheel Studs */}
          <circle cx="160" cy="90" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="160" cy="90" r="5" fill="#f59e0b" />
          {/* 5 Wheel Studs */}
          <circle cx="160" cy="74" r="2.5" fill="#e2e8f0" />
          <circle cx="175" cy="85" r="2.5" fill="#e2e8f0" />
          <circle cx="169" cy="103" r="2.5" fill="#e2e8f0" />
          <circle cx="151" cy="103" r="2.5" fill="#e2e8f0" />
          <circle cx="145" cy="85" r="2.5" fill="#e2e8f0" />

          {/* Cross-Drilled Radial Heat Ventilation Vanes (Glowing dots) */}
          <g fill="#fef08a" opacity="0.8">
            <circle cx="160" cy="50" r="1.5" /><circle cx="160" cy="58" r="1.5" />
            <circle cx="188" cy="62" r="1.5" /><circle cx="182" cy="69" r="1.5" />
            <circle cx="200" cy="90" r="1.5" /><circle cx="192" cy="90" r="1.5" />
            <circle cx="188" cy="118" r="1.5" /><circle cx="182" cy="111" r="1.5" />
            <circle cx="160" cy="130" r="1.5" /><circle cx="160" cy="122" r="1.5" />
            <circle cx="132" cy="118" r="1.5" /><circle cx="138" cy="111" r="1.5" />
            <circle cx="120" cy="90" r="1.5" /><circle cx="128" cy="90" r="1.5" />
            <circle cx="132" cy="62" r="1.5" /><circle cx="138" cy="69" r="1.5" />
          </g>

          {/* 6-Piston High Performance Monobloc Caliper (Clamping right side) */}
          <path
            d="M188 48 C215 58 226 80 226 95 C226 110 215 132 188 142 L180 135 C202 125 210 108 210 95 C210 82 202 65 180 55 Z"
            fill="url(#caliperMetal)"
            stroke="#fca5a5"
            strokeWidth="2"
          />

          {/* 6 Pistons */}
          <g fill="#475569" stroke="#fecaca" strokeWidth="1">
            <circle cx="202" cy="66" r="4.5" />
            <circle cx="206" cy="85" r="4.5" />
            <circle cx="206" cy="105" r="4.5" />
            <circle cx="202" cy="124" r="4.5" />
          </g>

          {/* Brake Cooling Duct with Blue Airflow Arrow */}
          <path d="M100 45 Q125 45 135 60 L145 70" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M140 68 L146 71 L145 65" fill="#38bdf8" />

          {/* Thermal Glow Halo */}
          <circle cx="160" cy="90" r="58" stroke="#f97316" strokeWidth="1.5" opacity="0.6" filter="blur(2px)" />

          {/* Tech Badges */}
          <text x="160" y="24" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CARBON-CARBON 1,000°C MATRIX</text>
          <text x="250" y="95" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="start">6-PISTON CALIPER</text>
          <text x="90" y="42" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">COOLING DUCT</text>
        </svg>
      );

    case 'suspension':
      return (
        <svg viewBox="0 0 320 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="suspMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <path d="M20 145 H300 M110 20 V160 M230 20 V160" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

          {/* Chassis Bulkhead Mount on Left */}
          <rect x="40" y="40" width="30" height="100" rx="4" fill="url(#suspMetal)" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="55" cy="55" r="3.5" fill="#f59e0b" />
          <circle cx="55" cy="90" r="3.5" fill="#f59e0b" />
          <circle cx="55" cy="125" r="3.5" fill="#f59e0b" />

          {/* Wheel Upright / Hub Assembly on Right */}
          <rect x="250" y="45" width="25" height="90" rx="4" fill="url(#suspMetal)" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="262" cy="90" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

          {/* Upper Double Wishbone (A-Arm) */}
          <path d="M55 55 L250 62 M55 70 L250 62" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

          {/* Lower Double Wishbone (A-Arm) */}
          <path d="M55 125 L250 118 M55 110 L250 118" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Diagonal Push-Rod Actuator Linkage (Red Carbon) */}
          <path d="M250 118 L90 45" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <circle cx="250" cy="118" r="5" fill="#f59e0b" />
          <circle cx="90" cy="45" r="5" fill="#ef4444" />

          {/* Inboard Rocker & Heave Coilover Damper Spring */}
          <polygon points="90,45 115,35 110,55" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <rect x="115" y="32" width="60" height="14" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Spring Coils */}
          <path d="M125 32 V46 M133 32 V46 M141 32 V46 M149 32 V46 M157 32 V46 M165 32 V46" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Anti-Roll Torsion Bar */}
          <path d="M110 55 C125 65 145 65 160 55" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Kerb Strike Vector Arrow (Ground Bump) */}
          <g stroke="#10b981" strokeWidth="2" strokeLinecap="round">
            <path d="M262 165 V142 M258 147 L262 142 L266 147" />
          </g>
          <text x="262" y="176" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">KERB ABSORPTION</text>

          {/* Tech Badges */}
          <text x="160" y="24" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">PUSH-ROD & DOUBLE WISHBONE GEOMETRY</text>
          <text x="145" y="80" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">HEAVE DAMPER</text>
          <text x="175" y="105" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">PUSH-ROD STRUT</text>
        </svg>
      );

    case 'chassis':
      return (
        <svg viewBox="0 0 320 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chassisCarbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="haloTitanium" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <path d="M10 90 H310 M100 20 V160 M200 20 V160" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

          {/* Monocoque Safety Cell Silhouette */}
          <path
            d="M30 115 L70 108 L110 88 L140 85 L200 85 L250 92 L290 110 L280 128 L230 132 L100 132 L35 125 Z"
            fill="url(#chassisCarbon)"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Carbon Fiber Weave Texture Accent Lines */}
          <g stroke="#334155" strokeWidth="1" opacity="0.4">
            <path d="M50 112 L70 125 M80 102 L100 125 M110 90 L130 125 M140 88 L160 125 M170 88 L190 125 M200 88 L220 125" />
            <path d="M70 108 L50 125 M100 95 L80 125 M130 88 L110 125 M160 88 L140 125 M190 88 L170 125 M220 90 L200 125" />
          </g>

          {/* Cockpit Opening */}
          <ellipse cx="160" cy="85" rx="34" ry="12" fill="#020617" stroke="#64748b" strokeWidth="2" />

          {/* Titanium HALO Structure (Top view & Arch) */}
          <path
            d="M132 85 C132 60 160 52 160 52 C160 52 188 60 188 85"
            stroke="url(#haloTitanium)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Central Halo Pylon */}
          <path d="M160 52 V82" stroke="url(#haloTitanium)" strokeWidth="4.5" strokeLinecap="round" />

          {/* Sidepod Radiator Air Intake Duct */}
          <path d="M190 92 L235 96 L228 120 L185 116 Z" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
          <path d="M195 96 L210 116" stroke="#38bdf8" strokeWidth="2" />

          {/* Ballast / Weight Balance Low Center of Gravity Point */}
          <circle cx="160" cy="125" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M160 118 V132 M153 125 H167" stroke="#ffffff" strokeWidth="1" />

          {/* Tech Badges */}
          <text x="160" y="32" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CARBON FIBER MONOCOQUE SURVIVAL CELL</text>
          <text x="160" y="46" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">TITANIUM HALO (125 kN LOAD)</text>
          <text x="160" y="148" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">OPTIMAL 54:46 WEIGHT BALANCE CG</text>
        </svg>
      );
  }
};
