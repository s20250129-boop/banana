'use strict';
/* =========================================================
   數字冒險島 — interactive prototype
   Single file build · offline · localStorage
   ========================================================= */

const SAVE_KEY = 'number-adventure-island.v1';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- island / difficulty metadata ---------- */
const ISLANDS = [
  {
    id:'volcano', name:'火山速算島', short:'火山速算', topic:'四則運算',
    c1:'#FF9A63', c2:'#E5432B', accent:'#FFC24B', icon:'volcano',
    tagline:'手快心準，連熔岩都追你唔到。',
    desc:'加減乘除、混合運算同百分比，限時挑戰你嘅反應同準確度。'
  },
  {
    id:'fraction', name:'分數叢林', short:'分數叢林', topic:'分數',
    c1:'#6BD185', c2:'#2E8B4F', accent:'#FFE08A', icon:'leaf',
    tagline:'切開一片森林，睇清每份有幾多。',
    desc:'比較、等值、加減同乘法，用視覺分數條建立真正嘅分數感。'
  },
  {
    id:'geometry', name:'圖形海灣', short:'圖形海灣', topic:'圖形與度量',
    c1:'#4CC3E6', c2:'#147FA8', accent:'#FFE08A', icon:'shell',
    tagline:'量度海岸線，搵出圖形嘅秘密。',
    desc:'周界、面積、體積同角度，附圖解，唔需要死記公式。'
  },
  {
    id:'word', name:'應用題沙漠', short:'應用題', topic:'應用題',
    c1:'#F7C756', c2:'#D68B1C', accent:'#FFF0B8', icon:'cactus',
    tagline:'讀懂故事，先至搵到答案。',
    desc:'購物、速度、平均數同百分比，一步步拆解生活情境。'
  },
  {
    id:'algebra', name:'方程山洞', short:'方程山洞', topic:'代數',
    c1:'#9B7DF8', c2:'#5B3FC4', accent:'#FFE08A', icon:'crystal',
    tagline:'解開石門上嘅未知數。',
    desc:'由找未知數到一元一次方程，練習逆向思考同平衡兩邊。'
  },
  {
    id:'data', name:'數據燈塔', short:'數據燈塔', topic:'數據與概率',
    c1:'#3FC8B4', c2:'#0B7A72', accent:'#FFE08A', icon:'lighthouse',
    tagline:'喺數據海上面，搵到方向。',
    desc:'讀圖表、平均數、中位數同概率，令數字講出故事。'
  }
];

const DIFFS = [
  { id:1, name:'探索', tag:'熱身', color:'#0B7A72', soft:'#DFF5EE',
    meta:'6 題 · 約 3 分鐘', count:6, desc:'啱啱開始，慢慢建立信心' },
  { id:2, name:'挑戰', tag:'推薦', color:'#C48412', soft:'#FFF2CC',
    meta:'8 題 · 約 4 分鐘', count:8, desc:'混合題型，真正考驗實力' },
  { id:3, name:'極限', tag:'高手', color:'#D9492A', soft:'#FFE3DB',
    meta:'8 題 · 約 5 分鐘', count:8, desc:'進階題目，挑戰更高星數' }
];

const LEVELS = [0, 300, 700, 1200, 1800, 2500, 3300, 4200, 5200, 6400, 7800, 9200, 10800];
const RANKS = ['見習探險家','見習探險家','島嶼嚮導','島嶼嚮導','數學船長','數學船長','傳說航海家','傳說航海家','群島守護者','群島守護者'];

