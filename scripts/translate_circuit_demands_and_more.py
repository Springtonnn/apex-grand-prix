import re

# 1. rivalPersonalities.ts
with open('src/data/rivalPersonalities.ts', 'r', encoding='utf-8') as f:
    rp = f.read()

rp = rp.replace("skillDescription: 'เมื่อโดนแซง จะระเบิดพลัง Hammer Time เร่งความเร็ว +14 km/h เพื่อไล่บี้เอาตำแหน่งคืน',", "skillDescription: 'When overtaken, triggers Hammer Time unleashing +14 km/h surge to immediately reclaim position.',")
rp = rp.replace("titleTh: 'ผู้ท้าชิงสายสู้',", "titleTh: 'Feisty Challenger',")
rp = rp.replace("tagline: 'นักแข่งคู่ปรับที่พร้อมสู้เพื่อชัยชนะ',", "tagline: 'Fierce competitor ready to battle for every point and podium.',")
rp = rp.replace("skillNameTh: 'เร่งสปีดชิงจังหวะ',", "skillNameTh: 'Aggressive Pace Lock',")
rp = rp.replace("skillDescription: 'เร่งความเร็วเกาะติดการแข่งขัน',", "skillDescription: 'Hangs on to the racing pack with relentless pace.',")

with open('src/data/rivalPersonalities.ts', 'w', encoding='utf-8') as f:
    f.write(rp)

# 2. HelpTutorial.tsx
with open('src/components/HelpTutorial.tsx', 'r', encoding='utf-8') as f:
    ht = f.read()

ht = ht.replace('<strong>Quick Time Event (QTE) Arrows & Pit Crew Skill:</strong> ระหว่างการเข้า Pit Stop จะมีลูกศร WASD / ปุ่มทิศทาง ให้กดตามลำดับ', '<strong>Quick Time Event (QTE) Arrows & Pit Crew Skill:</strong> During pit stops, follow the WASD / Arrow sequence accurately:')
ht = ht.replace('<li><strong className="text-emerald-400">Elite Crew = Fewer Arrows:</strong> ลูกเรือระดับแชมป์ (95+ OVR) มีเพียง 4 ลูกศร ขณะที่ลูกเรือฝึกหัด (&lt;55 OVR) ต้องกดถึง 10 ลูกศร!</li>', '<li><strong className="text-emerald-400">Elite Crew = Fewer Arrows:</strong> Championship-grade crews (95+ OVR) require only 4 arrows, while rookie crews (&lt;55 OVR) require up to 10 arrows!</li>')
ht = ht.replace('<li><strong className="text-amber-400">Faster Inputs = Shorter Stop:</strong> การกดถูกต้องแต่ละครั้งจะลดเวลา Pit Stop ลงทันที (-0.35s) พร้อม Rocket Launch พุ่งออกจาก Pit ด้วยความเร็วสูง</li>', '<li><strong className="text-amber-400">Faster Inputs = Shorter Stop:</strong> Each correct input instantly shaves off pit stop time (-0.35s) followed by a rocket safe release launch.</li>')
ht = ht.replace('<li><strong className="text-cyan-400">Speed & Precision:</strong> ลดโอกาสเกิดความผิดพลาดน็อตล้อสะดุด และทำเวลาเปลี่ยนยางเร็วในระดับ 1.8 - 2.2 วินาที</li>', '<li><strong className="text-cyan-400">Speed & Precision:</strong> Minimizes cross-thread nut jams and clocks lightning 1.8 - 2.2 second stationary stops.</li>')
ht = ht.replace('<li><strong className="text-rose-400">500m Pit Entry Alert:</strong> ป้ายสัญญาณเตือนลูกศรและตัวเลขระยะทางจะแจ้งเตือนเมื่ออยู่ห่างจากทางเข้า Pit 500 เมตร (หากลืมเข้าจนยางแตก สามารถเลี้ยวเข้า Pit ในรอบถัดไปเพื่อเปลี่ยนยางใหม่ และรถจะกลับมาสมบูรณ์ 100%)</li>', '<li><strong className="text-rose-400">500m Pit Entry Alert:</strong> Signage and telemetry distance alerts sound 500m before pit entrance. (If tires blow out, pit on the next lap for fresh rubber to restore 100% car condition).</li>')

