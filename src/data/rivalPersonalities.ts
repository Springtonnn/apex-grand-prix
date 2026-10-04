export type DriverPersonalityKey =
  | 'apex_predator'
  | 'corner_virtuoso'
  | 'slingshot_hunter'
  | 'legendary_precision'
  | 'iron_wall'
  | 'tenacious_fighter'
  | 'smooth_operator'
  | 'ice_cold'
  | 'underdog_raider'
  | 'straight_line_rocket'
  | 'veteran_battler';

export interface DriverPersonalityProfile {
  key: DriverPersonalityKey;
  driverId: string;
  driverName: string;
  driverTag: string;
  teamName: string;
  number: number;
  icon: string;
  title: string;
  titleTh: string;
  tagline: string;
  skillName: string;
  skillNameTh: string;
  skillDescription: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const DRIVER_PERSONALITIES: Record<string, DriverPersonalityProfile> = {
  'ai-1': {
    key: 'apex_predator',
    driverId: 'ai-1',
    driverName: 'Max Verstappen',
    driverTag: 'VER',
    teamName: 'Red Bull Racing',
    number: 1,
    icon: '🦁',
    title: 'Apex Predator',
    titleTh: 'จอมล่าเอเพ็กซ์ไร้ปรานี',
    tagline: 'เบรกช้าสุดขีด เสียบตัดเอเพ็กซ์คมกริบ ไม่มียกคันเร่งในจังหวะดวล',
    skillName: 'APEX DIVE-BOMB',
    skillNameTh: 'พุ่งเสียบในโค้งสายฟ้า',
    skillDescription: 'เบรกช้ากว่าปกติ พุ่งตัดไลน์เอเพ็กซ์วงในด้วยความเร็วสูง และเร่งเครื่องออกจากโค้งทันที',
    badgeBg: 'rgba(30, 58, 138, 0.95)',
    badgeBorder: '#3b82f6',
    badgeText: '#93c5fd',
  },
  'ai-2': {
    key: 'corner_virtuoso',
    driverId: 'ai-2',
    driverName: 'Charles Leclerc',
    driverTag: 'LEC',
    teamName: 'Scuderia Ferrari',
    number: 16,
    icon: '🐎',
    title: 'Corner Virtuoso',
    titleTh: 'เซียนโค้งกล้าเสี่ยง',
    tagline: 'เร่งความเร็วทะลุโค้ง รีดสมรรถนะแอร์โรว์ไดนามิกส์ถึงขีดสุด',
    skillName: 'CORNER BLITZ',
    skillNameTh: 'สาดโค้งความเร็วสูง',
    skillDescription: 'รักษาความเร็วในโค้งสูงกว่ารถคันอื่นถึง +12 km/h ด้วยไลน์กว้างจรดเคิร์บ',
    badgeBg: 'rgba(185, 28, 28, 0.95)',
    badgeBorder: '#ef4444',
    badgeText: '#fca5a5',
  },
  'ai-3': {
    key: 'slingshot_hunter',
    driverId: 'ai-3',
    driverName: 'Lando Norris',
    driverTag: 'NOR',
    teamName: 'McLaren F1 Team',
    number: 4,
    icon: '⚡',
    title: 'Slingshot Hunter',
    titleTh: 'นักล่าสลิปสตรีมแซงสายฟ้า',
    tagline: 'เกาะติดท้ายรถคู่แข่ง รอจังหวะสลิปสตรีมระเบิดความเร็วดีดแซงฉับพลัน',
    skillName: 'SLINGSHOT SURGE',
    skillNameTh: 'สลิปสตรีมดีดพุ่งแซง',
    skillDescription: 'รับแรงดูดสลิปสตรีมแรงกว่าปกติ +22 km/h เมื่อตามหลังในระยะ 70 เมตร',
    badgeBg: 'rgba(194, 65, 12, 0.95)',
    badgeBorder: '#f97316',
    badgeText: '#fed7aa',
  },
  'ai-4': {
    key: 'legendary_precision',
    driverId: 'ai-4',
    driverName: 'Lewis Hamilton',
    driverTag: 'HAM',
    teamName: 'Mercedes-AMG F1',
    number: 44,
    icon: '👑',
    title: 'Legendary Precision',
    titleTh: 'สุขุมระดับตำนาน',
    tagline: 'อ่านไลน์เฉียบขาด หลบสิ่งกีดขวางไร้ที่ติ และสวนกลับด้วย Hammer Time',
    skillName: 'HAMMER TIME',
    skillNameTh: 'เค้นฟอร์มแชมป์โลกสวนกลับ',
    skillDescription: 'เมื่อโดนแซง จะระเบิดพลัง Hammer Time เร่งความเร็ว +14 km/h เพื่อไล่บี้เอาตำแหน่งคืน',
    badgeBg: 'rgba(15, 118, 110, 0.95)',
    badgeBorder: '#00d2be',
    badgeText: '#99f6e4',
  },
  'ai-5': {
    key: 'iron_wall',
    driverId: 'ai-5',
    driverName: 'Fernando Alonso',
    driverTag: 'ALO',
    teamName: 'Aston Martin F1',
    number: 14,
    icon: '🛡️',
    title: 'The Iron Wall',
    titleTh: 'กำแพงเหล็กจอมบล็อก',
    tagline: 'เขี้ยวลากดิน โยกบังไลน์สกัดการแซง เบียดปะทะไม่สะทกสะท้าน',
    skillName: 'DEFENSIVE WEAVE',
    skillNameTh: 'โยกบล็อกปิดไลน์สกัดแซง',
    skillDescription: 'สแกนรถข้างหลังแล้วโยกปิดไลน์ทันที ลดแรงสะเทือนจากการชน 40% และไม่เสียจังหวะ',
    badgeBg: 'rgba(6, 78, 59, 0.95)',
    badgeBorder: '#10b981',
    badgeText: '#a7f3d0',
  },
  'ai-6': {
    key: 'tenacious_fighter',
    driverId: 'ai-6',
    driverName: 'George Russell',
    driverTag: 'RUS',
    teamName: 'Mercedes-AMG F1',
    number: 63,
    icon: '🥊',
    title: 'Tenacious Fighter',
    titleTh: 'สายไฟท์เตอร์กัดไม่ปล่อย',
    tagline: 'สู้ไม่ถอยในจังหวะตีคู่ เบียดชนไม่มียอมยกคันเร่ง',
    skillName: 'SIDE-BY-SIDE BRAWL',
    skillNameTh: 'ดวลเบียดตีคู่ไม่ยก',
    skillDescription: 'เมื่อขับตีคู่จะไม่ยอมถอยคันเร่ง และพร้อมเบียดสู้ไลน์ในทุกจังหวะ',
    badgeBg: 'rgba(51, 65, 85, 0.95)',
    badgeBorder: '#94a3b8',
    badgeText: '#e2e8f0',
  },
  'ai-7': {
    key: 'smooth_operator',
    driverId: 'ai-7',
    driverName: 'Carlos Sainz',
    driverTag: 'SAI',
    teamName: 'Scuderia Ferrari',
    number: 55,
    icon: '🧠',
    title: 'Smooth Operator',
    titleTh: 'สุขุมฉลาดฉวยโอกาสทอง',
    tagline: 'คำนวณจังหวะแข่งชาญฉลาด สลับไลน์หนีกลุ่มรถช้า หาช่องแซงที่โล่งสะอาด',
    skillName: 'SMOOTH UNDERCUT',
    skillNameTh: 'สลับไลน์แซงวงในไร้เสียง',
    skillDescription: 'อ่านการจราจรด้านหน้าและเปลี่ยนเลนแซงอัตโนมัติ ไม่ติดพันกับรถที่ขวางทาง',
    badgeBg: 'rgba(133, 77, 14, 0.95)',
    badgeBorder: '#eab308',
    badgeText: '#fef08a',
  },
  'ai-8': {
    key: 'ice_cold',
    driverId: 'ai-8',
    driverName: 'Oscar Piastri',
    driverTag: 'PIA',
    teamName: 'McLaren F1 Team',
    number: 81,
    icon: '🧊',
    title: 'Ice Cold',
    titleTh: 'เยือกเย็นดั่งน้ำแข็ง',
    tagline: 'ไร้ความกดดัน นิ่งสงบ ฟื้นตัวจากการชนและสะบัดเร็วกว่าใคร',
    skillName: 'ICE RECOVERY',
    skillNameTh: 'ฟื้นสติคืนการควบคุมฉับไว',
    skillDescription: 'ระยะเวลาสตันและสปีดดรอปจากการชนลดลง 50% คืนความเร็วสู่เรซเพซทันที',
    badgeBg: 'rgba(7, 89, 133, 0.95)',
    badgeBorder: '#38bdf8',
    badgeText: '#bae6fd',
  },
  'ai-9': {
    key: 'underdog_raider',
    driverId: 'ai-9',
    driverName: 'Pierre Gasly',
    driverTag: 'GAS',
    teamName: 'Alpine F1 Team',
    number: 10,
    icon: '🔥',
    title: 'Underdog Raider',
    titleTh: 'สายลุยกล้าแลก',
    tagline: 'พุ่งชาร์จทุกช่องว่าง ตาไว ล่าบูสเตอร์แพดเพื่อสปีดทะยาน',
    skillName: 'BOOSTER RUSH',
    skillNameTh: 'พุ่งชาร์จบูสเตอร์ทะลวง',
    skillDescription: 'สแกนหาบูสเตอร์แพดล่วงหน้าและพุ่งเข้าเหยียบด้วยความแม่นยำสูง',
    badgeBg: 'rgba(157, 23, 77, 0.95)',
    badgeBorder: '#ec4899',
    badgeText: '#fbcfe8',
  },
  'ai-10': {
    key: 'straight_line_rocket',
    driverId: 'ai-10',
    driverName: 'Alexander Albon',
    driverTag: 'ALB',
    teamName: 'Williams Racing',
    number: 23,
    icon: '🚀',
    title: 'Straight-Line Rocket',
    titleTh: 'จรวดทางตรงสู้สุดใจ',
    tagline: 'แอร์โรว์วิลเลียมส์แรงต้านต่ำพิเศษ ทางตรงเร็วทะลุปรอท',
    skillName: 'STRAIGHT-LINE MISSILE',
    skillNameTh: 'ยิงทางตรงความเร็วสูงสุด',
    skillDescription: 'ความเร็วสูงสุดในทางตรงเพิ่มขึ้นพิเศษ +12 km/h และกอดไลน์ในเหนียวแน่นเมื่อนำหน้า',
    badgeBg: 'rgba(29, 78, 216, 0.95)',
    badgeBorder: '#60a5fa',
    badgeText: '#bfdbfe',
  },
  'ai-11': {
    key: 'veteran_battler',
    driverId: 'ai-11',
    driverName: 'Nico Hülkenberg',
    driverTag: 'HUL',
    teamName: 'Haas F1 Team',
    number: 27,
    icon: '⚓',
    title: 'Veteran Battler',
    titleTh: 'จอมเก๋ามากประสบการณ์',
    tagline: 'การรักษาตำแหน่งแน่นอนสม่ำเสมอ ไลน์การขับมั่นคงยากจะเจาะเข้า',
    skillName: 'VETERAN HOLD',
    skillNameTh: 'คุมไลน์สกัดเก๋าเกม',
    skillDescription: 'รักษาไลน์การขับอย่างสมดุล ไม่หลุดออกนอกแทร็ก และรับมือการแซงได้เนียนตา',
    badgeBg: 'rgba(71, 85, 105, 0.95)',
    badgeBorder: '#cbd5e1',
    badgeText: '#f8fafc',
  },
};

export function getDriverPersonality(aiIdOrTag: string): DriverPersonalityProfile {
  if (DRIVER_PERSONALITIES[aiIdOrTag]) {
    return DRIVER_PERSONALITIES[aiIdOrTag];
  }
  const byTag = Object.values(DRIVER_PERSONALITIES).find(
    (p) => p.driverTag.toLowerCase() === aiIdOrTag.toLowerCase()
  );
  if (byTag) return byTag;

  // Fallback
  return {
    key: 'tenacious_fighter',
    driverId: aiIdOrTag,
    driverName: 'Challenger Rival',
    driverTag: 'RIV',
    teamName: 'F1 Rival Team',
    number: 99,
    icon: '🏎️',
    title: 'Tenacious Challenger',
    titleTh: 'ผู้ท้าชิงสายสู้',
    tagline: 'นักแข่งคู่ปรับที่พร้อมสู้เพื่อชัยชนะ',
    skillName: 'TACTICAL SPRINT',
    skillNameTh: 'เร่งสปีดชิงจังหวะ',
    skillDescription: 'เร่งความเร็วเกาะติดการแข่งขัน',
    badgeBg: 'rgba(15, 23, 42, 0.95)',
    badgeBorder: '#94a3b8',
    badgeText: '#e2e8f0',
  };
}
