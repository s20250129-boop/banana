'use strict';

/* ============================================================
   Bilingual copy
   ============================================================ */
const I18N = {
  zh: {
    'meta.title': '數字冒險島 · 玩住闖關，練好數學',
    'meta.description': '為中小學生而設的數學冒險遊戲。六個島嶼、三種難度、十四枚徽章；答錯自動記錄，進度只存喺你部裝置。',
    'brand.name': '數字冒險島',
    'brand.en': 'NUMBER ADVENTURE ISLAND',
    'nav.islands': '島嶼',
    'nav.demo': '試玩',
    'nav.how': '玩法',
    'nav.learning': '學習設計',
    'nav.pricing': '方案',
    'nav.faq': '常見問題',
    'nav.author': '作者',
    'nav.play': '立即試玩',
    'hero.badge': '為 P4–S3 而設 · 免費試玩',
    'hero.title': '數學，唔止係練習。<br>係一場<span class="hl">冒險</span>。',
    'hero.lede': '數字冒險島將六個數學課題變成六個島嶼。揀難度、答題過關、收集徽章；答錯嘅題目會自動留低，變成下一次練習。',
    'hero.cta': '免費試玩',
    'hero.secondary': '睇下點玩',
    'hero.trust1': '免登入',
    'hero.trust2': '離線可玩',
    'hero.trust3': '進度只存本地',
    'hero.alt': '數字冒險島手機 App 的冒險地圖畫面',
    'hero.floatLevel': '島嶼嚮導',
    'hero.floatStars': '完美通關',
    'hero.floatBadges': '徽章',
    'hero.stat1': '島嶼',
    'hero.stat2': '難度',
    'hero.stat3': '徽章',
    'hero.stat4': '分鐘',
    'why.eyebrow': 'THE PROBLEM',
    'why.title': '練習唔應該只係<br>「做多幾題」。',
    'why.lede': '學生唔係唔想練，而係唔知為咩練；錯咗之後，亦冇一個工具幫佢返去。數字冒險島把練習變成一個有起點、有終點、有回饋嘅循環。',
    'why.signature': '設計原則：讓學生願意再做一次提取。',
    'why.card1Title': '冇目標，做到麻木',
    'why.card1Body': '做完十題，只係做完十題。冇星、冇進度、冇下一個目的地。',
    'why.card2Title': '錯題散失，唔會再見',
    'why.card2Body': '對完答案，錯題就散喺練習冊同截圖入面；下次唔會再遇到。',
    'why.card3Title': '難度錯配，怕錯多過想試',
    'why.card3Body': '太淺覺得悶，太深覺得挫敗；最後只敢揀最安全嘅題目。',
    'why.solution': '我哋將呢三件事，變成一個 3–5 分鐘嘅冒險循環。',
    'islands.eyebrow': 'THE ARCHIPELAGO',
    'islands.title': '六個島嶼，六種數學能力。',
    'islands.lede': '每個島嶼代表一個課題，由探索到極限，題目會跟住難度同學習階段變化。揀一個島，就係揀今日想練嘅能力。',
    'islands.volcano.name': '火山速算島',
    'islands.volcano.alt': 'Volcano Sprint',
    'islands.volcano.desc': '四則運算、百分比與混合運算。限時挑戰你嘅反應同準確度。',
    'islands.fraction.name': '分數叢林',
    'islands.fraction.alt': 'Fraction Forest',
    'islands.fraction.desc': '由分數條到異分母加減，建立真正嘅分數感。',
    'islands.geometry.name': '圖形海灣',
    'islands.geometry.alt': 'Geometry Bay',
    'islands.geometry.desc': '面積、周界、體積與角度，附圖解，唔需要死記公式。',
    'islands.word.name': '應用題沙漠',
    'islands.word.alt': 'Word Problem Desert',
    'islands.word.desc': '購物、速率、平均數與百分比，一步步拆解生活情境。',
    'islands.algebra.name': '方程山洞',
    'islands.algebra.alt': 'Equation Cavern',
    'islands.algebra.desc': '由找未知數到一元一次方程，練習平衡兩邊。',
    'islands.data.name': '數據燈塔',
    'islands.data.alt': 'Data Lighthouse',
    'islands.data.desc': '圖表、平均數、中位數與概率，讓數字說故事。',
    'islands.play': '試玩這個島',
    'topic.arithmetic': '四則運算',
    'topic.percentages': '百分比',
    'topic.fractions': '分數',
    'topic.equivalence': '等值',
    'topic.geometry': '圖形',
    'topic.measurement': '度量',
    'topic.word': '應用題',
    'topic.everyday': '生活數學',
    'topic.algebra': '代數',
    'topic.equations': '方程',
    'topic.statistics': '統計',
    'topic.probability': '概率',
    'islands.rule1Title': '3 種難度',
    'islands.rule1Body': '探索、挑戰、極限',
    'islands.rule2Title': '4 顆心',
    'islands.rule2Body': '4 次失誤先中止，容許試錯',
    'islands.rule3Title': '3 星制',
    'islands.rule3Body': '最多錯 1 題得 3 星',
    'islands.note': '全部六個島都包括在免費試玩內。',
    'demo.eyebrow': 'LIVE DEMO',
    'demo.title': '唔使註冊，即刻開始<br>你嘅第一次冒險。',
    'demo.lede': '呢個係完整可玩嘅原型，唔係預錄 demo。你可以揀島、答題、睇錯題；所有進度只存喺你部裝置。',
    'demo.b1': '6 個島嶼 × 3 種難度',
    'demo.b2': '即時解題回饋',
    'demo.b3': '答錯自動入錯題簿',
    'demo.cta': '開始試玩',
    'demo.open': '喺新分頁開啟',
    'demo.langNote': '試玩版介面以繁體中文為主；數學題目同圖形係通用嘅。',
    'demo.alt': '數字冒險島火山速算答題畫面，顯示計時與選項',
    'demo.tap': '點擊試玩',
    'demo.note': '完整 App · 390 × 844',
    'demo.modalTitle': '即時試玩',
    'demo.modalNote': '完整遊戲載入中。所有進度只存喺你部裝置。',
    'demo.loading': '載入中…',
    'demo.newTab': '新分頁',
    'gallery.eyebrow': 'A CLOSER LOOK',
    'gallery.title': '由答題到掌握，<br>每一個畫面都有原因。',
    'gallery.lede': '結算、錯題、徽章、進度——唔係裝飾，而係令學生知道下一步去邊。',
    'gallery.cap1': '即時回饋',
    'gallery.cap1Body': '答啱／答錯、正確答案同簡短步驟。',
    'gallery.cap2': '錯題簿',
    'gallery.cap2Body': '自動收集、可重練、可標記掌握。',
    'gallery.cap3': '徽章牆',
    'gallery.cap3Body': '14 枚徽章，獎勵精通、修正同韌性。',
    'gallery.alt1': '完美通關結算畫面',
    'gallery.alt2': '錯題簿畫面',
    'gallery.alt3': '徽章牆畫面',
    'how.eyebrow': 'THE LOOP',
    'how.title': '由揀島到掌握，只需三個步驟。',
    'how.lede': '一關 6–8 題，約 3–5 分鐘。適合小息、搭車或者睡前。',
    'how.step1Title': '揀島嶼與難度',
    'how.step1Body': '六個課題，三種難度。由你決定今日想挑戰幾多。',
    'how.step2Title': '答 6–8 題',
    'how.step2Body': '四顆心、即時回饋、每題解釋。錯咗唔會即刻被審判。',
    'how.step3Title': '收集與重練',
    'how.step3Body': '星、XP、徽章；錯題自動入簿，答啱先叫掌握。',
    'how.time': '3–5 分鐘 / 一關',
    'learning.eyebrow': 'LEARNING DESIGN',
    'learning.title': '遊戲係外殼，<br>學習設計先係核心。',
    'learning.lede': '四個原則，決定每一題點樣出現、幾時俾回饋、幾時算掌握。',
    'learning.card1Title': '提取練習',
    'learning.card1Body': '每次都要學生自己揀答案或輸入答案，唔係睇住解釋。',
    'learning.card1Why': '記憶係喺提取嘅時候鞏固，唔係喺重讀嘅時候。',
    'learning.card2Title': '即時回饋',
    'learning.card2Body': '答完即刻知啱錯，仲有簡短解題步驟。',
    'learning.card2Why': '越快修正，錯誤概念越難扎根。',
    'learning.card3Title': '精通學習',
    'learning.card3Body': '錯題重練答啱，先會標記為「已掌握」。',
    'learning.card3Why': '做過唔等於識；答啱先算掌握。',
    'learning.card4Title': '低壓自主',
    'learning.card4Body': '自選島嶼與難度，冇排行榜，冇公開比較。',
    'learning.card4Why': '安全感越高，學生越願意試難少少嘅題目。',
    'learning.quote': '與其叫學生「再做十題」，不如俾佢揀一個島，打一場冒險。',
    'learning.quoteBy': '— 產品設計筆記',
    'curriculum.eyebrow': 'CURRICULUM',
    'curriculum.title': '由小四到中三，<br>六個課題。',
    'curriculum.lede': '涵蓋香港數學課程常見課題，適合作課堂熱身、功課以外嘅練習，或者家長伴學。',
    'curriculum.range': 'P4–S3',
    'curriculum.note': '每題附解釋；難度由探索到極限，會按學習階段調整。',
    'curriculum.primary': '小學 P4–P6',
    'curriculum.secondary': '中學 S1–S3',
    'curriculum.chip1': '四則運算',
    'curriculum.chip2': '分數',
    'curriculum.chip3': '圖形與度量',
    'curriculum.chip4': '應用題',
    'curriculum.chip5': '數據與概率',
    'curriculum.chip6': '代數',
    'curriculum.chip7': '一元一次方程',
    'curriculum.chip8': '百分比',
    'curriculum.chip9': '速率',
    'curriculum.chip10': '統計與概率',
    'progress.eyebrow': 'PROGRESS',
    'progress.title': '進步，要睇得見。',
    'progress.lede': '唔係只有「做完」同「未做」。星數、正確率、掌握度同錯題，全部有數睇。',
    'progress.b1': '近 7 日練習圖',
    'progress.b2': '每個島嶼嘅掌握度',
    'progress.b3': '已掌握錯題數量',
    'progress.b4': '連續冒險日數',
    'progress.parent': '家長可以睇到趨勢，但唔需要監控每一題。',
    'progress.teacher': '老師可以喺課堂用 5 分鐘做熱身，唔使開帳號。',
    'progress.alt': '數字冒險島進度頁，顯示 7 日練習圖與島嶼掌握度',
    'progress.metric1': '正確率',
    'progress.metric2': '已收集星數',
    'progress.metric3': '已掌握錯題',
    'progress.preview': '示範數據',
    'pricing.eyebrow': 'PLANS',
    'pricing.title': '免費開始，學校試行。',
    'pricing.lede': '原型階段全部學習功能免費。家庭同步同學校後台係下一步，未收費。',
    'pricing.c1Tag': '免費',
    'pricing.c1Name': '探索者',
    'pricing.c1Price': 'HK$0',
    'pricing.c1Desc': '適合學生自己試玩，或者家長一齊探索。',
    'pricing.c1F1': '六個島嶼、三種難度',
    'pricing.c1F2': '14 枚徽章',
    'pricing.c1F3': '錯題簿與進度記錄',
    'pricing.c1F4': '免登入、本地儲存',
    'pricing.c1Cta': '開始玩',
    'pricing.c2Tag': '即將推出',
    'pricing.c2Name': '家庭版',
    'pricing.c2Price': 'Roadmap',
    'pricing.c2Desc': '畀想跨裝置同步、睇每週摘要嘅家庭。',
    'pricing.c2F1': '跨裝置進度同步',
    'pricing.c2F2': '家長每週摘要',
    'pricing.c2F3': '無廣告、無追蹤',
    'pricing.c2F4': '多個孩子檔案',
    'pricing.c2Cta': '表達興趣',
    'pricing.c3Tag': '試行',
    'pricing.c3Name': '學校試行',
    'pricing.c3Price': 'Pilot',
    'pricing.c3Desc': '畀老師用 5 分鐘課堂熱身，或者課後練習。',
    'pricing.c3F1': '班級碼與課程對應',
    'pricing.c3F2': '老師視圖（Roadmap）',
    'pricing.c3F3': '學生免帳號',
    'pricing.c3F4': '可離線使用',
    'pricing.c3Cta': '聯絡作者',
    'pricing.note': '原型階段唔收費；付費計劃只係 roadmap。',
    'author.eyebrow': 'ABOUT THE AUTHOR',
    'author.name': '2A 余卓烽',
    'author.role': '產品設計 · 介面 · 題目引擎 · 部署',
    'author.bio1': '香港中二學生。由產品構思、視覺設計、題目引擎到網站與部署，一手包辦。',
    'author.bio2': '這個 project 想證明：數學練習都可以有好奇心。',
    'author.chip1': '香港',
    'author.chip2': '中二',
    'author.chip3': '2026',
    'author.chip4': '學生作品',
    'author.github': 'GitHub',
    'author.design': '產品設計筆記',
    'author.note': '如果你係老師，想喺課堂試行，歡迎喺 GitHub 開 issue 傾。',
    'faq.eyebrow': 'FAQ',
    'faq.title': '常見問題',
    'faq.lede': '關於年級、私隱、英文同收費。',
    'faq.q1': '適合幾年級？',
    'faq.a1': '主要為小四至中三（約 9–15 歲）而設。難度由探索到極限，會按學習階段調整。',
    'faq.q2': '要唔要註冊？',
    'faq.a2': '唔使。打開就可以玩，冇帳號、冇 email、冇密碼。',
    'faq.q3': '要唔要上網？',
    'faq.a3': '第一次載入需要網絡；之後遊戲可以離線玩。如果你下載 index.html，亦可以直接開啟。',
    'faq.q4': '遊戲有英文版嗎？',
    'faq.a4': '網站同學習說明有完整中英文。試玩版遊戲介面暫時以繁體中文為主，英文遊戲介面係下一步。',
    'faq.q5': '進度會上傳嗎？',
    'faq.a5': '唔會。進度只存喺你部裝置嘅 localStorage，冇後端、冇追蹤。',
    'faq.q6': '有老師後台嗎？',
    'faq.a6': '而家未有。學校試行會先由班級碼同課程對應開始，老師視圖係 roadmap。',
    'faq.q7': '點樣俾意見？',
    'faq.a7': '喺 GitHub 開 issue，或者直接聯絡作者。',
    'cta.eyebrow': 'READY?',
    'cta.title': '準備好開始你嘅第一次冒險？',
    'cta.lede': '免費、免登入、3–5 分鐘。揀一個島，試下先。',
    'cta.primary': '免費試玩',
    'cta.secondary': '睇產品設計',
    'cta.note': '為好奇嘅頭腦而設。Made for curious minds.',
    'footer.tagline': '玩住闖關，練好數學。',
    'footer.privacy': '冇 cookies、冇追蹤；進度只存喺你部裝置。',
    'footer.explore': '探索',
    'footer.resources': '資源',
    'footer.language': '語言',
    'footer.source': 'GitHub 原始碼',
    'footer.design': '產品設計筆記',
    'footer.issue': '回報問題',
    'footer.play': '試玩',
    'footer.noCookies': '本地優先 · 冇廣告 · 冇追蹤',
    'footer.built': 'Designed & built by 2A 余卓烽',
    'footer.copyright': '© 2026 余卓烽 · 2A'
  },
  en: {
    'meta.title': 'Number Adventure Island · Math, turned into an adventure',
    'meta.description': 'A math adventure for P4–S3 students: six islands, three difficulty levels, 14 badges, automatic mistake review, and progress that stays on your device.',
    'brand.name': 'Number Adventure Island',
    'brand.en': '數字冒險島 · MATH ADVENTURE',
    'nav.islands': 'Islands',
    'nav.demo': 'Demo',
    'nav.how': 'How it works',
    'nav.learning': 'Learning',
    'nav.pricing': 'Plans',
    'nav.faq': 'FAQ',
    'nav.author': 'Author',
    'nav.play': 'Play free',
    'hero.badge': 'FOR AGES 9–15 · FREE TO PLAY',
    'hero.title': 'Math is more than practice.<br>It\'s an <span class="hl">adventure</span>.',
    'hero.lede': 'Number Adventure Island turns six math topics into six islands. Pick a difficulty, clear levels, collect badges—and every mistake becomes the next practice.',
    'hero.cta': 'Play free',
    'hero.secondary': 'See how it works',
    'hero.trust1': 'No sign-up',
    'hero.trust2': 'Works offline',
    'hero.trust3': 'Local-only progress',
    'hero.alt': 'Number Adventure Island app showing the adventure map',
    'hero.floatLevel': 'Island Guide',
    'hero.floatStars': 'Perfect run',
    'hero.floatBadges': 'badges',
    'hero.stat1': 'Islands',
    'hero.stat2': 'Levels',
    'hero.stat3': 'Badges',
    'hero.stat4': 'Minutes',
    'why.eyebrow': 'THE PROBLEM',
    'why.title': 'Practice isn\'t just<br>more questions.',
    'why.lede': 'Students don\'t avoid practice because they\'re lazy. They avoid it because it has no goal—and when they get something wrong, nothing brings them back. Number Adventure Island turns practice into a loop with a start, an end, and feedback.',
    'why.signature': 'Design principle: make students want to retrieve one more time.',
    'why.card1Title': 'No goal, just volume',
    'why.card1Body': 'Ten questions done is just ten questions done. No stars, no progress, nowhere to go next.',
    'why.card2Title': 'Mistakes disappear',
    'why.card2Body': 'Once you check the answers, mistakes scatter across workbooks and screenshots—and never come back.',
    'why.card3Title': 'One size fits none',
    'why.card3Body': 'Too easy is boring. Too hard is defeating. Eventually students only choose the safest questions.',
    'why.solution': 'We turned those three problems into a 3–5 minute adventure loop.',
    'islands.eyebrow': 'THE ARCHIPELAGO',
    'islands.title': 'Six islands.<br>Six ways to think.',
    'islands.lede': 'Each island is a topic. From Explorer to Extreme, questions adapt to difficulty and learning stage. Pick an island—and pick the skill you want to train today.',
    'islands.volcano.name': 'Volcano Sprint',
    'islands.volcano.alt': '火山速算島',
    'islands.volcano.desc': 'Arithmetic, percentages and mixed operations. A timed test of speed and accuracy.',
    'islands.fraction.name': 'Fraction Forest',
    'islands.fraction.alt': '分數叢林',
    'islands.fraction.desc': 'From fraction bars to unlike denominators, build a real sense of fractions.',
    'islands.geometry.name': 'Geometry Bay',
    'islands.geometry.alt': '圖形海灣',
    'islands.geometry.desc': 'Area, perimeter, volume and angles—with diagrams, not rote memorisation.',
    'islands.word.name': 'Word Problem Desert',
    'islands.word.alt': '應用題沙漠',
    'islands.word.desc': 'Shopping, speed, averages and percentages, unpacked step by step.',
    'islands.algebra.name': 'Equation Cavern',
    'islands.algebra.alt': '方程山洞',
    'islands.algebra.desc': 'From missing numbers to linear equations, practise balancing both sides.',
    'islands.data.name': 'Data Lighthouse',
    'islands.data.alt': '數據燈塔',
    'islands.data.desc': 'Charts, averages, medians and probability—let the numbers tell a story.',
    'islands.play': 'Play this island',
    'topic.arithmetic': 'Arithmetic',
    'topic.percentages': 'Percentages',
    'topic.fractions': 'Fractions',
    'topic.equivalence': 'Equivalence',
    'topic.geometry': 'Geometry',
    'topic.measurement': 'Measurement',
    'topic.word': 'Word problems',
    'topic.everyday': 'Everyday maths',
    'topic.algebra': 'Algebra',
    'topic.equations': 'Equations',
    'topic.statistics': 'Statistics',
    'topic.probability': 'Probability',
    'islands.rule1Title': '3 difficulty levels',
    'islands.rule1Body': 'Explorer, Challenge, Extreme',
    'islands.rule2Title': '4 hearts',
    'islands.rule2Body': 'Four misses before a run ends—room to try',
    'islands.rule3Title': '3-star system',
    'islands.rule3Body': 'Three stars for one mistake or fewer',
    'islands.note': 'All six islands are included in the free demo.',
    'demo.eyebrow': 'LIVE DEMO',
    'demo.title': 'No sign-up.<br>Start your adventure.',
    'demo.lede': 'This is the full playable prototype, not a recording. Pick an island, answer questions, review mistakes—all progress stays on your device.',
    'demo.b1': '6 islands × 3 difficulty levels',
    'demo.b2': 'Instant explanations',
    'demo.b3': 'Mistakes saved automatically',
    'demo.cta': 'Start playing',
    'demo.open': 'Open in new tab',
    'demo.langNote': 'The playable prototype\'s in-game text is currently in Traditional Chinese. Math notation is universal.',
    'demo.alt': 'Number Adventure Island Volcano Sprint question screen with timer and options',
    'demo.tap': 'Tap to play',
    'demo.note': 'Full app · 390 × 844',
    'demo.modalTitle': 'Live demo',
    'demo.modalNote': 'The full game is loading. Progress stays on your device.',
    'demo.loading': 'Loading…',
    'demo.newTab': 'New tab',
    'gallery.eyebrow': 'A CLOSER LOOK',
    'gallery.title': 'Every screen<br>has a reason.',
    'gallery.lede': 'Results, mistakes, badges and progress aren\'t decoration. They show students where to go next.',
    'gallery.cap1': 'Instant feedback',
    'gallery.cap1Body': 'Right or wrong, the answer and a short explanation.',
    'gallery.cap2': 'Mistake notebook',
    'gallery.cap2Body': 'Collected automatically, replayable, markable as mastered.',
    'gallery.cap3': 'Badge wall',
    'gallery.cap3Body': '14 badges for mastery, correction and resilience.',
    'gallery.alt1': 'Perfect run results screen',
    'gallery.alt2': 'Mistake notebook screen',
    'gallery.alt3': 'Badge wall screen',
    'how.eyebrow': 'THE LOOP',
    'how.title': 'From island to mastery, in three steps.',
    'how.lede': 'Six to eight questions per run, about three to five minutes. Perfect for a break, a commute or before bed.',
    'how.step1Title': 'Pick an island and a level',
    'how.step1Body': 'Six topics, three levels. You decide how much to take on today.',
    'how.step2Title': 'Answer 6–8 questions',
    'how.step2Body': 'Four hearts, instant feedback, an explanation for every question.',
    'how.step3Title': 'Collect and review',
    'how.step3Body': 'Stars, XP, badges—and mistakes that only count as mastered when you get them right.',
    'how.time': '3–5 min / run',
    'learning.eyebrow': 'LEARNING DESIGN',
    'learning.title': 'The game is the wrapper.<br>Learning is the core.',
    'learning.lede': 'Four principles shape when questions appear, when feedback lands, and what counts as mastery.',
    'learning.card1Title': 'Retrieval practice',
    'learning.card1Body': 'Students retrieve the answer themselves—no passive reading.',
    'learning.card1Why': 'Memory is strengthened by retrieval, not re-reading.',
    'learning.card2Title': 'Immediate feedback',
    'learning.card2Body': 'Know immediately whether you\'re right, with a short worked explanation.',
    'learning.card2Why': 'The sooner a misconception is corrected, the less it sticks.',
    'learning.card3Title': 'Mastery learning',
    'learning.card3Body': 'A mistake only becomes \'mastered\' when you get it right in review.',
    'learning.card3Why': 'Seen is not the same as mastered.',
    'learning.card4Title': 'Low-stakes autonomy',
    'learning.card4Body': 'Choose your island and level. No leaderboards, no public comparison.',
    'learning.card4Why': 'The safer students feel, the more willing they are to try something harder.',
    'learning.quote': 'Instead of asking students to do ten more questions, let them pick an island and play one adventure.',
    'learning.quoteBy': '— Product design notes',
    'curriculum.eyebrow': 'CURRICULUM',
    'curriculum.title': 'From P4 to S3,<br>six topics.',
    'curriculum.lede': 'Covers common topics in the Hong Kong maths curriculum—useful for a lesson warm-up, extra practice, or learning together at home.',
    'curriculum.range': 'P4–S3',
    'curriculum.note': 'Every question includes an explanation. Difficulty adapts from Explorer to Extreme and by stage.',
    'curriculum.primary': 'Primary P4–P6',
    'curriculum.secondary': 'Secondary S1–S3',
    'curriculum.chip1': 'Arithmetic',
    'curriculum.chip2': 'Fractions',
    'curriculum.chip3': 'Geometry & measurement',
    'curriculum.chip4': 'Word problems',
    'curriculum.chip5': 'Data & probability',
    'curriculum.chip6': 'Algebra',
    'curriculum.chip7': 'Linear equations',
    'curriculum.chip8': 'Percentages',
    'curriculum.chip9': 'Speed',
    'curriculum.chip10': 'Statistics & probability',
    'progress.eyebrow': 'PROGRESS',
    'progress.title': 'Progress you can see.',
    'progress.lede': 'Not just done or not done. Stars, accuracy, mastery and mistakes all have a number.',
    'progress.b1': '7-day practice chart',
    'progress.b2': 'Mastery for every island',
    'progress.b3': 'Mistakes mastered',
    'progress.b4': 'Adventure streak',
    'progress.parent': 'Parents can see the trend without monitoring every question.',
    'progress.teacher': 'Teachers can run a five-minute warm-up—no accounts required.',
    'progress.alt': 'Number Adventure Island progress page with a 7-day chart and island mastery',
    'progress.metric1': 'Accuracy',
    'progress.metric2': 'Stars collected',
    'progress.metric3': 'Mistakes mastered',
    'progress.preview': 'Preview data',
    'pricing.eyebrow': 'PLANS',
    'pricing.title': 'Start free.<br>Pilot with your school.',
    'pricing.lede': 'All learning features are free during the prototype. Family sync and school dashboards are next—not yet charged.',
    'pricing.c1Tag': 'Free',
    'pricing.c1Name': 'Explorer',
    'pricing.c1Price': 'HK$0',
    'pricing.c1Desc': 'For students trying it out—or exploring together at home.',
    'pricing.c1F1': 'Six islands, three levels',
    'pricing.c1F2': '14 badges',
    'pricing.c1F3': 'Mistake notebook and progress',
    'pricing.c1F4': 'No sign-up, local storage',
    'pricing.c1Cta': 'Start playing',
    'pricing.c2Tag': 'Coming soon',
    'pricing.c2Name': 'Family',
    'pricing.c2Price': 'Roadmap',
    'pricing.c2Desc': 'For families who want cross-device sync and a weekly summary.',
    'pricing.c2F1': 'Cross-device progress sync',
    'pricing.c2F2': 'Weekly parent summary',
    'pricing.c2F3': 'No ads, no tracking',
    'pricing.c2F4': 'Multiple child profiles',
    'pricing.c2Cta': 'Register interest',
    'pricing.c3Tag': 'Pilot',
    'pricing.c3Name': 'School pilot',
    'pricing.c3Price': 'Pilot',
    'pricing.c3Desc': 'For teachers running a five-minute warm-up or after-school practice.',
    'pricing.c3F1': 'Class codes and curriculum mapping',
    'pricing.c3F2': 'Teacher view (roadmap)',
    'pricing.c3F3': 'No student accounts',
    'pricing.c3F4': 'Works offline',
    'pricing.c3Cta': 'Contact the author',
    'pricing.note': 'Free during the prototype. Paid plans are roadmap only.',
    'author.eyebrow': 'ABOUT THE AUTHOR',
    'author.name': '2A 余卓烽',
    'author.role': 'Product design · Interface · Question engine · Deployment',
    'author.bio1': 'A Form 2 student from Hong Kong. Built the concept, visual design, question engine, website and deployment.',
    'author.bio2': 'This project is a small proof that math practice can still feel curious.',
    'author.chip1': 'Hong Kong',
    'author.chip2': 'Form 2',
    'author.chip3': '2026',
    'author.chip4': 'Student project',
    'author.github': 'GitHub',
    'author.design': 'Design notes',
    'author.note': 'If you\'re a teacher interested in a classroom pilot, open an issue on GitHub.',
    'faq.eyebrow': 'FAQ',
    'faq.title': 'Frequently asked questions',
    'faq.lede': 'Ages, privacy, language and pricing.',
    'faq.q1': 'What ages is it for?',
    'faq.a1': 'It\'s designed for P4–S3 (roughly ages 9–15). Difficulty ranges from Explorer to Extreme and adapts by stage.',
    'faq.q2': 'Do I need an account?',
    'faq.a2': 'No. Open it and play—no account, email or password.',
    'faq.q3': 'Does it need internet?',
    'faq.a3': 'The first load needs internet; after that the game works offline. You can also open the downloaded index.html directly.',
    'faq.q4': 'Is the game available in English?',
    'faq.a4': 'The website and learning guide are fully bilingual. The playable prototype\'s in-game text is currently Traditional Chinese; an English game UI is next.',
    'faq.q5': 'Is my progress uploaded?',
    'faq.a5': 'No. Progress stays in your browser\'s localStorage—no backend, no tracking.',
    'faq.q6': 'Is there a teacher dashboard?',
    'faq.a6': 'Not yet. School pilots would start with class codes and curriculum mapping; a teacher view is on the roadmap.',
    'faq.q7': 'How can I give feedback?',
    'faq.a7': 'Open an issue on GitHub, or contact the author directly.',
    'cta.eyebrow': 'READY?',
    'cta.title': 'Ready for your first adventure?',
    'cta.lede': 'Free, no sign-up, three to five minutes. Pick an island and try.',
    'cta.primary': 'Play free',
    'cta.secondary': 'Read the design notes',
    'cta.note': 'Made for curious minds.',
    'footer.tagline': 'Play your way to stronger maths.',
    'footer.privacy': 'No cookies, no tracking. Progress stays on your device.',
    'footer.explore': 'Explore',
    'footer.resources': 'Resources',
    'footer.language': 'Language',
    'footer.source': 'GitHub source',
    'footer.design': 'Design notes',
    'footer.issue': 'Report an issue',
    'footer.play': 'Play',
    'footer.noCookies': 'Local-first · No ads · No tracking',
    'footer.built': 'Designed & built by 2A 余卓烽',
    'footer.copyright': '© 2026 余卓烽 · 2A'
  }
};

