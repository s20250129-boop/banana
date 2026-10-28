/* =========================================================
   UI, run engine & screens
   ========================================================= */
const REVIEW_META = {
  id:'review', name:'錯題特訓', short:'錯題特訓', topic:'針對練習',
  c1:'#FF9A6A', c2:'#D9492A', accent:'#FFE08A', icon:'target',
  tagline:'向答錯過嘅題目，再挑戰一次。',
  desc:'逐題重練，答啱就自動標記為「已掌握」。'
};

const UI = {
  view:'home', tab:'home',
  overlay:null,
  run:null, result:null,
  filter:'all', openMistake:null,
  timerId:null, toastTimer:null, demo:false,
  wasPaused:false
};

const fmtDate = iso => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};
const timeText = sec => {
  if (sec < 60) return `${Math.max(1, Math.round(sec))} 秒`;
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return s ? `${m} 分 ${s} 秒` : `${m} 分鐘`;
};
const jsonClone = o => JSON.parse(JSON.stringify(o));

/* ---------- badge / progress mutations ---------- */
function checkBadges() {
  const newly = [];
  BADGES.forEach(b => {
    if (!S.badges[b.id] && b.test()) {
      S.badges[b.id] = new Date().toISOString();
      newly.push(b);
    }
  });
  return newly;
}

function recordMistake(q, value, timedOut) {
  const yourHTML = value === null || value === undefined
    ? '未作答'
    : q.kind === 'choice'
      ? (q.options[value] ?? '未作答')
      : unitStr(Number(value), q.unit);
  const correctHTML = q.kind === 'choice' ? q.options[q.answerIndex] : unitStr(q.answer, q.unit);
  const existing = S.mistakes.find(m => !m.mastered && m.q && textOf(m.q.prompt) === textOf(q.prompt) && m.q.island === q.island);
  if (existing) {
    existing.attempts = (existing.attempts || 1) + 1;
    existing.lastAt = new Date().toISOString();
    existing.yourHTML = yourHTML;
    existing.yourAnswer = textOf(yourHTML);
    return;
  }
  S.mistakes.unshift({
    id: uid('m'),
    q: jsonClone(q),
    yourAnswer: textOf(yourHTML),
    yourHTML,
    correctHTML,
    createdAt: new Date().toISOString(),
    lastAt: new Date().toISOString(),
    mastered: false,
    masteredAt: null,
    attempts: 1
  });
  if (S.mistakes.length > 80) S.mistakes.length = 80;
}

function markMastered(id) {
  const m = S.mistakes.find(x => x.id === id);
  if (!m) return;
  m.mastered = true;
  m.masteredAt = new Date().toISOString();
  const newly = checkBadges();
  persist();
  render({ keepScroll:true });
  sfx('star');
  toast(newly.length ? '徽章解鎖：' + newly.map(b => b.name).join('、') : '已標記為掌握，繼續保持！');
}

/* ---------- timer ---------- */
function updateTimerDom(left) {
  const run = UI.run;
  if (!run || !run.q) return;
  const total = run.q.timer || 1;
  const fill = $('#timerFill'), num = $('#timerNum'), wrap = $('#timerWrap');
  if (fill) fill.style.width = clamp(left / total * 100, 0, 100) + '%';
  if (num) num.textContent = Math.max(0, Math.ceil(left)) + 's';
  if (wrap) wrap.classList.toggle('warn', left <= 4.2);
}
function stopTimer() {
  if (UI.timerId) { clearInterval(UI.timerId); UI.timerId = null; }
  const run = UI.run;
  if (run && run.timerEnd) {
    run.timeLeft = Math.max(0, (run.timerEnd - Date.now()) / 1000);
    run.timerEnd = null;
  }
}
function startTimer() {
  stopTimer();
  const run = UI.run;
  if (!run || !run.q || !run.q.timer || run.feedback) return;
  if (run.timeLeft == null) run.timeLeft = run.q.timer;
  run.timerEnd = Date.now() + run.timeLeft * 1000;
  UI.timerId = setInterval(() => {
    if (!UI.run || UI.run !== run || !run.timerEnd) return;
    const left = Math.max(0, (run.timerEnd - Date.now()) / 1000);
    run.timeLeft = left;
    updateTimerDom(left);
    if (left <= 0) {
      stopTimer();
      submitAnswer(null, true);
    }
  }, 100);
  updateTimerDom(run.timeLeft);
}

/* ---------- sound ---------- */
let audioCtx = null;
let soundUnlocked = false;
document.addEventListener('pointerdown', () => { soundUnlocked = true; }, { once:true });
document.addEventListener('keydown', () => { soundUnlocked = true; }, { once:true });
function sfx(type) {
  if (!S.settings.sound || !soundUnlocked) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const notes = type === 'correct' ? [523.25, 783.99]
      : type === 'wrong' ? [196, 155]
        : type === 'star' ? [523.25, 659.25, 783.99, 1046.5]
          : type === 'level' ? [392, 523.25, 659.25, 783.99]
            : [660];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type === 'wrong' ? 'triangle' : 'sine';
      o.frequency.value = f;
      const t = now + i * (type === 'star' ? 0.09 : 0.1);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(type === 'wrong' ? .055 : .04, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + (type === 'wrong' ? .24 : .28));
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + .3);
    });
  } catch (e) { /* audio is a bonus, never block the game */ }
}

