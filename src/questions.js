/* =========================================================
   Question engine — six islands, three difficulties
   ========================================================= */
const lcm = (a, b) => a * b / gcd(a, b);

function wrongNumbers(ans, count = 3, opt = {}) {
  const min = opt.min === undefined ? -9999 : opt.min;
  const max = opt.max === undefined ? 9999 : opt.max;
  const deltas = [1, -1, 2, -2, 5, -5, 10, -10, 3, -3, 20, -20, 100, -100, 0.5, -0.5];
  const out = [];
  const seen = new Set([ans]);
  for (const d of deltas) {
    let v = ans + d;
    if (!Number.isInteger(ans)) v = Math.round(v * 100) / 100;
    if (v !== ans && v >= min && v <= max && !seen.has(v)) { seen.add(v); out.push(v); }
    if (out.length >= count) break;
  }
  let k = 1;
  while (out.length < count) {
    let v = ans + k * 7 * (k % 2 ? 1 : -1);
    if (v >= min && v <= max && !seen.has(v)) { seen.add(v); out.push(v); }
    k++;
  }
  return out;
}

function choiceQ(o) {
  const seen = new Set();
  const raw = [o.correct, ...(o.wrongs || [])].filter(v => v !== undefined && v !== null);
  const uniq = [];
  raw.forEach(v => { const k = String(v); if (!seen.has(k)) { seen.add(k); uniq.push(v); } });
  while (uniq.length < 3) uniq.push(String(o.correct) + ' ');
  const options = shuffle(uniq);
  return Object.assign({}, o, {
    kind: 'choice',
    options,
    answerIndex: options.indexOf(o.correct),
    optionCols: o.optionCols || 2,
    center: !!o.center
  });
}

function inputQ(o) {
  return Object.assign({ kind: 'input', unit: '' }, o);
}

const unitStr = (n, unit) => {
  if (!unit) return disp(n);
  if (unit === '元') return '$' + fmt(n);
  if (unit === '°') return disp(n) + '°';
  return disp(n) + ' ' + unit;
};

/* ---------- 1. 火山速算 ---------- */
function genVolcano(diff, stage) {
  const sec = stage === 'secondary';
  const timer = diff === 1 ? 16 : diff === 2 ? 13 : 11;
  const base = { island: 'volcano', diff, kindLabel: '四則運算', timer };
  const make = (prompt, ans, explain, extra = {}) => choiceQ(Object.assign({}, base, {
    prompt, correct: disp(ans), wrongs: wrongNumbers(ans, 3, { min: sec ? -999 : 0 }).map(disp), explain
  }, extra));

  let type;
  if (diff === 1) type = pick(['add', 'sub', 'mul', 'missing']);
  else if (diff === 2) type = pick(['add', 'sub', 'mul', 'div', 'mixed', 'percent']);
  else type = pick(['mul', 'mixed', 'percent', 'power', 'div']);

  if (type === 'add') {
    let a, b;
    if (diff === 1) { a = ri(3, 18); b = ri(2, 9); }
    else if (diff === 2) { a = ri(24, 89); b = ri(13, 76); }
    else { a = ri(145, 790); b = ri(85, 690); }
    if (sec && diff >= 2 && rng() < .35) a = -a;
    const ans = a + b;
    const prompt = `${disp(a)} + ${b < 0 ? '(' + disp(b) + ')' : b} = ?`;
    return make(prompt, ans, `${disp(a)} + ${disp(b)} = <b>${disp(ans)}</b>。`, { center: true });
  }

  if (type === 'sub') {
    let a, b;
    if (diff === 1) { a = ri(8, 20); b = ri(2, a - 2); }
    else if (diff === 2) { a = ri(45, 120); b = ri(12, a - 8); }
    else { a = ri(180, 940); b = ri(65, 160); if (sec && rng() < .3) a = -a; }
    const ans = a - b;
    const prompt = `${disp(a)} − ${b < 0 ? '(' + disp(b) + ')' : b} = ?`;
    return make(prompt, ans, `${disp(a)} 減 ${disp(b)}，等於 <b>${disp(ans)}</b>。`, { center: true });
  }

  if (type === 'mul') {
    let a, b;
    if (diff === 1) { a = ri(2, 9); b = ri(2, 9); }
    else if (diff === 2) { a = ri(3, 12); b = ri(4, 19); }
    else { a = ri(12, 29); b = ri(11, 29); }
    const ans = a * b;
    return make(`${a} × ${b} = ?`, ans, `${a} × ${b} = <b>${fmt(ans)}</b>。`, { center: true });
  }

  if (type === 'div') {
    const b = ri(3, 12); const ans = ri(3, 12); const a = b * ans;
    return make(`${a} ÷ ${b} = ?`, ans, `因為 ${b} × ${ans} = ${a}，所以 ${a} ÷ ${b} = <b>${ans}</b>。`, { center: true });
  }

  if (type === 'missing') {
    const a = ri(4, 15); const ans = ri(3, 12); const b = a + ans;
    return make(
      `${a} + <span class="unk">?</span> = ${b}`, ans,
      `兩邊同時減 ${a}：? = ${b} − ${a} = <b>${ans}</b>。`,
      { center: true, prompt: `${a} + <span class="unk">?</span> = ${b}` }
    );
  }

  if (type === 'mixed') {
    const a = ri(3, 9), b = ri(4, 12);
    if (diff === 2) {
      if (rng() < .5) {
        const c = ri(4, 20); const ans = a * b + c;
        return make(`${a} × ${b} + ${c} = ?`, ans,
          `先乘後加：${a} × ${b} = ${a * b}，再加 ${c}，等於 <b>${ans}</b>。`,
          { center: true, wrongs: [String((a * b + c) ), String(a * (b + c)), String(a * b + c + 10), String(a * b + c - 10)] });
      } else {
        const c = ri(3, 9); const ans = a + b * c;
        return make(`${a} + ${b} × ${c} = ?`, ans,
          `先乘後加：${b} × ${c} = ${b * c}，再加 ${a}，等於 <b>${ans}</b>。`,
          { center: true });
      }
    } else {
      if (rng() < .55) {
        const c = ri(3, 8); const ans = (a + b) * c;
        return make(`(${a} + ${b}) × ${c} = ?`, ans,
          `先算括號：${a} + ${b} = ${a + b}；再乘 ${c}，等於 <b>${ans}</b>。`,
          { center: true });
      } else {
        const c = ri(4, Math.max(5, a * b - 1)); const ans = a * b - c;
        return make(`${a} × ${b} − ${c} = ?`, Math.abs(ans),
          `先乘後減：${a} × ${b} = ${a * b}，再減 ${c}，等於 <b>${a * b - c}</b>。`,
          { center: true });
      }
    }
  }

  if (type === 'percent') {
    const p = pick([10, 20, 25, 50]);
    const baseN = pick([20, 40, 60, 80, 120, 160, 200, 240]);
    const ans = baseN * p / 100;
    return make(`${baseN} 嘅 ${p}% 係幾多？`, ans,
      `${baseN} × ${p}% = ${baseN} × ${p / 100} = <b>${fmt(ans)}</b>。`,
      { center: true });
  }

  if (type === 'power') {
    const a = ri(2, 9);
    const e = diff === 3 ? pick([2, 2, 3]) : 2;
    const ans = Math.pow(a, e);
    return make(`${a}<sup>${e}</sup> = ?`, ans,
      `${a}<sup>${e}</sup> 即係 ${Array(e).fill(a).join(' × ')}，等於 <b>${fmt(ans)}</b>。`,
      { center: true });
  }

  return make('12 × 4 = ?', 48, '12 × 4 = <b>48</b>。', { center: true });
}