/* ============================================================
   Language
   ============================================================ */
const LANG_KEY = 'nai-site-lang';
const supported = ['zh', 'en'];

function getInitialLang() {
  const params = new URLSearchParams(location.search);
  const fromQuery = params.get('lang');
  if (supported.includes(fromQuery)) return fromQuery;
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (supported.includes(stored)) return stored;
  } catch (e) { /* private mode */ }
  return 'zh';
}

function applyLanguage(lang, options = {}) {
  lang = supported.includes(lang) ? lang : 'zh';
  const dict = I18N[lang];
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant-HK';
  document.body.dataset.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (dict[key] !== undefined) el.setAttribute('alt', dict[key]);
  });

  if (dict['meta.title']) document.title = dict['meta.title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', dict['meta.description']);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute('content', dict['meta.title']);
  if (ogDesc) ogDesc.setAttribute('content', dict['meta.description']);

  document.querySelectorAll('[data-set-lang]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
  });

  const frame = document.getElementById('gameFrame');
  if (frame) {
    frame.title = lang === 'en'
      ? 'Number Adventure Island demo'
      : '數字冒險島試玩';
  }

  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }

  if (options.updateUrl) {
    const url = new URL(location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }
}

document.querySelectorAll('[data-set-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.setLang;
    applyLanguage(lang, { updateUrl: true });
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  });
});