ht = ht.replace('• <strong>กดปุ่ม Shift หรือ Spacebar:</strong> เพื่อเปิดระบบ Turbo Nitro Boost เพิ่มความเร็วสูงสุดแตะ 350 KM/H (ความเร็วปกติไม่ใช้ไนโตรประมาณ 300 KM/H) พุ่งทะยานแซงคู่แข่งด้วยเปลวไฟ Afterburner!', '• <strong>Press Shift or Spacebar:</strong> Deploy Turbo Nitro Boost to rocket up to 350 KM/H (standard cruise ~300 KM/H) with afterburner exhaust flames!')
ht = ht.replace('• <strong>ระบบ Cooldown Reload เต็ม 100%:</strong> หากใช้ Nitro จนหมดเกลี้ยง (0%) ระบบจะล็อกทันทีและไม่สามารถกดใช้ใหม่ได้จนกว่าหลอด Nitro จะรีโหลดกลับมาเต็ม 100% เท่านั้น จึงต้องบริหารการบูสต์อย่างชาญฉลาด!', '• <strong>100% Cooldown Reload:</strong> Depleting Nitro to 0% locks the boost until the meter fully recharges to 100%. Manage your nitro strategically!')
ht = ht.replace('• <strong>การต่อสู้กับคู่แข่งสุดสูสี (±100m Duel):</strong> คู่แข่งวิ่งด้วยความเร็วสูสีกับผู้เล่น (ปกติ ~300 KM/H, ใช้ไนโตร ~350 KM/H) และเมื่อคู่แข่งแซงขึ้นหน้าผู้เล่นในระยะ ±100 เมตร ความเร็วจะปรับสูสีเท่าผู้เล่น เปิดโอกาสให้ดูดลมสลิปสตรีม ดวลล้อต่อล้อ และหาจังหวะสวนกลับได้อย่างเร้าใจ!', '• <strong>Competitive ±100m Racing:</strong> Rivals race at benchmark pace (~300 KM/H, nitro ~350 KM/H). Within ±100m, pace balances to enable thrilling slipstream drafting, wheel-to-wheel duels, and tactical counter-attacks!')

with open('src/components/HelpTutorial.tsx', 'w', encoding='utf-8') as f:
    f.write(ht)

# 3. circuitDemands.ts
with open('src/data/circuitDemands.ts', 'r', encoding='utf-8') as f:
    cd = f.read()

# Replace km/h
cd = cd.replace('กม./ชม.', 'km/h')