/* ---------- 2. 分數叢林 ---------- */
function fractionBars(n1, d1, n2, d2) {
  const bar = (n, d, y, label, color) => {
    const x = 62, w = 214, seg = w / d;
    let cells = '';
    for (let k = 0; k < d; k++) {
      cells += `<rect x="${x + k * seg}" y="${y}" width="${seg}" height="26" fill="${k < n ? color : '#FFFDF6'}" stroke="#0E6573" stroke-width="1.1"/>`;
    }
    return `<text x="14" y="${y + 18}" font-size="12" font-weight="800" fill="#13343B">${label}</text>${cells}
      <text x="${x + w + 8}" y="${y + 18}" font-size="11" fill="#547077">${n}/${d}</text>`;
  };
  return `<svg class="viz-svg" viewBox="0 0 300 150" role="img" aria-label="兩個分數的長條圖比較">
    <text x="14" y="15" font-size="9" font-weight="800" fill="#879A9C">邊個著色部分較多？</text>
    ${bar(n1, d1, 30, 'A', '#2E8B4F')}
    ${bar(n2, d2, 82, 'B', '#E8A21E')}
  </svg>`;
}

function fracOptionSet(correctTuple, wrongTuples) {
  const [cn, cd] = correctTuple;
  const correct = frac(cn, cd);
  const seen = new Set([cn / cd]);
  const wrongs = [];
  for (const [n, d] of wrongTuples) {
    if (!d || d === 0 || !Number.isFinite(n)) continue;
    const v = n / d;
    if (seen.has(v)) continue;
    seen.add(v);
    wrongs.push(frac(n, d));
    if (wrongs.length >= 3) break;
  }
  const extras = [[cn + 1, cd], [cn + 2, cd], [cn, cd + 1], [cn + 1, cd + 1], [Math.max(1, cn - 1), cd + 2]];
  for (const [n, d] of extras) {
    if (wrongs.length >= 3) break;
    const v = n / d;
    if (seen.has(v)) continue;
    seen.add(v); wrongs.push(frac(n, d));
  }
  return { correct, wrongs };
}

function genFraction(diff, stage) {
  const sec = stage === 'secondary';
  const base = { island: 'fraction', diff, kindLabel: '分數' };
  const makeFrac = (prompt, correct, wrongs, explain, extra = {}) => choiceQ(Object.assign({}, base, {
    prompt, correct, wrongs, explain, center: true, optionCols: 2
  }, extra));

  const types = diff === 1
    ? ['compare', 'add', 'of']
    : diff === 2
      ? ['compare', 'equal', 'add', 'of', 'simplify']
      : (sec ? ['compare', 'add', 'multiply', 'divide', 'of'] : ['compare', 'add', 'multiply', 'of', 'simplify']);

  const type = pick(types);

  if (type === 'compare') {
    let n1, d1, n2, d2;
    if (diff === 1) {
      d1 = d2 = pick([4, 5, 6, 8]);
      n1 = ri(1, d1 - 2); n2 = ri(1, d1 - 1);
      if (n1 === n2) n2 = n1 === d1 - 1 ? 1 : n1 + 1;
    } else if (diff === 2) {
      const pair = pick([[2, 3], [3, 4], [4, 6], [5, 8], [3, 5], [6, 8]]);
      [d1, d2] = pair; n1 = ri(1, d1 - 1); n2 = ri(1, d2 - 1);
    } else {
      const pair = pick([[4, 6], [6, 8], [5, 8], [6, 9], [8, 12], [9, 12]]);
      [d1, d2] = pair; n1 = ri(2, d1 - 1); n2 = ri(2, d2 - 1);
    }
    let equal = false;
    if (diff >= 2 && rng() < .18) {
      const cand = n1 * d2 / d1;
      if (Number.isInteger(cand) && cand > 0 && cand < d2) { n2 = cand; equal = true; }
    }
    if (!equal && n1 * d2 === n2 * d1) {
      n2 = (n2 + 1) % d2 || 1;
      if (n1 * d2 === n2 * d1) n2 = (n2 + 1) % d2 || 1;
    }
    const p1 = frac(n1, d1), p2 = frac(n2, d2);
    const correct = equal ? '一樣大' : (n1 * d2 > n2 * d1 ? p1 : p2);
    const wrongs = equal ? [p1, p2] : (correct === p1 ? [p2, '一樣大'] : [p1, '一樣大']);
    const explain = equal
      ? `交叉相乘：${n1} × ${d2} = ${n1 * d2}，${n2} × ${d1} = ${n2 * d1}，兩邊相等，所以一樣大。`
      : `交叉相乘：${n1} × ${d2} = ${n1 * d2}，${n2} × ${d1} = ${n2 * d1}。因為 ${Math.max(n1 * d2, n2 * d1)} > ${Math.min(n1 * d2, n2 * d1)}，所以 ${correct} 較大。`;
    return makeFrac(
      `比較 ${p1} 同 ${p2}，邊個較大？`,
      correct, wrongs, explain,
      { optionCols: 3, visual: diff === 1 ? fractionBars(n1, d1, n2, d2) : '' }
    );
  }

  if (type === 'equal') {
    const d = pick([3, 4, 5, 6]); const n = ri(1, d - 1);
    const k = ri(2, 4);
    const opts = fracOptionSet([n * k, d * k], [[n + k, d + k], [n * k, d], [n, d * k], [n * k + 1, d * k]]);
    return makeFrac(
      `邊個分數同 ${frac(n, d)} 相等？`,
      opts.correct, opts.wrongs,
      `分子同分母同時乘 ${k}：${frac(n, d)} = ${frac(n * k, d * k)}。`,
      { visual: '' }
    );
  }

  if (type === 'add') {
    let d1, d2, n1, n2, sub = false;
    if (diff === 1) {
      d1 = d2 = ri(6, 10); n1 = ri(1, 3); n2 = ri(1, 3);
    } else if (diff === 2) {
      [d1, d2] = pick([[2, 4], [3, 6], [4, 8], [2, 5], [3, 4], [5, 10]]);
      n1 = ri(1, d1 - 1); n2 = ri(1, d2 - 1);
    } else {
      [d1, d2] = pick([[3, 4], [4, 6], [5, 8], [6, 9], [8, 12]]);
      n1 = ri(2, d1 - 1); n2 = ri(2, d2 - 1);
      sub = rng() < .4;
    }
    if (sub && n1 / d1 <= n2 / d2) {
      [n1, n2] = [n2, n1]; [d1, d2] = [d2, d1];
      if (n1 / d1 <= n2 / d2) sub = false;
    }
    const l = lcm(d1, d2);
    const N1 = n1 * (l / d1), N2 = n2 * (l / d2);
    const num = sub ? N1 - N2 : N1 + N2;
    const [sn, sd] = simplify(num, l);
    const opts = fracOptionSet([sn, sd], [
      [num, d1 + d2], [N1 + N2, l], [Math.max(1, num + 1), l], [sn + 1, sd]
    ]);
    const op = sub ? '−' : '+';
    const explain = `通分：${frac(n1, d1)} ${op} ${frac(n2, d2)} = ${frac(N1, l)} ${op} ${frac(N2, l)} = ${frac(num, l)}${num !== sn ? ' = ' + opts.correct : ''}。`;
    return makeFrac(
      `${frac(n1, d1)} ${op} ${frac(n2, d2)} = ?`,
      opts.correct, opts.wrongs, explain, { optionCols: 2 }
    );
  }

  if (type === 'of') {
    const d = pick([3, 4, 5, 6]); const n = ri(1, d - 1);
    const each = ri(3, 9); const total = d * each;
    const ans = n * each;
    const distract = [total - ans, total / n, ans + n, each, ans + each].filter(v => Number.isFinite(v) && v > 0 && v !== ans);
    const wrongs = [...new Set(distract.map(disp))].slice(0, 3);
    while (wrongs.length < 3) wrongs.push(disp(ans + wrongs.length + 1));
    return choiceQ(Object.assign({}, base, {
      prompt: `${total} 嘅 ${frac(n, d)} 係幾多？`,
      correct: disp(ans),
      wrongs,
      explain: `${total} ÷ ${d} = ${each}，再乘 ${n}：${each} × ${n} = <b>${ans}</b>。`,
      center: true
    }));
  }

  if (type === 'simplify') {
    const d = pick([6, 8, 9, 10, 12]); const n = ri(2, d - 1);
    const g = gcd(n, d);
    if (g === 1) return genFraction(diff, stage);
    const opts = fracOptionSet([n / g, d / g], [
      [n, d / g], [n / g, d], [n + 1, d], [n + g, d]
    ]);
    return makeFrac(
      `化簡 ${frac(n, d)}`,
      opts.correct, opts.wrongs,
      `分子同分母嘅最大公因數係 ${g}，同時除以 ${g}，得到 ${opts.correct}。`
    );
  }

  if (type === 'multiply') {
    const d1 = pick([2, 3, 4, 5]), d2 = pick([3, 4, 5, 6]);
    const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
    const [sn, sd] = simplify(n1 * n2, d1 * d2);
    const opts = fracOptionSet([sn, sd], [
      [n1 * n2, d1 * d2], [n1 + n2, d1 + d2], [n1 * d2, n2 * d1], [n1 * n2 + 1, d1 * d2]
    ]);
    return makeFrac(
      `${frac(n1, d1)} × ${frac(n2, d2)} = ?`,
      opts.correct, opts.wrongs,
      `分子乘分子、分母乘分母：${frac(n1 * n2, d1 * d2)}${sn !== n1 * n2 ? ' = ' + opts.correct : ''}。`,
      { optionCols: 2 }
    );
  }

  if (type === 'divide') {
    const a = ri(1, 3), b = pick([2, 3, 4]), c = ri(1, 2), d = pick([3, 5]);
    const [sn, sd] = simplify(a * d, b * c);
    const opts = fracOptionSet([sn, sd], [
      [a * d, b * c], [a * c, b * d], [a * b, c * d], [sn + 1, sd]
    ]);
    return makeFrac(
      `${frac(a, b)} ÷ ${frac(c, d)} = ?`,
      opts.correct, opts.wrongs,
      `除以一個分數，等於乘佢嘅倒數：${frac(a, b)} × ${frac(d, c)} = ${frac(a * d, b * c)}${(sn !== a * d || sd !== b * c) ? ' = ' + opts.correct : ''}。`,
      { optionCols: 2 }
    );
  }

  return genFraction(2, stage);
}

