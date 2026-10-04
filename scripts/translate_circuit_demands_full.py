import re

translations = {
    # Bahrain
    "trackTypeDescription: 'ทะเลทราย ทางตรงยาวสลับโค้งหักศอกที่เบรกหนัก',": "trackTypeDescription: 'Desert circuit with long straights alternating into heavy hairpin braking zones.',",
    "tacticalAdvice: 'มีจุดเบรกหนัก 4 โซนจากความเร็ว 325+ km/h ระบบเบรกช่วยให้เบรกลึกแซงได้ดีขึ้น',": "tacticalAdvice: 'Contains 4 heavy braking zones from 325+ km/h. High-spec Brakes allow deeper overtaking maneuvers.',",
    "rivalBehaviorNotice: 'คู่แข่งเริ่มดันสปีดบนทางตรงยาว แนะนำอัพเกรดเบรกเพื่อแซงตอนเข้าโค้ง 1 และ 4',": "rivalBehaviorNotice: 'Rivals unleash high straight-line speeds. Upgrade Brakes to pass into Turns 1 and 4.',",

    # Spain / Catalunya
    "trackTypeDescription: 'สนามมาตรฐานทดสอบแรงกดอากาศพลศาสตร์และโค้งความเร็วสูง',": "trackTypeDescription: 'Benchmark aerodynamic proving ground with demanding high-speed sweeps.',",
    "tacticalAdvice: 'โค้งยาว Turn 3 และโค้งขวาความเร็วสูง ต้องการ Aero เพื่อสร้างแรงกดไม่ให้รถไถล',": "tacticalAdvice: 'Long sweeping Turn 3 and fast right-handers demand high Aero downforce to prevent slides.',",
    "rivalBehaviorNotice: 'ทีมท็อปเริ่มนำแพ็กเกจ Aero อัพเกรดมาใช้ จะเห็นความต่างในโค้งความเร็วสูงชัดเจน',": "rivalBehaviorNotice: 'Top teams bring major Aero packages here; expect high speeds through technical corners.',",

    # Monaco
    "trackTypeDescription: 'แทร็กแคบกั้นกำแพงคอนกรีต โค้งหักศอกและโค้งชิเคนท่าเรือ',": "trackTypeDescription: 'Narrow barrier-lined street track, tight hairpins, and marina chicane.',",
    "tacticalAdvice: 'ความเร็วปลายทางตรงไม่ใช่ปัจจัยหลัก แต่คือความคล่องตัวของ Chassis ในการมุดผ่านโค้งแคบ',": "tacticalAdvice: 'Top speed is secondary here; agile Chassis responsiveness is essential through narrow turns.',",
    "rivalBehaviorNotice: 'คู่แข่งจะขับปิดไลน์อย่างเหนียวแน่น ต้องอาศัยความคล่องตัวโยกหลบหรือชิงจังหวะในพิท',": "rivalBehaviorNotice: 'Rivals guard the inside line aggressively. Rely on agile handling and rapid pit stops.',",

    # Bangkok / Thailand
    "trackTypeDescription: 'สตรีทแทร็กความเร็วสูงริมแม่น้ำเจ้าพระยา เลียบพระบรมมหาราชวังและวัดอรุณ',": "trackTypeDescription: 'High-speed street circuit along Chao Phraya River, past the Grand Palace and Wat Arun.',",
    "tacticalAdvice: 'สตรีทเซอร์กิตริมน้ำกั้นกำแพงคอนกรีต ต้องการความคล่องตัวของ Chassis และเบรกที่มั่นใจ',": "tacticalAdvice: 'Riverside concrete canyon requires agile Chassis transition and trustworthy Braking power.',",
    "rivalBehaviorNotice: 'อเล็กซ์ อัลบูน (Alex Alboon) และทีมชั้นนำจะดุดันเป็นพิเศษในเรซเหย้าครั้งประวัติศาสตร์นี้',": "rivalBehaviorNotice: 'Alex Alboon and top factory teams race with ferocious intensity in this historic home race.',",

    # Silverstone
    "trackTypeDescription: 'สนามตำนาน โค้งต่อเชื่อมความเร็วสูง Maggotts-Becketts-Chapel',": "trackTypeDescription: 'Legendary circuit featuring the high-speed Maggotts-Becketts-Chapel complex.',",
    "tacticalAdvice: 'Aero และ Suspension สำคัญที่สุดในการแบกความเร็วทะลุชุดโค้งต่อเนื่อง',": "tacticalAdvice: 'Aero downforce and Suspension compliance are vital to carry momentum through continuous sweeps.',",
    "rivalBehaviorNotice: 'Silver Arrow และ MacLaren จะเร็วเป็นพิเศษในสนามบ้านเกิด ต้องมี Aero 80+ เพื่อสู้ได้สูสี',": "rivalBehaviorNotice: 'Silver Arrow and MacLaren are exceptionally fast on home soil. Aero 80+ is recommended.',",

    # Austria / Red Bull Ring
    "trackTypeDescription: 'แทร็กสั้นรอบเร็ว ทางขึ้นเนินชัน 3 สเตจ',": "trackTypeDescription: 'Short, rapid lap with three steep uphill full-throttle stages.',",
    "tacticalAdvice: 'การขึ้นเนินชันทดสอบแรงม้าและแรงบิดโดยตรง อัพเกรด Engine เพื่อไม่ให้เสียจังหวะตอนปีนเนิน',": "tacticalAdvice: 'Steep hill climbs demand peak torque. Upgrade Engine PU to prevent momentum loss.',",
    "rivalBehaviorNotice: 'สนามบ้านเกิดของ Red Bullion คู่แข่งจะเร็วมากและใช้สลิปสตรีมแซงกันดุเดือดตลอดเรซ',": "rivalBehaviorNotice: 'Red Bullion home territory; rivals draft aggressively in non-stop DRS trains.',",

    # Spa-Francorchamps
    "trackTypeDescription: 'เนิน Eau Rouge และทางตรง Kemmel Straight ที่ยาวสะใจ',": "trackTypeDescription: 'Iconic Eau Rouge compression and the epic flat-out Kemmel Straight.',",
    "tacticalAdvice: 'หากพลังเครื่องยนต์ไม่ถึง 85+ OVR คุณจะถูกคู่แข่งเปิด DRS แซงผ่านบนทางตรง Kemmel Straight อย่างง่ายดาย',": "tacticalAdvice: 'If Engine PU is below 85+ OVR, rivals will breeze past with DRS along Kemmel Straight.',",
    "rivalBehaviorNotice: 'คู่แข่งวิ่งเร็วทะลุ 360 km/h และดักเก็บ Speed Pad อย่างแม่นยำ',": "rivalBehaviorNotice: 'Rivals breach 360 km/h and hit Speed Pads with high precision.',",

    # Zandvoort
    "trackTypeDescription: 'โค้งลาดเอียง (Banked Curves) กลางเนินทรายริมทะเลเหนือ',": "trackTypeDescription: 'Banked dune corners carving through North Sea coastal dunes.',",
    "tacticalAdvice: 'ช่วงล่าง Suspension รับภาระแรงกดมหาศาลในโค้งเอียง ช่วยให้รถทรงตัวนิ่งและไม่หลุดโค้ง',": "tacticalAdvice: 'Suspension absorbs massive G-forces in the banking, keeping the chassis composed and planted.',",
    "rivalBehaviorNotice: 'คลื่นแฟนคลับสีส้มหนุนหลัง Min Werstappen ที่นี่ เขาจะขับแบบไร้ที่ติและแทบไม่พลาดเลย',": "rivalBehaviorNotice: 'Backed by an electric home crowd, Min Werstappen is relentless and nearly mistake-free.',",

    # Monza
    "trackTypeDescription: 'วิหารแห่งความเร็ว วิ่งคันเร่งเต็ม 80% ของแทร็ก ทางตรงยาวที่สุดในโลก',": "trackTypeDescription: 'The Temple of Speed. 80% full throttle per lap with the highest terminal velocity on earth.',",
    "tacticalAdvice: 'ไฟลต์บังคับ! ต้องอัพเกรด Engine & Aero ให้แตะระดับ 88+ เพื่อทำความเร็วปลายแตะ 370+ km/h',": "tacticalAdvice: 'Crucial requirement: upgrade Engine & Aero to 88+ OVR to achieve terminal velocities of 370+ km/h.',",
    "rivalBehaviorNotice: 'Scuderia Cavallo และ Red Bullion นำเครื่องยนต์สเปกสูงสุดมาใช้ การขับเคี่ยวทางตรงจะดุเดือดที่สุด',": "rivalBehaviorNotice: 'Scuderia Cavallo and Red Bullion deploy maximum-spec engines; straight-line battles will be intense.',",

    # Singapore
    "trackTypeDescription: 'สตรีตเซอร์กิตกลางคืน 19 โค้ง พื้นผิวไม่เรียบ ร้อนชื้น',": "trackTypeDescription: 'Night street circuit with 19 technical corners over bumpy, tropical asphalt.',",
    "tacticalAdvice: 'ต้องการแชสซีส์ที่คล่องตัวสูงในการเปลี่ยนทิศทางฉับไว และเบรกที่คมกริบเพื่อหยุดรถก่อนกำแพง',": "tacticalAdvice: 'Requires agile Chassis for rapid transitions and razor-sharp Brakes before concrete barriers.',",
    "rivalBehaviorNotice: 'การแข่งขันกลางคืนมีกำแพงประชิดตลอดเส้นทาง ความผิดพลาดเพียงนิดเดียวอาจทำให้เกิดอุบัติเหตุ',": "rivalBehaviorNotice: 'High barrier risk throughout the night; single errors trigger severe multi-car safety car incidents.',",

    # Suzuka
    "trackTypeDescription: 'สนามรูปเลขแปด โค้ง S-Curves สลับซ้ายขวา และโค้ง 130R ในตำนาน',": "trackTypeDescription: 'Figure-eight masterpiece featuring the relentless Esses and iconic 130R flat-out sweeper.',",
    "tacticalAdvice: 'Aero และ Chassis ต้องทำงานประสานกันอย่างสมบูรณ์แบบเพื่อไม่ให้เสียสปีดในโค้ง S-Curves',": "tacticalAdvice: 'Aero and Chassis must be in perfect harmony to preserve momentum through the flowing Esses.',",
    "rivalBehaviorNotice: 'คู่แข่งระดับแชมเปียนจะรักษาเรซเพซได้อย่างสม่ำเสมอ การแซงต้องรอจังหวะชิเคนสุดท้าย Casio Triangle',": "rivalBehaviorNotice: 'Championship-caliber rivals hold metronomic pace; key overtaking happens into Casio Triangle.',",

    # COTA / USA
    "trackTypeDescription: 'สนามโรลเลอร์โคสเตอร์ โค้ง 1 วิ่งขึ้นเนินชัน สลับโค้งไฮสปีด Sector 1',": "trackTypeDescription: 'Modern rollercoaster layout featuring a steep blind Turn 1 crest and rapid Sector 1 Esses.',",
    "tacticalAdvice: 'ต้องมีความเร็วปลายบนทางตรงยาว และช่วงล่างที่รองรับแรงกระแทกจากรอยต่อบนผิวแทร็ก',": "tacticalAdvice: 'Needs top speed down the back straight and compliant Suspension over undulating bumps.',",
    "rivalBehaviorNotice: 'การแข่งขันช่วงท้ายฤดูกาล ทุกทีมนำชิ้นส่วนอัพเกรดขั้นสูงสุดมาใช้ การขับเคี่ยวจะสูสีที่สุด',": "rivalBehaviorNotice: 'Late season title climax: all factory teams bring peak aero packages; battle is fiercely close.',",

    # Las Vegas
    "trackTypeDescription: 'สตรีตสตริปสปีดสูงผ่านโรงแรมระดับโลก อุณหภูมิหนาวเย็นยามค่ำคืน',": "trackTypeDescription: 'High-speed Las Vegas Strip street circuit under freezing night desert air.',",
    "tacticalAdvice: 'ทางตรง The Strip ยาวเกือบ 2 กิโลเมตร! อัพเกรด Engine ให้เต็มสูบเพื่อยิงความเร็วแตะ 350 km/h',": "tacticalAdvice: 'The Strip straight spans nearly 2 km. Max out Engine PU to blast past 350 km/h.',",
    "rivalBehaviorNotice: 'ยางเย็นเร็วมากในอากาศหนาว ระวังเบรกล้อล็อกในโค้งแรกหลังทางตรงยาว',": "rivalBehaviorNotice: 'Cold surface chills tires rapidly; watch for massive wheel lockups into Turn 1.',",

    # Abu Dhabi / Yas Marina
    "trackTypeDescription: 'สนามปิดฤดูกาลยามพลบค่ำ ทางตรงยาว 2 ช่วง สลับโรงแรม W และท่าเรือยอร์ช',": "trackTypeDescription: 'Championship twilight finale. Twin back straights sweeping past luxury yachts and the marina.',",
    "tacticalAdvice: 'เรซตัดสินแชมป์โลก! อัพเกรดทุกส่วนให้เต็ม 99 OVR เพื่อต่อกรกับ Min Werstappen และคู่แข่งทุกคน',": "tacticalAdvice: 'World Championship decider! Max out all departments toward 99 OVR to defeat Min Werstappen.',",
    "rivalBehaviorNotice: 'ไม่มีการยอมจำนน! คู่แข่งทุกคนจะใส่เต็มร้อย Min Werstappen จะสู้จนถึงรอบสุดท้ายเพื่อถ้วยแชมป์โลก',": "rivalBehaviorNotice: 'Zero compromises! Min Werstappen and title rivals fight flat-out to the final flag for the World Crown.'"
}

with open('src/data/circuitDemands.ts', 'r', encoding='utf-8') as f:
    cd = f.read()

for old, new in translations.items():
    cd = cd.replace(old, new)

with open('src/data/circuitDemands.ts', 'w', encoding='utf-8') as f:
    f.write(cd)

print('Updated circuitDemands.ts')
