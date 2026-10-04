import re

def clean_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. CarUpgradeIllustrations.tsx
clean_file('src/components/CarUpgradeIllustrations.tsx', [
    ("thaiName: 'เครื่องยนต์ V6 เทอร์โบ',", "thaiName: 'V6 Turbo Hybrid Power Unit',"),
    ("primaryBenefit: 'วิ่งทางตรงเร็วขึ้น & เร่งแซงไว',", "primaryBenefit: 'Higher Top Speed & Fast Acceleration',")
])

# 2. raceEffects.ts
clean_file('src/utils/raceEffects.ts', [
    ("engine: '📉 ความเร็วปลายและอัตราเร่งไม่พอ เสียเวลาบนทางตรงยาวเมื่อเทียบกับคู่แข่ง แนะนำอัพเกรด Engine',", "engine: '📉 Top speed and acceleration lag behind rivals on long straights. Upgrade Engine PU.',"),
    ("brakes: '📉 ระบบเบรกขาดประสิทธิภาพ เสียเวลาในจุดเบรกหนักของสนามนี้มากที่สุด แนะนำอัพเกรด Brakes ก่อนแข่งรอบถัดไป',", "brakes: '📉 Braking efficiency is low; losing significant time into heavy stops. Upgrade Brakes before next race.',")
])

# 3. HelpTutorial.tsx
with open('src/components/HelpTutorial.tsx', 'r', encoding='utf-8') as f:
    ht = f.read()

ht = ht.replace('Quick Time Event (QTE) ลูกศร & ฝีมือลูกเรือ:', 'Quick Time Event (QTE) Arrows & Pit Crew Skill:')
ht = ht.replace('ระหว่างการเข้า Pit Stop จะมีลูกศร WASD / ปุ่มลูกศรปรากฏขึ้นบนหน้าจอให้คุณกดตามลำดับอย่างแม่นยำ:', 'During every pit stop, a WASD / Arrow key sequence appears on screen for you to execute with speed and precision:')
ht = ht.replace('ยิ่งลูกเรือฝีมือดี ลูกศรยิ่งน้อยลง:', 'Elite Crew = Fewer Arrows:')
ht = ht.replace('ลูกเรือระดับแชมป์โลก (90+ OVR) จะเหลือลูกศรเพียง 4-5 ตัว ทำให้กดผ่านได้ในพริบตา ขณะที่ลูกเรือเริ่มต้นอาจมีถึง 9-10 ตัว', 'World-class pit crews (90+ OVR) require only 4-5 arrow inputs to clear in a flash, whereas rookie crews require 9-10.')
ht = ht.replace('ยิ่งกดเร็ว ยิ่งออก Pit เร็ว:', 'Faster Inputs = Shorter Stop:')
ht = ht.replace('การกดถูกต้องแต่ละครั้งจะเร่งเวลาจอดเปลี่ยนยางให้เสร็จสิ้นเร็วขึ้นอย่างเห็นได้ชัด', 'Each accurate key input cuts stationary tire change time significantly.')
ht = ht.replace('ลดโอกาสเกิดความผิดพลาดน็อตล้อสะดุด (Cross-thread) ที่ทำให้เสียเวลาหลายวินาที', 'Reduces risk of cross-threaded wheel nuts and jack release stalls that lose precious track time.')
ht = ht.replace('ระบบเตือนเข้า Pit 500m:', '500m Pit Entry Alert:')
ht = ht.replace('ป้ายสัญญาณเตือนลูกศรและตัวเลขระยะทางจะแจ้งเตือนล่วงหน้า 500 เมตรเพื่อให้คุณเตรียมชิดขวาเข้าสู่พิทเลน', 'Turn signal boards and telemetry distance markers alert you 500m in advance to prepare to take the pit lane entrance.')

