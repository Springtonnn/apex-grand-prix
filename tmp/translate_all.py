import re

def clean_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. SeasonRecords.tsx
clean_file('src/components/SeasonRecords.tsx', [
    ('คะแนนสะสมชิงแชมป์โลก, ประวัติผลการแข่งขันแต่ละสนาม และสถิติตลอดกาลของทีม', 'World championship standings, race results history, and all-time team records'),
    ('<span>STANDINGS (ตารางคะแนน)</span>', '<span>STANDINGS</span>'),
    ('<span>RACE LOGS (ประวัติการแข่ง)</span>', '<span>RACE LOGS</span>'),
    ('<span>SEASONS ARCHIVE (ฤดูกาล)</span>', '<span>SEASONS ARCHIVE</span>'),
    ('ผลการแข่งขันอย่างเป็นทางการของ {teamState.teamName} ในฤดูกาลที่ {selectedSeason.seasonNumber}', 'Official race classification for {teamState.teamName} in Season {selectedSeason.seasonNumber}'),
    ('<p className="text-sm font-bold text-slate-300">ยังไม่มีประวัติการแข่งในฤดูกาลนี้</p>', '<p className="text-sm font-bold text-slate-300">No race records in this season yet</p>'),
    ('เข้าสู่หน้า <strong className="text-red-400">CHAMPIONSHIP</strong> เพื่อเริ่มแข่งขันสนามแรก', 'Go to the <strong className="text-red-400">CHAMPIONSHIP</strong> tab to start your first Grand Prix'),
    ('<th className="py-3 px-4">RACE WINNER (ผู้ชนะสนาม)</th>', '<th className="py-3 px-4">RACE WINNER</th>'),
    ('ALL SEASONS ARCHIVE • ประวัติศาสตร์ทุกฤดูกาล', 'ALL SEASONS ARCHIVE • Complete History'),
    ('ประวัติผลงานสะสมของทีม {teamState.teamName} ในแต่ละฤดูกาล', 'Historical team records and championship achievements for {teamState.teamName}')
])

# 2. PitCrewIllustration.tsx
clean_file('src/components/PitCrewIllustration.tsx', [
    ("title: 'ลูกศรมินิเกมน้อยลง'", "title: 'Fewer QTE Arrows'"),
    ("description: 'จำนวนลูกศรตรงมินิเกมเข้าพิทจะน้อยลง (จาก 10 เหลือเพียง 4-5 ลูกศร)'", "description: 'Reduces pit stop minigame QTE sequence arrows from 10 down to 4-5 arrows'"),
    ("impact: 'กดผ่านได้ไวมาก'", "impact: 'Lightning Fast Input'"),
    ("title: 'กดผ่านพิทได้ไวขึ้น'", "title: 'Rapid Pit Clearance'"),
    ("description: 'ลูกศรน้อยลง ทำให้กดคีย์ลัดผ่านได้อย่างรวดเร็วในเสี้ยววินาที'", "description: 'Fewer arrow inputs let you clear the pit stop in a fraction of a second'"),
    ("impact: 'ไม่เสียจังหวะในสนาม'", "impact: 'Zero Track Hesitation'"),
    ("title: 'เปลี่ยนยางเร็วขึ้น'", "title: 'Sub-2s Tire Swap'"),
    ("description: 'จอดเปลี่ยนยางสั้นลงเหลือเพียง ~1.9 - 2.4 วินาที'", "description: 'Stationary wheel change reduced to an elite ~1.9 - 2.4 seconds'"),
    ("impact: 'ประหยัดเวลาในพิทเลน'", "impact: 'Huge Pit Lane Savings'"),
    ("title: 'ออกตัวแซงในพิทไว'", "title: 'Rapid Safe Release'"),
    ("description: 'ปลดแจ็คและปล่อยรถ Safe Release ทันที ชิงอันดับ (Undercut) ได้เปรียบ'", "description: 'Instant jack release and green-light launch to secure the pit undercut'"),
    ("impact: 'กลับสู่การแข่งได้รวดเร็ว'", "impact: 'Immediate Track Re-entry'")
])