/* ---------- 3. 圖形海灣 ---------- */
function svgWrap(inner, label) {
  return `<svg class="viz-svg" viewBox="0 0 300 180" role="img" aria-label="${label}">${inner}</svg>`;
}
function rectViz(w, h) {
  return svgWrap(`
    <rect x="60" y="34" width="180" height="106" rx="3" class="viz-fill" stroke="#0B7A72" stroke-width="2.4"/>
    <path d="M60 152h180" stroke="#879A9C" stroke-width="1.4"/>
    <path d="M60 148v8M240 148v8" stroke="#879A9C" stroke-width="1.4"/>
    <text x="150" y="170" text-anchor="middle" class="viz-num">${w} cm</text>
    <path d="M252 34v106" stroke="#879A9C" stroke-width="1.4"/>
    <path d="M248 34h8M248 140h8" stroke="#879A9C" stroke-width="1.4"/>
    <text x="266" y="92" text-anchor="middle" class="viz-num" transform="rotate(90 266 92)">${h} cm</text>
  `, `長方形，長 ${w} 厘米，闊 ${h} 厘米`);
}
function triViz(b, h) {
  return svgWrap(`
    <path d="M150 26 52 146h196z" class="viz-fill" stroke="#0B7A72" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M150 26v120" stroke="#879A9C" stroke-width="1.6" stroke-dasharray="4 4"/>
    <path d="M141 136h9v10" fill="none" stroke="#879A9C" stroke-width="1.4"/>
    <text x="150" y="166" text-anchor="middle" class="viz-num">底 ${b} cm</text>
    <text x="160" y="92" class="viz-num">高 ${h} cm</text>
  `, `三角形，底 ${b} 厘米，高 ${h} 厘米`);
}
function circleViz(r) {
  return svgWrap(`
    <circle cx="150" cy="86" r="58" class="viz-fill" stroke="#0B7A72" stroke-width="2.4"/>
    <circle cx="150" cy="86" r="3" fill="#0B7A72"/>
    <path d="M150 86h58" stroke="#E5432B" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="176" y="78" text-anchor="middle" class="viz-num">${r} cm</text>
    <text x="150" y="166" text-anchor="middle" class="viz-label">半徑 = ${r} cm</text>
  `, `圓形，半徑 ${r} 厘米`);
}
function paraViz(b, h) {
  return svgWrap(`
    <path d="M72 146 122 36h108L180 146z" class="viz-fill" stroke="#0B7A72" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M122 36v110" stroke="#879A9C" stroke-width="1.6" stroke-dasharray="4 4"/>
    <path d="M113 136h9v10" fill="none" stroke="#879A9C" stroke-width="1.4"/>
    <text x="150" y="166" text-anchor="middle" class="viz-num">底 ${b} cm</text>
    <text x="134" y="96" class="viz-num">高 ${h} cm</text>
  `, `平行四邊形，底 ${b} 厘米，高 ${h} 厘米`);
}
function trapeziumViz(a, b, h) {
  const top = 180, bot = 236;
  return svgWrap(`
    <path d="M${150 - top / 2} 36h${top}l${(bot - top) / 2} 108h-${bot}z" class="viz-fill" stroke="#0B7A72" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M150 36v108" stroke="#879A9C" stroke-width="1.6" stroke-dasharray="4 4"/>
    <text x="150" y="166" text-anchor="middle" class="viz-num">下底 ${b} cm</text>
    <text x="150" y="26" text-anchor="middle" class="viz-num">上底 ${a} cm</text>
    <text x="162" y="94" class="viz-num">高 ${h} cm</text>
  `, `梯形，上底 ${a} 厘米，下底 ${b} 厘米，高 ${h} 厘米`);
}
function cuboidViz(a, b, c) {
  return svgWrap(`
    <path d="M72 64h126v92H72z" class="viz-fill" stroke="#0B7A72" stroke-width="2.2"/>
    <path d="m72 64 32-26h126L198 64" fill="none" stroke="#0B7A72" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M198 64v92l32-26V38" fill="none" stroke="#0B7A72" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M72 156l32-26h126" fill="none" stroke="#0B7A72" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="135" y="174" text-anchor="middle" class="viz-num">長 ${a} cm</text>
    <text x="58" y="116" text-anchor="middle" class="viz-num" transform="rotate(-90 58 116)">高 ${c} cm</text>
    <text x="232" y="116" text-anchor="middle" class="viz-num" transform="rotate(-90 232 116)">闊 ${b} cm</text>
  `, `長方體，長 ${a} 厘米，闊 ${b} 厘米，高 ${c} 厘米`);
}
function angleTriViz(a, b) {
  return svgWrap(`
    <path d="M150 26 48 148h204z" class="viz-fill" stroke="#0B7A72" stroke-width="2.4" stroke-linejoin="round"/>
    <text x="150" y="52" text-anchor="middle" class="viz-num">${a}°</text>
    <text x="78" y="142" text-anchor="middle" class="viz-num">${b}°</text>
    <text x="224" y="142" text-anchor="middle" class="viz-num" fill="#D9492A">?</text>
  `, `三角形其中兩隻角是 ${a} 度和 ${b} 度`);
}
function pythViz(a, b, c) {
  return svgWrap(`
    <path d="M60 34v112h180z" class="viz-fill" stroke="#0B7A72" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M60 126h20v20" fill="none" stroke="#879A9C" stroke-width="1.5"/>
    <text x="50" y="94" text-anchor="middle" class="viz-num" transform="rotate(-90 50 94)">${a} cm</text>
    <text x="150" y="168" text-anchor="middle" class="viz-num">${b} cm</text>
    <text x="160" y="82" class="viz-num" fill="#D9492A">? cm</text>
  `, `直角三角形，兩條直角邊分別是 ${a} 厘米和 ${b} 厘米`);
}