const BADGES = [
  { id:'first',    name:'初次登島',   desc:'完成你嘅第一次冒險。',                 hint:'完成任何一個關卡',      color:'#16A394', icon:'flag',
    test:() => S.stats.runs >= 1 },
  { id:'perfect',  name:'完美通關',   desc:'一次冒險入面答啱晒所有題目。',         hint:'0 失誤完成一關',        color:'#E8A21E', icon:'star',
    test:() => S.stats.perfectRuns >= 1 },
  { id:'combo',    name:'連擊高手',   desc:'一口氣連續答啱 10 題。',               hint:'連擊達 10',            color:'#F2683F', icon:'bolt',
    test:() => S.stats.bestCombo >= 10 },
  { id:'speedy',   name:'閃電快手',   desc:'喺火山速算島攞到 3 星。',              hint:'火山速算 3 星',        color:'#E5432B', icon:'clock',
    test:() => bestStars('volcano') >= 3 },
  { id:'fraction', name:'分數大師',   desc:'喺分數叢林嘅極限難度攞到 3 星。',      hint:'分數叢林 · 極限 3 星', color:'#2E8B4F', icon:'leaf',
    test:() => S.islands.fraction.stars[3] >= 3 },
  { id:'geometry', name:'圖形之眼',   desc:'喺圖形海灣嘅極限難度攞到 3 星。',      hint:'圖形海灣 · 極限 3 星', color:'#147FA8', icon:'shapes',
    test:() => S.islands.geometry.stars[3] >= 3 },
  { id:'word',     name:'應用題偵探', desc:'喺應用題沙漠嘅極限難度攞到 3 星。',    hint:'應用題沙漠 · 極限 3 星',color:'#B87712', icon:'compass',
    test:() => S.islands.word.stars[3] >= 3 },
  { id:'algebra',  name:'方程忍者',   desc:'喺方程山洞嘅極限難度攞到 3 星。',      hint:'方程山洞 · 極限 3 星', color:'#5B3FC4', icon:'gem',
    test:() => S.islands.algebra.stars[3] >= 3 },
  { id:'data',     name:'數據分析師', desc:'喺數據燈塔嘅極限難度攞到 3 星。',      hint:'數據燈塔 · 極限 3 星', color:'#0B7A72', icon:'chart',
    test:() => S.islands.data.stars[3] >= 3 },
  { id:'mistakes', name:'錯題清零',   desc:'將 10 道錯題重新掌握。',               hint:'掌握 10 道錯題',       color:'#4FA85E', icon:'check',
    test:() => masteredCount() >= 10 },
  { id:'streak',   name:'七日探險家', desc:'連續七日登島練習。',                   hint:'連續 7 日',            color:'#F2683F', icon:'flame',
    test:() => S.player.streak >= 7 },
  { id:'hundred',  name:'百題勇士',   desc:'累計答對 100 道題目。',                 hint:'累計答對 100 題',      color:'#0A4E5C', icon:'book',
    test:() => S.stats.correct >= 100 },
  { id:'islands',  name:'群島之主',   desc:'六個島嶼都至少攞到 2 星。',            hint:'六島各 2 星',          color:'#C48412', icon:'crown',
    test:() => ISLANDS.every(i => bestStars(i.id) >= 2) },
  { id:'comeback', name:'逆轉勝',     desc:'失敗之後，喺同一關攞返 3 星。',        hint:'失敗後再攞 3 星',      color:'#7B5CF0', icon:'mountain',
    test:() => S.stats.comeback >= 1 }
];

