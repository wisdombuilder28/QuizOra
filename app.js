/* ============================================================
   STATE
   ============================================================ */
const state = {
  phase: "subject",
  subject: null, difficulty: null, count: 5,
  questions: [], index: 0, selected: null,
  score: 0, answers: [], streak: 0, bestStreak: 0,
  theme: "dark",
};

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const stored = localStorage.getItem("qo-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  state.theme = stored || (prefersDark ? "dark" : "light");
  applyTheme();
}
function applyTheme() {
  document.documentElement.classList.toggle("light", state.theme === "light");
  localStorage.setItem("qo-theme", state.theme);
}
function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
  render();
}

/* ============================================================
   DOM HELPERS
   ============================================================ */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "className")       node.className = v;
      else if (k === "innerHTML")  node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else node.setAttribute(k, v);
    }
  }
  children.flat().forEach(c => {
    if (c == null) return;
    node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  });
  return node;
}

function svgIcon(path, size = 16) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", size); s.setAttribute("height", size);
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none");
  s.setAttribute("stroke", "currentColor"); s.setAttribute("stroke-width", "2");
  s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
  s.innerHTML = path;
  return s;
}

const SUN  = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
const MOON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
const ARR  = '<path d="M5 12h14M12 5l7 7-7 7"/>';

/* ============================================================
   PARTICLES & CONFETTI
   ============================================================ */