ht = ht.replace('⚡ Shift to Nitro & การแข่งขันกับคู่แข่ง:', '⚡ Shift to Nitro & Head-to-Head Racing:')
ht = ht.replace('• <strong>กดปุ่ม Shift หรือ Spacebar:</strong> เพื่อเปิดระบบ Turbo Nitro Boost เพิ่มความเร็วสูงสุดแตะ 350 กม./ชม. พร้อมเปลวไฟท้ายรถสุดเร้าใจ', '• <strong>Press Shift or Spacebar:</strong> Deploy Turbo Nitro Boost to rocket up to 350 km/h with blazing exhaust flames.')
ht = ht.replace('• <strong>ระบบ Cooldown Reload เต็ม 100%:</strong> หากใช้ Nitro จนหมดเกลี้ยง (0%) ระบบจะล็อกทันทีและต้องรอการรีโหลดคูลดาวน์ให้กลับมาเต็ม 100% ถึงจะใช้งานได้อีกครั้ง', '• <strong>100% Cooldown Reload:</strong> If Nitro is fully depleted to 0%, it locks until the recharge meter fills back to 100%.')
ht = ht.replace('• <strong>การต่อสู้กับคู่แข่งสุดสูสี (±100m Duel):</strong> คู่แข่งวิ่งด้วยความเร็วสูสีกับผู้เล่น (ประมาณ 300 กม./ชม.) และสามารถใช้ Nitro พุ่งแตะ 350 กม./ชม. ได้เช่นกัน เมื่อคู่แข่งอยู่ห่างเกิน 100 เมตร ระบบจะเร่งความเร็วให้เกาะกลุ่ม แต่เมื่อเข้าใกล้ ±100 เมตร ความเร็วจะกลับสู่สภาวะปกติ ให้การชิงชัยตัดสินที่ฝีมือการขับขี่และการวางแผนของคุณอย่างแท้จริง!', '• <strong>Competitive ±100m Racing:</strong> Competitors match your benchmark pace (~300 km/h) and can unleash nitro up to 350 km/h. When rivals are trailing by over 100m, catch-up boost keeps the pack tight, but inside ±100m speeds equalize so true driver racecraft and strategy decide the victory!')

with open('src/components/HelpTutorial.tsx', 'w', encoding='utf-8') as f:
    f.write(ht)

# 4. rivalPersonalities.ts
with open('src/data/rivalPersonalities.ts', 'r', encoding='utf-8') as f:
    rp = f.read()