circuit_translations = [
    # R1
    ("trackTypeDescription: 'พาร์คแลนด์กึ่งสตรีตเซอร์กิต ไหลลื่นสลับโค้งชิเคน',", "trackTypeDescription: 'Semi-street parkland circuit, flowing sweeps alternating with high-speed chicanes.',"),
    ("tacticalAdvice: 'สนามเปิดฤดูกาล แนะนำอัพเกรด Engine และ Chassis เพื่ออัตราเร่งออกจากชิเคนและการเข้าโค้งที่กระชับ',", "tacticalAdvice: 'Season opener: prioritize Engine and Chassis upgrades for punchy chicane exits and agile turn-in.',"),
    ("rivalBehaviorNotice: 'คู่แข่งยังขับอย่างระมัดระวัง เป็นโอกาสทองในการขึ้นโพเดียมเก็บแต้มแรกของปี',", "rivalBehaviorNotice: 'Rivals race conservatively in the opening rounds; prime opportunity to secure early podium points.',"),

    # R2
    ("trackTypeDescription: 'สนามทะเลทรายทางตรงยาว 4 ช่วง สลับจุดเบรกหนัก 100 เมตร',", "trackTypeDescription: 'Desert circuit with 4 long straights punctuated by severe 100-meter heavy braking zones.',"),
    ("tacticalAdvice: 'อัพเกรด Brakes และ Engine ด่วน! สนามนี้กินพลังเบรกมหาศาล หากเบรกไม่ดีจะเสียเวลาใน T1 และ T4',", "tacticalAdvice: 'Prioritize Brakes and Engine PU! Heavy thermal brake demands into Turn 1 and Turn 4.',"),
    ("rivalBehaviorNotice: 'ระวังลมทะเลทรายพัดทรายเข้าแทร็ก รถจะลื่นไถลได้ง่ายในโค้ง 9-10',", "rivalBehaviorNotice: 'Watch for desert sand blown onto track causing low grip through Turns 9 and 10.',"),

    # R3
    ("trackTypeDescription: 'สตรีตเซอร์กิตริมทะเลสาบและมารีน่า ทางตรงยาวสุดลูกหูลูกตา',", "trackTypeDescription: 'Lakeside street circuit featuring enormous flat-out blast straights.',"),
    ("tacticalAdvice: 'ต้องการ Top Speed สูงสุด อัพเกรด Engine และ Aero ให้แอร์โรว์ลู่ลมเพื่อแซงใน DRS Zone',", "tacticalAdvice: 'Demands maximum Top Speed; upgrade Engine and Aero to slice through air in DRS zones.',"),
    ("rivalBehaviorNotice: 'Min Werstappen และ Red Bullion แข็งแกร่งมากที่นี่ จะกดดันคุณตลอดการแข่งขัน',", "rivalBehaviorNotice: 'Min Werstappen and Red Bullion are blisteringly fast here and will mount intense pressure.',"),

    # R4
    ("trackTypeDescription: 'สนามระดับตำนาน โค้งขึ้นเนินลงเขาแคบสลับซับซ้อน',", "trackTypeDescription: 'Legendary rollercoaster layout with high elevation changes and technical blind crests.',"),
    ("tacticalAdvice: 'Chassis และ Suspension สำคัญที่สุด! รถต้องนิ่งเมื่อปีนเคิร์บ T1-T2 และไม่สะบัดในเขาวงกต T8',", "tacticalAdvice: 'Chassis and Suspension are crucial. The car must remain composed when riding kerbs into Turns 1-2.',"),
    ("rivalBehaviorNotice: 'Charles Leclerc ในรถเฟอร์รารี่มักทำเวลาควอลิฟายได้เร็วมากในสนามบ้านเกิด',", "rivalBehaviorNotice: 'Charles Leclerc historically sets blistering pace around his home circuit.',"),

    # R5
    ("trackTypeDescription: 'สตรีตเซอร์กิตริมแม่น้ำเจ้าพระยาผ่านสะพานพระราม 8 และวัดอรุณ',", "trackTypeDescription: 'Iconic street circuit along Chao Phraya River, blasting past Rama VIII Bridge and Wat Arun.',"),
    ("tacticalAdvice: 'ทางตรงยาวสลับชิเคนแคบกลางเมือง อัพเกรด Engine และ Brakes เพื่อเร่งเต็มสปีดและหยุดรถได้ทัน',", "tacticalAdvice: 'Long urban straights meet tight chicane sequences. Upgrade Engine and Brakes for peak deceleration.',"),
    ("rivalBehaviorNotice: 'กองเชียร์เจ้าถิ่นหนุนหลัง Min Werstappen คู่แข่งจะขับดุดันและบีบช่องว่างอย่างรวดเร็ว',", "rivalBehaviorNotice: 'Rival drivers push aggressive lines through the night-lit urban canyon.',"),

    # R6
    ("trackTypeDescription: 'ราชาแห่งสตรีตเซอร์กิต แคบที่สุด ไร้รันออฟแอเรีย ผิดพลาดเท่ากับชนกำแพง',", "trackTypeDescription: 'The crown jewel of street circuits. Zero runoff areas where any mistake means hitting the barrier.',"),
    ("tacticalAdvice: 'ความเร็วสูงสุดไม่มีประโยชน์ที่นี่! ทุ่มอัพเกรด Chassis และ Brakes เพื่อความคล่องตัวในโค้งหักศอก',", "tacticalAdvice: 'Top speed is useless here. Focus entirely on Chassis and Brakes for razor-sharp hairpin agility.',"),
    ("rivalBehaviorNotice: 'แซงยากที่สุดในโลก! โค้ชกลยุทธ์ระดับสูงจะช่วยให้อันเดอร์คัตแซงในพิทได้สำเร็จ',", "rivalBehaviorNotice: 'Hardest circuit to overtake on track. Elite pit strategy and undercuts are paramount.',"),

    # R7
    ("trackTypeDescription: 'สนามประวัติศาสตร์ริมแม่น้ำ ทางตรงเร็วสลับชิเคน Wall of Champions',", "trackTypeDescription: 'Historic island circuit with heavy stop-and-go straights into the Wall of Champions chicane.',"),
    ("tacticalAdvice: 'ทดสอบเบรกและช่วงล่างอย่างหนักหน่วง อัพเกรด Brakes เพื่อหยุดรถจาก 330 กม./ชม. สู่ชิเคนสุดท้าย',", "tacticalAdvice: 'Brutal on brakes and suspension. Upgrade Brakes to decelerate from 330 km/h into final chicane.',"),
    ("rivalBehaviorNotice: 'ระวังกิริยาดีดตัวเมื่อปีนเคิร์บชิเคนสุดท้าย อาจทำให้รถเสียหลักพุ่งชนกำแพงแชมเปียนได้',", "rivalBehaviorNotice: 'Violent kerb hops at final chicane can snap the rear into the Wall of Champions.',"),

    # R8
    ("trackTypeDescription: 'สนามเร็วและสั้นในหุบเขาแอลป์ โค้งขวาความเร็วสูงต่อเนื่อง',", "trackTypeDescription: 'Short, thrilling Alpine circuit with fast sweeping uphill right-handers.',"),
    ("tacticalAdvice: 'รอบสั้นมาก (เวลาต่อรอบ ~65 วินาที) อัพเกรด Engine เพื่อพุ่งขึ้นเนิน T1 และ T3',", "tacticalAdvice: 'Short lap time (~65s). Upgrade Engine PU for massive uphill acceleration into Turns 1 and 3.',"),
    ("rivalBehaviorNotice: 'การแข่งขันชิดติดกันเป็นขบวนรถไฟ DRS ตลอดทั้งเรซ แซงกันไปมาดุเดือด',", "rivalBehaviorNotice: 'Continuous DRS trains create non-stop slipstreaming overtakes all race long.',"),

    # R9
    ("trackTypeDescription: 'มหาวิหารแห่งความเร็วไฮสปีด โค้ง Maggotts-Becketts-Chapel ในตำนาน',", "trackTypeDescription: 'The temple of high-speed racing, featuring the legendary Maggotts-Becketts-Chapel complex.',"),
    ("tacticalAdvice: 'Aero และ Suspension คือหัวใจหลัก! ต้องมีแรงกดมหาศาลเพื่อผ่านโค้งความเร็วสูง 280 กม./ชม.',", "tacticalAdvice: 'Aero and Suspension are essential. High downforce is needed to carve through sweepers at 280 km/h.',"),
    ("rivalBehaviorNotice: 'Lewis Hamilton และ Lando Norris จะแข็งแกร่งเป็นพิเศษต่อหน้าแฟนคลับในบ้านเกิด',", "rivalBehaviorNotice: 'Lewis Hamilton and Lando Norris are exceptionally formidable in front of home fans.',"),

    # R10
    ("trackTypeDescription: 'เขาวงกตกลางแดดจัด โค้งแคบต่อเนื่องเหมือนสนามโกคาร์ตขนาดใหญ่',", "trackTypeDescription: 'Tight technical labyrinth under scorching summer heat, nicknamed Monaco without walls.',"),
    ("tacticalAdvice: 'ความเร็วสูงสุดต่ำ แต่อยากได้แอร์โรว์แรงกดสูงสุดและแชสซีคล่องตัวเพื่อเปลี่ยนทิศทางใน Sector 2',", "tacticalAdvice: 'Low top speed circuit. Maximum downforce Aero and agile Chassis are required for Sector 2.',"),
    ("rivalBehaviorNotice: 'อุณหภูมิแทร็กสูงมาก ยางจะสึกหรอเร็วเป็นสองเท่า วางแผนพิทสต็อปให้แม่นยำ',", "rivalBehaviorNotice: 'Blistering track temperatures double tire degradation; strategize pit stops precisely.',"),

    # R11
    ("trackTypeDescription: 'สนามที่ยาวที่สุดในป่าอาร์เดนเนส ทางตรง Kemmel สลับโค้ง Eau Rouge ขึ้นชื่อ',", "trackTypeDescription: 'Longest circuit on the calendar, carving through Ardennes forest and iconic Eau Rouge.',"),
    ("tacticalAdvice: 'ต้องการบาลานซ์ที่สมบูรณ์แบบระหว่าง Engine บนทางตรง Kemmel และ Aero ใน Sector 2',", "tacticalAdvice: 'Requires perfect setup compromise between top speed on Kemmel straight and downforce in Sector 2.',"),
    ("rivalBehaviorNotice: 'สภาพอากาศแปรปรวน ฝนอาจตกเฉพาะบางส่วนของสนาม เตรียมยาง Wet ให้พร้อม',", "rivalBehaviorNotice: 'Micro-climate weather swings; rain often falls on one sector while others stay bone dry.',"),

    # R12
    ("trackTypeDescription: 'สนามโค้งแบงก์เอียง 18 องศา เลียบชายฝั่งทะเลเหนือ',", "trackTypeDescription: 'Historic seaside dunes circuit with radical 18-degree banked parabolica corners.',"),
    ("tacticalAdvice: 'ช่วงล่างและแชสซีต้องรองรับแรงกดมหาศาลในโค้งแบงก์กิ้ง T3 และ T14',", "tacticalAdvice: 'Suspension and chassis must withstand massive vertical compressive loads in banked Turn 3 and Turn 14.',"),
    ("rivalBehaviorNotice: 'คลื่นแฟนคลับสีส้มหนุนหลัง Min Werstappen ขับขี่ได้อย่างไร้ที่ติในสนามนี้',", "rivalBehaviorNotice: 'An army of orange fans backs Min Werstappen as he pushes for dominant home glory.',"),

    # R13
    ("trackTypeDescription: 'วิหารแห่งความเร็ว ทางตรงยาว 4 ช่วง สปีดทะลุ 340+ กม./ชม.',", "trackTypeDescription: 'The Temple of Speed. Endless straights seeing cars rocket past 340+ km/h.',"),
    ("tacticalAdvice: 'ลดแรงต้านแอร์โรว์ให้ต่ำสุด ทุ่มอัพเกรด Engine และ Brakes เพื่อความเร็วปลายและหยุดรถในชิเคนแรก',", "tacticalAdvice: 'Trim drag to minimum; pour investments into Engine and Brakes for top speed and chicane stops.',"),
    ("rivalBehaviorNotice: 'กระแสดราฟต์สลิปสตรีมทรงพลังที่สุดในโลก รถคันหลังจะได้เปรียบความเร็วสูงมาก',", "rivalBehaviorNotice: 'Strongest slipstream draft on earth. Trailing cars gain enormous straight-line tow.',"),

    # R14
    ("trackTypeDescription: 'สนามระดับปรมาจารย์ โค้งรูปตัว S และโค้ง 130R สุดเร้าใจ',", "trackTypeDescription: 'Figure-eight racing masterpiece featuring legendary Esses and flat-out 130R curve.',"),
    ("tacticalAdvice: 'ทดสอบความสมบูรณ์แบบของรถทุกมิติ อัพเกรดทั้ง 5 ส่วนให้สมดุลเพื่อเข้าโค้งรูปเลข 8 ได้ไร้รอยต่อ',", "tacticalAdvice: 'Tests every dimension of car engineering. Balance all 5 departments for figure-eight flow.',"),
    ("rivalBehaviorNotice: 'นักแข่งทุกคนยกระดับสมาธิขั้นสูงสุด สนามนี้ผู้ขับขี่ที่ผิดพลาดน้อยที่สุดจะชนะ',", "rivalBehaviorNotice: 'Elite drivers lock in maximum concentration; minimal unforced errors decide the victor.',"),

    # R15
    ("trackTypeDescription: 'สนามร้อนระอุแข่งตอนกลางคืน สตรีตเซอร์กิต 23 โค้งที่เหนื่อยล้าที่สุด',", "trackTypeDescription: 'Night-lit tropical street battle. 23 punishing corners under humid, furnace conditions.',"),
    ("tacticalAdvice: 'Chassis และ Brakes ต้องพร้อมรับศึกหนัก! โค้งช้าเยอะมาก ต้องเร่งออกจากโค้งได้กระชับ',", "tacticalAdvice: 'Chassis and Brakes face severe punishment. Heavy traction demand out of slow 90-degree corners.',"),
    ("rivalBehaviorNotice: 'ความเหนื่อยล้าสูง คู่แข่งมักเกิดข้อผิดพลาดและเกิดเซฟตี้คาร์บ่อยครั้ง',", "rivalBehaviorNotice: 'Physical exhaustion is brutal; rivals frequently lock up into barriers, deploying Safety Cars.',"),

    # R16
    ("trackTypeDescription: 'สนามโรลเลอร์โคสเตอร์ โค้ง 1 วิ่งขึ้นเนินชัน สลับโค้งไฮสปีด Sector 1',", "trackTypeDescription: 'Rollercoaster circuit with steep uphill Turn 1 into high-speed technical sweepers.',"),
    ("tacticalAdvice: 'สนามนี้ต้องการความครบเครื่อง อัพเกรด Suspension เพื่อซับแรงกระแทกจากเนินและขอบทาง',", "tacticalAdvice: 'Demands all-round excellence. Upgrade Suspension to handle steep gradients and elevation bumps.',"),
    ("rivalBehaviorNotice: 'ช่วงท้ายฤดูกาล ทุกทีมนำชิ้นส่วนอัพเกรดขั้นสูงสุดมาใช้ การขับเคี่ยวจะสูสีที่สุด',", "rivalBehaviorNotice: 'Late-season title push. All teams bring peak development packages to the battle.',"),

    # R17
    ("trackTypeDescription: 'สตรีตสตริปสปีดสูงผ่านโรงแรมระดับโลก อุณหภูมิหนาวเย็นยามค่ำคืน',", "trackTypeDescription: 'High-speed street blast along the Strip past world-famous megaresorts in chilly night air.',"),
    ("tacticalAdvice: 'ทางตรง The Strip ยาวเกือบ 2 กิโลเมตร! อัพเกรด Engine ให้เต็มสูบเพื่อยิงความเร็วแตะ 350 กม./ชม.',", "tacticalAdvice: 'The Strip straight is nearly 2 km long! Max out Engine PU to touch 350 km/h in top gear.',"),
    ("rivalBehaviorNotice: 'ยางเย็นเร็วมากในอากาศหนาว ระวังเบรกล้อล็อกในโค้งแรกหลังทางตรงยาว',", "rivalBehaviorNotice: 'Cold evening asphalt chills tires quickly; watch for massive front lockups into Turn 1.',"),

    # R18
    ("trackTypeDescription: 'สนามปิดฤดูกาลยามพลบค่ำ ทางตรงยาว 2 ช่วง สลับโรงแรม W และท่าเรือยอร์ช',", "trackTypeDescription: 'Championship twilight finale. Twin back straights sweeping past luxury yachts and the marina.',"),
    ("tacticalAdvice: 'เรซตัดสินแชมป์โลก! อัพเกรดทุกส่วนให้เต็ม 99 OVR เพื่อต่อกรกับ Min Werstappen และคู่แข่งทุกคน',", "tacticalAdvice: 'Title decider! Maximize all departments toward 99 OVR to defeat Min Werstappen and grid rivals.',"),
    ("rivalBehaviorNotice: 'ไม่มีการยอมจำนน! คู่แข่งทุกคนจะใส่เต็มร้อย Min Werstappen จะสู้จนถึงรอบสุดท้ายเพื่อถ้วยแชมป์โลก',", "rivalBehaviorNotice: 'Zero compromises! Min Werstappen and title contenders fight flat out to the final lap for the World Crown.',")
]

for old, new in circuit_translations:
    cd = cd.replace(old, new)

with open('src/data/circuitDemands.ts', 'w', encoding='utf-8') as f:
    f.write(cd)

print('Translated circuitDemands.ts and HelpTutorial and rivalPersonalities')
