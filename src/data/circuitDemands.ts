/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarStatKey, CarStats } from '../types/game';

export interface CircuitDemandInfo {
  round: number;
  circuitName: string;
  country: string;
  flag: string;
  stageName: string;
  stageTier: 1 | 2 | 3 | 4;
  rivalSpeedRange: string;
  rivalBenchmarkOvr: number;
  topContenders: string[];
  primaryFocus: CarStatKey[];
  secondaryFocus: CarStatKey[];
  trackTypeDescription: string;
  tacticalAdvice: string;
  rivalBehaviorNotice: string;
}

export const CIRCUIT_STRATEGIC_DEMANDS: Record<number, CircuitDemandInfo> = {
  1: {
    round: 1,
    circuitName: 'Albert Park Circuit',
    country: 'Australia',
    flag: '🇦🇺',
    stageName: 'Opening Flyaways',
    stageTier: 1,
    rivalSpeedRange: '320 - 330 กม./ชม.',
    rivalBenchmarkOvr: 70,
    topContenders: ['VER', 'LEC', 'NOR'],
    primaryFocus: ['engine', 'chassis'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'พาร์คแลนด์กึ่งสตรีตเซอร์กิต ไหลลื่นสลับโค้งชิเคน',
    tacticalAdvice: 'สนามเปิดฤดูกาล แนะนำอัพเกรด Engine และ Chassis เพื่ออัตราเร่งออกจากชิเคนและการเข้าโค้งที่กระชับ',
    rivalBehaviorNotice: 'คู่แข่งยังขับอย่างระมัดระวัง เป็นโอกาสทองในการขึ้นโพเดียมเก็บแต้มแรกของปี',
  },
  2: {
    round: 2,
    circuitName: 'Bahrain International Circuit',
    country: 'Bahrain',
    flag: '🇧🇭',
    stageName: 'Desert Power & Heavy Braking',
    stageTier: 1,
    rivalSpeedRange: '325 - 335 กม./ชม.',
    rivalBenchmarkOvr: 72,
    topContenders: ['VER', 'LEC', 'HAM'],
    primaryFocus: ['brakes', 'engine'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'ทะเลทราย ทางตรงยาวสลับโค้งหักศอกที่เบรกหนัก',
    tacticalAdvice: 'มีจุดเบรกหนัก 4 โซนจากความเร็ว 325+ กม./ชม. ระบบเบรกช่วยให้เบรกลึกแซงคู่แข่งในโค้ง 1 และโค้ง 4',
    rivalBehaviorNotice: 'คู่แข่งเริ่มดันสปีดบนทางตรงยาว แนะนำอัพเกรดเบรกเพื่อแซงตอนแต่งไลน์',
  },
  3: {
    round: 3,
    circuitName: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    flag: '🇪🇸',
    stageName: 'Aerodynamic Benchmark',
    stageTier: 1,
    rivalSpeedRange: '330 - 340 กม./ชม.',
    rivalBenchmarkOvr: 74,
    topContenders: ['VER', 'NOR', 'LEC'],
    primaryFocus: ['aero', 'suspension'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'สนามมาตรฐานทดสอบแรงกดอากาศพลศาสตร์และโค้งความเร็วสูง',
    tacticalAdvice: 'โค้งยาว Turn 3 และโค้งขวาความเร็วสูง ต้องการ Aero เพื่อสร้างแรงกดหน่วงไม่ให้รถไถลออกนอกแทร็ก',
    rivalBehaviorNotice: 'ทีมท็อปเริ่มนำแพ็กเกจ Aero อัพเกรดมาใช้ จะเห็นความต่างในโค้งความเร็วสูงชัดเจน',
  },
  4: {
    round: 4,
    circuitName: 'Circuit de Monaco',
    country: 'Monaco',
    flag: '🇲🇨',
    stageName: 'Crown Jewel Street Fight',
    stageTier: 1,
    rivalSpeedRange: '332 - 342 กม./ชม.',
    rivalBenchmarkOvr: 76,
    topContenders: ['LEC', 'VER', 'NOR'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'แทร็กแคบกั้นกำแพงคอนกรีต โค้งหักศอกและโค้งชิเคนท่าเรือ',
    tacticalAdvice: 'ความเร็วปลายทางตรงไม่ใช่ปัจจัยหลัก แต่คือความคล่องตัวของ Chassis และความแม่นยำของ Brakes',
    rivalBehaviorNotice: 'คู่แข่งจะขับปิดไลน์อย่างเหนียวแน่น ต้องอาศัยความคล่องตัวโยกแซงในชิเคน',
  },
  5: {
    round: 5,
    circuitName: 'Bangkok River Street Circuit',
    country: 'Thailand',
    flag: '🇹🇭',
    stageName: 'F1 Thailand Grand Prix (Bangkok 2571)',
    stageTier: 2,
    rivalSpeedRange: '338 - 348 กม./ชม.',
    rivalBenchmarkOvr: 78,
    topContenders: ['ALB', 'VER', 'HAM', 'NOR'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['engine', 'aero'],
    trackTypeDescription: 'สตรีทแทร็กความเร็วสูงริมแม่น้ำเจ้าพระยา เลียบพระบรมมหาราชวัง สะพานพระราม 8 และโค้งวัดอรุณ',
    tacticalAdvice: 'สตรีทเซอร์กิตริมน้ำกั้นกำแพงคอนกรีต ต้องการความคล่องตัวของ Chassis และความแม่นยำของ Brakes บนถนนกรุงเทพฯ',
    rivalBehaviorNotice: 'อเล็กซ์ อัลบอน (ALB) และทีมชั้นนำจะดุดันเป็นพิเศษในเรซประเทศไทยเพื่อแฟนมอเตอร์สปอร์ตชาวไทย',
  },
  6: {
    round: 6,
    circuitName: 'Silverstone Circuit',
    country: 'United Kingdom',
    flag: '🇬🇧',
    stageName: 'Home of High Speed Sweepers',
    stageTier: 2,
    rivalSpeedRange: '344 - 354 กม./ชม.',
    rivalBenchmarkOvr: 80,
    topContenders: ['HAM', 'NOR', 'VER'],
    primaryFocus: ['aero', 'suspension'],
    secondaryFocus: ['engine'],
    trackTypeDescription: 'สนามตำนาน โค้งต่อเชื่อมความเร็วสูง Maggotts-Becketts-Chapel',
    tacticalAdvice: 'Aero และ Suspension สำคัญที่สุดในการแบกความเร็วทะลุชุดโค้งต่อเนื่องโดยไม่หลุดไลน์',
    rivalBehaviorNotice: 'Mercedes และ McLaren จะเร็วเป็นพิเศษในสนามบ้านเกิด ต้องมี Aero ระดับ 80+ เพื่อสู้ได้',
  },
  7: {
    round: 7,
    circuitName: 'Red Bull Ring',
    country: 'Austria',
    flag: '🇦🇹',
    stageName: 'Alpine Power Sprint',
    stageTier: 2,
    rivalSpeedRange: '348 - 358 กม./ชม.',
    rivalBenchmarkOvr: 82,
    topContenders: ['VER', 'LEC', 'NOR'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'แทร็กสั้นรอบเร็ว ทางขึ้นเนินชัน 3 สเตจ',
    tacticalAdvice: 'การขึ้นเนินชันทดสอบแรงม้าและแรงบิดโดยตรง อัพเกรด Engine เพื่อไม่ให้เสียความเร็วตอนไต่เนิน',
    rivalBehaviorNotice: 'Max Verstappen และ Red Bull แข็งแกร่งมากที่นี่ จะกดดันคุณตลอดการแข่งขัน',
  },
  8: {
    round: 8,
    circuitName: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    flag: '🇧🇪',
    stageName: 'Ardennes High-Speed Rollercoaster',
    stageTier: 2,
    rivalSpeedRange: '354 - 364 กม./ชม.',
    rivalBenchmarkOvr: 84,
    topContenders: ['VER', 'LEC', 'NOR', 'HAM'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'เนิน Eau Rouge และทางตรง Kemmel Straight ที่ยาวสะใจ',
    tacticalAdvice: 'หากพลังเครื่องยนต์ไม่ถึง 85+ OVR คุณจะถูกคู่แข่งเปิด DRS แซงผ่านบนทางตรง Kemmel อย่างง่ายดาย',
    rivalBehaviorNotice: 'คู่แข่งวิ่งเร็วทะลุ 360 กม./ชม. และดักเก็บ Speed Pad อย่างแม่นยำ',
  },
  9: {
    round: 9,
    circuitName: 'Circuit Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    stageName: 'Banked Dunes & High Grip',
    stageTier: 2,
    rivalSpeedRange: '356 - 366 กม./ชม.',
    rivalBenchmarkOvr: 86,
    topContenders: ['VER', 'NOR', 'LEC'],
    primaryFocus: ['suspension', 'chassis'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'โค้งลาดเอียง (Banked Curves) กลางเนินทรายริมทะเลเหนือ',
    tacticalAdvice: 'ช่วงล่าง Suspension รับภาระแรงกดมหาศาลในโค้งเอียง ช่วยให้รถทรงตัวนิ่งและเร่งออกโค้งได้เร็วกว่า',
    rivalBehaviorNotice: 'กองเชียร์เจ้าถิ่นหนุนหลัง Verstappen คู่แข่งจะขับดุดันและบีบช่องว่างอย่างรวดเร็ว',
  },
  10: {
    round: 10,
    circuitName: 'Autodromo Nazionale Monza',
    country: 'Italy',
    flag: '🇮🇹',
    stageName: 'The Temple of Speed',
    stageTier: 3,
    rivalSpeedRange: '364 - 374 กม./ชม.',
    rivalBenchmarkOvr: 88,
    topContenders: ['LEC', 'VER', 'SAI', 'NOR'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'วิหารแห่งความเร็ว วิ่งคันเร่งเต็ม 80% ของแทร็ก ทางตรงยาวที่สุด',
    tacticalAdvice: 'ไฟลต์บังคับ! ต้องอัพเกรด Engine & Aero ให้แตะระดับ 88+ เพื่อทำความเร็วปลายทะลุ 365+ กม./ชม.',
    rivalBehaviorNotice: 'Ferrari และ Red Bull นำเครื่องยนต์สเปกสูงสุดมาลงแข่ง ความเร็วทางตรงโหดเหี้ยมมาก',
  },
  11: {
    round: 11,
    circuitName: 'Marina Bay Street Circuit',
    country: 'Singapore',
    flag: '🇸🇬',
    stageName: 'Night Street Heat & Precision',
    stageTier: 3,
    rivalSpeedRange: '366 - 376 กม./ชม.',
    rivalBenchmarkOvr: 90,
    topContenders: ['LEC', 'NOR', 'VER', 'HAM'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'สตรีตเซอร์กิตกลางคืน 19 โค้ง พื้นผิวไม่เรียบ ร้อนชื้น',
    tacticalAdvice: 'ต้องการแชสซีส์ที่คล่องตัวสูงในการเปลี่ยนทิศทางฉับไว และเบรกที่คงทนเพื่อเลี้ยวสกัดคู่แข่ง',
    rivalBehaviorNotice: 'การแข่งขันกลางคืนมีกำแพงประชิดตลอดเส้นทาง ความผิดพลาดเพียงนิดเดียวจะเสียอันดับทันที',
  },
  12: {
    round: 12,
    circuitName: 'Suzuka International Racing Course',
    country: 'Japan',
    flag: '🇯🇵',
    stageName: 'The Ultimate Driver Test',
    stageTier: 3,
    rivalSpeedRange: '370 - 380 กม./ชม.',
    rivalBenchmarkOvr: 92,
    topContenders: ['VER', 'NOR', 'LEC', 'HAM'],
    primaryFocus: ['aero', 'chassis'],
    secondaryFocus: ['engine'],
    trackTypeDescription: 'สนามรูปเลขแปด โค้ง S-Curves สลับซ้ายขวา และโค้ง 130R ในตำนาน',
    tacticalAdvice: 'Aero และ Chassis ต้องทำงานประสานกันอย่างสมบูรณ์แบบเพื่อไม่ให้เสียโมเมนตัมใน S-Curves',
    rivalBehaviorNotice: 'คู่แข่งระดับท็อป 4 คันวิ่งประกบติดด้วยความเร็วเฉลี่ย 375 กม./ชม. พร้อมจังหวะเข้าโค้งที่ไร้ที่ติ',
  },
  13: {
    round: 13,
    circuitName: 'Circuit of the Americas (COTA)',
    country: 'United States',
    flag: '🇺🇸',
    stageName: 'Texas Elevation & Straightaway Battle',
    stageTier: 3,
    rivalSpeedRange: '374 - 384 กม./ชม.',
    rivalBenchmarkOvr: 94,
    topContenders: ['VER', 'HAM', 'LEC', 'NOR'],
    primaryFocus: ['engine', 'suspension'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'ขึ้นเนิน Turn 1 มุมมองบอด และทางตรงหลังยาว 1.2 กิโลเมตร',
    tacticalAdvice: 'อัพเกรด Engine สำหรับทางตรงยาว และ Suspension รองรับพื้นผิวเป็นลอนคลื่นของ COTA',
    rivalBehaviorNotice: 'คู่แข่งจะใช้ DRS และจังหวะบูสต์ไล่ล่าอย่างไม่ลดละ หากรถช้าจะโดนแซงรูด',
  },
  14: {
    round: 14,
    circuitName: 'Autódromo Hermanos Rodríguez',
    country: 'Mexico',
    flag: '🇲🇽',
    stageName: 'High Altitude Thin Air Challenge',
    stageTier: 3,
    rivalSpeedRange: '378 - 388 กม./ชม.',
    rivalBenchmarkOvr: 95,
    topContenders: ['VER', 'LEC', 'NOR', 'PER'],
    primaryFocus: ['aero', 'engine'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'สูงกว่าระดับน้ำทะเล 2,200 เมตร อากาศเบาบาง แรงกดตามธรรมชาติลดลง 25%',
    tacticalAdvice: 'ต้องอัพเกรด Aero สเปกสูงสุดเพื่อสร้างแรงกดทดแทนอากาศเบาบาง และ Engine เพื่อชดเชยออกซิเจนที่น้อยลง',
    rivalBehaviorNotice: 'ความเร็วปลายบนทางตรงยาวแตะ 380+ กม./ชม. รถที่มีแอร์โรต่ำจะลื่นไถลควบคุมไม่อยู่',
  },
  15: {
    round: 15,
    circuitName: 'Autódromo José Carlos Pace (Interlagos)',
    country: 'Brazil',
    flag: '🇧🇷',
    stageName: 'South American Title Showdown',
    stageTier: 4,
    rivalSpeedRange: '382 - 390 กม./ชม.',
    rivalBenchmarkOvr: 96,
    topContenders: ['VER', 'HAM', 'NOR', 'LEC'],
    primaryFocus: ['suspension', 'engine'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'สนามวิ่งทวนเข็มนาฬิกา เนินลูกคลื่นและโค้ง Senna S อันโด่งดัง',
    tacticalAdvice: 'การเข้าโค้ง Senna S บนทางลงเขาต้องการ Suspension และ Engine ที่ตอบสนองฉับไวเพื่อขึ้นแซง',
    rivalBehaviorNotice: 'การขับเคี่ยวเข้าสู่ช่วงชี้ชะตาแชมป์โลก คู่แข่งจะโจมตีทุกจุดเปิดและประกบติดท้ายรถคุณตลอดเวลา',
  },
  16: {
    round: 16,
    circuitName: 'Las Vegas Strip Circuit',
    country: 'United States',
    flag: '🇺🇸',
    stageName: 'Vegas Neon Cold Nights & Hyper-Speed',
    stageTier: 4,
    rivalSpeedRange: '386 - 394 กม./ชม.',
    rivalBenchmarkOvr: 97,
    topContenders: ['VER', 'LEC', 'NOR', 'RUS'],
    primaryFocus: ['engine', 'brakes'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'ทางตรง Strip ความเร็วทะลุ 385+ กม./ชม. กลางแสงสีนีออนและอากาศหนาว',
    tacticalAdvice: 'ทางตรงยาวมหาศาลต้องการ Engine สูงสุด 95+ OVR และ Brakes เกรดท็อปเพื่อหยุดรถก่อนเลี้ยวหักศอก',
    rivalBehaviorNotice: 'คู่แข่งวิ่งด้วยความเร็วเกิน 385 กม./ชม. บนทางตรง หากรถคุณยังไม่อัพเกรดจะตามไม่ทันแน่นอน',
  },
  17: {
    round: 17,
    circuitName: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    stageName: 'Twilight Championship Decider',
    stageTier: 4,
    rivalSpeedRange: '388 - 396 กม./ชม.',
    rivalBenchmarkOvr: 98,
    topContenders: ['VER', 'LEC', 'NOR', 'HAM'],
    primaryFocus: ['engine', 'brakes'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'แข่งใต้แสงไฟสปอตไลท์ ทางตรงยาว 2 สเตจและเซกเตอร์โรงแรมหรู',
    tacticalAdvice: 'สนามรองสุดท้ายของฤดูกาล ชิ้นส่วนรถต้องแตะระดับ 95-98 OVR ทุกชิ้นเพื่อลุ้นคว้าแต้มแชมป์โลก',
    rivalBehaviorNotice: 'คู่แข่งขับด้วยความเร็วระดับแชมเปียนชิป DRS ทุกจุดเปิดใช้งานอย่างเต็มประสิทธิภาพ',
  },
  18: {
    round: 18,
    circuitName: 'Cape Town Grand Prix Circuit',
    country: 'South Africa',
    flag: '🇿🇦',
    stageName: 'World Tour Grand Finale',
    stageTier: 4,
    rivalSpeedRange: '392 - 400+ กม./ชม.',
    rivalBenchmarkOvr: 99,
    topContenders: ['VER', 'LEC', 'NOR', 'HAM', 'ALO'],
    primaryFocus: ['engine', 'aero', 'chassis', 'brakes', 'suspension'],
    secondaryFocus: [],
    trackTypeDescription: 'สนามปิดฉากฤดูกาล ริมชายฝั่งมหาสมุทรแอตแลนติก โค้งความเร็วสูงและทางตรงเลียบหาด',
    tacticalAdvice: 'รอบชิงชนะเลิศระดับโลก! รถต้องอัพเกรดเต็มสูบ (95-99 OVR ทุกจุด) และขับอย่างสมบูรณ์แบบเพื่อขึ้นโพเดียม P1!',
    rivalBehaviorNotice: 'คู่แข่งทุกคนปลดล็อกสมรรถนะสูงสุด วิ่งแตะ 395-405 กม./ชม. ด้วยความดุดันระดับตำนาน',
  },
};

export function getCircuitDemands(roundNumber: number): CircuitDemandInfo {
  const safeRound = Math.min(18, Math.max(1, roundNumber));
  return CIRCUIT_STRATEGIC_DEMANDS[safeRound] || CIRCUIT_STRATEGIC_DEMANDS[1];
}

export function evaluateCarPreparedness(
  car: CarStats,
  demands: CircuitDemandInfo
): {
  playerCarOvr: number;
  benchmarkOvr: number;
  gap: number;
  status: 'advantage' | 'parity' | 'warning' | 'danger';
  title: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  const playerCarOvr = Math.round(
    (car.engine + car.aero + car.brakes + car.suspension + car.chassis) / 5
  );
  const benchmarkOvr = demands.rivalBenchmarkOvr;
  const gap = playerCarOvr - benchmarkOvr;

  if (gap >= 4) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'advantage',
      title: 'ได้เปรียบสมรรถนะ (Car Advantage)',
      desc: `รถของคุณ (${playerCarOvr} OVR) เหนือกว่าค่าเฉลี่ยคู่แข่ง (${benchmarkOvr} OVR) มีโอกาสคว้าชัยชนะ P1 สูงมาก`,
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
    };
  }

  if (gap >= -1) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'parity',
      title: 'สมรรถนะสูสี (Competitive Match)',
      desc: `รถของคุณ (${playerCarOvr} OVR) อยู่ในเกณฑ์สูสีกับคู่แข่ง (${benchmarkOvr} OVR) ต้องอาศัยฝีมือขับและเหยียบบูสต์สม่ำเสมอ`,
      badgeBg: 'bg-blue-950/80',
      badgeText: 'text-blue-400',
      badgeBorder: 'border-blue-500/40',
    };
  }

  if (gap >= -6) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'warning',
      title: 'เริ่มเสียเปรียบ (Slightly Underpowered)',
      desc: `รถของคุณ (${playerCarOvr} OVR) ตามหลังคู่แข่ง (${benchmarkOvr} OVR) อยู่ ${Math.abs(gap)} แต้ม แนะนำอัพเกรดชิ้นส่วนสำคัญก่อนแข่ง`,
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/40',
    };
  }

  return {
    playerCarOvr,
    benchmarkOvr,
    gap,
    status: 'danger',
    title: 'เสียเปรียบอย่างหนัก! ต้องอัพเกรดด่วน (Critical Upgrade Needed)',
    desc: `รถของคุณ (${playerCarOvr} OVR) ต่ำกว่าคู่แข่ง (${benchmarkOvr} OVR) มากถึง ${Math.abs(gap)} แต้ม! คู่แข่งจะทิ้งห่างบนทางตรงและเข้าโค้งได้เร็วกว่า ต้องอัพเกรดเพื่อเอาชนะ`,
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/50',
  };
}
