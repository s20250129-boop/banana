/* =========================================================
   Events, keyboard, demo deep-links & boot
   ========================================================= */
function goTab(tab) {
  UI.overlay = null;
  UI.view = tab === 'home' ? 'home' : tab;
  UI.tab = tab;
  UI.result = null;
  if (tab !== 'mistakes') UI.openMistake = null;
  render();
  const sc = $('.scroll');
  if (sc) sc.scrollTop = 0;
}

function closeOverlay() {
  const prev = UI.overlay;
  UI.overlay = null;
  renderOverlay();
  if (prev && prev.type === 'quit' && UI.view === 'play' && UI.run && !UI.run.feedback) startTimer();
}

function pressKey(k) {
  const run = UI.run;
  if (!run || run.feedback || run.q.kind !== 'input') return;
  let v = run.input || '';
  if (k === 'del') v = v.slice(0, -1);
  else if (k === 'sign') v = v.startsWith('-') ? v.slice(1) : '-' + v;
  else if (k === 'dot') { if (!v.includes('.')) v = (v || '0') + '.'; }
  else if (/^\d$/.test(k)) {
    if (v === '0') v = k;
    else if (v.replace('-', '').replace('.', '').length < 8) v += k;
  }
  run.input = v;
  render({ keepScroll:true });
}

function submitCurrent() {
  const run = UI.run;
  if (!run || run.feedback) return;
  if (!/^-?\d*\.?\d+$/.test(run.input || '')) {
    toast('請先輸入完整答案');
    return;
  }
  submitAnswer(run.input, false);
}

function saveName() {
  const inp = $('#nameInput');
  const v = (inp ? inp.value : '').trim();
  if (!v) { toast('名字唔可以留空'); return; }
  S.player.name = v.slice(0, 10);
  persist();
  UI.overlay = null;
  renderOverlay();
  render();
  toast('已經幫你改好名！');
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;

  if (act === 'backdrop') {
    if (e.target.classList.contains('overlay')) closeOverlay();
    return;
  }

  switch (act) {
    case 'tab':
      sfx('tap');
      goTab(el.dataset.tab);
      break;

    case 'island': {
      const id = el.dataset.id;
      const idx = ISLANDS.findIndex(i => i.id === id);
      if (!isUnlocked(idx)) {
        const prev = ISLANDS[idx - 1];
        toast(prev ? `完成「${prev.name}」任何關卡，就可以解鎖呢個島。` : '完成前面嘅島嶼先可以解鎖。');
        sfx('wrong');
        return;
      }
      sfx('tap');
      UI.overlay = { type:'island', id };
      renderOverlay();
      break;
    }

    case 'close':
      closeOverlay();
      break;

    case 'start':
      sfx('tap');
      startRun(el.dataset.island, Number(el.dataset.diff));
      break;

    case 'answer':
      if (UI.run && !UI.run.feedback) submitAnswer(Number(el.dataset.index));
      break;

    case 'key':
      pressKey(el.dataset.key);
      break;

    case 'submit':
      submitCurrent();
      break;

    case 'hint':
      if (UI.run && !UI.run.feedback) {
        UI.run.hint = !UI.run.hint;
        render({ keepScroll:true });
      }
      break;

    case 'next':
      nextQuestion();
      break;

    case 'quit':
      if (!UI.run) { goTab('home'); break; }
      stopTimer();
      UI.overlay = { type:'quit' };
      renderOverlay();
      break;

    case 'confirm-quit':
      sfx('tap');
      quitRun();
      break;

    case 'result-map':
      sfx('tap');
      UI.result = null;
      UI.view = 'home'; UI.tab = 'home';
      render();
      break;

    case 'result-again': {
      const r = UI.result;
      if (!r) { goTab('home'); break; }
      sfx('tap');
      startRun(r.islandId, r.diff);
      break;
    }

    case 'result-mistakes':
      sfx('tap');
      UI.result = null;
      goTab('mistakes');
      break;

    case 'filter':
      UI.filter = el.dataset.filter;
      UI.openMistake = null;
      render({ keepScroll:true });
      break;

    case 'train': {
      const list = filteredMistakes();
      if (!list.length) { toast('呢個篩選暫時冇錯題。'); return; }
      sfx('tap');
      startReview(list);
      break;
    }

    case 'retry-one': {
      const m = S.mistakes.find(x => x.id === el.dataset.id);
      if (m && !m.mastered) { sfx('tap'); startReview([m]); }
      break;
    }

    case 'master':
      if (el.dataset.id) markMastered(el.dataset.id);
      break;

    case 'explain':
      UI.openMistake = UI.openMistake === el.dataset.id ? null : el.dataset.id;
      render({ keepScroll:true });
      break;

    case 'badge':
      sfx('tap');
      UI.overlay = { type:'badge', id:el.dataset.id };
      renderOverlay();
      break;

    case 'toggle-sound':
      S.settings.sound = !S.settings.sound;
      persist();
      if (S.settings.sound) sfx('tap');
      render({ keepScroll:true });
      toast(S.settings.sound ? '音效已開啟' : '音效已關閉');
      break;

    case 'toggle-motion':
      S.settings.motion = !S.settings.motion;
      persist();
      render({ keepScroll:true });
      toast(S.settings.motion ? '動態效果已開啟' : '已減少動態效果');
      break;

    case 'stage':
      if (S.player.stage !== el.dataset.stage) {
        S.player.stage = el.dataset.stage;
        persist();
        render({ keepScroll:true });
        toast(el.dataset.stage === 'secondary' ? '已切換到中學程度，下一關會用新題目。' : '已切換到小學程度，下一關會用新題目。');
        sfx('tap');
      }
      break;

    case 'reset':
      UI.overlay = { type:'reset' };
      renderOverlay();
      break;

    case 'confirm-reset':
      resetProgress();
      UI.overlay = null;
      UI.result = null;
      UI.run = null;
      UI.filter = 'all';
      UI.openMistake = null;
      UI.view = 'home';
      UI.tab = 'home';
      render();
      toast('已重設所有進度，重新開始冒險！');
      break;

    case 'edit-name':
      UI.overlay = { type:'name' };
      renderOverlay();
      break;

    case 'save-name':
      saveName();
      break;

    default:
      break;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (UI.overlay) { closeOverlay(); return; }
    if (UI.view === 'play' && UI.run) {
      stopTimer();
      UI.overlay = { type:'quit' };
      renderOverlay();
      return;
    }
    if (UI.view === 'result') {
      UI.result = null; UI.view = 'home'; UI.tab = 'home'; render();
      return;
    }
  }
  if (UI.overlay && UI.overlay.type === 'name' && e.key === 'Enter') {
    e.preventDefault();
    saveName();
    return;
  }
  if (UI.view !== 'play' || !UI.run || UI.overlay) return;
  const run = UI.run;
  if (run.feedback) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextQuestion(); }
    return;
  }
  if (run.q.kind === 'input') {
    if (/^\d$/.test(e.key)) { e.preventDefault(); pressKey(e.key); }
    else if (e.key === '.') { e.preventDefault(); pressKey('dot'); }
    else if (e.key === '-') { e.preventDefault(); pressKey('sign'); }
    else if (e.key === 'Backspace') { e.preventDefault(); pressKey('del'); }
    else if (e.key === 'Enter') { e.preventDefault(); submitCurrent(); }
  } else {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= run.q.options.length) { e.preventDefault(); submitAnswer(n - 1); return; }
    const idx = 'abcd'.indexOf(e.key.toLowerCase());
    if (idx >= 0 && idx < run.q.options.length) { e.preventDefault(); submitAnswer(idx); }
  }
});