applyLanguage(getInitialLang(), { updateUrl: false });

/* ============================================================
   Navigation
   ============================================================ */
const nav = document.getElementById('siteNav');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function syncNav() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
}
syncNav();
window.addEventListener('scroll', syncNav, { passive: true });

function setMenu(open) {
  if (!menuBtn || !mobileMenu) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
  const iconUse = menuBtn.querySelector('use');
  if (iconUse) iconUse.setAttribute('href', open ? '#i-close' : '#i-menu');
  if (open) {
    const first = mobileMenu.querySelector('a, button');
    if (first) setTimeout(() => first.focus(), 80);
  }
}
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
}
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenu(false);
});

/* active nav link */
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
  sections.forEach(s => navObs.observe(s));
}

/* ============================================================
   Reveal on scroll
   ============================================================ */
const revealEls = Array.from(document.querySelectorAll('.reveal'));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ============================================================
   Live demo modal
   ============================================================ */
const demoModal = document.getElementById('demoModal');
const gameFrame = document.getElementById('gameFrame');
const gameLoading = document.getElementById('gameLoading');
const demoNewTab = document.getElementById('demoNewTab');
let lastFocus = null;
let currentDemoUrl = 'app/';

function openDemo(url) {
  if (!demoModal || !gameFrame) return;
  currentDemoUrl = url || 'app/';
  lastFocus = document.activeElement;
  demoNewTab.href = currentDemoUrl;
  gameLoading.classList.remove('done');
  gameFrame.src = currentDemoUrl;
  demoModal.classList.add('open');
  demoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  const closeBtn = demoModal.querySelector('[data-close-demo]');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 80);
  // let the iframe load behind the spinner
  gameFrame.addEventListener('load', () => {
    if (gameFrame.src && gameFrame.src.indexOf('about:blank') === -1) {
      setTimeout(() => gameLoading.classList.add('done'), 150);
    }
  }, { once: true });
}