function toast(msg) {
  const root = $('#toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 260); }, 2500);
}

function confetti(n = 34) {
  const root = $('#fx-root');
  if (!root) return;
  const colors = ['#FFC24B', '#FF6B4A', '#16A394', '#FFE08A', '#7B5CF0', '#4FA85E'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.style.left = (Math.random() * 100) + '%';
    s.style.background = colors[i % colors.length];
    s.style.setProperty('--dur', (1.8 + Math.random() * 1.8) + 's');
    s.style.setProperty('--delay', (Math.random() * .45) + 's');
    s.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    s.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
    if (i % 4 === 0) { s.style.width = '5px'; s.style.height = '14px'; }
    root.appendChild(s);
    setTimeout(() => s.remove(), 4200);
  }
}

/* =========================================================
   Reusable components
   ========================================================= */
function topbarHTML() {
  return `<header class="topbar">
    <div class="brand">
      <span class="brand-mark">${icon('island', 25)}</span>
      <span class="brand-name">數字冒險島<em>NUMBER ISLAND</em></span>
    </div>
    <div class="top-actions">
      <span class="streak-pill" title="連續冒險日數">${icon('flame', 14)}<b>${S.player.streak}</b>日</span>
      <button class="avatar" data-act="tab" data-tab="progress" aria-label="開啟個人進度">${esc(S.player.name.slice(0, 1))}</button>
    </div>
  </header>`;
}

function tabbarHTML(active) {
  const items = [['home', '地圖', 'map'], ['mistakes', '錯題', 'book'], ['badges', '徽章', 'medal'], ['progress', '進度', 'chart']];
  const open = openMistakes().length;
  return `<nav class="tabbar" aria-label="主要導航">${items.map(([id, label, ic]) => `
    <button class="tab ${active === id ? 'active' : ''}" data-act="tab" data-tab="${id}" ${active === id ? 'aria-current="page"' : ''}>
      ${icon(ic, 21)}
      <span>${label}</span>
      ${id === 'mistakes' && open ? `<span class="badge-dot">${open}</span>` : ''}
    </button>`).join('')}</nav>`;
}

function heroHTML() {
  const li = levelInfo(S.player.xp);
  const name = esc(S.player.name);
  return `<section class="hero">
    <div class="hero-sun" aria-hidden="true"></div>
    <svg class="hero-waves" viewBox="0 0 390 72" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 44c42-16 78 8 122 4 40-4 58-18 98-16 52 3 72 20 170 4v36H0z" fill="#0A4E5C" opacity=".55"/>
      <path d="M0 58c46-12 76 6 118 3 36-3 64-14 102-10 52 6 76 15 170 2v19H0z" fill="#06343E" opacity=".55"/>
    </svg>
    <div class="hero-copy">
      <p class="hero-date">${todayLabel()} · 第 ${S.player.streak} 日冒險</p>
      <h1 class="hero-title">${greeting()}，${name}！<br>今日去邊個<span>島</span>？</h1>
      <div class="hero-level">
        <span class="lvl-chip">Lv.${li.level}</span>
        <div class="lvl-info">
          <b>${li.rank} · ${fmt(S.player.xp)} XP</b>
          <div class="lvl-bar"><i style="width:${li.pct}%"></i></div>
        </div>
      </div>
    </div>
    <div class="hero-sticker">出發啦！</div>
    <div class="hero-mascot">${mascot('happy')}</div>
  </section>`;
}

function questsHTML() {
  const q = questState();
  const item = (ic, label, val, target, done) => `
    <div class="quest ${done ? 'done' : ''}">
      ${done ? `<span class="quest-done-mark">${icon('check', 8)}</span>` : ''}
      <span class="quest-ico">${icon(ic, 14)}</span>
      <div class="quest-label">${label}</div>
      <div class="quest-bar"><i style="width:${clamp(val / target * 100, 0, 100)}%"></i></div>
      <div class="quest-num">${Math.min(val, target)} / ${target}</div>
    </div>`;
  return `<section class="quests">
    <div class="quest-head">
      <span class="quest-title">今日任務</span>
      <span class="quest-reward">${icon('sparkle', 10)} +50 XP</span>
      <span class="quest-count">${q.count} / 3</span>
    </div>
    <div class="quest-grid">
      ${item('book', '答 10 題', q.answered, 10, q.answered >= 10)}
      ${item('flag', '完成 1 關', q.cleared, 1, q.cleared >= 1)}
      ${item('refresh', '重溫 2 題', q.reviewed, 2, q.reviewed >= 2)}
    </div>
  </section>`;
}

const NODE_POS = [[28, 66], [72, 200], [26, 334], [74, 468], [28, 602], [71, 736]];
const nextIslandIndex = () => ISLANDS.findIndex((is, i) => isUnlocked(i) && bestStars(is.id) === 0);

function nodeHTML(island, i) {
  const pos = NODE_POS[i];
  const locked = !isUnlocked(i);
  const best = bestStars(island.id);
  const isNext = !locked && i === nextIslandIndex();
  return `<button class="node ${locked ? 'is-locked' : ''} ${isNext ? 'is-next' : ''}"
    style="left:${pos[0]}%;top:${pos[1]}px;--c1:${island.c1};--c2:${island.c2}"
    data-act="island" data-id="${island.id}" aria-label="${island.name}，${locked ? '未解鎖' : best + ' 星'}" ${locked ? 'aria-disabled="true"' : ''}>
    ${isNext ? '<span class="node-here">你喺度</span>' : ''}
    <span class="node-circle">
      <span class="node-no">0${i + 1}</span>
      ${locked ? icon('lock', 27) : islandIcon(island.id, 40)}
    </span>
    <span class="node-name">${island.name}</span>
    <span class="node-foot">
      ${locked ? `<span class="node-lock">${icon('lock', 9)} 未解鎖</span>` : starsHtml(best, 11)}
    </span>
  </button>`;
}

function mapHTML() {
  return `<div class="map-head">
      <h2>冒險地圖<span>6 個島嶼</span></h2>
      <span class="map-legend">${icon('medal', 11)} ${Object.keys(S.badges).length} / ${BADGES.length} 徽章</span>
    </div>
    <div class="map-wrap">
      <div class="map-card">
        ${mapScenery()}
        <svg class="map-path" viewBox="0 0 362 836" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M101 108C168 126 208 198 261 242S128 332 94 376S226 464 268 510S142 598 101 644S214 736 257 778"
            stroke="#C9B07A" stroke-width="2.4" stroke-dasharray="1 9" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".62"/>
        </svg>
        <div class="map-nodes">${ISLANDS.map(nodeHTML).join('')}</div>
      </div>
    </div>
    <div class="map-foot">${icon('info', 12)} 完成上一個島嶼任何關卡，即可解鎖下一個島。更多島嶼開發中。</div>`;
}

function homeView() {
  return `${topbarHTML()}
    <div class="scroll">${heroHTML()}${questsHTML()}${mapHTML()}</div>
    ${tabbarHTML('home')}`;
}

/* =========================================================
   Island sheet
   ========================================================= */
function sheetHTML(id) {
  const island = getIsland(id);
  if (!island) return '';
  const total = starSum(id);
  return `<section class="sheet" role="dialog" aria-modal="true" aria-label="${island.name}">
    <div class="sheet-hero" style="--c1:${island.c1};--c2:${island.c2}">
      <button class="sheet-close" data-act="close" aria-label="關閉">${icon('x', 15)}</button>
      <div class="sheet-head">
        <span class="sheet-ico">${islandIcon(id, 34)}</span>
        <div>
          <h2>${island.name}</h2>
          <p>${island.tagline}</p>
          <div class="sheet-starline">${starsHtml(bestStars(id), 11)} 已收集 ${total} / 9 粒星</div>
        </div>
      </div>
    </div>
    <div class="sheet-body">
      <div class="sheet-hint">${icon('target', 12)} 難度越深，題目越豐富，最多可攞 3 星</div>
      ${DIFFS.map(d => {
        const best = S.islands[id].stars[d.id] || 0;
        return `<button class="diff" data-act="start" data-island="${id}" data-diff="${d.id}" style="--dc:${d.color};--ds:${d.soft}">
          <div class="diff-main">
            <div class="diff-name">${d.name}<span class="diff-badge">${d.tag}</span></div>
            <div class="diff-meta">${d.meta} · ${d.desc}</div>
            <div class="diff-stars">${starsHtml(best, 11)}<em>最佳 ${best} 星</em></div>
          </div>
          <span class="diff-play">${icon('play', 17)}</span>
        </button>`;
      }).join('')}
      <div class="sheet-note">${icon('info', 12)} ${island.desc}</div>
      <div class="sheet-note">${icon('book', 12)} 答錯嘅題目會自動收入錯題簿，可以隨時重練。</div>
    </div>
  </section>`;
}

function badgeModalHTML(id) {
  const b = BADGES.find(x => x.id === id);
  if (!b) return '';
  const earned = S.badges[id];
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="${b.name}">
    ${medalHtml(b)}
    <h3>${b.name}</h3>
    <p>${b.desc}</p>
    <div class="badge-cond"><b>解鎖條件</b><br>${b.hint}</div>
    <div style="font-size:10px;font-weight:800;color:${earned ? 'var(--leaf-dark)' : 'var(--ink-3)'};margin-bottom:15px">
      ${earned ? '已於 ' + fmtDate(earned) + ' 獲得' : '仲未解鎖，繼續探險啦！'}
    </div>
    <div class="modal-actions"><button class="btn primary" data-act="close">繼續探險</button></div>
  </div>`;
}

function nameModalHTML() {
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="更改名字">
    <h3>你叫咩名？</h3>
    <p>呢個名會顯示喺地圖同進度頁，唔會上傳。</p>
    <input class="name-input" id="nameInput" maxlength="10" value="${esc(S.player.name)}" aria-label="探險家名字" autocomplete="off">
    <div class="modal-actions">
      <button class="btn secondary" data-act="close">取消</button>
      <button class="btn primary" data-act="save-name">儲存</button>
    </div>
  </div>`;
}

function quitModalHTML() {
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="放棄冒險">
    <h3>放棄今次冒險？</h3>
    <p>已經答過嘅題目會照樣記錄，但今次關卡唔會完成，亦唔會計星。</p>
    <div class="modal-actions">
      <button class="btn secondary" data-act="close">繼續玩</button>
      <button class="btn primary" data-act="confirm-quit">放棄</button>
    </div>
  </div>`;
}

function resetModalHTML() {
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="重設進度">
    <h3>重設所有進度？</h3>
    <p>等級、星數、徽章同錯題簿都會清空，<b>無法復原</b>。試玩完想重新開始，先用呢個。</p>
    <div class="modal-actions">
      <button class="btn secondary" data-act="close">取消</button>
      <button class="btn primary" data-act="confirm-reset">重設</button>
    </div>
  </div>`;
}

function renderOverlay() {
  const root = $('#overlay-root');
  if (!root) return;
  if (!UI.overlay) { root.innerHTML = ''; return; }
  const o = UI.overlay;
  let inner = '';
  let cls = 'overlay';
  if (o.type === 'island') {
    inner = sheetHTML(o.id);
  } else if (o.type === 'badge') {
    cls = 'overlay center'; inner = badgeModalHTML(o.id);
  } else if (o.type === 'name') {
    cls = 'overlay center'; inner = nameModalHTML();
  } else if (o.type === 'quit') {
    cls = 'overlay center'; inner = quitModalHTML();
  } else if (o.type === 'reset') {
    cls = 'overlay center'; inner = resetModalHTML();
  }
  root.innerHTML = `<div class="${cls}" data-act="backdrop">${inner}</div>`;
  if (o.type === 'name') {
    setTimeout(() => { const inp = $('#nameInput'); if (inp) { inp.focus(); inp.select(); } }, 60);
  }
}

/* =========================================================
   Play screen
   ========================================================= */
function runIslandMeta(run) {
  return run.mode === 'review' ? REVIEW_META : getIsland(run.islandId);
}

function optionClass(q, i, fb) {
  if (!fb) return '';
  const chosen = fb.value === i;
  if (q.answerIndex === i) return 'correct';
  if (chosen) return 'wrong';
  return 'dim';
}

function playHTML() {
  const run = UI.run;
  if (!run) return '';
  const island = runIslandMeta(run);
  const q = run.q;
  const fb = run.feedback;
  const diff = run.mode === 'review' ? { name:'錯題重練' } : getDiff(run.diff);
  const last = run.index >= run.questions.length - 1 || run.hearts <= 0;
  const progress = run.questions.map((_, i) => {
    const r = run.results[i];
    return `<div class="seg ${r === 'ok' ? 'ok' : r === 'miss' ? 'miss' : i === run.index ? 'cur' : ''}"><i></i></div>`;
  }).join('');

  const options = q.kind === 'choice' ? `<div class="options ${q.optionCols === 3 ? 'cols-3' : ''}">
    ${q.options.map((o, i) => `<button class="opt ${optionClass(q, i, fb)} ${String(o).length <= 3 ? 'center' : ''}" data-act="answer" data-index="${i}" ${fb ? 'disabled' : ''}>
      <span class="opt-key">${'ABCD'[i]}</span>
      <span class="opt-body">${o}</span>
    </button>`).join('')}
  </div>` : '';

  let inputArea = '';
  if (q.kind === 'input') {
    const shown = fb ? (fb.value === null || fb.value === undefined ? '未作答' : String(fb.value).replace('-', '−')) : (run.input || '');
    const hasInput = !!run.input;
    inputArea = `
      <div class="answer-display">
        ${shown ? `<span class="answer-value">${esc(shown)}</span>` : `<span class="answer-value placeholder">輸入答案</span>`}
        ${q.unit ? `<span class="answer-unit">${q.unit === '元' ? '元' : q.unit}</span>` : ''}
        ${!fb ? `<button class="answer-del" data-act="key" data-key="del" aria-label="刪除最後一個字">${icon('backspace', 17)}</button>` : ''}
      </div>
      ${!fb ? `<div class="keypad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-act="key" data-key="${n}">${n}</button>`).join('')}
        <button class="key" data-act="key" data-key="sign" aria-label="正負號">±</button>
        <button class="key" data-act="key" data-key="0">0</button>
        <button class="key" data-act="key" data-key="dot">.</button>
      </div>
      <button class="keypad-submit" data-act="submit" ${hasInput ? '' : 'disabled'}>確認答案 ${icon('arrow', 15)}</button>` : ''}
      ${!fb && q.hint ? `<button class="hint-btn" data-act="hint">${icon('bulb', 13)} ${run.hint ? '收起提示' : '需要提示？'}</button>` : ''}
      ${!fb && run.hint && q.hint ? `<div class="hint-box">${q.hint}</div>` : ''}
    `;
  }

  let feedback = '';
  if (fb) {
    const title = fb.ok ? '答啱喇！' : fb.timeout ? '時間到！' : '差少少。';
    const gain = fb.ok ? (10 + Math.min(run.combo, 6) * 2) : 0;
    feedback = `<div class="feedback ${fb.ok ? 'ok' : 'bad'}">
      <div class="fb-head">
        <span class="fb-ico">${icon(fb.ok ? 'check' : 'x', 14)}</span>
        ${title}
        ${fb.ok && gain ? `<small>+${gain} XP</small>` : ''}
      </div>
      <div class="fb-explain">
        ${!fb.ok ? `<div style="margin-bottom:5px">正確答案：<b>${fb.answerHTML}</b></div>` : ''}
        ${q.explain}
      </div>
      <button class="fb-btn" data-act="next">${last ? '完成冒險' : '繼續'} ${icon('arrow', 15)}</button>
    </div>`;
  }

  const promptClass = q.center ? 'center' : (q.island === 'word' || textOf(q.prompt).length > 32) ? 'word' : '';
  return `<div class="play ${q.kind === 'input' ? 'input-mode' : ''}" style="--c1:${island.c1}">
    <div class="play-doodle" style="right:18px;top:43%;font-size:150px" aria-hidden="true">×</div>
    <div class="play-doodle" style="left:18px;bottom:172px;font-size:96px" aria-hidden="true">÷</div>
    <header class="play-top">
      <button class="icon-btn" data-act="quit" aria-label="返回地圖">${icon('x', 18)}</button>
      <div class="play-title"><span class="dot"></span>${run.mode === 'review' ? '錯題特訓' : island.short}<em>${diff.name}</em></div>
      <div class="hearts" aria-label="剩餘生命 ${run.hearts}">${[0, 1, 2, 3].map(i => `<svg class="heart ${i >= run.hearts ? 'lost' : ''}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21c-.6 0-1.1-.2-1.6-.6C5.7 16.7 3 14 3 10.2 3 7.3 5.2 5 8.1 5c1.6 0 3.1.7 3.9 1.9C12.8 5.7 14.3 5 15.9 5 18.8 5 21 7.3 21 10.2c0 3.8-2.7 6.5-7.4 10.2-.5.4-1 .6-1.6.6z"/></svg>`).join('')}</div>
    </header>
    <div class="seg-row" aria-hidden="true">${progress}</div>
    ${q.timer ? `<div class="timer ${((run.timeLeft ?? q.timer) <= 4) ? 'warn' : ''}" id="timerWrap"><div class="timer-track"><div class="timer-fill" id="timerFill" style="width:${clamp((run.timeLeft ?? q.timer) / q.timer * 100, 0, 100)}%"></div></div><span class="timer-num" id="timerNum">${Math.max(0, Math.ceil(run.timeLeft ?? q.timer))}s</span></div>` : ''}
    <div class="play-meta">
      <span class="qcount">第 ${run.index + 1} / ${run.questions.length} 題${run.mode === 'review' ? ' · 答啱即掌握' : ''}</span>
      <span class="combo ${run.combo >= 2 ? 'on' : ''}">${icon('flame', 11)} 連擊 ×${run.combo}</span>
    </div>
    <div class="play-scroll">
      <section class="q-card">
        <div class="q-eyebrow"><b>${run.mode === 'review' ? '錯題重練' : island.topic}</b> · ${diff.name}</div>
        <h2 class="q-prompt ${promptClass}">${q.prompt}</h2>
        ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ''}
        ${options}
        ${inputArea}
        ${feedback}
      </section>
      <div class="play-buddy">
        ${mascot(fb ? (fb.ok ? 'cheer' : 'oops') : 'think')}
        <div class="buddy-bubble">${buddyText(run)}</div>
      </div>
    </div>
    <div class="play-foot">${icon('bulb', 12)} ${playTip(run)}</div>
  </div>`;
}

function buddyText(run) {
  if (run.feedback) return run.feedback.ok ? '答得啱！保持呢個節奏。' : '唔緊要，錯咗先知道邊度要練。';
  if (run.mode === 'review') return '慢慢嚟，答啱就會自動掌握。';
  if (run.islandId === 'volcano') return '深呼吸，計清楚先撳。';
  if (run.islandId === 'fraction') return '慢慢計，唔使同人鬥快。';
  if (run.islandId === 'geometry') return '圖入面嘅數字，就係線索。';
  if (run.islandId === 'algebra') return '一步一步拆開，唔難嘅。';
  return '睇清楚先撳，你可以嘅。';
}

function playTip(run) {
  if (run.mode === 'review') return '答啱就會自動標記為「已掌握」，答錯可以再試。';
  if (run.islandId === 'volcano') return '快手之餘，記得先乘除、後加減。';
  if (run.islandId === 'fraction') return '分母唔同，先通分再計；答案記得化簡。';
  if (run.islandId === 'geometry') return '可以喺草稿紙畫一畫，圖形會清楚好多。';
  if (run.islandId === 'word') return '慢慢讀一次題目，搵出已知同未知。';
  if (run.islandId === 'algebra') return '等式兩邊要同步做同一個動作。';
  return '答錯唔緊要，錯題會自動留低俾你重練。';
}

function startRun(islandId, diff, opts = {}) {
  const island = opts.mode === 'review' ? REVIEW_META : getIsland(islandId);
  if (!island) return;
  const d = getDiff(diff) || DIFFS[1];
  let questions = opts.questions;
  if (!questions) {
    const count = d.count;
    questions = buildQuestions(islandId, diff, count, opts.seed || (Date.now() + '-' + Math.random()));
    if (!questions.length) { toast('題目生成失敗，請再試一次。'); return; }
  }
  const run = {
    mode: opts.mode || 'normal',
    islandId, diff,
    questions,
    index: 0,
    q: questions[0],
    correct: 0, wrong: 0,
    combo: 0, maxCombo: 0,
    hearts: 4,
    feedback: null,
    results: [],
    input: '',
    hint: false,
    timeLeft: questions[0].timer || null,
    timerEnd: null,
    startedAt: Date.now(),
    mastered: 0,
    demo: !!opts.demo
  };
  if (opts.index && opts.index > 0 && opts.index < questions.length) {
    run.index = opts.index;
    run.q = questions[opts.index];
    run.timeLeft = run.q.timer || null;
  }
  UI.run = run;
  UI.view = 'play';
  UI.overlay = null;
  UI.result = null;
  render();
  if (!opts.demoPaused) startTimer();
}

function startReview(list) {
  if (!list || !list.length) { toast('而家冇待重練嘅錯題。'); return; }
  const qs = list.slice(0, 6).map(m => Object.assign(jsonClone(m.q), { mistakeId:m.id }));
  startRun(qs[0].island || 'volcano', 2, { questions:qs, mode:'review' });
}

function submitAnswer(value, timeout = false) {
  const run = UI.run;
  if (!run || run.feedback) return;
  stopTimer();
  const q = run.q;
  let ok = false;
  if (q.kind === 'choice') ok = value === q.answerIndex;
  else {
    const n = Number(value);
    ok = value !== null && value !== '' && isFinite(n) && Math.abs(n - q.answer) <= 0.011;
  }
  if (value !== null && value !== undefined) run.input = String(value);
  if (ok) {
    run.correct++;
    run.combo++;
    run.maxCombo = Math.max(run.maxCombo, run.combo);
    sfx('correct');
  } else {
    run.wrong++;
    run.combo = 0;
    run.hearts = Math.max(0, run.hearts - 1);
    sfx('wrong');
    recordMistake(q, value, timeout);
  }
  if (q.mistakeId && ok) {
    const m = S.mistakes.find(x => x.id === q.mistakeId);
    if (m && !m.mastered) { m.mastered = true; m.masteredAt = new Date().toISOString(); run.mastered++; }
  }
  run.results[run.index] = ok ? 'ok' : 'miss';
  S.stats.answered++;
  S.stats.correct += ok ? 1 : 0;
  S.stats.bestCombo = Math.max(S.stats.bestCombo, run.maxCombo);
  S.daily.answered++;
  S.daily.correct += ok ? 1 : 0;
  const dayKey = todayKey();
  if (!S.stats.days[dayKey]) S.stats.days[dayKey] = { answered:0, correct:0, minutes:0 };
  S.stats.days[dayKey].answered++;
  S.stats.days[dayKey].correct += ok ? 1 : 0;
  run.feedback = {
    ok, timeout, value,
    answerHTML: q.kind === 'choice' ? q.options[q.answerIndex] : unitStr(q.answer, q.unit),
    yourHTML: value === null ? '未作答' : q.kind === 'choice' ? q.options[value] : unitStr(Number(value), q.unit)
  };
  persist();
  render({ keepScroll:true });
  const card = $('.feedback');
  if (card) setTimeout(() => card.scrollIntoView({ behavior:'smooth', block:'nearest' }), 90);
}

function nextQuestion() {
  const run = UI.run;
  if (!run) return;
  if (run.hearts <= 0 || run.index >= run.questions.length - 1) { finishRun(); return; }
  run.index++;
  run.q = run.questions[run.index];
  run.feedback = null;
  run.input = '';
  run.hint = false;
  run.timeLeft = run.q.timer || null;
  render();
  startTimer();
}

function quitRun() {
  stopTimer();
  UI.run = null;
  UI.overlay = null;
  UI.result = null;
  UI.view = 'home';
  UI.tab = 'home';
  render();
}

/* =========================================================
   Finish / result
   ========================================================= */
function finishRun() {
  const run = UI.run;
  if (!run) return;
  stopTimer();
  const elapsed = Math.max(1, Math.round((Date.now() - run.startedAt) / 1000));
  const answered = run.correct + run.wrong;
  const acc = answered ? Math.round(run.correct / answered * 100) : 0;
  const failed = run.hearts <= 0 || (run.mode === 'normal' && acc < 40);
  let stars = 0;
  if (run.mode === 'normal' && !failed) {
    stars = run.wrong <= 1 ? 3 : run.wrong <= 2 ? 2 : 1;
  }
  const island = getIsland(run.islandId);
  const prevBest = island ? (S.islands[run.islandId].stars[run.diff] || 0) : 0;
  const firstClear = run.mode === 'normal' && prevBest === 0 && stars > 0;
  let xp = 0;
  if (run.mode === 'review') {
    xp = run.correct * 5 + 10;
  } else {
    xp = run.correct * 10 + Math.min(run.maxCombo, 10) * 2 + stars * 15 + (stars > 0 ? 10 : 0) + (firstClear ? 20 : 0);
  }
  const levelBefore = levelInfo(S.player.xp).level;
  const islandIdx = ISLANDS.findIndex(i => i.id === run.islandId);
  const nextIsland = islandIdx >= 0 ? ISLANDS[islandIdx + 1] : null;
  const nextWasLocked = nextIsland ? !isUnlocked(islandIdx + 1) : false;

  if (run.mode === 'normal' && island) {
    const rec = S.islands[run.islandId];
    rec.plays = (rec.plays || 0) + 1;
    if (stars > prevBest) rec.stars[run.diff] = stars;
    if (stars === 3 && rec.failed[run.diff]) { S.stats.comeback++; delete rec.failed[run.diff]; }
    if (stars === 0) rec.failed[run.diff] = true;
    S.stats.runs++;
    if (run.wrong === 0 && answered >= 1 && stars > 0) S.stats.perfectRuns++;
    if (stars > 0) S.daily.cleared++;
  }
  S.stats.timeSec += elapsed;
  {
    const dk = todayKey();
    if (!S.stats.days[dk]) S.stats.days[dk] = { answered:0, correct:0, minutes:0 };
    S.stats.days[dk].minutes = (S.stats.days[dk].minutes || 0) + Math.round(elapsed / 60);
  }
  if (run.mode === 'review') {
    S.daily.reviewed += run.correct;
  }

  /* streak */
  const t = todayKey();
  if (S.player.lastActive !== t) {
    const gap = daysBetween(S.player.lastActive, t);
    S.player.streak = gap === 1 ? S.player.streak + 1 : Math.max(1, S.player.streak ? 1 : 1);
    S.player.lastActive = t;
  }

  /* daily quest bonus */
  const qs = questState();
  let questBonus = 0;
  if (qs.done && !S.daily.claimed) {
    S.daily.claimed = true;
    questBonus = 50;
    xp += questBonus;
  }

  S.player.xp += xp;
  const levelAfter = levelInfo(S.player.xp).level;
  const newly = checkBadges();
  let unlockedIsland = null;
  if (run.mode === 'normal' && island && nextIsland && nextWasLocked && isUnlocked(islandIdx + 1)) {
    unlockedIsland = nextIsland;
  }

  UI.result = {
    mode: run.mode,
    islandId: run.islandId,
    diff: run.diff,
    stars, correct: run.correct, wrong: run.wrong,
    total: run.questions.length, maxCombo: run.maxCombo,
    xp, timeSec: elapsed, accuracy: acc, failed,
    newBadges: newly,
    unlockedIsland,
    questBonus,
    leveledUp: levelAfter > levelBefore,
    level: levelAfter,
    mastered: run.mastered || 0,
    masteredTotal: run.questions.filter(q => q.mistakeId).length,
    demo: run.demo
  };
  UI.run = null;
  UI.view = 'result';
  persist();
  render();
  if (stars >= 2 || newly.length) { sfx('star'); confetti(stars === 3 ? 42 : 28); }
  else if (stars > 0) sfx('level');
}

function resultHTML() {
  const r = UI.result;
  if (!r) return '';
  const island = r.mode === 'review' ? REVIEW_META : getIsland(r.islandId);
  const diff = r.mode === 'review' ? { name:'錯題重練' } : getDiff(r.diff);
  const review = r.mode === 'review';
  const title = review
    ? (r.mastered >= r.masteredTotal && r.mastered > 0 ? '全部掌握！' : '特訓完成！')
    : r.failed ? '差少少，再嚟過！' : r.stars === 3 ? '完美通關！' : '闖關成功！';
  const sub = review
    ? `掌握咗 ${r.mastered} / ${r.masteredTotal} 道錯題`
    : `${island.name} · ${diff.name} · 答對 ${r.correct} / ${r.total} 題`;
  const starsHTML = review
    ? `<div class="res-stars"><span class="res-star on" style="color:#7BE0C8">${icon('check', 58)}</span></div>`
    : `<div class="res-stars">${[1, 2, 3].map(i => `<span class="res-star ${i <= r.stars ? 'on' : ''}">${starHtml(true, 58)}</span>`).join('')}</div>`;

  const badges = r.newBadges && r.newBadges.length ? `
    <div class="res-sec">新徽章解鎖</div>
    <div class="res-badges">
      ${r.newBadges.map(b => `<div class="res-badge">${medalHtml(b)}<div><b>${b.name}</b><span>${b.desc}</span></div></div>`).join('')}
    </div>` : '';

  const unlock = r.unlockedIsland ? `<div class="res-unlock">
      <span class="ico">${icon('lock', 16)}</span>
      <div>新島嶼解鎖！<b>${r.unlockedIsland.name}</b></div>
    </div>` : '';

  const note = !review && r.wrong > 0 ? '答錯嘅題目已收入錯題簿，記得回去重練。' : '所有進度已儲存喺呢部裝置。';

  return `<div class="result">
    <div class="res-hero ${r.failed ? 'fail' : ''}">
      <div class="res-rays" aria-hidden="true"></div>
      <button class="icon-btn res-close" data-act="result-map" aria-label="返回地圖">${icon('x', 17)}</button>
      <div class="res-eyebrow">${review ? '錯題特訓' : island.name + ' · ' + diff.name}</div>
      ${starsHTML}
      <h1 class="res-title">${title}</h1>
      <p class="res-sub">${sub}</p>
      <div class="res-mascot">${mascot(r.failed ? 'oops' : 'cheer')}</div>
    </div>
    <div class="res-panel">
      <div class="res-xp">
        ${icon('sparkle', 17)} +${r.xp} XP
        ${r.questBonus ? `<span class="bonus">任務 +${r.questBonus}</span>` : ''}
        ${r.leveledUp ? `<small>升到 Lv.${r.level}！</small>` : ''}
      </div>
      <div class="res-stats">
        <div class="res-stat"><b>${r.correct} <small>/ ${r.total}</small></b><span>答對題數</span></div>
        <div class="res-stat"><b>${r.maxCombo}</b><span>最高連擊</span></div>
        <div class="res-stat"><b>${Math.floor(r.timeSec / 60)}:${pad2(r.timeSec % 60)}</b><span>冒險時間</span></div>
      </div>
      ${badges}
      ${unlock}
      <div class="res-actions">
        <button class="btn primary" data-act="${review ? 'result-mistakes' : 'result-again'}">
          ${review ? '返錯題簿' : (r.failed ? '再試一次' : '再玩一次')} ${icon('arrow', 16)}
        </button>
        <button class="btn secondary" data-act="result-map">${review ? '返地圖' : '返回地圖'}</button>
      </div>
      <div class="res-note">${note}</div>
    </div>
  </div>`;
}

/* =========================================================
   Mistakes
   ========================================================= */
function filteredMistakes() {
  const list = openMistakes();
  return UI.filter === 'all' ? list : list.filter(m => m.q.island === UI.filter);
}

function mistakesView() {
  const list = filteredMistakes();
  const shortNames = { volcano:'火山', fraction:'分數', geometry:'圖形', word:'應用', algebra:'方程', data:'數據' };
  const filters = [['all','全部']].concat(ISLANDS.map(i => [i.id, shortNames[i.id] || i.short]));
  return `${topbarHTML()}
    <div class="scroll">
      <div class="page-head">
        <div>
          <h1>錯題簿</h1>
          <div class="sub">${openMistakes().length} 題待攻克 · 已掌握 ${masteredCount()} 題</div>
        </div>
        <button class="train-btn" data-act="train" ${list.length ? '' : 'disabled'}>${icon('target', 12)} 錯題特訓</button>
      </div>
      <div class="filter-row">
        ${filters.map(([id, label]) => {
          const n = id === 'all' ? openMistakes().length : openMistakes().filter(m => m.q.island === id).length;
          return `<button class="chip ${UI.filter === id ? 'active' : ''}" data-act="filter" data-filter="${id}">${label}<span class="n">${n}</span></button>`;
        }).join('')}
      </div>
      ${masteredCount() ? `<div class="mastered-note">${icon('check', 12)} 你已經重新掌握 ${masteredCount()} 道錯題，繼續保持！</div>` : ''}
      ${list.length ? `<div class="mistake-list">${list.map(mistakeCard).join('')}</div>` : emptyMistakes()}
    </div>
    ${tabbarHTML('mistakes')}`;
}

function mistakeCard(m) {
  const island = getIsland(m.q.island) || getIsland('volcano');
  const d = getDiff(m.q.diff) || DIFFS[1];
  const open = UI.openMistake === m.id;
  return `<article class="mistake ${open ? 'open' : ''}">
    <div class="m-top">
      <span class="m-island" style="--ic:${island.c2};--ib:${island.c1}22">${islandIcon(m.q.island, 10)}${island.short}</span>
      <span class="m-diff">${d.name}難度</span>
      <span class="m-date">${fmtDate(m.createdAt)}</span>
    </div>
    <div class="m-q">${m.q.prompt}</div>
    <div class="m-answers">
      <div class="m-ans"><em>你嘅答案</em>${m.yourHTML}</div>
      <div class="m-ans good"><em>正確答案</em>${m.correctHTML}</div>
    </div>
    <div class="m-explain"><b>解題思路：</b>${m.q.explain}</div>
    <div class="m-actions">
      <button class="mini" data-act="explain" data-id="${m.id}">${icon('bulb', 12)} 解釋</button>
      <button class="mini solid" data-act="retry-one" data-id="${m.id}">${icon('refresh', 12)} 再做一次</button>
      <button class="mini green" data-act="master" data-id="${m.id}">${icon('check', 12)} 已掌握</button>
    </div>
  </article>`;
}

function emptyMistakes() {
  const filtered = UI.filter !== 'all';
  return `<div class="empty">
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#FFF6DD"/>
      <path d="M40 40h30l10 10v30H40z" fill="#FFFDF6" stroke="#0B7A72" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M70 40v10h10M48 58h24M48 66h16" stroke="#0B7A72" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="80" cy="78" r="15" fill="#4FA85E"/>
      <path d="m73 78 5 5 9-10" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h3>${filtered ? '呢個島暫時冇錯題' : '錯題簿空空如也'}</h3>
    <p>${filtered ? '試下其他島嶼，或者去冒險地圖繼續挑戰。' : '答錯嘅題目會自動出現喺度，重練答啱就可以標記掌握。'}</p>
  </div>`;
}

/* =========================================================
   Badges
   ========================================================= */
function badgesView() {
  const earned = Object.keys(S.badges).length;
  const pct = Math.round(earned / BADGES.length * 100);
  return `${topbarHTML()}
    <div class="scroll">
      <div class="page-head"><div><h1>徽章</h1><div class="sub">收集成就 · 記錄每一步</div></div></div>
      <div class="badge-summary">
        <div style="flex:none">
          <div class="n">${earned}<small> / ${BADGES.length}</small></div>
          <div class="t">已收集徽章</div>
        </div>
        <div style="flex:1">
          <div class="t" style="margin-top:0">${earned === BADGES.length ? '全部收集完成，你係真正嘅群島守護者！' : '仲差 ' + (BADGES.length - earned) + ' 枚，繼續探索啦。'}</div>
          <div class="badge-prog"><i style="width:${pct}%"></i></div>
        </div>
      </div>
      <div class="badge-grid">
        ${BADGES.map(b => {
          const got = !!S.badges[b.id];
          return `<button class="badge-tile ${got ? 'earned' : 'locked'}" data-act="badge" data-id="${b.id}">
            ${got ? `<span class="spark">${icon('sparkle', 10)}</span>` : ''}
            ${medalHtml(b)}
            <b>${b.name}</b>
            <span>${got ? '已於 ' + fmtDate(S.badges[b.id]) + ' 獲得' : b.hint}</span>
          </button>`;
        }).join('')}
      </div>
    </div>
    ${tabbarHTML('badges')}`;
}

/* =========================================================
   Progress
   ========================================================= */
function weekData() {
  const out = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = addDays(now, -i);
    const key = ymd(d);
    const rec = S.stats.days[key] || { answered:0, correct:0, minutes:0 };
    out.push({ key, label:'日一二三四五六'[d.getDay()], n:rec.answered || 0, today:i === 0 });
  }
  return out;
}