# 3. StrategistIllustration.tsx
clean_file('src/components/StrategistIllustration.tsx', [
    ("title: 'แซงในพิท (Undercut)'", "title: 'Pit Undercut Mastery'"),
    ("description: 'คำนวณรอบสลับยางใหม่ แซงคู่แข่งโดยไม่ต้องเสี่ยงชน'", "description: 'Optimizes fresh tire pit window to leapfrog rivals without crash risk'"),
    ("impact: 'โอกาสแซงในพิทสูงขึ้น'", "impact: 'High Undercut Success'"),
    ("title: 'พิทฟรีตอน Safety Car'", "title: 'Safety Car Free Pit'"),
    ("description: 'สั่งเข้าพิททันทีที่ธงเหลืองขึ้น เสียเวลาน้อยกว่าปกติ'", "description: 'Pits immediately under full-course cautions with minimal track time lost'"),
    ("impact: 'กระโดดแซงหลายอันดับ'", "impact: 'Gain Multiple Positions'"),
    ("title: 'เรดาร์ฝนตกแม่นยำ'", "title: 'Doppler Rain Radar'"),
    ("description: 'เตือนฝนตกล่วงหน้า สั่งใส่ยางฝนได้ถูกจังหวะ'", "description: 'Early weather alerts and precise timing to switch to intermediate/wet tires'"),
    ("impact: 'ไม่เสียเวลาบนแทร็กเปียก'", "impact: 'No Wet Track Time Loss'"),
    ("title: 'ตัดสินใจไม่ผิดพลาด'", "title: 'Flawless Race Strategy'"),
    ("description: 'เลือกยางและวางแผนรอบเข้าพิทอย่างแม่นยำ'", "description: 'Selects optimal tire compounds and pit stop laps with championship precision'"),
    ("impact: 'แผนการแข่งรัดกุม'", "impact: 'Bulletproof Race Plan'")
])

# 4. Championship.tsx
clean_file('src/components/Championship.tsx', [
    ('// Notify parent of active racing status so background is locked during races ("ระหว่างแข่งห้ามเปลี่ยน")', '// Notify parent of active racing status so background is locked during races'),
    ('// Track 12th place (P12) finishes ("หรือได้อันดับที่ 12 3 ครั้ง")', '// Track 12th place (P12) finishes'),
    ('// Handle Interactive OutRun 3D Race Completion ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่")', '// Handle Interactive OutRun 3D Race Completion'),
    ('// If player suffered a DNF or defeat ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่"):', '// If player suffered a DNF or defeat:'),
    ('// Track car wreck count ("ทำรถพังเกิน 20 ครั้ง")', '// Track car wreck count'),
    ('// Use Claim modal\'s standings as canonical source ("ให้ใช้ของ claim เป็นหลัก")', '// Use Claim modal\'s standings as canonical source'),
    ('reason: `รถพังไฟไหม้และหยุดทำงาน (ENGINE FIRE DNF) • สถิติรถพังสะสม ${nextCrashes}/20 ครั้ง • คุณต้องแข่งสนามนี้ใหม่เพื่อผ่านไปยังรอบถัดไป`,', 'reason: `Engine fire wreck (ENGINE FIRE DNF) • Crash count: ${nextCrashes}/20 • You must restart and complete this Grand Prix to advance!`,'),
    ('<span>CHAMPIONSHIP CEREMONY (ถ้วยรางวัล) 🏆</span>', '<span>CHAMPIONSHIP CEREMONY 🏆</span>'),
    ('{/* DNF Defeat Notice Banner ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่") */}', '{/* DNF Defeat Notice Banner */}'),
    ('<span>การแข่งขันล้มเหลว (DNF) • ต้องแข่งสนามนี้ใหม่</span>', '<span>RACE RETIREMENT (DNF) • RESTART REQUIRED</span>'),
    ('<span>แข่งสนามนี้ใหม่ (RETRY) →</span>', '<span>RETRY GRAND PRIX →</span>'),
    ('ควบคุมพวงมาลัยด้วยตัวคุณเอง สู้กับแรงเหวี่ยงหนีศูนย์กลางในโค้ง เปิดระบบ DRS Boost บนทางตรง และสู้เพื่อตำแหน่ง P1 บนสนามแข่ง! จำนวนรอบแข่งจะเพิ่มขึ้นอัตโนมัติเมื่อเข้าสู่ช่วงท้ายของฤดูกาล (จำกัดสูงสุด 5 รอบ)', 'Take manual control behind the wheel, battle centrifugal G-forces in the turns, deploy DRS boost on the straights, and fight for P1 on track! Total race laps scale dynamically up to 5 laps in championship finale stages.'),
    ('<span>PODIUM PRIZES (รางวัลที่ 1 - 3)</span>', '<span>PODIUM PRIZES (P1 - P3)</span>'),
    ('เงินรางวัลเข้าบัญชีสโมสรเรียบร้อยหลังหักค่าเหนื่อยนักแข่งและทีมงาน', 'Prize purse deposited into team account after deducting driver and crew salaries.')
])