function spawnParticles(x, y) {
  const colors = ["#5469f8","#8b5cf6","#22d3ee","#f59e0b","#10b981","#fff"];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 55 + Math.random() * 55;
    p.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;width:${5+Math.random()*5}px;height:${5+Math.random()*5}px;`;
    APP.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function spawnConfetti() {
  const colors = ["#5469f8","#8b5cf6","#22d3ee","#f59e0b","#10b981","#f87171","#34d399"];
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-bit";
      const w = 4 + Math.random() * 7, h = 5 + Math.random() * 9;
      c.style.cssText = `left:${Math.random()*100}%;width:${w}px;height:${h}px;background:${colors[i%colors.length]};border-radius:${Math.random()>.4?"50%":"2px"};animation-duration:${1.8+Math.random()*2.2}s;animation-delay:${Math.random()*0.6}s;`;
      APP.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }, i * 16);
  }
}

/* ============================================================
   KEYBOARD
   ============================================================ */
document.addEventListener("keydown", e => {
  if (state.phase !== "playing") return;
  const q = state.questions[state.index];
  if (!q) return;
  if (!state.selected) {
    const idx = ["1","2","3","4"].indexOf(e.key);
    if (idx >= 0 && idx < q.shuffledOptions.length) pickOption(q.shuffledOptions[idx]);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextQuestion();
  }
});

/* ============================================================
   PREPARE QUIZ
   ============================================================ */
function prepare(subject, difficulty, count) {
  const pool = getQuestions(subject, difficulty);
  return shuffle(pool).slice(0, Math.min(count, pool.length)).map(q => ({
    ...q, shuffledOptions: shuffle(q.options),
  }));
}

/* ============================================================
   MAIN RENDER
   ============================================================ */
const APP = document.getElementById("app");

function render() {
  APP.innerHTML = "";

  // Background
  const bg = document.createElement("div");
  bg.className = "bg-fx";
  bg.innerHTML = '<div class="bg-grid"></div><div class="glow-a"></div><div class="glow-b"></div>';
  APP.appendChild(bg);

  const wrap = el("div", { className: "container" });
  wrap.appendChild(buildHeader());

  const content = el("div", { className: "content" });
  if      (state.phase === "subject")    content.appendChild(buildSubjectScreen());
  else if (state.phase === "difficulty") content.appendChild(buildDifficultyScreen());
  else if (state.phase === "playing")    content.appendChild(buildPlayingScreen());
  else if (state.phase === "finished")   content.appendChild(buildResultsScreen());
  else if (state.phase === "review")     content.appendChild(buildReviewScreen());
  wrap.appendChild(content);
  APP.appendChild(wrap);
}

/* ============================================================
   HEADER
   ============================================================ */
function buildHeader() {
  const end = el("div", { className: "header-end" });

  const subMeta = state.subject ? SUBJECTS.find(s => s.id === state.subject) : null;
  if (subMeta && ["playing","finished","review"].includes(state.phase))
    end.appendChild(el("span", { className: "pill hidden-xs" }, subMeta.icon + " " + subMeta.label));
  if (state.difficulty && ["playing","finished","review"].includes(state.phase))
    end.appendChild(el("span", { className: "pill " + state.difficulty }, state.difficulty));
  if (state.streak >= 3 && state.phase === "playing")
    end.appendChild(el("span", { className: "streak-badge", id: "streakBadge" }, "🔥 " + state.streak + " streak"));

  const themeBtn = el("button", { className: "theme-btn", "aria-label": "Toggle theme", onclick: toggleTheme });
  themeBtn.appendChild(svgIcon(state.theme === "dark" ? SUN : MOON));
  end.appendChild(themeBtn);

  return el("header", { className: "header" },
    el("button", { className: "logo-btn", onclick: backToStart },
      el("span", { className: "logo-mark" }, "Q"),
      el("span", { className: "logo-label" }, "QuizOra")
    ),
    end
  );
}

/* ============================================================
   SUBJECT SCREEN
   ============================================================ */
function buildSubjectScreen() {
  const wrap = el("div", { className: "anim-up" });
  const hero = el("div", { className: "center" });
  hero.appendChild(el("span", { className: "eyebrow" }, "Step 1 · Choose a Subject"));
  const title = el("h1", { className: "screen-title" });
  title.innerHTML = "What do you want<br><span class='g-text'>to be tested on?</span>";
  hero.appendChild(title);
  hero.appendChild(el("p", { className: "screen-sub" },
    "Pick a subject, choose your difficulty, set how many questions — then prove what you know."));
  wrap.appendChild(hero);

  const list = el("div", { className: "card-list" });
  SUBJECTS.forEach((s, i) => {
    const btn = el("button", {
      className: "card-btn anim-up",
      style: { animationDelay: (i * 0.08) + "s" },
      onclick: () => pickSubject(s.id),
    });
    btn.appendChild(el("span", { className: "card-icon" }, s.icon));
    const txt = el("div", { className: "card-text" });
    txt.appendChild(el("h3", {}, s.label));
    txt.appendChild(el("p", {}, s.blurb));
    btn.appendChild(txt);
    const arr = el("span", { className: "card-arrow" });
    arr.appendChild(svgIcon(ARR));
    btn.appendChild(arr);
    list.appendChild(btn);
  });
  wrap.appendChild(list);
  return wrap;
}

function pickSubject(s) {
  state.subject = s;
  state.difficulty = null;
  state.phase = "difficulty";
  render();
}

/* ============================================================
   DIFFICULTY SCREEN
   ============================================================ */
function buildDifficultyScreen() {
  const sub = SUBJECTS.find(s => s.id === state.subject);
  const wrap = el("div", { className: "anim-up" });

  const hero = el("div", { className: "center" });
  hero.appendChild(el("span", { className: "eyebrow" }, "Step 2 · Pick Difficulty"));
  hero.appendChild(el("h1", { className: "screen-title" }, sub.icon + " " + sub.label));
  hero.appendChild(el("p", { className: "screen-sub" }, "How much of a challenge are you in the mood for?"));
  wrap.appendChild(hero);

  const list = el("div", { className: "card-list" });
  DIFFICULTIES.forEach((d, i) => {
    const total = getQuestions(state.subject, d.id).length;
    const btn = el("button", {
      className: "card-btn anim-up" + (state.difficulty === d.id ? " active" : ""),
      style: { animationDelay: (i * 0.07) + "s" },
      onclick: () => selectDifficulty(d.id, total),
    });
    btn.appendChild(el("span", { className: "diff-label " + d.id }, d.label));
    const txt = el("div", { className: "card-text" });
    txt.appendChild(el("p", {}, d.blurb));
    btn.appendChild(txt);
    btn.appendChild(el("span", { className: "q-count" }, total + " Qs"));
    list.appendChild(btn);
  });
  wrap.appendChild(list);

  if (state.difficulty) {
    const maxQ = getQuestions(state.subject, state.difficulty).length;
    const cur  = Math.min(state.count, maxQ);

    const panel = el("div", { className: "count-panel" });
    const top   = el("div", { className: "count-top" });
    const lbl   = el("div");
    lbl.appendChild(el("div", { className: "count-label" }, "Questions"));
    lbl.appendChild(el("div", { className: "count-desc"  }, "Up to " + maxQ + " available"));
    top.appendChild(lbl);
    top.appendChild(el("div", { className: "count-num", id: "cntDisp" }, String(cur)));
    panel.appendChild(top);

    const slider = el("input", {
      type: "range", min: 1, max: maxQ, value: cur,
      oninput: e => {
        state.count = +e.target.value;
        const d = document.getElementById("cntDisp");
        if (d) d.textContent = state.count;
        const b = document.getElementById("startBtn");
        if (b) b.textContent = "Start " + state.count + " " + (state.count === 1 ? "question" : "questions") + " →";
      },
    });
    panel.appendChild(slider);
    panel.appendChild(el("div", { className: "range-labels" },
      el("span", {}, "1"), el("span", {}, String(maxQ))));

    panel.appendChild(el("button", {
      id: "startBtn",
      className: "btn-primary",
      onclick: () => startQuiz(state.subject, state.difficulty, Math.min(state.count, maxQ)),
    }, "Start " + cur + " " + (cur === 1 ? "question" : "questions") + " →"));

    wrap.appendChild(panel);
  }

  wrap.appendChild(el("button", { className: "back-link", onclick: backToStart }, "← Change subject"));
  return wrap;
}

function selectDifficulty(d, total) {
  state.difficulty = d;
  state.count = Math.min(state.count, total);
  render();
}

/* ============================================================
   PLAYING SCREEN
   build once — pickOption updates DOM in-place so transitions fire
   ============================================================ */
function buildPlayingScreen() {
  const q     = state.questions[state.index];
  const total = state.questions.length;
  const pct   = Math.round((state.index / total) * 100);
  const isLast = state.index + 1 >= total;

  const screen = el("div", { className: "anim-in" });

  // ---- Progress bar ----
  screen.appendChild(
    el("div", { className: "progress-wrap" },
      el("div", { className: "progress-meta" },
        el("span", {}, "Question " + (state.index + 1) + " of " + total),
        el("span", {}, pct + "%")
      ),
      el("div", { className: "progress-track" },
        el("div", { className: "progress-fill", style: { width: pct + "%" } })
      )
    )
  );

  // ---- Question ----
  screen.appendChild(el("h2", { className: "question-text" }, q.q));

  // ---- Options ----
  const optList = el("div", { className: "options", id: "optList" });
  q.shuffledOptions.forEach((opt, i) => {
    const btn = el("button", {
      className: "option",
      "data-opt": opt,
      onclick: e => pickOption(opt, e),
    },
      el("span", { className: "opt-key" }, String.fromCharCode(65 + i)),
      el("span", { className: "opt-txt", style: { flex: 1 } }, opt),
      el("span", { className: "opt-hint" }, String(i + 1))
    );
    optList.appendChild(btn);
  });
  screen.appendChild(optList);

  // ---- Explanation (hidden until answer picked) ----
  const expBox = el("div", { className: "explanation-box", id: "expBox", style: { display: "none" } });
  expBox.appendChild(el("div", { className: "exp-label", id: "expLabel" }));
  expBox.appendChild(el("p",   { className: "exp-text"  }, q.explanation));
  screen.appendChild(expBox);

  // ---- Next button (disabled until answer picked) ----
  const nextWrap = el("div", { className: "next-wrap" });
  nextWrap.appendChild(el("button", {
    className: "btn-next",
    id: "nextBtn",
    disabled: true,
    onclick: nextQuestion,
  }, isLast ? "See results →" : "Next question →"));
  screen.appendChild(nextWrap);

  // ---- Keyboard hint ----
  screen.appendChild(el("p", { className: "kb-hint", id: "kbHint" },
    "Press 1–4 to select  ·  Enter or Space to continue"));

  return screen;
}

/* ============================================================
   PICK OPTION — in-place DOM update, NO render() call
   This is what makes transitions & animations actually fire
   ============================================================ */
function pickOption(opt, event) {
  if (state.selected !== null) return;
  const q = state.questions[state.index];
  state.selected = opt;
  state.answers[state.index] = opt;
  const correct = opt === q.answer;

  if (correct) {
    state.score++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  } else {
    state.streak = 0;
  }

  // ---- 1. Update every option button in place ----
  document.querySelectorAll(".option").forEach(btn => {
    const btnOpt  = btn.getAttribute("data-opt");
    const isRight = btnOpt === q.answer;
    const isPicked = btnOpt === opt;
    const keyEl   = btn.querySelector(".opt-key");
    const hintEl  = btn.querySelector(".opt-hint");

    btn.disabled = true;
    if (hintEl) hintEl.style.opacity = "0";

    if (isRight) {
      btn.classList.add("correct");
      if (keyEl) keyEl.textContent = "✓";
    } else if (isPicked) {
      btn.classList.add("wrong");
      if (keyEl) keyEl.textContent = "✕";
    } else {
      btn.classList.add("inactive");
    }
  });

  // ---- 2. Particles on correct ----
  if (correct && event) {
    const appRect  = APP.getBoundingClientRect();
    const btnRect  = event.currentTarget.getBoundingClientRect();
    spawnParticles(
      btnRect.left + btnRect.width  / 2 - appRect.left,
      btnRect.top  + btnRect.height / 2 - appRect.top
    );
  }

  // ---- 3. Show explanation with slide-up ----
  const expBox   = document.getElementById("expBox");
  const expLabel = document.getElementById("expLabel");
  if (expBox) {
    expLabel.textContent = correct ? "✓ Correct!" : "✗ Incorrect";
    expBox.className = "explanation-box " + (correct ? "correct-box" : "wrong-box");
    expBox.style.display = "";
    expBox.style.animation = "none";
    void expBox.offsetWidth; // force reflow so animation restarts
    expBox.style.animation = "slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both";
  }

  // ---- 4. Unlock + animate next button ----
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.style.animation = "none";
    void nextBtn.offsetWidth;
    nextBtn.style.animation = "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.12s both";
  }

  // ---- 5. Hide keyboard hint ----
  const kbHint = document.getElementById("kbHint");
  if (kbHint) kbHint.style.opacity = "0";

  // ---- 6. Update streak badge without full re-render ----
  updateStreakBadge();
}

/* ============================================================
   UPDATE STREAK BADGE (targeted, no re-render)
   ============================================================ */
function updateStreakBadge() {
  const end = document.querySelector(".header-end");
  if (!end) return;
  let badge = document.getElementById("streakBadge");

  if (state.streak >= 3) {
    if (!badge) {
      badge = el("span", { className: "streak-badge", id: "streakBadge" });
      const themeBtn = end.querySelector(".theme-btn");
      end.insertBefore(badge, themeBtn || null);
    }
    badge.textContent = "🔥 " + state.streak + " streak";
    badge.style.animation = "none";
    void badge.offsetWidth;
    badge.style.animation = "streakPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both";
  } else if (badge) {
    badge.remove();
  }
}

/* ============================================================
   NEXT QUESTION
   ============================================================ */
function nextQuestion() {
  if (state.index + 1 >= state.questions.length) {
    state.phase = "finished";
  } else {
    state.index++;
    state.selected = null;
  }
  render();
}

/* ============================================================
   RESULTS SCREEN
   ============================================================ */
function buildResultsScreen() {
  const total = state.questions.length;
  const pct   = total ? Math.round((state.score / total) * 100) : 0;
  const circ  = 2 * Math.PI * 42;

  const msgs = [
    { min: 100, emoji: "🏆", text: "Perfect score! You crushed it." },
    { min: 80,  emoji: "🎯", text: "Excellent — rock-solid fundamentals." },
    { min: 60,  emoji: "📚", text: "Good work — a few gaps to fill." },
    { min: 0,   emoji: "🔬", text: "Keep at it — science rewards the curious." },
  ];
  const { emoji, text } = msgs.find(m => pct >= m.min);

  const screen = el("div", { className: "results-center anim-zoom" });

  // Ring
  const ringWrap = el("div", { className: "score-ring-wrap" });
  ringWrap.innerHTML = `
    <svg class="score-ring" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#5469f8"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
      <circle id="ringFill" cx="50" cy="50" r="42" fill="none" stroke="url(#rg)" stroke-width="8"
        stroke-linecap="round" stroke-dasharray="${circ}"
        stroke-dashoffset="${circ}"
        style="transition: stroke-dashoffset 1.3s cubic-bezier(0.34,1.1,0.64,1);"/>
    </svg>
    <div class="score-text">
      <span class="score-pct" id="scorePct">0%</span>
      <span class="score-frac">${state.score} / ${total}</span>
    </div>`;
  screen.appendChild(ringWrap);

  // Animate ring + counter after DOM is attached
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = document.getElementById("ringFill");
    if (fill) fill.style.strokeDashoffset = circ * (1 - pct / 100);

    const dur = 1300, start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const pctEl = document.getElementById("scorePct");
      if (pctEl) pctEl.textContent = Math.round(ease * pct) + "%";
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }));

  if (pct === 100) setTimeout(spawnConfetti, 400);

  screen.appendChild(el("div", { className: "result-msg" }, emoji + "  " + text));

  const stats = el("div", { className: "stats-row" });
  [
    { val: state.score,      label: "Correct",     cls: "green" },
    { val: total-state.score,label: "Incorrect",   cls: total-state.score > 0 ? "red" : "green" },
    { val: state.bestStreak, label: "Best Streak", cls: "gold" },
  ].forEach(({ val, label, cls }) => {
    stats.appendChild(el("div", { className: "stat-box" },
      el("div", { className: "stat-val " + cls }, String(val)),
      el("div", { className: "stat-label"       }, label)
    ));
  });
  screen.appendChild(stats);

  const row = el("div", { className: "btn-row" });
  row.appendChild(el("button", { className: "btn btn-cta",
    onclick: () => { state.phase = "review"; render(); }}, "Review Answers"));
  row.appendChild(el("button", { className: "btn btn-ghost",
    onclick: () => startQuiz(state.subject, state.difficulty, state.count) }, "Play Again"));
  row.appendChild(el("button", { className: "btn btn-ghost",
    onclick: backToStart }, "New Subject"));
  screen.appendChild(row);

  return screen;
}

/* ============================================================
   REVIEW SCREEN
   ============================================================ */
function buildReviewScreen() {
  const screen = el("div", { className: "anim-up" });

  const hdr = el("div", { className: "review-header" });
  const hl  = el("div");
  hl.appendChild(el("span", { className: "eyebrow" }, "Review"));
  hl.appendChild(el("h2",   { className: "review-title" }, "Scored " + state.score + " / " + state.questions.length));
  hdr.appendChild(hl);
  hdr.appendChild(el("button", {
    className: "back-link",
    style: { marginTop: 0, width: "auto" },
    onclick: () => { state.phase = "finished"; render(); }
  }, "← Back"));
  screen.appendChild(hdr);

  const list = el("ol", { className: "review-list" });
  state.questions.forEach((q, i) => {
    const picked  = state.answers[i];
    const correct = picked === q.answer;
    const card    = el("li", { className: "review-card" });

    const top = el("div", { className: "review-card-top" });
    top.appendChild(el("span", { className: "r-status " + (correct ? "ok" : "no") }, correct ? "✓" : "✕"));
    const info = el("div");
    info.appendChild(el("div", { className: "r-qnum" }, "Question " + (i + 1)));
    info.appendChild(el("div", { className: "r-qtxt" }, q.q));
    top.appendChild(info);
    card.appendChild(top);

    const ans = el("div", { className: "r-answers" });
    const yCls = !picked ? "missed" : correct ? "correct" : "wrong";
    ans.appendChild(el("div", { className: "r-answer-row" },
      el("span", { className: "r-answer-lbl" }, "Your answer"),
      el("span", { className: "r-answer-val " + yCls }, picked ?? "No answer")
    ));
    if (!correct) {
      ans.appendChild(el("div", { className: "r-answer-row" },
        el("span", { className: "r-answer-lbl" }, "Correct"),
        el("span", { className: "r-answer-val correct" }, q.answer)
      ));
    }
    card.appendChild(ans);
    card.appendChild(el("div", { className: "r-exp" }, q.explanation));
    list.appendChild(card);
  });
  screen.appendChild(list);

  const row = el("div", { className: "btn-row" });
  row.appendChild(el("button", { className: "btn btn-cta",
    onclick: () => startQuiz(state.subject, state.difficulty, state.count) }, "Play Again"));
  row.appendChild(el("button", { className: "btn btn-ghost",
    onclick: () => { state.phase = "finished"; render(); } }, "Back to Results"));
  screen.appendChild(row);
  return screen;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function backToStart() {
  Object.assign(state, {
    phase: "subject", subject: null, difficulty: null,
    selected: null, index: 0, score: 0,
    streak: 0, bestStreak: 0, questions: [], answers: [],
  });
  render();
}

function startQuiz(subject, difficulty, count) {
  const qs = prepare(subject, difficulty, count);
  Object.assign(state, {
    phase: "playing", subject, difficulty,
    count: qs.length, questions: qs,
    index: 0, score: 0, selected: null,
    streak: 0, bestStreak: 0,
    answers: new Array(qs.length).fill(null),
  });
  render();
}

/* ============================================================
   BOOT
   ============================================================ */
initTheme();
render();