function closeDemo() {
  if (!demoModal) return;
  demoModal.classList.remove('open');
  demoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  setTimeout(() => {
    if (gameFrame) gameFrame.src = 'about:blank';
    if (gameLoading) gameLoading.classList.remove('done');
  }, 260);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

document.querySelectorAll('[data-open-demo]').forEach(el => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    const url = el.getAttribute('data-demo-url') || el.getAttribute('href') || 'app/';
    setMenu(false);
    openDemo(url);
  });
});
document.querySelectorAll('[data-close-demo]').forEach(el => el.addEventListener('click', closeDemo));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (demoModal && demoModal.classList.contains('open')) closeDemo();
    else if (mobileMenu && mobileMenu.classList.contains('open')) setMenu(false);
  }
  if (event.key !== 'Tab' || !demoModal || !demoModal.classList.contains('open')) return;
  const focusables = Array.from(demoModal.querySelectorAll('a[href], button:not([disabled]), input, iframe'));
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});

/* close modal when clicking the backdrop (the backdrop itself is also a close target) */
if (demoModal) {
  demoModal.addEventListener('click', (event) => {
    if (event.target === demoModal) closeDemo();
  });
}

/* ============================================================
   Small niceties
   ============================================================ */
/* close other FAQ items when one opens (optional, keeps the page tidy) */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

/* keep the demo new-tab link in sync if the modal is opened from a card */
if (demoNewTab) {
  const observer = new MutationObserver(() => {
    if (demoModal.classList.contains('open')) demoNewTab.href = currentDemoUrl;
  });
  observer.observe(demoModal, { attributes: true, attributeFilter: ['class'] });
}
