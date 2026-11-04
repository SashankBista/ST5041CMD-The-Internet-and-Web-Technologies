(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ns = 'http://www.w3.org/2000/svg';
  function el(n, a, txt) { var e = document.createElementNS(ns, n); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- navigation: only one dropdown open at a time ----------
  var nav = document.querySelector('.nav'), burger = document.querySelector('.burger');
  var dropItems = [].slice.call(document.querySelectorAll('.menu > li')).filter(function (li) { return li.querySelector('.drop'); });
  function compact() { return window.innerWidth <= 820 || !(window.matchMedia && window.matchMedia('(hover: hover)').matches); }
  function setOpen(li, on) {
    li.classList.toggle('open', on);
    var b = li.querySelector('button'); if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  function closeDrops(except) { dropItems.forEach(function (li) { if (li !== except) setOpen(li, false); }); }
  function closeAll() { closeDrops(); document.querySelectorAll('details.who[open]').forEach(function (d) { d.removeAttribute('open'); }); }
  dropItems.forEach(function (li) {
    var btn = li.querySelector('button'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-haspopup', 'true');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = compact() ? !li.classList.contains('open') : true;   // phones/touch: toggle. Desktop: hover drives it, click keeps it open.
      closeDrops(willOpen ? li : null); setOpen(li, willOpen);
    });
    li.addEventListener('mouseenter', function () { if (!compact()) { closeDrops(li); setOpen(li, true); } });
    li.addEventListener('mouseleave', function () { if (!compact()) setOpen(li, false); });
    li.querySelectorAll('.drop a').forEach(function (a) { a.addEventListener('click', function () { closeDrops(); if (nav) nav.classList.remove('open'); }); });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu')) closeDrops();
    document.querySelectorAll('details.who[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); if (nav) nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); } });
  if (nav && burger) burger.addEventListener('click', function (e) {
    e.stopPropagation(); closeDrops();
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  window.addEventListener('resize', function () { closeDrops(); if (window.innerWidth > 820 && nav) nav.classList.remove('open'); });

  // ---------- generic tabs (fires "tabshow" so hidden charts can size themselves) ----------
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = root.querySelectorAll('[data-tab]'), panels = root.querySelectorAll('[data-panel]');
    function show(id) {
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.tab === id); });
      panels.forEach(function (p) { p.classList.toggle('on', p.dataset.panel === id); });
      root.dispatchEvent(new CustomEvent('tabshow', { detail: id }));
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab); }); });
  });

  // ---------- scroll reveal ----------
  if ('IntersectionObserver' in window && !reduce) {
    var targets = document.querySelectorAll('.section-title, .uc, .sec, .scale, .chart, .cmp, .big, .big__foot, .ft__list, .start, .footer__g');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    targets.forEach(function (t) { t.classList.add('rv'); io.observe(t); });
    document.querySelectorAll('.uc a, .sec > div, .scale > div').forEach(function (c, i) { c.style.transitionDelay = ((i % 3) * 70) + 'ms'; });
  }

  // ---------- hero: type the code, then show the result ----------
  var code = document.getElementById('hero-code'), outEl = document.getElementById('hero-out');
  if (code && outEl) {
    code.innerHTML = code.innerHTML.split('\n').map(function (l) { return '<span class="cl hid">' + l + '</span>'; }).join('\n');
    var lines = code.querySelectorAll('.cl');
    var rows = [
      '<span class="c">$ submit sql-login-bypass</span>',
      'format check    <span class="s">ok</span>',
      'rate limit      <span class="s">3 of 10 this minute</span>',
      'hash compare    <span class="s">match</span>',
      '<span class="s">Solved</span>  <span class="n">+300</span> points awarded'
    ];
    outEl.innerHTML = '<span class="c">waiting for a submission...</span>';
    if (reduce) {
      lines.forEach(function (l) { l.classList.remove('hid'); });
      outEl.innerHTML = rows.join('\n');
    } else {
      lines.forEach(function (l, i) { setTimeout(function () { l.classList.remove('hid'); }, 120 + i * 85); });
      var t0 = 360 + lines.length * 85;
      rows.forEach(function (r, i) {
        setTimeout(function () { outEl.innerHTML = rows.slice(0, i + 1).join('\n') + (i < rows.length - 1 ? '\n<span class="caret-b"></span>' : ''); }, t0 + i * 320);
      });
    }
  }

  // ---------- challenge board filters ----------
  var board = document.getElementById('board');
  if (board) {
    var rowsEl = board.querySelectorAll('.row[data-cat]'), cat = 'all', diff = 'all',
        count = document.getElementById('b-count'), empty = document.getElementById('b-empty');
    function apply() {
      var shown = 0, solved = 0;
      rowsEl.forEach(function (r) {
        var ok = (cat === 'all' || r.dataset.cat === cat) && (diff === 'all' || r.dataset.diff === diff);
        r.hidden = !ok;
        if (ok) { shown++; if (r.dataset.solved) solved++; }
      });
      empty.hidden = shown > 0;
      count.textContent = shown + ' shown · ' + solved + ' solved';
    }
    board.querySelectorAll('[data-cat]:not(.row)').forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.cat;
        board.querySelectorAll('.side [data-cat]').forEach(function (x) { x.classList.toggle('on', x === b); });
        apply();
      });
    });
    board.querySelectorAll('[data-diff]').forEach(function (b) {
      b.addEventListener('click', function () {
        diff = b.dataset.diff;
        board.querySelectorAll('.tags [data-diff]').forEach(function (x) { x.classList.toggle('on', x === b); });
        apply();
      });
    });
  }

  // ---------- before / after drag line ----------
  var cmp = document.getElementById('cmp'), bar = document.getElementById('cmp-bar');
  if (cmp && bar) {
    var dragging = false;
    function setP(p) { p = clamp(p, 0, 100); cmp.style.setProperty('--p', p + '%'); bar.setAttribute('aria-valuenow', Math.round(p)); }
    function fromEvent(e) { var r = cmp.getBoundingClientRect(); setP((e.clientX - r.left) / r.width * 100); }
    cmp.addEventListener('pointerdown', function (e) {
      dragging = true; cmp.classList.add('drag');
      try { cmp.setPointerCapture(e.pointerId); } catch (_) {}
      fromEvent(e);
    });
    cmp.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel'].forEach(function (n) { cmp.addEventListener(n, function () { dragging = false; cmp.classList.remove('drag'); }); });
    bar.addEventListener('keydown', function (e) {
      var v = +bar.getAttribute('aria-valuenow');
      if (e.key === 'ArrowLeft') { setP(v - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setP(v + 5); e.preventDefault(); }
      if (e.key === 'Home') { setP(0); e.preventDefault(); }
      if (e.key === 'End') { setP(100); e.preventDefault(); }
    });
    // small hint animation the first time it scrolls into view
    if ('IntersectionObserver' in window && !reduce) {
      var hint = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; hint.disconnect();
        var t0 = null;
        (function step(ts) {
          if (t0 === null) t0 = ts; var k = (ts - t0) / 1400;
          if (dragging || k >= 1) { if (!dragging) setP(50); return; }
          setP(50 + Math.sin(k * Math.PI * 2) * 14 * (1 - k)); requestAnimationFrame(step);
        })(performance.now());
      }, { threshold: .5 });
      hint.observe(cmp);
    }
  }

  // ---------- scoring decay chart ----------
  var decayEl = document.getElementById('decay'), decayIn = document.getElementById('decay-in'), decayOut = document.getElementById('decay-out');
  if (decayEl && decayIn) {
    var N = 20;
    function pts(n) { return 100 + 400 * Math.exp(-n / 6); }
    var dW, dH, dL = 40, dR = 18, dT = 24, dB = 26, dsel = 0, dline, darea, ddot, dlab, dcur, dpts = [];
    function dx(k) { return dL + (dW - dL - dR) * k / (N - 1); }
    function dy(v) { return dT + (dH - dT - dB) * (1 - v / 500); }
    function dbuild(animate) {
      dW = Math.max(260, decayEl.clientWidth); if (!decayEl.clientWidth) return;
      dH = dW < 460 ? 190 : 230;
      decayEl.innerHTML = '';
      var svg = el('svg', { viewBox: '0 0 ' + dW + ' ' + dH, width: dW, height: dH, role: 'img', 'aria-label': 'Points per solve, decaying from 500 to 100' });
      [100, 300, 500].forEach(function (g) {
        svg.appendChild(el('line', { x1: dL, x2: dW - dR, y1: dy(g), y2: dy(g), stroke: '#2b2b2b', 'stroke-dasharray': '2 4' }));
        svg.appendChild(el('text', { x: dL - 8, y: dy(g) + 4, 'text-anchor': 'end' }, g));
      });
      [1, 5, 10, 15, 20].forEach(function (s) { svg.appendChild(el('text', { x: dx(s - 1), y: dH - 7, 'text-anchor': 'middle' }, '#' + s)); });
      var d = '', i;
      for (i = 0; i <= 190; i++) { var k = i / 10; d += (i ? 'L' : 'M') + dx(k).toFixed(1) + ' ' + dy(pts(k)).toFixed(1); }
      darea = el('path', { d: d + 'L' + dx(N - 1) + ' ' + dy(0) + 'L' + dx(0) + ' ' + dy(0) + 'Z', fill: '#ededed', opacity: 0 });
      dline = el('path', { d: d, fill: 'none', stroke: '#ededed', 'stroke-width': 2, 'stroke-linejoin': 'round' });
      svg.appendChild(darea); svg.appendChild(dline);
      dpts = [];
      for (i = 0; i < N; i++) { var c = el('circle', { cx: dx(i), cy: dy(pts(i)), r: 2.5, fill: '#8c8c8c' }); svg.appendChild(c); dpts.push(c); }
      dcur = el('line', { y1: dT, y2: dH - dB, stroke: '#ededed', 'stroke-dasharray': '3 4', opacity: .5 }); svg.appendChild(dcur);
      ddot = el('circle', { r: 5.5, fill: '#ededed' }); svg.appendChild(ddot);
      dlab = el('text', { 'text-anchor': 'middle', style: 'fill:#ededed;font-size:12px' }); svg.appendChild(dlab);
      decayEl.appendChild(svg);
      if (animate && !reduce) {
        var len = dline.getTotalLength ? dline.getTotalLength() : 1200;
        dline.style.strokeDasharray = len; dline.style.strokeDashoffset = len;
        dline.getBoundingClientRect();
        dline.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.3,.7,.2,1)'; dline.style.strokeDashoffset = 0;
        setTimeout(function () { darea.style.transition = 'opacity .6s'; darea.setAttribute('opacity', .06); }, 700);
      } else { darea.setAttribute('opacity', .06); }
      dupdate();
    }
    function dupdate() {
      var v = pts(dsel), X = dx(dsel), Y = dy(v);
      dcur.setAttribute('x1', X); dcur.setAttribute('x2', X);
      ddot.setAttribute('cx', X); ddot.setAttribute('cy', Y);
      dlab.setAttribute('x', clamp(X, 28, dW - 28)); dlab.setAttribute('y', Y - 13); dlab.textContent = Math.round(v) + ' pts';
      dpts.forEach(function (c, i) { c.setAttribute('fill', i === dsel ? '#ededed' : (i < dsel ? '#3d3d3d' : '#8c8c8c')); });
      decayOut.textContent = 'Next solve: ' + Math.round(v) + ' pts'; decayIn.value = dsel;
    }
    decayIn.addEventListener('input', function () { dsel = +decayIn.value; dupdate(); });
    var tabsRoot = decayEl.closest('[data-tabs]'), drawn = false;
    tabsRoot.addEventListener('tabshow', function (e) { if (e.detail === 'c') { dbuild(!drawn); drawn = true; } });
    var drt; window.addEventListener('resize', function () { clearTimeout(drt); drt = setTimeout(function () { if (decayEl.clientWidth) dbuild(false); }, 120); });
  }

  // ---------- sign-in form (front-end validation only) ----------
  var form = document.getElementById('signin');
  if (form) {
    var idIn = document.getElementById('si-id'), pwIn = document.getElementById('si-pw'), alertEl = document.getElementById('si-alert'),
        idErr = document.getElementById('si-id-e'), pwErr = document.getElementById('si-pw-e'), tog = form.querySelector('.pw__t');
    function fieldErr(input, err, msg) { input.classList.toggle('bad', !!msg); err.hidden = !msg; err.textContent = msg || ''; input.setAttribute('aria-invalid', msg ? 'true' : 'false'); }
    tog.addEventListener('click', function () {
      var show = pwIn.type === 'password'; pwIn.type = show ? 'text' : 'password';
      tog.textContent = show ? 'Hide' : 'Show'; tog.setAttribute('aria-pressed', show); tog.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    [idIn, pwIn].forEach(function (i) { i.addEventListener('input', function () { fieldErr(i, i === idIn ? idErr : pwErr, ''); alertEl.hidden = true; }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = idIn.value.trim(), p = pwIn.value, bad = false;
      if (a.length < 3) { fieldErr(idIn, idErr, 'Enter your email or username.'); bad = true; } else fieldErr(idIn, idErr, '');
      if (p.length < 8) { fieldErr(pwIn, pwErr, 'Password must be at least 8 characters.'); bad = true; } else fieldErr(pwIn, pwErr, '');
      if (bad) { alertEl.className = 'alert'; alertEl.textContent = 'Check the highlighted fields and try again.'; alertEl.hidden = false; (a.length < 3 ? idIn : pwIn).focus(); return; }
      alertEl.className = 'alert info'; alertEl.textContent = 'Preview only: this form is connected to the server once the backend is added.'; alertEl.hidden = false;
    });
  }

  // ---------- skills chart ----------
  var svg = document.getElementById('chart');
  if (!svg) return;

  var HOURS = 24, MAXY = 40;
  var cats = [
    { name: 'Web', color: '#70b8ff', max: 34, peak: 5 },
    { name: 'Crypto', color: '#3dd68c', max: 22, peak: 9 },
    { name: 'Pwn', color: '#ff6369', max: 14, peak: 15 },
    { name: 'Reverse', color: '#baa7ff', max: 18, peak: 12 },
    { name: 'Forensics', color: '#ffc53d', max: 26, peak: 7 },
    { name: 'Misc', color: '#a3a3a3', max: 20, peak: 3 }
  ];
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  cats.forEach(function (c, i) {
    var r = rng(11 + i * 7), inc = [], sum = 0, h, acc = 0;
    for (h = 0; h <= HOURS; h++) { var v = h === 0 ? 0 : (0.25 + r()) * Math.exp(-Math.pow((h - c.peak) / 7, 2)); inc.push(v); sum += v; }
    c.data = inc.map(function (v) { acc += v; return acc / sum * c.max; });
    // monotone cubic tangents -> smooth curves that never overshoot
    var n = c.data.length, d = [], m = [], k;
    for (k = 0; k < n - 1; k++) d.push(c.data[k + 1] - c.data[k]);
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (k = 1; k < n - 1; k++) m[k] = d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2;
    for (k = 0; k < n - 1; k++) {
      if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
      var a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
      if (s > 9) { var tt = 3 / Math.sqrt(s); m[k] = tt * a * d[k]; m[k + 1] = tt * b * d[k]; }
    }
    c.m = m;
  });
  function valueAt(c, t) {
    var i = Math.min(Math.floor(t), HOURS - 1), f = t - i, f2 = f * f, f3 = f2 * f;
    return (2 * f3 - 3 * f2 + 1) * c.data[i] + (f3 - 2 * f2 + f) * c.m[i] + (-2 * f3 + 3 * f2) * c.data[i + 1] + (f3 - f2) * c.m[i + 1];
  }

  var slider = document.getElementById('hour'), out = document.getElementById('hour-out'),
      legend = document.getElementById('legend'), total = document.getElementById('chart-total'),
      replay = document.getElementById('replay');

  var hl = -1, legendItems = [];
  cats.forEach(function (c, i) {
    var d = document.createElement('div');
    d.innerHTML = '<i style="background:' + c.color + '"></i>' + c.name + '<b>0</b>';
    legend.appendChild(d); c.out = d.querySelector('b'); legendItems.push(d);
    d.addEventListener('mouseenter', function () { hl = i; draw(); });
    d.addEventListener('mouseleave', function () { hl = -1; draw(); });
  });

  var W, H, L = 40, R = 26, T = 12, B = 28, live = [], areas = [], dots = [], cur, t = 0;
  function x(h) { return L + (W - L - R) * h / HOURS; }
  function y(v) { return T + (H - T - B) * (1 - v / MAXY); }
  function pathTo(c, tt, close) {
    var d = '', s = 0.2, h;
    for (h = 0; h < tt; h += s) d += (h ? 'L' : 'M') + x(h).toFixed(1) + ' ' + y(valueAt(c, h)).toFixed(1);
    d += (tt ? 'L' : 'M') + x(tt).toFixed(1) + ' ' + y(valueAt(c, tt)).toFixed(1);
    if (close) d += 'L' + x(tt).toFixed(1) + ' ' + y(0).toFixed(1) + 'L' + x(0).toFixed(1) + ' ' + y(0).toFixed(1) + 'Z';
    return d;
  }

  function build() {
    var w = svg.parentNode.clientWidth - (window.innerWidth < 600 ? 32 : 56);
    W = Math.max(280, w); H = W < 520 ? 250 : 340;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    live = []; areas = []; dots = [];
    for (var g = 0; g <= MAXY; g += 10) {
      svg.appendChild(el('line', { x1: L, x2: W - R, y1: y(g), y2: y(g), stroke: '#2b2b2b', 'stroke-dasharray': g ? '2 4' : '' }));
      svg.appendChild(el('text', { x: L - 8, y: y(g) + 4, 'text-anchor': 'end' }, g));
    }
    var step = W < 520 ? 8 : 4;
    for (var hh = 0; hh <= HOURS; hh += step) svg.appendChild(el('text', { x: x(hh), y: H - 8, 'text-anchor': 'middle' }, hh + ':00'));
    cats.forEach(function (c) { svg.appendChild(el('path', { d: pathTo(c, HOURS), fill: 'none', stroke: c.color, 'stroke-width': 1.5, opacity: .12 })); });
    cats.forEach(function (c) { var a = el('path', { fill: c.color }); svg.appendChild(a); areas.push(a); });
    cur = el('line', { y1: T, y2: H - B, stroke: '#ededed', 'stroke-dasharray': '3 4', opacity: .6 });
    svg.appendChild(cur);
    cats.forEach(function (c) {
      var p = el('path', { fill: 'none', stroke: c.color, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
      var d = el('circle', { fill: c.color });
      svg.appendChild(p); svg.appendChild(d); live.push(p); dots.push(d);
    });
    draw();
  }

  function draw() {
    var sum = 0;
    cur.setAttribute('x1', x(t)); cur.setAttribute('x2', x(t));
    cats.forEach(function (c, i) {
      var v = valueAt(c, t), on = hl === -1 || hl === i;
      live[i].setAttribute('d', pathTo(c, t, false));
      live[i].setAttribute('stroke-width', hl === i ? 3 : 2);
      live[i].setAttribute('opacity', on ? 1 : .18);
      areas[i].setAttribute('d', pathTo(c, t, true));
      areas[i].setAttribute('opacity', hl === i ? .14 : 0);
      dots[i].setAttribute('cx', x(t)); dots[i].setAttribute('cy', y(v));
      dots[i].setAttribute('r', hl === i ? 5 : 3.5); dots[i].setAttribute('opacity', on ? 1 : .25);
      c.out.textContent = Math.round(v); sum += Math.round(v);
      legendItems[i].style.opacity = on ? 1 : .4;
    });
    out.textContent = 'Hour ' + Math.floor(t) + ' of ' + HOURS;
    total.textContent = sum + ' flags captured';
    slider.value = Math.round(t * 10);
  }

  var raf = null;
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
  function play() {
    stop();
    if (reduce) { t = 12; draw(); return; }
    var start = null, dur = 7500; t = 0; draw();
    function tick(ts) {
      if (start === null) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      t = HOURS * (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
      draw(); raf = k < 1 ? requestAnimationFrame(tick) : null;
    }
    raf = requestAnimationFrame(tick);
  }

  slider.addEventListener('input', function () { stop(); t = slider.value / 10; draw(); });
  replay.addEventListener('click', play);

  build();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 120); });

  var started = false;
  function maybeStart() { if (!started) { started = true; play(); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { maybeStart(); o.disconnect(); } }); }, { threshold: .35 }).observe(svg);
  } else { maybeStart(); }
})();