rp_translations = [
    ("titleTh: 'จอมล่าเอเพ็กซ์ไร้ปรานี',", "titleTh: 'Relentless Apex Hunter',"),
    ("tagline: 'เบรกช้าสุดขีด เสียบตัดเอเพ็กซ์คมกริบ ไม่มียกคันเร่งในจังหวะดวล',", "tagline: 'Extreme late braking, razor apex cuts, and zero lift-off in wheel-to-wheel combat.',"),
    ("skillNameTh: 'พุ่งเสียบในโค้งสายฟ้า',", "skillNameTh: 'Lightning Apex Dive',"),
    ("skillDescription: 'เบรกช้ากว่าปกติ พุ่งตัดไลน์เอเพ็กซ์วงในด้วยความเร็วสูง และเร่งเครื่องออกจากโค้งทันที',", "skillDescription: 'Brakes deeper than normal, slicing through the inside apex with high momentum and explosive exit drive.',"),

    ("titleTh: 'เซียนโค้งกล้าเสี่ยง',", "titleTh: 'High-Speed Aero Master',"),
    ("tagline: 'เร่งความเร็วทะลุโค้ง รีดสมรรถนะแอร์โรว์ไดนามิกส์ถึงขีดสุด',", "tagline: 'Full throttle through high-speed sweepers, maximizing downforce to the absolute edge.',"),
    ("skillNameTh: 'สาดโค้งความเร็วสูง',", "skillNameTh: 'High-Speed Sweeper Glide',"),
    ("skillDescription: 'รักษาความเร็วในโค้งสูงกว่ารถคันอื่นถึง +12 km/h ด้วยไลน์กว้างจรดเคิร์บ',", "skillDescription: 'Carries +12 km/h higher cornering speed by clipping edge-to-edge kerb racing lines.',"),

    ("titleTh: 'นักล่าสลิปสตรีมแซงสายฟ้า',", "titleTh: 'Slipstream Hunter',"),
    ("tagline: 'เกาะติดท้ายรถคู่แข่ง รอจังหวะสลิปสตรีมระเบิดความเร็วดีดแซงฉับพลัน',", "tagline: 'Stalks the rear wing of rivals, harnessing turbulent slipstream before slingshotting ahead.',"),
    ("skillNameTh: 'สลิปสตรีมดีดพุ่งแซง',", "skillNameTh: 'Slingshot Slipstream Burst',"),
    ("skillDescription: 'รับแรงดูดสลิปสตรีมแรงกว่าปกติ +22 km/h เมื่อตามหลังในระยะ 70 เมตร',", "skillDescription: 'Gains +22 km/h slipstream tow when drafting within 70 meters of car ahead.',"),

    ("titleTh: 'สุขุมระดับตำนาน',", "titleTh: 'Legendary Precision',"),
    ("tagline: 'อ่านไลน์เฉียบขาด หลบสิ่งกีดขวางไร้ที่ติ และสวนกลับด้วย Hammer Time',", "tagline: 'Flawless line management, instinctive hazard evasion, and ruthless Hammer Time counter-attacks.',"),
    ("skillNameTh: 'เค้นฟอร์มแชมป์โลกสวนกลับ',", "skillNameTh: 'Hammer Time Counter-Attack',"),
    ("skillDescription: 'เมื่อโดนแซง จะระเบิดพลัง Hammer Time เร่งความเร็ว +14 km/h เพื่อไล่บี้เอาตำแหน่งคืนทันที',", "skillDescription: 'When overtaken, triggers Hammer Time unleashing +14 km/h surge to immediately reclaim position.',"),

    ("titleTh: 'กำแพงเหล็กจอมบล็อก',", "titleTh: 'Iron Fortress',"),
    ("tagline: 'เขี้ยวลากดิน โยกบังไลน์สกัดการแซง เบียดปะทะไม่สะทกสะท้าน',", "tagline: 'Tenacious racecraft, proactive defensive weaving, and rock-solid defense under braking.',"),
    ("skillNameTh: 'โยกบล็อกปิดไลน์สกัดแซง',", "skillNameTh: 'Defensive Line Block',"),
    ("skillDescription: 'สแกนรถข้างหลังแล้วโยกปิดไลน์ทันที ลดแรงสะเทือนจากการชน 40% และไม่เสียจังหวะ',", "skillDescription: 'Detects approaching pursuers and covers the inside line, reducing collision drag by 40%.'),

    ("titleTh: 'สายไฟท์เตอร์กัดไม่ปล่อย',", "titleTh: 'Tenacious Brawler',"),
    ("tagline: 'สู้ไม่ถอยในจังหวะตีคู่ เบียดชนไม่มียอมยกคันเร่ง',", "tagline: 'Never yields in side-by-side duels, locking wheels without ever lifting off throttle.',"),
    ("skillNameTh: 'ดวลเบียดตีคู่ไม่ยก',", "skillNameTh: 'No-Lift Side-by-Side Brawl',"),
    ("skillDescription: 'เมื่อขับตีคู่จะไม่ยอมถอยคันเร่ง และพร้อมเบียดสู้ไลน์ในทุกจังหวะ',", "skillDescription: 'Maintains flat-out acceleration during side-by-side duels, fiercely claiming track position.',"),

    ("titleTh: 'สุขุมฉลาดฉวยโอกาสทอง',", "titleTh: 'Cunning Opportunist',"),
    ("tagline: 'คำนวณจังหวะแข่งชาญฉลาด สลับไลน์หนีกลุ่มรถช้า หาช่องแซงที่โล่งสะอาด',", "tagline: 'Calculates every move with racecraft finesse, dodging traffic jams and seizing clear air.',"),
    ("skillNameTh: 'สลับไลน์แซงวงในไร้เสียง',", "skillNameTh: 'Stealth Traffic Slice',"),
    ("skillDescription: 'อ่านการจราจรด้านหน้าและเปลี่ยนเลนแซงอัตโนมัติ ไม่ติดพันกับรถที่ขวางทาง',", "skillDescription: 'Reads traffic bottlenecks ahead and switches lanes smoothly to avoid deceleration.',"),

    ("titleTh: 'เยือกเย็นดั่งน้ำแข็ง',", "titleTh: 'Ice-Cold Iceman',"),
    ("tagline: 'ไร้ความกดดัน นิ่งสงบ ฟื้นตัวจากการชนและสะบัดเร็วกว่าใคร',", "tagline: 'Zero panic under pressure, instant collision recovery, and razor-sharp composure.',"),
    ("skillNameTh: 'ฟื้นสติคืนการควบคุมฉับไว',", "skillNameTh: 'Instant Kinetic Recovery',"),
    ("skillDescription: 'ระยะเวลาสตันและสปีดดรอปจากการชนลดลง 50% คืนความเร็วสู่เรซเพซทันที',", "skillDescription: 'Cuts collision stun duration and speed penalty by 50%, returning to race pace instantly.',"),

    ("titleTh: 'สายลุยกล้าแลก',", "titleTh: 'Aggressive Booster Raider',"),
    ("tagline: 'พุ่งชาร์จทุกช่องว่าง ตาไว ล่าบูสเตอร์แพดเพื่อสปีดทะยาน',", "tagline: 'Eyes locked on speed pads, charging hard into gaps and chaining booster surges.',"),
    ("skillNameTh: 'พุ่งชาร์จบูสเตอร์ทะลวง',", "skillNameTh: 'Speed Pad Target Lock',"),
    ("skillDescription: 'สแกนหาบูสเตอร์แพดล่วงหน้าและพุ่งเข้าเหยียบด้วยความแม่นยำสูง',", "skillDescription: 'Anticipates upcoming booster pads and homes into them with pinpoint accuracy.',"),

    ("titleTh: 'จรวดทางตรงสู้สุดใจ',", "titleTh: 'Straight-Line Speed Demon',"),
    ("tagline: 'แอร์โรว์แรงต้านต่ำพิเศษ ทางตรงเร็วทะลุปรอท',", "tagline: 'Ultra-low aerodynamic drag setup, creating blistering top speed on long straights.',"),
    ("skillNameTh: 'ยิงทางตรงความเร็วสูงสุด',", "skillNameTh: 'Terminal Velocity Rocket',"),
    ("skillDescription: 'ความเร็วสูงสุดในทางตรงเพิ่มขึ้นพิเศษ +12 km/h และกอดไลน์ในเหนียวแน่นเมื่อนำหน้า',", "skillDescription: 'Terminal straight-line velocity boosted by +12 km/h while fiercely hugging the inside line.',"),

    ("titleTh: 'จอมเก๋ามากประสบการณ์',", "titleTh: 'Seasoned Veteran Guardian',"),
    ("tagline: 'การรักษาตำแหน่งแน่นอนสม่ำเสมอ ไลน์การขับมั่นคงยากจะเจาะเข้า',", "tagline: 'Consistent lap delivery, rock-steady lines, and unbreakable defense.',"),
    ("skillNameTh: 'คุมไลน์สกัดเก๋าเกม',", "skillNameTh: 'Master Defensive Line',"),
    ("skillDescription: 'รักษาไลน์การขับอย่างสมดุล ไม่หลุดออกนอกแทร็ก และรับมือการแซงได้เนียนตา',", "skillDescription: 'Holds an impenetrable racing groove with zero unforced errors or track excursion.'),

    ("titleTh: 'บ้าบิ่นไร้ความกลัว',", "titleTh: 'Fearless Daredevil',"),
    ("tagline: 'กล้าแลกทุกจังหวะ ไม่สนความเสี่ยง สับไลน์ดุเดือด',", "tagline: 'Aggressive risk-taker, daring late moves, and relentless overtaking energy.',"),
    ("skillNameTh: 'สับไลน์ดุเดือดทะลวงกลุ่ม',", "skillNameTh: 'Reckless Pack Breaker',"),
    ("skillDescription: 'กล้าตัดไลน์เบียดแซงอย่างดุดัน แม้ในพื้นที่แคบเสี่ยงชน',", "skillDescription: 'Boldly dives into tight corridors and threads through rival packs without fear.')
]

for old, new in rp_translations:
    rp = rp.replace(old, new)

with open('src/data/rivalPersonalities.ts', 'w', encoding='utf-8') as f:
    f.write(rp)

print('HelpTutorial, CarUpgrade, raceEffects, and rivalPersonalities translated!')