function genGeometry(diff, stage) {
  const sec = stage === 'secondary';
  const base = { island: 'geometry', diff, kindLabel: '圖形與度量' };
  const make = (prompt, ansText, wrongs, explain, visual) => choiceQ(Object.assign({}, base, {
    prompt, correct: ansText, wrongs, explain, visual: visual || '', center: false
  }));

  const types = diff === 1
    ? ['rectArea', 'rectPerim', 'square', 'triangle']
    : diff === 2
      ? ['triangle', 'rectPerim', 'parallelogram', 'angle', 'circleC']
      : (sec ? ['circleA', 'cuboid', 'pyth', 'trapezium', 'angle'] : ['circleA', 'trapezium', 'cuboid', 'angle', 'triangle']);

  const type = pick(types);

  if (type === 'rectArea') {
    const w = ri(4, 13), h = ri(3, 9), ans = w * h;
    return make(`長方形長 ${w} cm、闊 ${h} cm，面積是多少？`, `${ans} cm²`,
      [`${2 * (w + h)} cm`, `${w + h} cm²`, `${ans + w} cm²`],
      `長方形面積 = 長 × 闊 = ${w} × ${h} = <b>${ans} cm²</b>。`, rectViz(w, h));
  }
  if (type === 'rectPerim') {
    const w = ri(5, 14), h = ri(3, 9), ans = 2 * (w + h);
    return make(`長方形長 ${w} cm、闊 ${h} cm，周界是多少？`, `${ans} cm`,
      [`${w * h} cm`, `${w + h} cm`, `${ans + 2} cm`],
      `長方形周界 = (長 + 闊) × 2 = (${w} + ${h}) × 2 = <b>${ans} cm</b>。`, rectViz(w, h));
  }
  if (type === 'square') {
    const s = ri(4, 12);
    if (rng() < .5) {
      const ans = s * 4;
      return make(`正方形邊長 ${s} cm，周界是多少？`, `${ans} cm`,
        [`${s * s} cm`, `${s * 2} cm`, `${ans + 4} cm`],
        `正方形四條邊一樣長：${s} × 4 = <b>${ans} cm</b>。`, rectViz(s, s));
    }
    const ans = s * s;
    return make(`正方形邊長 ${s} cm，面積是多少？`, `${ans} cm²`,
      [`${s * 4} cm²`, `${s * 2} cm²`, `${ans + s} cm²`],
      `正方形面積 = 邊長 × 邊長 = ${s} × ${s} = <b>${ans} cm²</b>。`, rectViz(s, s));
  }
  if (type === 'triangle') {
    const b = 2 * ri(3, 10), h = ri(4, 11), ans = b * h / 2;
    return make(`三角形底 ${b} cm、高 ${h} cm，面積是多少？`, `${ans} cm²`,
      [`${b * h} cm²`, `${b + h} cm²`, `${ans + b} cm²`],
      `三角形面積 = 底 × 高 ÷ 2 = ${b} × ${h} ÷ 2 = <b>${ans} cm²</b>。`, triViz(b, h));
  }
  if (type === 'parallelogram') {
    const b = ri(6, 14), h = ri(4, 9), ans = b * h;
    return make(`平行四邊形底 ${b} cm、高 ${h} cm，面積是多少？`, `${ans} cm²`,
      [`${b * h / 2} cm²`, `${2 * (b + h)} cm²`, `${ans + b} cm²`],
      `平行四邊形面積 = 底 × 高 = ${b} × ${h} = <b>${ans} cm²</b>。`, paraViz(b, h));
  }
  if (type === 'angle') {
    const a = ri(35, 80), b = ri(30, 75);
    const ans = 180 - a - b;
    return make(`三角形其中兩隻角是 ${a}° 和 ${b}°，第三隻角是多少？`, `${ans}°`,
      [`${180 - a}°`, `${a + b}°`, `${360 - a - b}°`],
      `三角形內角和是 180°：180° − ${a}° − ${b}° = <b>${ans}°</b>。`, angleTriViz(a, b));
  }
  if (type === 'circleC') {
    const r = pick([4, 5, 10]);
    const ans = Math.round(2 * 3.14 * r * 10) / 10;
    return make(`圓形半徑 ${r} cm，周界（圓周）是多少？〈取 π = 3.14〉`, `${ans} cm`,
      [`${Math.round(3.14 * r * 10) / 10} cm`, `${r * 2} cm`, `${Math.round(3.14 * r * r * 10) / 10} cm`],
      `圓周 = 2 × π × r = 2 × 3.14 × ${r} = <b>${ans} cm</b>。`, circleViz(r));
  }
  if (type === 'circleA') {
    const r = pick([4, 5, 10]);
    const ans = Math.round(3.14 * r * r * 100) / 100;
    return make(`圓形半徑 ${r} cm，面積是多少？〈取 π = 3.14〉`, `${ans} cm²`,
      [`${Math.round(2 * 3.14 * r * 10) / 10} cm²`, `${r * r} cm²`, `${Math.round(3.14 * 2 * r * 10) / 10} cm²`],
      `圓面積 = π × r² = 3.14 × ${r} × ${r} = <b>${ans} cm²</b>。`, circleViz(r));
  }
  if (type === 'trapezium') {
    const a = ri(4, 9), b = ri(a + 2, 15); const h = 2 * ri(2, 6);
    const ans = (a + b) * h / 2;
    return make(`梯形上底 ${a} cm、下底 ${b} cm、高 ${h} cm，面積是多少？`, `${ans} cm²`,
      [`${(a + b) * h} cm²`, `${a + b + h} cm²`, `${ans + 10} cm²`],
      `梯形面積 = (上底 + 下底) × 高 ÷ 2 = (${a} + ${b}) × ${h} ÷ 2 = <b>${ans} cm²</b>。`, trapeziumViz(a, b, h));
  }
  if (type === 'cuboid') {
    const a = ri(3, 8), b = ri(2, 7), c = ri(2, 6);
    const ans = a * b * c;
    return make(`長方體長 ${a} cm、闊 ${b} cm、高 ${c} cm，體積是多少？`, `${ans} cm³`,
      [`${a + b + c} cm³`, `${2 * (a * b + b * c + a * c)} cm³`, `${a * b} cm³`],
      `長方體體積 = 長 × 闊 × 高 = ${a} × ${b} × ${c} = <b>${ans} cm³</b>。`, cuboidViz(a, b, c));
  }
  if (type === 'pyth') {
    const k = ri(2, 5), a = 3 * k, b = 4 * k, c = 5 * k;
    return make(`直角三角形兩條直角邊分別是 ${a} cm 和 ${b} cm，斜邊是多少？`, `${c} cm`,
      [`${a + b} cm`, `${Math.abs(a - b)} cm`, `${c + 2} cm`],
      `畢氏定理：a² + b² = c²。${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}，所以斜邊 = <b>${c} cm</b>。`, pythViz(a, b, c));
  }

  return genGeometry(1, stage);
}