function progressView() {
  const li = levelInfo(S.player.xp);
  const week = weekData();
  const max = Math.max(10, ...week.map(d => d.n));
  const total = week.reduce((a, b) => a + b.n, 0);
  const avg = (total / 7).toFixed(1);
  const today = ymd(new Date());
  const weekBars = week.map(d => `<div class="wbar ${d.today ? 'today' : ''}">
      <span class="v">${d.n || ''}</span>
      <i class="shape" style="height:${Math.max(3, d.n / max * 100)}%"></i>
      <span class="d">${d.today ? '今' : d.label}</span>
    </div>`).join('');
  const mastery = ISLANDS.map((is, i) => {
    const unlocked = isUnlocked(i);
    const sum = starSum(is.id);
    return `<div class="mastery ${unlocked ? '' : 'locked'}">
      <span class="mastery-ico" style="--c1:${is.c1};--c2:${is.c2}">${unlocked ? islandIcon(is.id, 16) : icon('lock', 14)}</span>
      <div class="mastery-main">
        <div class="mastery-top"><span>${is.name}</span><span>${unlocked ? sum + ' / 9 星' : '未解鎖'}</span></div>
        <div class="mastery-bar"><i style="width:${unlocked ? sum / 9 * 100 : 0}%"></i></div>
      </div>
      <div class="mastery-stars">${unlocked ? starsHtml(bestStars(is.id), 10) : ''}</div>
    </div>`;
  }).join('');

  return `${topbarHTML()}
    <div class="scroll">
      <div class="page-head"><div><h1>進度</h1><div class="sub">你嘅冒險紀錄</div></div></div>
      <div class="profile-card">
        <div class="profile-top">
          <div class="profile-avatar">${esc(S.player.name.slice(0, 1))}</div>
          <div>
            <div class="profile-name">${esc(S.player.name)}</div>
            <div class="profile-rank">Lv.${li.level} · ${li.rank}</div>
          </div>
          <button class="edit-name" data-act="edit-name" aria-label="更改名字">${icon('pencil', 13)}</button>
        </div>
        <div class="profile-xp">
          <div class="top"><span>${fmt(S.player.xp)} / ${fmt(li.next)} XP</span><b>距離下一級 ${fmt(Math.max(0, li.next - S.player.xp))} XP</b></div>
          <div class="profile-bar"><i style="width:${li.pct}%"></i></div>
        </div>
        <div class="profile-foot">${icon('flame', 11)} 連續 ${S.player.streak} 日 · 累計 ${totalStars()} / 54 星 · ${Object.keys(S.badges).length} 枚徽章</div>
      </div>

      <div class="panel">
        <div class="panel-title">${icon('user', 14)} 學習階段<span class="hint">影響題目深淺</span></div>
        <div class="stage-seg">
          <button class="${S.player.stage === 'primary' ? 'active' : ''}" data-act="stage" data-stage="primary">小學 P1–P6</button>
          <button class="${S.player.stage === 'secondary' ? 'active' : ''}" data-act="stage" data-stage="secondary">中學 S1–S3</button>
        </div>
        <div class="stage-note">${icon('info', 11)} 下一關開始會按所選階段出題，唔會影響已記錄嘅進度。</div>
      </div>

      <div class="panel">
        <div class="panel-title">${icon('chart', 14)} 數字一覽</div>
        <div class="stat-grid">
          <div class="stat-box"><div class="k">${icon('book', 11)} 累計答題</div><div class="v">${fmt(S.stats.answered)}<small>題</small></div></div>
          <div class="stat-box"><div class="k">${icon('target', 11)} 正確率</div><div class="v">${accuracy()}<small>%</small></div></div>
          <div class="stat-box"><div class="k">${icon('clock', 11)} 冒險時間</div><div class="v">${Math.round(S.stats.timeSec / 60)}<small>分鐘</small></div></div>
          <div class="stat-box"><div class="k">${icon('flame', 11)} 最佳連擊</div><div class="v">${S.stats.bestCombo}<small>題</small></div></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">${icon('chart', 14)} 近 7 日練習<span class="hint">合共 ${total} 題</span></div>
        <div class="week-chart">${weekBars}</div>
        <div class="week-foot"><span>每日平均 <b>${avg}</b> 題</span><span>${today === (S.daily.date || '') ? '今日已完成 ' + S.daily.answered + ' 題' : ''}</span></div>
      </div>

      <div class="panel">
        <div class="panel-title">${icon('island', 14)} 島嶼掌握度<span class="hint">每島 9 星為滿</span></div>
        <div class="mastery-list">${mastery}</div>
      </div>

      <div class="panel">
        <div class="panel-title">${icon('motion', 14)} 設定</div>
        <div class="settings-list">
          <div class="setting">
            <span class="setting-ico">${icon('sound', 14)}</span>
            <div><div class="setting-t">音效</div><div class="setting-s">答題同徽章提示音</div></div>
            <button class="switch ${S.settings.sound ? 'on' : ''}" role="switch" aria-checked="${S.settings.sound}" data-act="toggle-sound" aria-label="音效開關"><span></span></button>
          </div>
          <div class="setting">
            <span class="setting-ico">${icon('motion', 14)}</span>
            <div><div class="setting-t">動態效果</div><div class="setting-s">減少動畫可慳電啲</div></div>
            <button class="switch ${S.settings.motion ? 'on' : ''}" role="switch" aria-checked="${S.settings.motion}" data-act="toggle-motion" aria-label="動態效果開關"><span></span></button>
          </div>
          <div class="setting">
            <span class="setting-ico">${icon('reset', 14)}</span>
            <div><div class="setting-t">重設進度</div><div class="setting-s">清空所有紀錄，重新開始</div></div>
            <button class="reset-btn" data-act="reset">重設</button>
          </div>
        </div>
      </div>
      <div class="privacy-note">${icon('shield', 12)} 所有進度只儲存喺呢部裝置嘅瀏覽器，唔會上傳、唔需要帳號。換裝置或清除瀏覽器資料後，進度會消失。</div>
    </div>
    ${tabbarHTML('progress')}`;
}

/* =========================================================
   Render
   ========================================================= */
function render(opts = {}) {
  const app = $('#app');
  if (!app) return;
  const oldScroll = app.querySelector('.scroll');
  const top = opts.keepScroll && oldScroll ? oldScroll.scrollTop : 0;
  const oldPlay = app.querySelector('.play-scroll');
  const playTop = opts.keepScroll && oldPlay ? oldPlay.scrollTop : 0;
  app.classList.toggle('no-motion', !S.settings.motion);
  let html = '';
  if (UI.view === 'play' && UI.run) html = playHTML();
  else if (UI.view === 'result' && UI.result) html = resultHTML();
  else if (UI.view === 'mistakes') html = mistakesView();
  else if (UI.view === 'badges') html = badgesView();
  else if (UI.view === 'progress') html = progressView();
  else html = homeView();
  app.innerHTML = html;
  if (top) { const s = app.querySelector('.scroll'); if (s) s.scrollTop = top; }
  if (playTop) { const s = app.querySelector('.play-scroll'); if (s) s.scrollTop = playTop; }
  renderOverlay();
}