/* compact icon library */
const ICONS = {
  island:'<path d="M3 18.5h18"/><path d="M5.2 18.5c1.3-4.8 4-7.2 6.8-7.2s5.5 2.4 6.8 7.2"/><path d="M12 11.3V5.5"/><path d="M12 6.4c2.5 0 4.2-1.3 4.2-3.2-2.5 0-4.2 1.3-4.2 3.2z"/><path d="M9.2 21h5.6"/>',
  flame:'<path d="M12 21c-3.8 0-6.2-2.6-6.2-5.9 0-2.8 1.7-4.9 3.2-6.5.9-1 1.4-2 1.5-3.3 2.3 1.3 3.5 3.5 3.5 5.5 1-.6 1.6-1.5 1.9-2.6 1.7 1.9 3 4.1 3 6.9 0 3.3-2.4 5.9-6.2 5.9z"/><path d="M12 21c-1.9 0-3.1-1.3-3.1-3 0-1.6 1-2.7 1.7-3.6.4-.5.8-1.1.9-1.9 1 .6 1.5 1.5 1.5 2.5.5-.3.8-.8 1-1.4 1 1 1.6 2.3 1.6 3.9 0 1.8-1.3 3.5-3.6 3.5z" opacity=".45"/>',
  map:'<path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5L3.5 20V6.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  book:'<path d="M5 4.5h9.5L19 9v10.5H5z"/><path d="M8.2 12h7.6M8.2 15.5h5"/>',
  medal:'<circle cx="12" cy="9" r="5.4"/><path d="m8.7 13.4-1.9 6.4 5.2-2.6 5.2 2.6-1.9-6.4"/><path d="m10.5 9 1.1 1.1 2.1-2.2"/>',
  chart:'<path d="M4 20V4.5M4 20h16"/><path d="M8 16v-4.5M12 16V8M16 16v-2.5"/>',
  star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1L3.2 9.4l6.1-.9z"/>',
  lock:'<rect x="5" y="10" width="14" height="10" rx="2.4"/><path d="M8 10V7.6a4 4 0 0 1 8 0V10"/>',
  check:'<path d="m4.8 12.6 4.5 4.5L19.4 6.8"/>',
  x:'<path d="m6 6 12 12M18 6 6 18"/>',
  arrow:'<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  play:'<path d="M8 5.2v13.6L19 12z" fill="currentColor" stroke="none"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.3l3.4 2"/>',
  bolt:'<path d="M13.2 2.8 5.4 13.4h5.3l-.9 7.8 7.8-10.6h-5.2l.8-7.8z"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  pencil:'<path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z"/><path d="m13.8 7.2 3 3"/>',
  sound:'<path d="M4 9.5v5h3.5l5 4v-13l-5 4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.8 6a8.5 8.5 0 0 1 0 12"/>',
  motion:'<path d="M3 12h4l2.5-6 4 12 2.5-6h5"/>',
  reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4M4.5 4v5.5H10"/>',
  shield:'<path d="M12 3.5 19 6v5.5c0 4.5-3 7.4-7 9-4-1.6-7-4.5-7-9V6l7-2.5z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  info:'<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5M12 8h.01"/>',
  backspace:'<path d="M9 5h10.5A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5H9L3 12l6-7z"/><path d="m11.5 9.5 5 5M16.5 9.5l-5 5"/>',
  target:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/>',
  sparkle:'<path d="m12 2.8 1.7 4.7 4.7 1.7-4.7 1.7-1.7 4.7-1.7-4.7L5.6 9.2l4.7-1.7z"/><path d="m18.4 15 .8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z"/>',
  trophy:'<path d="M8 4h8v5.5a4 4 0 0 1-8 0V4z"/><path d="M8 6H4.5v2.5A3.5 3.5 0 0 0 8 12M16 6h3.5v2.5A3.5 3.5 0 0 1 16 12M12 13.5V18M8.5 21h7"/>',
  user:'<circle cx="12" cy="8.4" r="3.4"/><path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6"/>',
  leaf:'<path d="M20 4C10.5 4 4.5 9.3 4.5 16c0 2.2 1.2 4 3 4 7 0 13-5.7 12.5-16z"/><path d="M6 19C9.2 13.4 13.5 9.2 17.8 7"/>',
  volcano:'<path d="M2.5 20.5h19L15.4 7.2h-1.8l-1.1 3.4H9.3L8.2 7.2H6.4L2.5 20.5z"/><path d="M9.3 10.6 8.2 5l3 1 1.9-2.2 1 4.3"/><path d="M11.8 16.5h.01M14.5 18.5h.01M9 18h.01" stroke-width="2.6"/>',
  shell:'<path d="M3.5 19c0-8.5 3.6-14 8.5-14s8.5 5.5 8.5 14"/><path d="M3.5 19h17M12 5v14M7.2 7.8 4.8 19M16.8 7.8 19.2 19"/>',
  cactus:'<path d="M9.4 21V7.4a2.6 2.6 0 0 1 5.2 0V21"/><path d="M9.4 14.5H7a2 2 0 0 1-2-2V9.8"/><path d="M14.6 11.5H17a2 2 0 0 0 2-2V7.4"/><path d="M7.5 21h9"/>',
  crystal:'<path d="m12 2.6 5.6 6.6L12 21.4 6.4 9.2 12 2.6z"/><path d="M6.4 9.2h11.2M9.6 9.2 12 21.4l2.4-12.2"/>',
  lighthouse:'<path d="M9.2 21h5.6l-1.1-12h-3.4L9.2 21z"/><path d="M8.6 5.2h6.8l-.8 3.8H9.4l-.8-3.8z"/><path d="M12 2.4v2.8M4.5 8.6l3 .8M19.5 8.6l-3 .8"/><path d="M9.6 14.5h4.8"/>',
  shapes:'<circle cx="7.5" cy="7.5" r="4.2"/><rect x="12.5" y="12.5" width="8" height="8" rx="1.4"/><path d="m6.5 21 3.3-6 3.3 6z"/>',
  compass:'<circle cx="12" cy="12" r="8.8"/><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4 5.4-2.2z"/>',
  gem:'<path d="m12 2.6 6.2 5.2L12 21.4 5.8 7.8 12 2.6z"/><path d="M5.8 7.8h12.4M9.2 7.8 12 21.4l2.8-13.6"/>',
  crown:'<path d="m3.8 8.2 4.4 3.2L12 5l3.8 6.4 4.4-3.2-1.6 11H5.4l-1.6-11z"/><path d="M5.8 19.5h12.4"/>',
  mountain:'<path d="m2.8 20 6.4-12 4.2 6.3 2.1-3.2 5.7 8.9H2.8z"/><path d="m7.4 12 1.8 1.8L11 12"/>',
  flag:'<path d="M5.5 21V3.5M5.5 4.5h12.4l-2.4 4 2.4 4H5.5"/>',
  chartbars:'<path d="M4 20V4.5M4 20h16"/><path d="M8 16v-4.5M12 16V8M16 16v-2.5"/>'
};