# 5. HomelessBankruptCutscene.tsx
clean_file('src/components/HomelessBankruptCutscene.tsx', [
    ('<span>FALL FROM GRACE • จากจุดสูงสุดสู่คนไร้บ้าน</span>', '<span>FALL FROM GRACE • FROM PADDOCK TO STREETS</span>'),
    ('&quot;จากผู้จัดการทีม F1 ที่เคยยืนสั่งการอยู่ในพิทเลนระดับโลก... วันนี้ทุกอย่างสูญสิ้น', '&quot;From a world-class F1 team principal barking orders in the pit lane... to losing everything.'),
    ('เหลือเพียงม้านั่งไม้ตัวเก่าในสวนสาธารณะ กับกระเป๋าผ้าใส่ของใช้ส่วนตัวใบสุดท้าย&quot;', 'Now left with only an old wooden park bench and a duffel bag of personal belongings.&quot;'),
    ('CAREER TERMINATED • โดนปลดถาวร', 'CAREER TERMINATED • CONTRACT REVOKED'),
    ('<span>สาเหตุ: ทำรถแข่งพังเกินโควตา 20 ครั้ง</span>', '<span>CAUSE: WRECKED CAR OVER 20 TIMES</span>'),
    ('<span>สาเหตุ: จบอันดับ 12 (บ๊วย) ครบ 3 ครั้ง</span>', '<span>CAUSE: FINISHED P12 (DEAD LAST) 3 TIMES</span>'),
    ('? `คุณทำรถแข่งชนพังยับเยินสะสมไปถึง ${crashesCount} ครั้ง ค่าซ่อมบานปลายจนทีมล้มละลาย โดน FIA และเจ้าหนี้ยึดโรงงานและรถแข่งทั้งหมด กลายเป็นคนไร้บ้านสิ้นเนื้อประดาตัว!`', '? `You crashed the race cars ${crashesCount} times! Astronomical repair bills bankrupted the team, causing the FIA and creditors to seize the factory and all assets, leaving you destitute on the streets!`'),
    (': `คุณพาทีมเข้าเส้นชัยอันดับที่ 12 (บ๊วยสุดของกริด) ครบ ${p12Count} ครั้ง สปอนเซอร์ทุกรายฉีกสัญญาทิ้งทันที บอร์ดบริหารขับไล่ออกและฟ้องล้มละลายจนหมดตัว!`', ': `You finished in 12th place (dead last) ${p12Count} times! All sponsors immediately ripped up their contracts, and the board ousted you into bankruptcy!`'),
    ('<span className="text-slate-400">อดีตทีมที่ล้มละลาย:</span>', '<span className="text-slate-400">Bankrupted Team:</span>'),
    ('<span className="text-slate-400">สถิติรถพังสะสม:</span>', '<span className="text-slate-400">Total Crashes:</span>'),
    ("{crashesCount} / 20 ครั้ง {crashesCount >= 20 ? '🔥 (เกินโควตา)' : ''}", "{crashesCount} / 20 crashes {crashesCount >= 20 ? '🔥 (LIMIT EXCEEDED)' : ''}"),
    ('<span className="text-slate-400">อันดับที่ 12 (บ๊วย):</span>', '<span className="text-slate-400">P12 Finishes (Dead Last):</span>'),
    ("{p12Count} / 3 ครั้ง {p12Count >= 3 ? '📉 (โดนฉีกสัญญา)' : ''}", "{p12Count} / 3 finishes {p12Count >= 3 ? '📉 (CONTRACT TERMINATED)' : ''}"),
    ('<span className="text-slate-400">เงินในบัญชีคงเหลือ:</span>', '<span className="text-slate-400">Remaining Balance:</span>'),
    ('<strong className="text-red-400 font-bold">0 ฿ (หนี้สินท่วมตัว)</strong>', '<strong className="text-red-400 font-bold">$0 (Insurmountable Debt)</strong>'),
    ('<span className="text-slate-400">ที่พักอาศัยปัจจุบัน:</span>', '<span className="text-slate-400">Current Residence:</span>'),
    ('<span className="text-amber-300 font-thai text-[11px]">ม้านั่งในสวนสาธารณะ</span>', '<span className="text-amber-300 font-mono text-[11px]">Park Bench</span>'),
    ('<span>เริ่มเกมใหม่ทั้งหมด (START NEW GAME) →</span>', '<span>START NEW CAREER →</span>'),
    ('[Dev/Test: ปิดหน้าต่างนี้ชั่วคราวเพื่อดูหน้าจออื่น]', '[Dev/Test: Temporarily dismiss dialog]')
])