/* ---------- 4. 應用題沙漠 ---------- */
function genWord(diff, stage) {
  const sec = stage === 'secondary';
  const base = { island: 'word', diff, kindLabel: '應用題' };
  const names = ['阿澄', '小美', '家朗', '詠恩', '子謙', '樂兒'];
  const name = pick(names);

  const types = diff === 1
    ? ['shopping', 'group', 'speedH', 'areaCost']
    : diff === 2
      ? ['average', 'discount', 'ratio', 'speedM', 'areaCost']
      : (sec ? ['interest', 'profit', 'work', 'percentUp', 'twoItem'] : ['percentUp', 'work', 'twoItem', 'discount']);

  const type = pick(types);

  if (type === 'shopping') {
    const price = ri(12, 45), qty = ri(2, 5);
    const total = price * qty;
    const paid = Math.ceil((total + ri(5, 35)) / 10) * 10;
    const ans = paid - total;
    return inputQ(Object.assign({}, base, {
      prompt: `${name}買 ${qty} 本筆記簿，每本 $${price}。佢付咗 $${paid}，應找回多少元？`,
      answer: ans, unit: '元',
      hint: `先計 ${qty} 本筆記簿嘅總價：$${price} × ${qty}。`,
      explain: `${qty} 本筆記簿共 $${price} × ${qty} = $${total}。找回 $${paid} − $${total} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'group') {
    const groups = ri(3, 8), each = ri(4, 12), total = groups * each;
    return inputQ(Object.assign({}, base, {
      prompt: `${total} 粒糖平均分給 ${groups} 位同學，每人可分到多少粒？`,
      answer: each, unit: '粒',
      hint: `把 ${total} 平均分成 ${groups} 份。`,
      explain: `${total} ÷ ${groups} = <b>${each}</b> 粒。`
    }));
  }
  if (type === 'speedH') {
    const speed = ri(6, 15), hours = ri(2, 4), ans = speed * hours;
    return inputQ(Object.assign({}, base, {
      prompt: `旅遊巴以每小時 ${speed} 公里行駛 ${hours} 小時，共行駛多少公里？`,
      answer: ans, unit: '公里',
      hint: '距離 = 速度 × 時間。',
      explain: `距離 = ${speed} × ${hours} = <b>${ans}</b> 公里。`
    }));
  }
  if (type === 'areaCost') {
    const w = ri(3, 10), h = ri(3, 8), cost = ri(8, 20);
    const ans = w * h * cost;
    return inputQ(Object.assign({}, base, {
      prompt: `一塊長方形草地長 ${w} m、闊 ${h} m。每平方米鋪草皮 $${cost}，共需多少元？`,
      answer: ans, unit: '元',
      hint: `先計草地嘅面積：${w} × ${h} 平方米。`,
      explain: `面積 = ${w} × ${h} = ${w * h} m²。總費用 = ${w * h} × $${cost} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'average') {
    const mean = ri(58, 88);
    const patterns = [[-9, -3, 3, 9], [-6, -3, 3, 6], [-6, 0, 0, 6], [-3, 0, 0, 3], [-9, 0, 0, 9], [-3, -3, 3, 3]];
    const off = pick(patterns);
    const scores = off.map(o => mean + o);
    const list = shuffle(scores);
    return inputQ(Object.assign({}, base, {
      prompt: `${name}四次數學測驗嘅分數係 ${list.join('、')}，平均分是多少？`,
      answer: mean, unit: '分',
      hint: '先把四個分數加起來，再除以 4。',
      explain: `總分 = ${list.join(' + ')} = ${mean * 4}。平均分 = ${mean * 4} ÷ 4 = <b>${mean}</b> 分。`
    }));
  }
  if (type === 'discount') {
    const price = pick([200, 300, 400, 500, 800]);
    const p = pick([10, 20, 25]);
    const off = price * p / 100;
    const ans = price - off;
    return inputQ(Object.assign({}, base, {
      prompt: `一件外套原價 $${price}，現在減價 ${p}%。售價是多少元？`,
      answer: ans, unit: '元',
      hint: `減價金額 = $${price} × ${p}%。`,
      explain: `減價 $${price} × ${p}% = $${off}。售價 = $${price} − $${off} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'ratio') {
    const a = pick([2, 3, 4]), b = pick([3, 5, 7]);
    const k = ri(3, 8), given = a * k, ans = b * k;
    return inputQ(Object.assign({}, base, {
      prompt: `朱古力同糖果嘅數量比是 ${a} : ${b}。如果有 ${given} 粒朱古力，糖果有多少粒？`,
      answer: ans, unit: '粒',
      hint: `${given} 粒朱古力係 ${a} 份，先搵每份有多少粒。`,
      explain: `每份 = ${given} ÷ ${a} = ${k} 粒。糖果有 ${b} 份：${k} × ${b} = <b>${ans}</b> 粒。`
    }));
  }
  if (type === 'speedM') {
    const minutes = pick([30, 45]);
    const speed = minutes === 45 ? pick([8, 12, 16, 20]) : pick([8, 10, 12, 14]);
    const ans = speed * minutes / 60;
    return inputQ(Object.assign({}, base, {
      prompt: `單車以每小時 ${speed} 公里行駛 ${minutes} 分鐘，即係行咗多少公里？`,
      answer: ans, unit: '公里',
      hint: `先把 ${minutes} 分鐘化做小時。`,
      explain: `${minutes} 分鐘 = ${minutes}/60 小時 = ${minutes / 60} 小時。距離 = ${speed} × ${minutes / 60} = <b>${fmt(ans)}</b> 公里。`
    }));
  }
  if (type === 'twoItem') {
    const p1 = ri(8, 20), p2 = ri(15, 35), q1 = 3, q2 = 2;
    const total = p1 * q1 + p2 * q2;
    const paid = Math.ceil((total + ri(10, 50)) / 10) * 10;
    const ans = paid - total;
    return inputQ(Object.assign({}, base, {
      prompt: `${name}買了 ${q1} 支筆（每支 $${p1}）和 ${q2} 本簿（每本 $${p2}），付咗 $${paid}，應找回多少元？`,
      answer: ans, unit: '元',
      hint: `分開計筆同簿嘅價錢，再加埋一齊。`,
      explain: `筆：$${p1} × ${q1} = $${p1 * q1}；簿：$${p2} × ${q2} = $${p2 * q2}。共 $${total}，找回 $${paid} − $${total} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'percentUp') {
    const price = pick([200, 300, 400, 500, 800]);
    const p = pick([10, 15, 20, 25]);
    const ans = price * (100 + p) / 100;
    return inputQ(Object.assign({}, base, {
      prompt: `一對球鞋原價 $${price}，加價 ${p}% 後售價是多少元？`,
      answer: ans, unit: '元',
      hint: `加價金額 = $${price} × ${p}%。`,
      explain: `加價 $${price} × ${p}% = $${price * p / 100}。新售價 = $${price} + $${price * p / 100} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'work') {
    const p1 = 6, d1 = pick([8, 10, 12]), p2 = pick([3, 4]);
    if ((p1 * d1) % p2 !== 0) return genWord(diff, stage);
    const ans = p1 * d1 / p2;
    return inputQ(Object.assign({}, base, {
      prompt: `一項工程由 ${p1} 位工人做，需要 ${d1} 日完成。如果由 ${p2} 位工人做，需要多少日？`,
      answer: ans, unit: '日',
      hint: '總工作量不變：人數 × 日數 = 總工作量。',
      explain: `總工作量 = ${p1} × ${d1} = ${p1 * d1} 人日。${p2} 人做：${p1 * d1} ÷ ${p2} = <b>${ans}</b> 日。`
    }));
  }
  if (type === 'interest') {
    const principal = pick([2000, 3000, 4000, 5000, 8000]);
    const rate = pick([3, 4, 5]);
    const years = pick([2, 3]);
    const ans = principal * rate * years / 100;
    return inputQ(Object.assign({}, base, {
      prompt: `把 $${principal} 存入銀行，年利率 ${rate}%，存 ${years} 年。單利息是多少元？`,
      answer: ans, unit: '元',
      hint: '單利息 = 本金 × 年利率 × 年數。',
      explain: `利息 = ${principal} × ${rate}% × ${years} = <b>$${ans}</b>。`
    }));
  }
  if (type === 'profit') {
    const cost = pick([60, 80, 100, 120, 160]);
    const p = pick([10, 20, 25]);
    const ans = cost * p / 100;
    return inputQ(Object.assign({}, base, {
      prompt: `一件貨品成本 $${cost}，以 ${p}% 利潤售出。利潤是多少元？`,
      answer: ans, unit: '元',
      hint: '利潤 = 成本 × 利潤率。',
      explain: `利潤 = $${cost} × ${p}% = <b>$${ans}</b>。`
    }));
  }

  return genWord(1, stage);
}

/* ---------- 5. 方程山洞 ---------- */
function genAlgebra(diff, stage) {
  const sec = stage === 'secondary';
  const base = { island: 'algebra', diff, kindLabel: '代數' };
  const x = '<span class="x">x</span>';
  const unk = '<span class="unk">?</span>';
  const eq = html => `<div class="eqline">${html}</div>`;
  const make = (prompt, visual, ans, explain) => inputQ(Object.assign({}, base, { prompt, visual, answer: ans, unit: '', hint: '記住：等式兩邊要同步做同一個動作。', explain }));

  if (!sec) {
    if (diff === 1) {
      const type = pick(['add', 'sub', 'mul']);
      if (type === 'add') {
        const a = ri(3, 15), ans = ri(2, 12), b = a + ans;
        return make('搵出 ? 代表嘅數。', eq(`${a} + ${unk} = ${b}`), ans,
          `兩邊同時減 ${a}：? = ${b} − ${a} = <b>${ans}</b>。`);
      }
      if (type === 'sub') {
        const ans = ri(2, 9), a = ri(2, 9), b = ans + a;
        return make('搵出 ? 代表嘅數。', eq(`${b} − ${unk} = ${a}`), ans,
          `兩邊同時加 ?，再整理：? = ${b} − ${a} = <b>${ans}</b>。`);
      }
      const a = ri(2, 9), ans = ri(2, 9), b = a * ans;
      return make('搵出 ? 代表嘅數。', eq(`${unk} × ${a} = ${b}`), ans,
        `兩邊同時除以 ${a}：? = ${b} ÷ ${a} = <b>${ans}</b>。`);
    }
    if (diff === 2) {
      const type = pick(['two', 'div']);
      if (type === 'two') {
        const a = ri(2, 4), ans = ri(2, 9), b = ri(2, 9), c = a * ans + b;
        return make('搵出 ? 代表嘅數。', eq(`${a} × ${unk} + ${b} = ${c}`), ans,
          `兩邊先減 ${b}：${a} × ? = ${c - b}；再除以 ${a}：? = <b>${ans}</b>。`);
      }
      const a = ri(2, 4), q = ri(2, 7), ans = q * a, b = ri(2, 8), c = q + b;
      return make('搵出 ? 代表嘅數。', eq(`${frac('?', a)} + ${b} = ${c}`), ans,
        `兩邊先減 ${b}：? / ${a} = ${q}；再乘 ${a}：? = ${q} × ${a} = <b>${ans}</b>。`);
    }
    const type = pick(['bracket', 'three']);
    if (type === 'bracket') {
      const a = ri(2, 4), ans = ri(2, 7), b = ri(2, 6), c = a * (ans + b);
      return make('搵出 ? 代表嘅數。', eq(`${a}(${unk} + ${b}) = ${c}`), ans,
        `兩邊先除以 ${a}：? + ${b} = ${c / a}；再減 ${b}：? = <b>${ans}</b>。`);
    }
    const a = ri(2, 4), ans = ri(2, 8), b = ri(2, 8), c = a * ans - b;
    return make('搵出 ? 代表嘅數。', eq(`${a} × ${unk} − ${b} = ${c}`), ans,
      `兩邊先加 ${b}：${a} × ? = ${c + b}；再除以 ${a}：? = <b>${ans}</b>。`);
  }

  /* secondary */
  if (diff === 2) {
    const type = pick(['plus', 'minus', 'frac']);
    if (type === 'plus') {
      const a = ri(2, 6), ans = ri(2, 10), b = ri(2, 10), c = a * ans + b;
      return make('解方程，求 x 的值。', eq(`${a}${x} + ${b} = ${c}`), ans,
        `兩邊同時減 ${b}：${a}x = ${c - b}；兩邊除以 ${a}：x = <b>${ans}</b>。`);
    }
    if (type === 'minus') {
      const a = ri(2, 6), ans = ri(2, 10), b = ri(2, 10), c = a * ans - b;
      return make('解方程，求 x 的值。', eq(`${a}${x} − ${b} = ${c}`), ans,
        `兩邊同時加 ${b}：${a}x = ${c + b}；兩邊除以 ${a}：x = <b>${ans}</b>。`);
    }
    const a = ri(2, 5), ans = ri(2, 8), b = ri(2, 8), c = ans + b;
    return make('解方程，求 x 的值。', eq(`${frac(x, a)} + ${b} = ${c}`), ans,
      `兩邊先減 ${b}：x / ${a} = ${c - b}；兩邊乘 ${a}：x = <b>${ans}</b>。`);
  }

  const type = pick(['bracket', 'both', 'fractions']);
  if (type === 'bracket') {
    const a = ri(2, 5), ans = ri(2, 8), b = ri(2, 6), c = a * (ans + b);
    return make('解方程，求 x 的值。', eq(`${a}(${x} + ${b}) = ${c}`), ans,
      `兩邊先除以 ${a}：x + ${b} = ${c / a}；再減 ${b}：x = <b>${ans}</b>。`);
  }
  if (type === 'both') {
    const ans = ri(3, 7);
    const b = 2 * ans + ri(3, 10);
    const d = b - 2 * ans;
    return make('解方程，求 x 的值。', eq(`2${x} + ${b} = 4${x} + ${d}`), ans,
      `把 x 移去一邊：${b} − ${d} = 4x − 2x，即 ${b - d} = 2x；x = <b>${ans}</b>。`);
  }
  const ans = 6 * ri(1, 3);
  const c = ans / 2 + ans / 3;
  return make('解方程，求 x 的值。', eq(`${frac(x, 2)} + ${frac(x, 3)} = ${c}`), ans,
    `通分：${frac('3x', 6)} + ${frac('2x', 6)} = ${frac('5x', 6)} = ${c}；x = ${c} × 6 ÷ 5 = <b>${ans}</b>。`);
}

/* ---------- 6. 數據燈塔 ---------- */
function barViz(labels, values, unit = '本') {
  const max = Math.max(...values, 1);
  const base = 146, top = 36, chartH = 98;
  const n = values.length;
  const gap = 18, barW = Math.min(40, (250 - gap * (n - 1)) / n);
  const totalW = barW * n + gap * (n - 1);
  const x0 = 32 + (254 - totalW) / 2;
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const y = base - chartH * g / 4;
    grid += `<line x1="28" y1="${y}" x2="286" y2="${y}" stroke="#13343B" stroke-width=".7" opacity="${g === 0 ? .24 : .07}"/>`;
  }
  let bars = '';
  values.forEach((v, i) => {
    const h = Math.max(6, v / max * chartH);
    const x = x0 + i * (barW + gap);
    bars += `<rect x="${x}" y="${base - h}" width="${barW}" height="${h}" rx="5" fill="${i % 2 ? '#E8A21E' : '#16A394'}"/>
      <text x="${x + barW / 2}" y="${base - h - 6}" text-anchor="middle" font-size="10" font-weight="800" fill="#13343B">${v}</text>
      <text x="${x + barW / 2}" y="${base + 16}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#547077">${labels[i]}</text>`;
  });
  return `<svg class="viz-svg" viewBox="0 0 300 180" role="img" aria-label="長條圖：${labels.map((l, i) => l + ' ' + values[i] + unit).join('，')}">
    <text x="28" y="20" font-size="9" font-weight="800" fill="#879A9C">圖書館借書量（${unit}）</text>
    ${grid}${bars}
  </svg>`;
}

function genData(diff, stage) {
  const sec = stage === 'secondary';
  const base = { island: 'data', diff, kindLabel: '數據與概率' };

  if (diff === 1 || (diff === 2 && rng() < .6) || (diff === 3 && rng() < .35)) {
    const labels = ['一', '二', '三', '四'];
    const pool = shuffle([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const values = pool.slice(0, 4);
    const maxI = values.indexOf(Math.max(...values));
    const minI = values.indexOf(Math.min(...values));
    const total = values.reduce((a, b) => a + b, 0);
    const type = diff === 1 ? pick(['max', 'min', 'total']) : pick(['diff', 'total', 'max']);
    if (type === 'max') {
      return choiceQ(Object.assign({}, base, {
        prompt: '根據圖表，邊一日借出嘅圖書最多？',
        correct: '星期' + labels[maxI],
        wrongs: labels.filter((_, i) => i !== maxI).map(l => '星期' + l),
        explain: `最高嘅長條係星期${labels[maxI]}，有 ${values[maxI]} 本。`,
        visual: barViz(labels, values), center: false
      }));
    }
    if (type === 'min') {
      return choiceQ(Object.assign({}, base, {
        prompt: '根據圖表，邊一日借出嘅圖書最少？',
        correct: '星期' + labels[minI],
        wrongs: labels.filter((_, i) => i !== minI).map(l => '星期' + l),
        explain: `最低嘅長條係星期${labels[minI]}，有 ${values[minI]} 本。`,
        visual: barViz(labels, values)
      }));
    }
    if (type === 'total') {
      return inputQ(Object.assign({}, base, {
        prompt: '根據圖表，四日一共借出多少本圖書？',
        answer: total, unit: '本',
        hint: '把四條長條嘅數值加起來。',
        explain: `${values.join(' + ')} = <b>${total}</b> 本。`,
        visual: barViz(labels, values)
      }));
    }
    const d = Math.abs(values[maxI] - values[minI]);
    return inputQ(Object.assign({}, base, {
      prompt: `根據圖表，借書最多嘅一日比最少嘅一日多多少本？`,
      answer: d, unit: '本',
      hint: `最多 ${values[maxI]} 本，最少 ${values[minI]} 本。`,
      explain: `${values[maxI]} − ${values[minI]} = <b>${d}</b> 本。`,
      visual: barViz(labels, values)
    }));
  }

  if (diff === 2) {
    const type = pick(['mean', 'range', 'mode', 'prob']);
    if (type === 'mean') {
      const mean = ri(6, 15);
      const off = pick([[-3, -1, 1, 3], [-2, 0, 0, 2], [-4, 0, 0, 4], [-3, -3, 3, 3]]);
      const nums = shuffle(off.map(o => mean + o));
      return inputQ(Object.assign({}, base, {
        prompt: `四個數 ${nums.join('、')} 的平均數是多少？`,
        answer: mean, unit: '',
        hint: '總和 ÷ 數量。',
        explain: `總和 = ${nums.join(' + ')} = ${mean * 4}；平均數 = ${mean * 4} ÷ 4 = <b>${mean}</b>。`
      }));
    }
    if (type === 'range') {
      const nums = [ri(3, 20), ri(3, 20), ri(3, 20), ri(3, 20), ri(3, 20)];
      const ans = Math.max(...nums) - Math.min(...nums);
      return inputQ(Object.assign({}, base, {
        prompt: `五個數 ${nums.join('、')} 的範圍（最大減最小）是多少？`,
        answer: ans, unit: '',
        hint: '先搵最大同最細嘅數。',
        explain: `最大 ${Math.max(...nums)}，最小 ${Math.min(...nums)}，範圍 = <b>${ans}</b>。`
      }));
    }
    if (type === 'mode') {
      const mode = ri(4, 12);
      const a = ri(13, 20), b = ri(13, 20);
      const nums = shuffle([mode, mode, a, b, mode]);
      return choiceQ(Object.assign({}, base, {
        prompt: `五個數 ${nums.join('、')} 的眾數是多少？`,
        correct: String(mode),
        wrongs: [String(a), String(b), String(mode + 1)],
        explain: `眾數係出現次數最多嘅數。${mode} 出現咗 3 次，所以眾數係 <b>${mode}</b>。`
      }));
    }
    const p = pick([['擲一粒骰子，擲到偶數嘅機會是多少？', '1/2', ['1/3', '1/6', '1/4']],
      ['擲一粒骰子，擲到 5 或 6 嘅機會是多少？', '1/3', ['1/2', '1/6', '2/3']],
      ['擲一粒骰子，擲到 6 嘅機會是多少？', '1/6', ['1/3', '1/2', '1/5']]]);
    return choiceQ(Object.assign({}, base, {
      prompt: p[0], correct: frac(Number(p[1].split('/')[0]), Number(p[1].split('/')[1])),
      wrongs: p[2].map(f => { const [a, b] = f.split('/'); return frac(Number(a), Number(b)); }),
      explain: '機會 = 符合條件嘅結果數 ÷ 所有可能結果數。骰子有 6 個可能結果。',
      center: true
    }));
  }

  const type = pick(['median', 'missingMean', 'prob8', 'mean5']);
  if (type === 'median') {
    const nums = Array.from({ length: 5 }, () => ri(3, 20)).sort((a, b) => a - b);
    const ans = nums[2];
    return inputQ(Object.assign({}, base, {
      prompt: `五個數 ${shuffle(nums).join('、')} 的中位數是多少？`,
      answer: ans, unit: '',
      hint: '先由小至大排列，再搵中間嘅數。',
      explain: `排序後：${nums.join('、')}。中間嘅數係 <b>${ans}</b>。`
    }));
  }
  if (type === 'missingMean') {
    const mean = ri(6, 14);
    const four = [ri(3, 18), ri(3, 18), ri(3, 18), ri(3, 18)];
    const ans = mean * 5 - four.reduce((a, b) => a + b, 0);
    if (ans <= 0 || ans > 20) return genData(diff, stage);
    return inputQ(Object.assign({}, base, {
      prompt: `五次測驗嘅平均分是 ${mean} 分。其中四次是 ${four.join('、')} 分，第五次是多少分？`,
      answer: ans, unit: '分',
      hint: `五次總分 = ${mean} × 5。`,
      explain: `五次總分 = ${mean} × 5 = ${mean * 5}。第五次 = ${mean * 5} − (${four.join(' + ')}) = <b>${ans}</b> 分。`
    }));
  }
  if (type === 'prob8') {
    return choiceQ(Object.assign({}, base, {
      prompt: '一個轉盤平均分成 8 格，分別寫上 1 至 8。轉到 3 嘅倍數嘅機會是多少？',
      correct: frac(2, 8),
      wrongs: [frac(3, 8), frac(1, 8), frac(1, 3)],
      explain: '3 嘅倍數有 3 和 6，共 2 格。機會 = 2/8 = <b>1/4</b>。',
      center: true
    }));
  }
  const mean = ri(7, 15);
  const off = [[-2, -1, 0, 1, 2], [-4, -1, 0, 2, 3], [-3, -2, 0, 2, 3]][ri(0, 2)];
  const nums = shuffle(off.map(o => mean + o));
  return inputQ(Object.assign({}, base, {
    prompt: `五個數 ${nums.join('、')} 的平均數是多少？`,
    answer: mean, unit: '',
    hint: '總和 ÷ 5。',
    explain: `總和 = ${nums.join(' + ')} = ${mean * 5}；平均數 = ${mean * 5} ÷ 5 = <b>${mean}</b>。`
  }));
}

/* ---------- build a run ---------- */
function genQuestion(island, diff, stage) {
  if (island === 'volcano') return genVolcano(diff, stage);
  if (island === 'fraction') return genFraction(diff, stage);
  if (island === 'geometry') return genGeometry(diff, stage);
  if (island === 'word') return genWord(diff, stage);
  if (island === 'algebra') return genAlgebra(diff, stage);
  if (island === 'data') return genData(diff, stage);
  return genVolcano(1, stage);
}

function buildQuestions(islandId, diff, count, seedValue) {
  seedRng(String(seedValue || (Date.now() + Math.random())));
  const stage = S.player.stage;
  const out = [];
  const seen = new Set();
  let guard = 0;
  while (out.length < count && guard < 400) {
    guard++;
    let q;
    try { q = genQuestion(islandId, diff, stage); } catch (e) { q = null; }
    if (!q || !q.prompt) continue;
    const key = textOf(q.prompt) + '|' + textOf(q.visual || '').slice(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);
    q.island = islandId;
    q.diff = diff;
    q.id = uid('q');
    out.push(q);
  }
  return out;
}