/* ---------- tiny utilities ---------- */
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const isoAt = (d, h = 10, m = 0) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x.toISOString(); };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const fmt = n => {
  const x = Number(n);
  if (!isFinite(x)) return '0';
  if (Number.isInteger(x)) return x.toLocaleString('en-US');
  return String(Math.round(x * 100) / 100);
};
const disp = n => n < 0 ? '−' + fmt(Math.abs(n)) : fmt(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const textOf = html => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const uid = p => p + '_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);

/* deterministic RNG (used by the screenshot / demo mode) */
let rng = Math.random;
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function seedRng(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) { h ^= String(str).charCodeAt(i); h = Math.imul(h, 16777619); }
  rng = mulberry32(h >>> 0);
}
const ri = (a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = arr => arr[Math.floor(rng() * arr.length)];
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const simplify = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const frac = (n, d) => {
  if (d === 1) return String(n);
  return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`;
};
const fracV = (n, d) => {
  if (d === 1) return String(n);
  return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`;
};

/* ---------- date helpers ---------- */
function todayKey() { return ymd(new Date()); }
function daysBetween(a, b) {
  if (!a || !b) return 99;
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((new Date(by, bm - 1, bd) - new Date(ay, am - 1, ad)) / 86400000);
}

/* ---------- state ---------- */
function makeMistake(seed) {
  return Object.assign({
    id: uid('m'), mastered: false, attempts: 1, createdAt: new Date().toISOString(),
    lastAt: new Date().toISOString(), masteredAt: null
  }, seed);
}

function seedState() {
  const now = new Date();
  const today = ymd(now);
  const days = {};
  const plan = [
    [0, 6], [-1, 12], [-2, 8], [-3, 0], [-4, 10], [-5, 14], [-6, 7]
  ];
  plan.forEach(([off, n]) => {
    const d = ymd(addDays(now, off));
    days[d] = { answered: n, correct: Math.max(0, n - (off === 0 ? 1 : Math.ceil(n * .12))), minutes: Math.round(n * .55) };
  });

  const qVol = { kind:'choice', island:'volcano', diff:3, kindLabel:'四則運算',
    prompt:'25 × 16 = ?', options:['350','400','450','300'], answerIndex:1,
    explain:'25 × 16 = 25 × (10 + 6) = 250 + 150 = <b>400</b>。',
    hint:'可以拆做 25 × 10 加 25 × 6。' };
  const qFrac = { kind:'choice', island:'fraction', diff:2, kindLabel:'分數',
    prompt:`比較 ${frac(3,5)} 同 ${frac(5,8)}，邊個較大？`, options:[frac(3,5), frac(5,8), '一樣大'], answerIndex:1, optionCols:3,
    explain:`交叉相乘：3 × 8 = 24，5 × 5 = 25。因為 25 > 24，所以 ${frac(5,8)} 較大。`,
    hint:'把兩個分數通分，或交叉相乘再比較。' };
  const qWord = { kind:'input', island:'word', diff:2, kindLabel:'應用題',
    prompt:'單車以每小時 12 公里行駛 45 分鐘，即係行咗多少公里？', answer:9, unit:'公里',
    explain:'45 分鐘 = 45/60 小時 = 0.75 小時。12 × 0.75 = <b>9</b> 公里。',
    hint:'先把 45 分鐘化做小時。' };
  const qGeo = { kind:'choice', island:'geometry', diff:2, kindLabel:'圖形與度量',
    prompt:'一個三角形底 12 cm、高 7 cm，面積是多少？', options:['42 cm²','84 cm²','19 cm²','38 cm²'], answerIndex:0,
    explain:'三角形面積 = 底 × 高 ÷ 2 = 12 × 7 ÷ 2 = <b>42 cm²</b>。',
    hint:'記得三角形面積要除 2。' };
  const qData = { kind:'input', island:'data', diff:2, kindLabel:'數據與概率',
    prompt:'四個數 4、7、9、10 的平均數是多少？', answer:7.5, unit:'',
    explain:'總和 = 4 + 7 + 9 + 10 = 30，平均數 = 30 ÷ 4 = <b>7.5</b>。',
    hint:'先把所有數字加起，再除以數量。' };

  return {
    version:1,
    player:{
      name:'阿澄', stage:'primary', xp:1540, streak:5, lastActive:today,
      createdAt: isoAt(addDays(now, -7)),
      avatarSeed: 3
    },
    islands:{
      volcano:{ stars:{1:3,2:2,3:0}, plays:4, bestCombo:12, failed:{} },
      fraction:{ stars:{1:3,2:2,3:1}, plays:5, bestCombo:9, failed:{3:true} },
      geometry:{ stars:{1:2,2:1,3:0}, plays:3, bestCombo:7, failed:{} },
      word:{ stars:{1:3,2:0,3:0}, plays:2, bestCombo:6, failed:{} },
      algebra:{ stars:{1:0,2:0,3:0}, plays:0, bestCombo:0, failed:{} },
      data:{ stars:{1:0,2:0,3:0}, plays:0, bestCombo:0, failed:{} }
    },
    stats:{ answered:148, correct:129, timeSec:1860, bestCombo:12, runs:9, perfectRuns:1, comeback:0, days },
    badges:{
      first: isoAt(addDays(now, -6), 16, 10),
      perfect: isoAt(addDays(now, -4), 19, 22),
      combo: isoAt(addDays(now, -3), 18, 5),
      speedy: isoAt(addDays(now, -2), 17, 40),
      hundred: isoAt(addDays(now, -1), 20, 12)
    },
    mistakes:[
      makeMistake({ q:qFrac, yourAnswer:'3/5', yourHTML:frac(3,5), correctHTML:frac(5,8), createdAt:isoAt(addDays(now, -1), 18, 20), lastAt:isoAt(addDays(now, -1), 18, 20) }),
      makeMistake({ q:qWord, yourAnswer:'6', yourHTML:'6 公里', correctHTML:'9 公里', createdAt:isoAt(addDays(now, -2), 17, 30), lastAt:isoAt(addDays(now, -2), 17, 30) }),
      makeMistake({ q:qGeo, yourAnswer:'84', yourHTML:'84 cm²', correctHTML:'42 cm²', createdAt:isoAt(addDays(now, -3), 16, 5), lastAt:isoAt(addDays(now, -3), 16, 5) }),
      makeMistake({ q:qVol, yourAnswer:'350', yourHTML:'350', correctHTML:'400', createdAt:isoAt(addDays(now, -4), 15, 50), lastAt:isoAt(addDays(now, -4), 15, 50) }),
      makeMistake({ q:qData, yourAnswer:'7', yourHTML:'7', correctHTML:'7.5', createdAt:isoAt(addDays(now, -5), 19, 10), lastAt:isoAt(addDays(now, -5), 19, 10) }),
      makeMistake({
        q:{ kind:'choice', island:'geometry', diff:1, kindLabel:'圖形與度量', prompt:'三角形底 8 cm、高 5 cm，面積是多少？', options:['40 cm²','20 cm²','13 cm²','26 cm²'], answerIndex:1, explain:'三角形面積 = 底 × 高 ÷ 2 = 8 × 5 ÷ 2 = <b>20 cm²</b>。', hint:'記得除以 2。' },
        yourAnswer:'40', yourHTML:'40 cm²', correctHTML:'20 cm²',
        createdAt:isoAt(addDays(now, -8), 17, 10), lastAt:isoAt(addDays(now, -6), 17, 10),
        mastered:true, masteredAt:isoAt(addDays(now, -5), 17, 10)
      }),
      makeMistake({
        q:{ kind:'choice', island:'fraction', diff:1, kindLabel:'分數', prompt:`30 嘅 ${frac(2,5)} 係幾多？`, options:['12','15','10','18'], answerIndex:0, explain:`30 ÷ 5 = 6，6 × 2 = <b>12</b>。`, hint:'先除分母，再乘分子。' },
        yourAnswer:'15', yourHTML:'15', correctHTML:'12',
        createdAt:isoAt(addDays(now, -9), 18, 20), lastAt:isoAt(addDays(now, -7), 18, 20),
        mastered:true, masteredAt:isoAt(addDays(now, -6), 18, 20)
      }),
      makeMistake({
        q:{ kind:'input', island:'algebra', diff:1, kindLabel:'代數', prompt:'搵出 ? 代表嘅數。', visual:'<div class="eqline">7 + <span class="unk">?</span> = 12</div>', answer:5, unit:'', explain:'兩邊同時減 7：? = 12 − 7 = <b>5</b>。', hint:'等式兩邊要同步。' },
        yourAnswer:'6', yourHTML:'6', correctHTML:'5',
        createdAt:isoAt(addDays(now, -10), 16, 40), lastAt:isoAt(addDays(now, -8), 16, 40),
        mastered:true, masteredAt:isoAt(addDays(now, -7), 16, 40)
      })
    ],
    daily:{ date:today, answered:6, correct:5, cleared:1, reviewed:0, claimed:false },
    settings:{ sound:true, motion:true }
  };
}

function blankState() {
  const now = new Date();
  return {
    version:1,
    player:{ name:'小探險家', stage:'primary', xp:0, streak:0, lastActive:'', createdAt: new Date().toISOString(), avatarSeed:1 },
    islands: Object.fromEntries(ISLANDS.map(i => [i.id, { stars:{1:0,2:0,3:0}, plays:0, bestCombo:0, failed:{} }])),
    stats:{ answered:0, correct:0, timeSec:0, bestCombo:0, runs:0, perfectRuns:0, comeback:0, days:{} },
    badges:{}, mistakes:[],
    daily:{ date:todayKey(), answered:0, correct:0, cleared:0, reviewed:0, claimed:false },
    settings:{ sound:true, motion:true }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && parsed.player && parsed.islands) return parsed;
    }
  } catch (e) { /* file:// may block storage — fall back to memory */ }
  return seedState();
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}
function resetProgress() {
  S = blankState();
  persist();
}