/* =========================================================
   Deep links used by the preview screenshots / QA
   screen=home|play|result|mistakes|badges|progress
   play: island=volcano&diff=2&q=2
   sheet=volcano
   ========================================================= */
function applyDeepLink() {
  const qs = new URLSearchParams(location.search);
  if (qs.get('fresh') === '1') {
    S = blankState();
    persist();
  }
  // Marketing-site deep links: /app/?start=1&island=fraction&diff=2
  // starts a real run (not the paused screenshot demo).
  const autoIsland = qs.get('island');
  if (qs.get('start') === '1' && autoIsland && getIsland(autoIsland)) {
    const autoDiff = clamp(Number(qs.get('diff') || 1), 1, 3);
    startRun(autoIsland, autoDiff);
    return;
  }
  const screen = qs.get('screen');
  if (screen === 'play') {
    const islandId = getIsland(qs.get('island') || 'fraction') ? (qs.get('island') || 'fraction') : 'fraction';
    const diff = clamp(Number(qs.get('diff') || 2), 1, 3);
    const idx = clamp(Number(qs.get('q') || 2), 0, 7);
    startRun(islandId, diff, { seed:'demo-' + islandId + '-' + diff, index:idx, demoPaused:true, demo:true });
    if (UI.run) {
      for (let i = 0; i < idx; i++) UI.run.results[i] = 'ok';
      UI.run.correct = Math.min(idx, 2);
      UI.run.maxCombo = UI.run.correct;
      UI.run.combo = UI.run.correct;
      const q = UI.run.q;
      if (q && q.timer) {
        UI.run.timeLeft = Math.min(8.4, q.timer);
        updateTimerDom(UI.run.timeLeft);
      }
    }
  } else if (screen === 'result') {
    S.badges.fraction = S.badges.fraction || new Date().toISOString();
    UI.result = {
      mode:'normal', islandId:'fraction', diff:3, stars:3,
      correct:8, wrong:0, total:8, maxCombo:8, xp:221, timeSec:76,
      accuracy:100, failed:false,
      newBadges:[BADGES.find(b => b.id === 'fraction')],
      unlockedIsland:null, questBonus:50, leveledUp:false, level:4,
      mastered:0, masteredTotal:0, demo:true
    };
    UI.view = 'result';
  } else if (screen === 'mistakes' || screen === 'badges' || screen === 'progress') {
    UI.view = screen;
    UI.tab = screen;
  }
  render();
  if (qs.get('sheet')) {
    const id = qs.get('sheet');
    if (getIsland(id)) {
      UI.overlay = { type:'island', id };
      renderOverlay();
    }
  }
  if (screen === 'result') setTimeout(() => confetti(28), 180);
  if (screen === 'play') setTimeout(() => { const q = UI.run && UI.run.q; if (q && q.timer) updateTimerDom(UI.run.timeLeft); }, 60);
}

/* test / automation hook */
window.__NAI = {
  get S() { return S; },
  UI,
  startRun, startReview, submitAnswer, nextQuestion, finishRun,
  render, goTab, closeOverlay, checkBadges
};

applyDeepLink();