# 6. CarUpgradeIllustrations.tsx
clean_file('src/components/CarUpgradeIllustrations.tsx', [
    ("thaiName: 'เครื่องยนต์ V6 เทอร์โบไฮบริด'", "thaiName: 'V6 Turbo Hybrid Power Unit'"),
    ("primaryBenefit: 'เพิ่มความเร็วสูงสุด & อัตราเร่งกระชาก'", "primaryBenefit: 'Top Speed & Punchy Acceleration'"),
    ("{ icon: '🚀', text: 'เพิ่มความเร็วสูงสุดบนทางตรงยาว', tag: '+Top Speed' }", "{ icon: '🚀', text: 'Maximizes straight-line top speed', tag: '+Top Speed' }"),
    ("{ icon: '⚡', text: 'เร่งออกจากโค้งได้ฉับไว ไม่อืด', tag: '0-200 เร็วขึ้น' }", "{ icon: '⚡', text: 'Explosive corner-exit acceleration', tag: 'Fast 0-200' }"),
    ("{ icon: '🎯', text: 'แซงใน DRS Zone ง่ายขึ้น', tag: 'แซงทางตรง' }", "{ icon: '🎯', text: 'Effortless overtakes in DRS zones', tag: 'Straightline Pass' }"),
    ("{ icon: '⏱️', text: 'เวลาต่อรอบเร็วขึ้นในสนามทางตรง', tag: 'ลดเวลา/รอบ' }", "{ icon: '⏱️', text: 'Dramatically faster lap times on power circuits', tag: '-Lap Time' }"),

    ("thaiName: 'อากาศพลศาสตร์ & ปีกหน้า-หลัง'", "thaiName: 'Aerodynamics & Wings'"),
    ("primaryBenefit: 'เกาะถนนในโค้ง & ขับจี้ท้ายคันหน้า'", "primaryBenefit: 'High-Speed Downforce & Slipstreaming'"),
    ("{ icon: '🌪️', text: 'เพิ่มแรงกดตัวถัง เข้าโค้งเร็วไม่หลุด', tag: 'Downforce' }", "{ icon: '🌪️', text: 'Massive aerodynamic grip in high-speed sweepers', tag: 'Downforce' }"),
    ("{ icon: '🛡️', text: 'วิ่งจี้ท้ายคันหน้าได้นิ่ง ไม่ส่าย', tag: 'ต้านลมป่วน' }", "{ icon: '🛡️', text: 'Stable wake behavior when tailgating', tag: 'Dirty Air Resist' }"),
    ("{ icon: '💨', text: 'เปิดปีก DRS แซงคู่แข่งได้เฉียบขาด', tag: 'DRS Boost' }", "{ icon: '💨', text: 'High DRS opening efficiency for decisive overtakes', tag: 'DRS Boost' }"),
    ("{ icon: '⏱️', text: 'ทำเวลาได้ดีมากในสนามโค้งเยอะ', tag: 'ลดเวลาในโค้ง' }", "{ icon: '⏱️', text: 'Dominates twisty, technical circuits', tag: 'Apex Pace' }"),

    ("thaiName: 'ระบบเบรกคาร์บอนเซรามิก'", "thaiName: 'Carbon-Ceramic Braking System'"),
    ("primaryBenefit: 'เบรกลึกแซงเข้าโค้ง & ล้อไม่ล็อก'", "primaryBenefit: 'Late Braking & Anti-Lock Stability'"),
    ("{ icon: '🛑', text: 'เบรกได้ลึกกว่าคู่แข่ง แซงจังหวะเข้าโค้ง', tag: 'เบรกลึก' }", "{ icon: '🛑', text: 'Brake meters deeper into hairpins to pass rivals', tag: 'Late Braking' }"),
    ("{ icon: '🔒', text: 'ลดโอกาสเบรกล้อล็อก ไถลหลุดโค้ง', tag: 'ล้อไม่ล็อก' }", "{ icon: '🔒', text: 'Prevents wheel lockups and wide corner slides', tag: 'Anti-Lock' }"),
    ("{ icon: '🔥', text: 'ระบายความร้อนดี เบรกไม่เฟด', tag: 'เบรกทนทาน' }", "{ icon: '🔥', text: 'Zero thermal brake fade under repeated heavy stops', tag: 'Heat Resist' }"),
    ("{ icon: '🛡️', text: 'เบรกป้องกันคันหลังแซงในโค้งหักศอก', tag: 'กันถูกแซง' }", "{ icon: '🛡️', text: 'Defends line into heavy braking zones', tag: 'Corner Defense' }"),

    ("thaiName: 'ระบบกันสะเทือน & ช่วงล่าง'", "thaiName: 'Active Suspension & Damping'"),
    ("primaryBenefit: 'ยางสึกช้าลง & ปีนเคิร์บไม่หมุน'", "primaryBenefit: 'Tire Preservation & Kerb Riding'"),
    ("{ icon: '🛞', text: 'ยางสึกช้าลง วิ่งได้นานขึ้นหลายรอบ', tag: 'ถนอมยาง' }", "{ icon: '🛞', text: 'Reduces tire degradation, extending stint life', tag: 'Tire Saver' }"),
    ("{ icon: '📐', text: 'ปีนขอบทางเคิร์บตัดโค้ง รถไม่สะบัด', tag: 'ปีนเคิร์บเนียน' }", "{ icon: '📐', text: 'Rides aggressively over kerbs with zero snap oversteer', tag: 'Smooth Kerbs' }"),
    ("{ icon: '🌧️', text: 'คุมรถง่ายขึ้นตอนฝนตกแทร็กลื่น', tag: 'เกาะแทร็กเปียก' }", "{ icon: '🌧️', text: 'Superior traction and stability on rain-soaked tracks', tag: 'Wet Traction' }"),
    ("{ icon: '🔄', text: 'พลิกตัวรถในโค้งสลับได้ฉับไว', tag: 'เลี้ยวคล่องตัว' }", "{ icon: '🔄', text: 'Lightning rapid weight transfer in chicanes', tag: 'Agile Transition' }"),

    ("thaiName: 'แชสซีตัวถังคาร์บอน & HALO'", "thaiName: 'Carbon Monocoque Chassis & Halo'"),
    ("primaryBenefit: 'บาลานซ์รถนิ่ง & ลดความเสี่ยงรถพัง'", "primaryBenefit: 'Chassis Balance & Structural Rigidity'"),
    ("{ icon: '⚖️', text: 'กระจายน้ำหนักสมดุล เข้าโค้งนิ่ง', tag: 'บาลานซ์สมบูรณ์' }", "{ icon: '⚖️', text: 'Optimum center-of-gravity and neutral handling', tag: 'Perfect Balance' }"),
    ("{ icon: '🔧', text: 'โครงสร้างทนทาน ลดความเสี่ยงรถพัง (DNF)', tag: 'ทนทาน' }", "{ icon: '🔧', text: 'High impact resilience, drastically reducing DNF risk', tag: 'Durability' }"),
    ("{ icon: '🛡️', text: 'โครงสร้างนิรภัย Halo ปลอดภัยสูง', tag: 'มั่นใจทุกโค้ง' }", "{ icon: '🛡️', text: 'Titanium Halo safety cage protects driver in all battles', tag: 'Titanium Halo' }"),
    ("{ icon: '🏎️', text: 'ยกระดับคะแนนสมรรถนะรวมของรถ', tag: '+Car OVR' }", "{ icon: '🏎️', text: 'Elevates overall car performance index across the board', tag: '+Car OVR' }")
])