let S = loadState();

/* daily reset + broken streak repair */
(function normalizeState() {
  const t = todayKey();
  if (!S.daily || S.daily.date !== t) {
    S.daily = { date:t, answered:0, correct:0, cleared:0, reviewed:0, claimed:false };
  }
  if (S.player.lastActive && S.player.lastActive !== t && daysBetween(S.player.lastActive, t) > 1) {
    S.player.streak = 0;
  }
  ISLANDS.forEach(i => {
    if (!S.islands[i.id]) S.islands[i.id] = { stars:{1:0,2:0,3:0}, plays:0, bestCombo:0, failed:{} };
    if (!S.islands[i.id].stars) S.islands[i.id].stars = {1:0,2:0,3:0};
    if (!S.islands[i.id].failed) S.islands[i.id].failed = {};
  });
  if (!S.settings) S.settings = { sound:true, motion:true };
  if (!S.badges) S.badges = {};
  if (!S.mistakes) S.mistakes = [];
  if (!S.stats) S.stats = { answered:0, correct:0, timeSec:0, bestCombo:0, runs:0, perfectRuns:0, comeback:0, days:{} };
  if (!S.stats.days) S.stats.days = {};
  persist();
})();

/* ---------- derived values ---------- */
const getIsland = id => ISLANDS.find(i => i.id === id);
const getDiff = id => DIFFS.find(d => d.id === Number(id));
const bestStars = id => {
  const st = S.islands[id] ? S.islands[id].stars : {};
  return Math.max(st[1] || 0, st[2] || 0, st[3] || 0);
};
const starSum = id => {
  const st = S.islands[id] ? S.islands[id].stars : {};
  return (st[1] || 0) + (st[2] || 0) + (st[3] || 0);
};
const totalStars = () => ISLANDS.reduce((n, i) => n + starSum(i.id), 0);
const totalPlays = () => ISLANDS.reduce((n, i) => n + (S.islands[i.id].plays || 0), 0);
const masteredCount = () => (S.mistakes || []).filter(m => m.mastered).length;
const openMistakes = () => (S.mistakes || []).filter(m => !m.mastered);
const accuracy = () => S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0;
const isUnlocked = idx => idx === 0 || bestStars(ISLANDS[idx - 1].id) >= 1;
const nextLockedIndex = () => ISLANDS.findIndex((_, i) => !isUnlocked(i));
const levelInfo = xp => {
  let lv = 1;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lv = i + 1;
  const base = LEVELS[lv - 1] || 0;
  const next = LEVELS[lv] || (base + 1200);
  return { level:lv, base, next, pct: clamp((xp - base) / (next - base) * 100, 0, 100), rank: RANKS[Math.min(lv - 1, RANKS.length - 1)] };
};
const todayLabel = () => {
  const d = new Date();
  const wd = '日一二三四五六'[d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${wd}`;
};
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return '早晨';
  if (h < 18) return '午安';
  return '夜晚';
};
const questState = () => {
  const d = S.daily || {};
  return {
    answered: Math.min(d.answered || 0, 10),
    cleared: Math.min(d.cleared || 0, 1),
    reviewed: Math.min(d.reviewed || 0, 2),
    done: (d.answered || 0) >= 10 && (d.cleared || 0) >= 1 && (d.reviewed || 0) >= 2,
    count: ((d.answered || 0) >= 10 ? 1 : 0) + ((d.cleared || 0) >= 1 ? 1 : 0) + ((d.reviewed || 0) >= 2 ? 1 : 0)
  };
};

/* ---------- SVG helpers ---------- */
function icon(name, size = 20, sw = 1.9) {
  return `<svg class="svg-i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;
}
function starHtml(on, size = 13) {
  return `<svg class="star ${on ? 'on' : 'off'}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4L2.8 9.5l6.4-.9z"/></svg>`;
}
function starsHtml(n, size = 13) {
  n = Number(n) || 0;
  return `<span class="stars">${starHtml(n >= 1, size)}${starHtml(n >= 2, size)}${starHtml(n >= 3, size)}</span>`;
}
function medalHtml(badge, cls = '') {
  const earned = !!S.badges[badge.id];
  const paths = ICONS[badge.icon] || ICONS.star;
  return `<span class="medal ${earned ? '' : 'locked'} ${cls}" style="--bc:${badge.color}" aria-hidden="true">
    <svg viewBox="0 0 100 100">
      <path class="m-ribbon" d="M32 61 21 94l29-13 29 13-11-33" opacity=".82"/>
      <circle class="m-coin" cx="50" cy="46" r="33"/>
      <circle cx="50" cy="46" r="26.5" fill="none" stroke="rgba(255,248,232,.5)" stroke-width="2.6" stroke-dasharray="2 4"/>
      <circle class="m-coin-in" cx="50" cy="46" r="22.5"/>
      <g class="m-icon" transform="translate(31 27) scale(1.58)" style="stroke-width:2.3">${paths}</g>
    </svg>
  </span>`;
}
function islandIcon(id, size = 40) {
  const island = getIsland(id);
  return `<svg class="node-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[island ? island.icon : 'island']}</svg>`;
}

/* mascot: 阿龜 the sea turtle */
function mascot(mood = 'happy', cls = '') {
  const faces = {
    happy: `<circle cx="120.5" cy="75.5" r="2.8" fill="#13343B"/><circle cx="133.5" cy="75.5" r="2.8" fill="#13343B"/><path d="M123.5 84c2.5 2.3 5.8 2.3 8.3 0" fill="none" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><circle cx="112.5" cy="82.5" r="4.2" fill="#FF9E8A" opacity=".55"/>`,
    cheer: `<path d="M116.5 75.5c1.9-2.5 4.4-2.5 6.2 0M130.5 75.5c1.9-2.5 4.4-2.5 6.2 0" fill="none" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><path d="M122 82c2.6 5 8.4 5 11 0z" fill="#FF8FA3" stroke="#13343B" stroke-width="1.7" stroke-linejoin="round"/><circle cx="112" cy="81" r="4.5" fill="#FF9E8A" opacity=".65"/><circle cx="141" cy="81" r="3.6" fill="#FF9E8A" opacity=".55"/>`,
    oops: `<circle cx="120.5" cy="76" r="2.7" fill="#13343B"/><circle cx="133.5" cy="76" r="2.7" fill="#13343B"/><path d="M124 88c2.4-2.4 5.6-2.4 8 0" fill="none" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><path d="M144 70c3.2 3.2 4 6.2 2.2 8.2-2 .6-4.2-1.5-4.2-4.2 0-1.6.8-3 2-4z" fill="#8DD7EA" stroke="#147FA8" stroke-width="1.4"/>`,
    think: `<circle cx="120.5" cy="76" r="2.7" fill="#13343B"/><path d="M130.5 76h5" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><path d="M124 87h7" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><path d="M145 51c0-4 5.4-4.6 5.4-.8 0 2.4-3 2.6-3 5" fill="none" stroke="#FFC24B" stroke-width="2.6" stroke-linecap="round"/><circle cx="147.4" cy="59" r="1.6" fill="#FFC24B"/>`,
    sleep: `<path d="M116.5 77c2-2 4.4-2 6.2 0M130.5 77c2-2 4.4-2 6.2 0" fill="none" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/><path d="M124 87c2.4 1.4 5.6 1.4 8 0" fill="none" stroke="#13343B" stroke-width="2.2" stroke-linecap="round"/>`
  };
  const extras = {
    cheer: `<g color="#FFC24B"><path d="m26 42 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z" fill="currentColor"/><path d="m143 23 1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="currentColor" opacity=".8"/></g>`,
    oops: `<g opacity=".9"><path d="M31 30c5 0 8 4 8 8" fill="none" stroke="#FFD98A" stroke-width="2.5" stroke-linecap="round"/></g>`,
    think: '', happy: '', sleep: `<g fill="none" stroke="#FFD98A" stroke-width="2" stroke-linecap="round"><path d="M124 44h7l-7 7h7"/><path d="M137 35h5l-5 5h5"/></g>`
  };
  return `<svg class="mascot ${cls}" viewBox="0 0 160 152" fill="none" aria-hidden="true">
    <ellipse cx="80" cy="143" rx="47" ry="7" fill="rgba(4,42,51,.16)"/>
    <path d="M33 93c-9 3-14 12-10 19 9-1 17-7 22-14z" fill="#7CCBB1" stroke="#073B47" stroke-width="3" stroke-linejoin="round"/>
    <path d="M110 117c5 11 16 15 24 9-2-8-8-14-16-16z" fill="#7CCBB1" stroke="#073B47" stroke-width="3" stroke-linejoin="round"/>
    <path d="M44 64c0-19 14-30 30-30s30 11 30 30" fill="#7CCBB1" opacity=".8"/>
    <ellipse cx="74" cy="91" rx="48" ry="39" fill="#16A394" stroke="#073B47" stroke-width="3.4"/>
    <ellipse cx="74" cy="91" rx="48" ry="39" fill="none" stroke="#FFD98A" stroke-width="4"/>
    <ellipse cx="74" cy="91" rx="40" ry="31" fill="none" stroke="#0B7A72" stroke-width="2" opacity=".5"/>
    <path d="M74 56v70M35 78c14 9 64 9 78 0M42 114c11-8 52-8 64 0" stroke="#FFE9B8" stroke-width="2" stroke-linecap="round" opacity=".45"/>
    <circle cx="59" cy="72" r="3.4" fill="#FFE9B8" opacity=".55"/><circle cx="92" cy="105" r="2.6" fill="#FFE9B8" opacity=".45"/><circle cx="48" cy="101" r="2" fill="#FFE9B8" opacity=".4"/>
    <circle cx="124" cy="78" r="21" fill="#A9E0C9" stroke="#073B47" stroke-width="3.2"/>
    <path d="M105 64c9-8 29-8 38 0l-2.5 8c-9-6-23-6-32 0z" fill="#FF6B4A" stroke="#073B47" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M141 65c6 1 10 4 11 9-5 0-9-2-12-5z" fill="#FF6B4A" stroke="#073B47" stroke-width="2.2" stroke-linejoin="round"/>
    ${faces[mood] || faces.happy}
    <path d="M99 122c4 5 11 5 15 0" fill="none" stroke="#073B47" stroke-width="2.8" stroke-linecap="round" opacity=".28"/>
    ${extras[mood] || ''}
  </svg>`;
}

/* map scenery */
function mapScenery() {
  return `
  <svg class="map-compass" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
    <circle cx="30" cy="30" r="17"/>
    <circle cx="30" cy="30" r="23" stroke-dasharray="1 5"/>
    <path d="M30 11v38M11 30h38" opacity=".5"/>
    <path d="m30 14 5 14-5 3-5-3z" fill="#FF6B4A" stroke="none"/>
    <path d="m30 46-5-14 5-3 5 3z" fill="#FFF8E8" stroke="none"/>
    <circle cx="30" cy="30" r="3" fill="#13343B" stroke="none"/>
  </svg>
  <svg class="map-island-deco" style="right:26px;top:104px;width:44px" viewBox="0 0 60 40" fill="none" aria-hidden="true">
    <path d="M10 30c-4 0-6-3-6-6s3-5 6-4c1-5 9-7 12-2 5-3 11 0 11 5 5 0 7 4 6 7H10z" fill="#FFFDF6" opacity=".8"/>
  </svg>
  <svg class="map-island-deco" style="left:16px;top:150px;width:34px" viewBox="0 0 40 24" fill="none" stroke="#13343B" stroke-width="1.6" stroke-linecap="round" opacity=".28" aria-hidden="true">
    <path d="M4 16c4-6 9-6 13 0M18 12c3-4 7-4 10 0"/>
  </svg>
  <svg class="map-island-deco" style="left:18px;bottom:54px;width:40px;opacity:.5" viewBox="0 0 48 34" fill="none" aria-hidden="true">
    <path d="M6 28c2-7 6-11 10-11s8 4 10 11" stroke="#2E8B4F" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 27V13M16 15c-4 0-7-2-7-5 4 0 7 2 7 5zM16 15c4 0 7-2 7-5-4 0-7 2-7 5z" stroke="#2E8B4F" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M4 29h40" stroke="#C9B07A" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}