# 7. raceEffects.ts
clean_file('src/utils/raceEffects.ts', [
    ("shortEffectTh: '+0.24 กม./ชม. ความเร็วสูงสุด',", "shortEffectTh: '+0.24 km/h Top Speed',"),
    ("perLevelTh: '+0.24 กม./ชม. • อัตราเร่ง +6.5',", "perLevelTh: '+0.24 km/h • Acceleration +6.5',"),
    ("detailTh: 'เพิ่มความเร็วปลายทางตรงและอัตราเร่งออกจากโค้ง',", "detailTh: 'Increases top speed on straights and corner exit acceleration.',"),

    ("shortEffectTh: '+0.12 กม./ชม. & โบนัส DRS +0.18',", "shortEffectTh: '+0.12 km/h & DRS Bonus +0.18',"),
    ("perLevelTh: '+0.12 กม./ชม. • โบนัส DRS/Nitro +0.18',", "perLevelTh: '+0.12 km/h • DRS/Nitro Bonus +0.18',"),
    ("detailTh: 'เพิ่มแรงกดและประสิทธิภาพเมื่อเปิดใช้ DRS/Nitro',", "detailTh: 'Improves downforce and aerodynamic efficiency when activating DRS/Nitro.',"),

    ("shortEffectTh: 'เบรกดีขึ้น +8.5 พลังเบรก',", "shortEffectTh: '+8.5 Braking Force',"),
    ("perLevelTh: '+8.5 พลังหยุด • ลดความเร็วที่เสียก่อนเข้าโค้ง',", "perLevelTh: '+8.5 Stopping Power • Later braking point into turns',"),
    ("detailTh: 'เบรกลึกแซงคู่แข่งในโค้งหักศอก และคุมจังหวะเบรกแม่นยำ',", "detailTh: 'Brake deeper into hairpins to overtake rivals and stabilize stopping points.',"),

    ("shortEffectTh: 'รูดเคิร์บไม่เสียความเร็ว & ลดลื่น',", "shortEffectTh: 'Kerb Stability & Reduced Slip',"),
    ("perLevelTh: 'ทรงตัวนิ่งขึ้น • ลดการลื่นไถลตอนฝนตก',", "perLevelTh: 'Stabilized chassis • Reduced slip during rain',"),
    ("detailTh: 'ลดความเร็วที่สูญเสียเมื่อขึ้นขอบทางหรือลงหญ้า และเพิ่มการเกาะถนนบนแทร็กเปียก',", "detailTh: 'Reduces speed lost when running over kerbs/verges and boosts wet grip.',"),

    ("shortEffectTh: 'การเลี้ยวฉับไวขึ้น +0.065',", "shortEffectTh: '+0.065 Agility',"),
    ("perLevelTh: '+0.065 ความคล่องตัว • โครงสร้างทนทาน',", "perLevelTh: '+0.065 Agility • Structural Durability',"),
    ("detailTh: 'โยกเปลี่ยนเลนหลบสิ่งกีดขวางได้คมกริบและควบคุมรถนิ่งในโค้ง',", "detailTh: 'Sharp lane switching to dodge obstacles and composed high-G cornering.',"),

    ("engine: 'เครื่องยนต์ (Engine)',", "engine: 'Engine PU',"),
    ("aero: 'แอร์โรไดนามิกส์ (Aero)',", "aero: 'Aerodynamics',"),
    ("brakes: 'ระบบเบรก (Brakes)',", "brakes: 'Brakes',"),
    ("suspension: 'ระบบช่วงล่าง (Suspension)',", "suspension: 'Suspension',"),
    ("chassis: 'แชสซี (Chassis)',", "chassis: 'Chassis',"),

    ("engine: '📉 ความเร็วปลายและอัตราเร่งไม่พอ เสียเวลาบนทางตรงยาวเมื่อเทียบกับคู่แข่ง แนะนำอัพเกรด Engine ก่อนแข่ง'", "engine: '📉 Top speed and acceleration lag behind rivals on long straights. Upgrade Engine PU.'"),
    ("aero: '📉 แรงกดอากาศพลศาสตร์ไม่พอ เสียความเร็วในโค้งไฮสปีด แนะนำอัพเกรด Aero เพื่อสร้างแรงกด'", "aero: '📉 Insufficient downforce in high-speed corners. Upgrade Aero to increase cornering grip.'"),
    ("brakes: '📉 ระบบเบรกขาดประสิทธิภาพ เสียเวลาในจุดเบรกหนักของสนามนี้มากที่สุด แนะนำอัพเกรด Brakes ก่อนแข่ง'", "brakes: '📉 Braking efficiency is low; losing significant time into heavy stops. Upgrade Brakes.'"),
    ("suspension: '📉 การซับแรงกระแทกต่ำ เสียความเร็วจากการรูดเคิร์บและการทรงตัว แนะนำอัพเกรด Suspension'", "suspension: '📉 Low kerb compliance and dampening; losing stability over kerbs. Upgrade Suspension.'"),
    ("chassis: '📉 ความคล่องตัวน้อย โยกเปลี่ยนไลน์แซงและเข้าโค้งยังหน่วง แนะนำอัพเกรด Chassis'", "chassis: '📉 Chassis responsiveness is sluggish when changing lines to overtake. Upgrade Chassis.'"),

    ("titleTh: 'แซงให้ได้ 3 คัน',", "titleTh: 'Complete 3 Overtakes',"),
    ("descTh: 'แซงคู่แข่งขึ้นหน้าอย่างน้อย 3 คันระหว่างการแข่งขัน',", "descTh: 'Overtake at least 3 rival cars during the race',"),

    ("titleTh: 'ไม่ชนเลย (Clean Race)',", "titleTh: 'Clean Race',"),
    ("descTh: 'แข่งจบโดยไม่ชนสิ่งกีดขวางหรือหลุดแทร็กแม้แต่ครั้งเดียว',", "descTh: 'Finish the race with zero collisions or off-track excursions',"),

    ("titleTh: 'เข้าพิทตามเป้าหมาย',", "titleTh: 'Sub-2.8s Pit Stop',"),
    ("descTh: 'เข้าพิทและทำเวลา Pit Stop ได้รวดเร็วไม่เกิน 2.8 วินาที',", "descTh: 'Execute a lightning pit stop under 2.8 seconds',"),

    ("titleTh: 'จบอันดับ 5 อันดับแรก',", "titleTh: 'Top 5 Finish',"),
    ("descTh: 'ขับเข้าเส้นชัยในอันดับ 1 ถึง 5 (P1 - P5)',", "descTh: 'Cross the finish line in P1 through P5',")
])

print('Batch 2 & 3 part 1 completed')
