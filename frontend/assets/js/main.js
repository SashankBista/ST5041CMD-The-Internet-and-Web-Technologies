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
      'flag check      <span class="s">correct</span>',
      'team            nullbyte',
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
      if (!a) { fieldErr(idIn, idErr, 'Enter your email or username.'); bad = true; } else fieldErr(idIn, idErr, '');
      if (!p) { fieldErr(pwIn, pwErr, 'Enter your password.'); bad = true; } else fieldErr(pwIn, pwErr, '');
      if (bad) { alertEl.className = 'alert'; alertEl.textContent = 'Check the highlighted fields and try again.'; alertEl.hidden = false; (!a ? idIn : pwIn).focus(); return; }
      var isAdmin = a.toLowerCase() === 'admin';
      alertEl.className = 'alert info'; alertEl.textContent = 'Signed in (preview). Taking you to the ' + (isAdmin ? 'admin' : 'player') + ' dashboard...'; alertEl.hidden = false;
      setTimeout(function () { location.href = isAdmin ? 'admin/index.html' : 'dashboard.html'; }, 900);
    });
  }

  // ---------- register form (front-end validation only) ----------
  var reg = document.getElementById('register');
  if (reg) {
    var $ = function (id) { return document.getElementById(id); };
    var teams = { 'nullbyte': [3, 4], 'r00tkit': [4, 4], 'stackoverflown': [2, 4], 'segfault': [1, 4], '0xdeadbeef': [3, 4], 'packet_loss': [4, 4] };
    var F = { user: $('rg-user'), email: $('rg-email'), pw: $('rg-pw'), pw2: $('rg-pw2'), team: $('rg-team'), code: $('rg-code'), terms: $('rg-terms') };
    var rAlert = $('rg-alert'), teamBox = $('team-fields'), teamInfo = $('rg-team-i');
    var TEAM_HINT = 'Start typing to search existing teams.';
    function err(input, msg) {
      var e = $(input.id + '-e'); input.classList.toggle('bad', !!msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      e.hidden = !msg; e.textContent = msg || '';
    }
    function mode() { return reg.querySelector('input[name=mode]:checked').value; }

    // solo / team choice
    reg.querySelectorAll('.opt input').forEach(function (r) {
      r.addEventListener('change', function () {
        reg.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('on', o.querySelector('input').checked); });
        var team = mode() === 'team'; teamBox.hidden = !team;
        if (!team) { err(F.team, ''); err(F.code, ''); }
        else F.team.focus();
        rAlert.hidden = true;
      });
    });

    // password show/hide (controls both password fields)
    reg.querySelector('.pw__t').addEventListener('click', function () {
      var btn = this, show = F.pw.type === 'password';
      [F.pw, F.pw2].forEach(function (i) { i.type = show ? 'text' : 'password'; });
      btn.textContent = show ? 'Hide' : 'Show'; btn.setAttribute('aria-pressed', show); btn.setAttribute('aria-label', show ? 'Hide passwords' : 'Show passwords');
    });

    // team lookup
    F.team.addEventListener('input', function () {
      err(F.team, ''); teamInfo.className = 'hint';
      var t = teams[F.team.value.trim().toLowerCase()];
      if (!F.team.value.trim()) teamInfo.textContent = TEAM_HINT;
      else if (t && t[0] >= t[1]) { teamInfo.textContent = 'This team is full (' + t[0] + ' of ' + t[1] + ').'; }
      else if (t) { teamInfo.textContent = 'Team found: ' + t[0] + ' of ' + t[1] + ' members.'; teamInfo.className = 'hint ok'; }
      else teamInfo.textContent = TEAM_HINT;
    });

    Object.keys(F).forEach(function (k) {
      var ev = k === 'terms' ? 'change' : 'input';
      F[k].addEventListener(ev, function () { err(F[k], ''); rAlert.hidden = true; });
    });

    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [], u = F.user.value.trim(), em = F.email.value.trim(), p = F.pw.value;
      function fail(input, msg) { err(input, msg); bad.push(input); }
      if (!/^[A-Za-z0-9_-]{3,24}$/.test(u)) fail(F.user, 'Use 3 to 24 letters, numbers, _ or -.'); else err(F.user, '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) fail(F.email, 'Enter a valid email address.'); else err(F.email, '');
      if (!p) fail(F.pw, 'Choose a password.'); else err(F.pw, '');
      if (F.pw2.value !== p || !F.pw2.value) fail(F.pw2, 'Passwords do not match.'); else err(F.pw2, '');
      var m = mode(), teamName = F.team.value.trim();
      if (m === 'team') {
        var t = teams[teamName.toLowerCase()];
        if (!teamName) fail(F.team, 'Enter the name of the team you want to join.');
        else if (!t) fail(F.team, 'No team found with that name.');
        else if (t[0] >= t[1]) fail(F.team, 'That team is full. Choose another team or play solo.');
        else err(F.team, '');
        if (!/^[A-Za-z0-9-]{6,24}$/.test(F.code.value.trim())) fail(F.code, 'Enter the invite code (6 to 24 characters).'); else err(F.code, '');
      }
      if (!F.terms.checked) fail(F.terms, 'You need to agree to the rules to join.'); else err(F.terms, '');
      if (bad.length) {
        rAlert.className = 'alert'; rAlert.textContent = 'Check the highlighted fields and try again.'; rAlert.hidden = false; bad[0].focus(); return;
      }
      rAlert.className = 'alert info';
      rAlert.textContent = 'Preview only: this connects to the server once the backend is added. You would ' + (m === 'solo' ? 'register as a solo player.' : 'register and request to join ' + teamName + '.');
      rAlert.hidden = false;
    });
  }

  // ---------- dashboard: countdown + copy buttons ----------
  var cdEl = document.getElementById('countdown');
  if (cdEl) {
    var left = +cdEl.dataset.sec || 7749;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function showCd() { cdEl.textContent = pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left % 3600 / 60)) + ':' + pad(left % 60); }
    showCd(); setInterval(function () { if (left > 0) left--; showCd(); }, 1000);
  }
  function copyText(txt) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta); return ok;
    }
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt).then(function () { return true; }, function () { return fallback(); });
    return Promise.resolve(fallback());
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.textContent;
      copyText(b.dataset.copy).then(function (ok) { b.textContent = ok ? 'Copied' : 'Press Ctrl+C'; setTimeout(function () { b.textContent = t; }, 1600); });
    });
  });

  // ---------- admin: submissions chart (draws itself once, data comes from the page) ----------
  var ac = document.getElementById('adm-chart');
  if (ac && ac.dataset.correct) {
    var corr = ac.dataset.correct.split(',').map(Number), wrong = ac.dataset.wrong.split(',').map(Number),
        stp = +ac.dataset.step || 15, t0s = (ac.dataset.start || '09:00').split(':'), t0 = (+t0s[0]) * 60 + (+t0s[1]),
        AN = corr.length, aMax = Math.ceil(Math.max.apply(null, corr.concat(wrong)) / 20) * 20;
    var AW, AH, AL = 34, AR = 16, AT = 12, AB = 26;
    function ax(i) { return AL + (AW - AL - AR) * i / (AN - 1); }
    function ay(v) { return AT + (AH - AT - AB) * (1 - v / aMax); }
    function hhmm(i) { var m = t0 + i * stp, p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(Math.floor(m / 60)) + ':' + p(m % 60); }
    function smooth(d) {
      var p = d.map(function (v, i) { return [ax(i), ay(v)]; }), s = 'M' + p[0][0] + ' ' + p[0][1], i;
      for (i = 0; i < p.length - 1; i++) {
        var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        s += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + Math.min(ay(0), p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + Math.min(ay(0), p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      return s;
    }
    var aDone = false;
    function abuild(animate) {
      AW = Math.max(280, ac.clientWidth); AH = AW < 520 ? 220 : 270; ac.innerHTML = '';
      var s = el('svg', { viewBox: '0 0 ' + AW + ' ' + AH, width: AW, height: AH, role: 'img', 'aria-label': 'Correct and wrong submissions every 15 minutes since the event started' });
      for (var g = 0; g <= aMax; g += aMax / 4) {
        s.appendChild(el('line', { x1: AL, x2: AW - AR, y1: ay(g), y2: ay(g), stroke: '#2b2b2b', 'stroke-dasharray': g ? '2 4' : '' }));
        s.appendChild(el('text', { x: AL - 8, y: ay(g) + 4, 'text-anchor': 'end' }, g));
      }
      (AW < 520 ? [0, 8, AN - 1] : [0, 4, 8, 12, 16, AN - 1]).forEach(function (i) { s.appendChild(el('text', { x: ax(i), y: AH - 7, 'text-anchor': i === AN - 1 ? 'end' : (i === 0 ? 'start' : 'middle') }, hhmm(i))); });
      [[wrong, '#ff6369'], [corr, '#3dd68c']].forEach(function (z) {
        var pth = el('path', { d: smooth(z[0]), fill: 'none', stroke: z[1], 'stroke-width': 2, 'stroke-linecap': 'round' }); s.appendChild(pth);
        if (animate && !reduce) {
          var len = pth.getTotalLength(); pth.style.strokeDasharray = len; pth.style.strokeDashoffset = len; pth.getBoundingClientRect();
          pth.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.7,.2,1)'; pth.style.strokeDashoffset = 0;
        }
      });
      ac.appendChild(s);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { abuild(true); aDone = true; o.disconnect(); } }, { threshold: .3 }).observe(ac);
    } else { abuild(false); aDone = true; }
    var art; window.addEventListener('resize', function () { clearTimeout(art); art = setTimeout(function () { if (aDone) abuild(false); }, 120); });
  }

  // ---------- admin: dialog, toast, tables, actions ----------
  function toast(msg) {
    var box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; box.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }
  window.rootlineToast = toast;
  function ask(o, onOk) {
    if (!window.HTMLDialogElement) { if (confirm(o.title)) onOk(); return; }
    var d = document.createElement('dialog'); d.className = 'mdl';
    d.innerHTML = '<div class="mdl__b"><h3></h3><div class="mdl__t"></div></div><div class="mdl__f"><button type="button" class="btn btn--sm" data-x>Cancel</button><button type="button" class="btn btn--sm" data-ok></button></div>';
    d.querySelector('h3').textContent = o.title;
    if (o.html) d.querySelector('.mdl__t').appendChild(o.html); else { var p = document.createElement('p'); p.textContent = o.text || ''; d.querySelector('.mdl__t').appendChild(p); }
    var ok = d.querySelector('[data-ok]'); ok.textContent = o.ok || 'Confirm'; ok.className = 'btn btn--sm ' + (o.danger ? 'btn--del' : 'btn--ok');
    if (o.noOk) ok.remove();
    d.querySelector('[data-x]').textContent = o.noOk ? 'Close' : 'Cancel';
    document.body.appendChild(d);
    d.addEventListener('close', function () { d.remove(); });
    d.querySelector('[data-x]').addEventListener('click', function () { d.close(); });
    ok.addEventListener('click', function () { if (o.validate && o.validate() === false) return; d.close(); if (onOk) onOk(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.showModal();
  }

  // filterable, sortable tables: <div data-table data-total="36"> with [data-search], select[data-col], [data-chips], th.sortable, [data-pager], [data-count], tr[data-row]
  document.querySelectorAll('[data-table]').forEach(function (root) {
    var q = root.querySelector('[data-search]'), sels = root.querySelectorAll('select[data-col]'), groups = [].slice.call(root.querySelectorAll('[data-chips]')),
        count = root.querySelector('[data-count]'), emptyCell = root.querySelector('.empty-row'), emptyRow = emptyCell && emptyCell.parentNode,
        tbody = root.querySelector('tbody'), noun = root.dataset.noun || 'items';
    function dataRows() { return [].slice.call(tbody.querySelectorAll('tr[data-row]')); }
    function apply() {
      var term = q ? q.value.trim().toLowerCase() : '', n = 0;
      dataRows().forEach(function (r) {
        var ok = !term || r.textContent.toLowerCase().indexOf(term) > -1;
        sels.forEach(function (s) { if (s.value && r.dataset[s.dataset.col] !== s.value) ok = false; });
        groups.forEach(function (g) {
          var on = g.querySelector('.fchip.on'), v = on ? on.dataset.val : ''; if (!v) return;
          if (g.dataset.mode === 'max') { if (!(+r.dataset[g.dataset.col] <= +v)) ok = false; } else if (r.dataset[g.dataset.col] !== v) ok = false;
        });
        r.hidden = !ok; if (ok) n++;
      });
      if (count) count.textContent = 'Showing ' + n + ' of ' + root.dataset.total + ' ' + noun;
      if (emptyRow) emptyRow.hidden = n > 0;
    }
    // label every cell with its column name so rows can become cards on phones
    var heads = [].map.call(root.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    dataRows().forEach(function (tr) {
      [].forEach.call(tr.children, function (td, i) { td.setAttribute('data-l', heads[i] || ''); if (td.querySelector('.act')) td.classList.add('actcell'); });
    });
    if (q) q.addEventListener('input', apply);
    sels.forEach(function (s) { s.addEventListener('change', apply); });
    groups.forEach(function (g) {
      g.querySelectorAll('.fchip').forEach(function (b) {
        b.addEventListener('click', function () { g.querySelectorAll('.fchip').forEach(function (x) { x.classList.toggle('on', x === b); }); apply(); });
      });
    });
    root.addEventListener('refresh', apply);

    // sorting
    root.querySelectorAll('th.sortable').forEach(function (th) {
      th.tabIndex = 0;
      function sortBy() {
        var idx = th.cellIndex, num = th.dataset.sort === 'num', dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        root.querySelectorAll('th.sortable').forEach(function (x) { x.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        var val = function (r) { var t = r.children[idx].textContent.trim().replace(/,/g, ''); return num ? parseFloat(t) || 0 : t.toLowerCase(); };
        dataRows().sort(function (a, b) {
          var A = val(a), B = val(b), c = num ? A - B : String(A).localeCompare(String(B), undefined, { numeric: true });
          return dir === 'ascending' ? c : -c;
        }).forEach(function (r) { tbody.insertBefore(r, emptyRow || null); });
      }
      th.addEventListener('click', sortBy);
      th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortBy(); } });
    });

    // pager (the server will supply the other pages)
    var pg = root.querySelector('[data-pager]');
    if (pg) {
      var pages = +pg.dataset.pages || 1, list = pages <= 5 ? Array.apply(null, Array(pages)).map(function (_, i) { return i + 1; }) : [1, 2, 3, '...', pages];
      var html = '<button type="button" disabled aria-label="Previous page">&lsaquo; Prev</button>';
      list.forEach(function (p) { html += p === '...' ? '<span>...</span>' : '<button type="button"' + (p === 1 ? ' class="on" aria-current="page"' : '') + ' data-page="' + p + '">' + p + '</button>'; });
      html += '<button type="button" data-page="2" aria-label="Next page">Next &rsaquo;</button>';
      pg.innerHTML = html;
      pg.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-page]'); if (!b || b.classList.contains('on')) return;
        toast('Page ' + b.dataset.page + ' of ' + pages + ' loads from the server (preview)');
      });
    }
    apply();
  });

  function chip(tr, cls, text, sel) { var c = tr.querySelector(sel || '.st'); if (c) { c.className = ('st ' + cls + ' ' + (sel ? sel.slice(1) : '')).trim(); c.textContent = text; } }
  function drop(tr, what) {
    var root = tr.closest('[data-table]'); tr.remove();
    if (root) { root.dataset.total = Math.max(0, (+root.dataset.total || 1) - 1); root.dispatchEvent(new Event('refresh')); }
    toast(what + ' deleted (preview)');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var tr = b.closest('tr'), name = b.dataset.name || (tr && tr.dataset.name) || 'this item', act = b.dataset.act;
    if (act === 'delete') ask({ title: 'Delete ' + name + '?', text: b.dataset.text || 'This cannot be undone.', ok: 'Delete', danger: true }, function () { drop(tr, name); });
    if (act === 'live') {
      var live = tr.dataset.status === 'live';
      tr.dataset.status = live ? 'hidden' : 'live'; chip(tr, live ? '' : 'st--ok', live ? 'hidden' : 'live');
      b.textContent = live ? 'Show' : 'Hide'; toast(name + (live ? ' hidden from players' : ' is now live') + ' (preview)');
    }
    if (act === 'ban') {
      var banned = tr.dataset.status === 'banned';
      var go = function () { tr.dataset.status = banned ? 'active' : 'banned'; chip(tr, banned ? 'st--ok' : 'st--bad', banned ? 'active' : 'banned', '.st-status'); b.textContent = banned ? 'Ban' : 'Unban'; toast(name + (banned ? ' unbanned' : ' banned') + ' (preview)'); };
      if (banned) go(); else ask({ title: 'Ban ' + name + '?', text: 'They will not be able to sign in or submit flags.', ok: 'Ban user', danger: true }, go);
    }
    if (act === 'role') {
      var isAdmin = tr.dataset.role === 'admin';
      var go2 = function () { tr.dataset.role = isAdmin ? 'player' : 'admin'; chip(tr, isAdmin ? '' : 'st--warn', isAdmin ? 'player' : 'admin', '.st-role'); b.textContent = isAdmin ? 'Make admin' : 'Make player'; toast(name + ' is now ' + (isAdmin ? 'a player' : 'an admin') + ' (preview)'); };
      if (isAdmin) go2(); else ask({ title: 'Make ' + name + ' an admin?', text: 'Admins can manage challenges, users and announcements.', ok: 'Make admin' }, go2);
    }
    if (act === 'members') {
      var ul = document.createElement('ul'); ul.className = 'mlist';
      (tr.dataset.members || '').split(',').forEach(function (m) {
        var p = m.split(':'); var li = document.createElement('li');
        li.innerHTML = '<span></span>'; li.firstChild.textContent = p[0]; var i = document.createElement('i'); i.textContent = p[1]; li.firstChild.appendChild(i);
        if (p[1] !== 'captain') { var rb = document.createElement('button'); rb.type = 'button'; rb.className = 'btn btn--sm btn--del'; rb.textContent = 'Remove'; rb.addEventListener('click', function () { li.remove(); toast(p[0] + ' removed from ' + name + ' (preview)'); }); li.appendChild(rb); }
        ul.appendChild(li);
      });
      ask({ title: name + ' members', html: ul, noOk: true });
    }
    if (act === 'invite') {
      var box = document.createElement('div');
      box.innerHTML = '<p>They get an email with a link to create their account.</p><div class="f" style="margin-top:16px"><label for="inv-email">Email</label><input id="inv-email" type="email" autocomplete="off"><p class="err" id="inv-err" hidden></p></div><div class="f" style="margin-bottom:0"><label for="inv-role">Role</label><select id="inv-role"><option value="player">Player</option><option value="admin">Admin</option></select></div>';
      ask({ title: 'Invite a user', html: box, ok: 'Send invite',
        validate: function () { var v = box.querySelector('#inv-email').value.trim(), bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); box.querySelector('#inv-err').hidden = !bad; box.querySelector('#inv-err').textContent = 'Enter a valid email address.'; box.querySelector('#inv-email').classList.toggle('bad', bad); return !bad; } },
        function () { toast('Invite sent to ' + box.querySelector('#inv-email').value.trim() + ' (preview)'); });
    }
    if (act === 'newteam') {
      var tb = document.createElement('div');
      tb.innerHTML = '<div class="f"><label for="nt-name">Team name</label><input id="nt-name" type="text" maxlength="40" autocomplete="off"><p class="err" id="nt-name-e" hidden></p></div><div class="f" style="margin-bottom:0"><label for="nt-cap">Captain username</label><input id="nt-cap" type="text" maxlength="24" autocomplete="off"><p class="err" id="nt-cap-e" hidden></p></div>';
      ask({ title: 'New team', html: tb, ok: 'Create team',
        validate: function () {
          var n = tb.querySelector('#nt-name'), c = tb.querySelector('#nt-cap'), bad = false;
          [[n, 'Enter a team name.'], [c, 'Enter the captain\'s username.']].forEach(function (p) { var e = tb.querySelector('#' + p[0].id + '-e'), miss = !p[0].value.trim(); e.hidden = !miss; e.textContent = p[1]; p[0].classList.toggle('bad', miss); if (miss) bad = true; });
          return !bad;
        } },
        function () {
          var root = document.querySelector('[data-table]'), body = root.querySelector('tbody'), first = body.querySelector('tr[data-row]'), nm = tb.querySelector('#nt-name').value.trim(), cap = tb.querySelector('#nt-cap').value.trim();
          var tr = first.cloneNode(true); tr.hidden = false; tr.dataset.name = nm; tr.dataset.size = 'open'; tr.dataset.members = cap + ':captain';
          var c = tr.children; c[0].textContent = nm; c[1].textContent = '1 of 4'; c[2].textContent = cap; c[3].textContent = '0'; c[4].textContent = '0'; c[5].textContent = 'Today';
          body.insertBefore(tr, first); root.dataset.total = (+root.dataset.total || 0) + 1; root.dispatchEvent(new Event('refresh')); toast('Team ' + nm + ' created (preview)');
        });
    }
    if (act === 'preview') {
      var f = document.getElementById('cform'), g = function (n) { return f.elements[n].value.trim(); };
      var pv = document.createElement('div'); pv.className = 'pv';
      var hs = [].filter.call(f.querySelectorAll('[name=hint_text]'), function (i) { return i.value.trim(); }).length;
      var tag = function (t) { var s = document.createElement('span'); s.className = 'st'; s.textContent = t; return s; };
      var tags = document.createElement('div'); tags.className = 'chal__tags'; [g('category') || 'category', g('difficulty') || 'difficulty', (g('points') || '0') + ' pts'].forEach(function (t) { tags.appendChild(tag(t)); });
      var h = document.createElement('h3'); h.textContent = g('title') || 'Untitled challenge';
      var d = document.createElement('p'); d.textContent = g('description') || 'No description yet.';
      var m = document.createElement('p'); m.className = 'mute'; m.textContent = hs + (hs === 1 ? ' hint' : ' hints') + ' · Visibility: ' + g('visibility');
      [tags, h, d, m].forEach(function (n) { pv.appendChild(n); });
      ask({ title: 'How players will see it', html: pv, noOk: true });
    }
    if (act === 'toast') toast(b.dataset.msg || 'Done (preview)');
  });

  // ---------- admin: announcements (create / edit / delete in the page) ----------
  var annForm = document.getElementById('ann-form');
  if (annForm) {
    var annList = document.getElementById('ann-list'), editing = null, aT = document.getElementById('ann-title'), aB = document.getElementById('ann-body'), aP = document.getElementById('ann-pin'),
        aSave = document.getElementById('ann-save'), aCancel = document.getElementById('ann-cancel'), aH = document.getElementById('ann-h'), aErr = document.getElementById('ann-title-e'), aBErr = document.getElementById('ann-body-e');
    function reset() { editing = null; annForm.reset(); aSave.textContent = 'Post announcement'; aCancel.hidden = true; aH.textContent = 'New announcement'; aErr.hidden = aBErr.hidden = true; aT.classList.remove('bad'); aB.classList.remove('bad'); }
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function nowStr() { var d = new Date(); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
    function rowHtml(r, title, body, pin, time) {
      r.dataset.pin = pin ? '1' : '';
      r.innerHTML = '<div class="arow__h"><time></time><span class="st st--warn"' + (pin ? '' : ' hidden') + '>pinned</span></div><b></b><p></p><div class="act"><button type="button" class="btn btn--sm" data-edit>Edit</button><button type="button" class="btn btn--sm btn--del" data-del>Delete</button></div>';
      r.querySelector('time').textContent = time; r.querySelector('b').textContent = title; r.querySelector('p').textContent = body;
    }
    annForm.addEventListener('submit', function (e) {
      e.preventDefault(); var t = aT.value.trim(), b = aB.value.trim(), bad = false;
      aT.classList.toggle('bad', !t); aErr.hidden = !!t; aErr.textContent = 'Enter a title.'; if (!t) bad = true;
      aB.classList.toggle('bad', !b); aBErr.hidden = !!b; aBErr.textContent = 'Write the message.'; if (!b) bad = true;
      if (bad) { (t ? aB : aT).focus(); return; }
      if (editing) { rowHtml(editing, t, b, aP.checked, editing.querySelector('time').textContent); toast('Announcement updated (preview)'); }
      else { var r = document.createElement('div'); r.className = 'arow'; rowHtml(r, t, b, aP.checked, 'Today ' + nowStr()); annList.insertBefore(r, annList.children[1] || null); toast('Announcement posted (preview)'); }
      reset();
    });
    aCancel.addEventListener('click', reset);
    annList.addEventListener('click', function (e) {
      var r = e.target.closest('.arow'); if (!r) return;
      if (e.target.closest('[data-edit]')) {
        editing = r; aT.value = r.querySelector('b').textContent; aB.value = r.querySelector('p').textContent; aP.checked = !!r.dataset.pin;
        aSave.textContent = 'Save changes'; aCancel.hidden = false; aH.textContent = 'Edit announcement'; aT.focus(); annForm.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (e.target.closest('[data-del]')) ask({ title: 'Delete this announcement?', text: r.querySelector('b').textContent, ok: 'Delete', danger: true }, function () { r.remove(); if (editing === r) reset(); toast('Announcement deleted (preview)'); });
    });
  }

  // ---------- admin: challenge form ----------
  var cform = document.getElementById('cform');
  if (cform) {
    var CH = {
      1: { title: 'Cookie monster', cat: 'web', diff: 'easy', pts: 150, min: 50, status: 'live', flag: 'FLAG{cookies_are_not_secrets}', desc: 'The site remembers who you are. Make it remember you as someone else.' },
      2: { title: 'Login bypass', cat: 'web', diff: 'medium', pts: 300, min: 100, status: 'live', flag: 'FLAG{or_1_equals_1}', desc: 'The admin panel trusts whatever you type. Get in without the password.' },
      5: { title: 'Weak RSA', cat: 'crypto', diff: 'medium', pts: 300, min: 100, status: 'live', flag: 'FLAG{small_primes_big_problem}', desc: 'The key is shorter than it should be. Recover the message.' },
      11: { title: 'Stack smash 101', cat: 'pwn', diff: 'hard', pts: 500, min: 100, status: 'live', flag: 'FLAG{return_to_sender}', desc: 'A tiny service with a big mistake. Take control of the program.' },
      12: { title: 'Heap of trouble', cat: 'pwn', diff: 'hard', pts: 600, min: 150, status: 'scheduled', flag: '', desc: 'Memory is not always yours to keep. Find the use after free.' }
    };
    var id = new URLSearchParams(location.search).get('id'), data = CH[id];
    var $c = function (n) { return cform.elements[n]; };
    var heading = document.getElementById('cform-h'), when = document.getElementById('when-wrap');
    if (data) {
      heading.textContent = 'Edit challenge'; document.title = 'Edit challenge | Rootline';
      $c('title').value = data.title; $c('category').value = data.cat; $c('difficulty').value = data.diff; $c('points').value = data.pts; $c('min_points').value = data.min;
      $c('flag').value = data.flag; $c('description').value = data.desc; $c('visibility').value = data.status;
      if (data.status === 'scheduled') $c('publish_at').value = '2026-04-18T18:00';
    }
    function syncWhen() { when.hidden = $c('visibility').value !== 'scheduled'; }
    $c('visibility').addEventListener('change', syncWhen); syncWhen();
    var hints = document.getElementById('hints');
    function syncHints() { var e = document.getElementById('hints-empty'); if (e) e.hidden = hints.children.length > 0; }
    function addHint(text, cost) {
      var r = document.createElement('div'); r.className = 'hrow';
      r.innerHTML = '<input class="in" type="text" name="hint_text" placeholder="Hint text"><input class="in" type="number" min="0" name="hint_cost" placeholder="Cost"><button type="button" class="btn btn--sm btn--del" aria-label="Remove hint">Remove</button>';
      r.children[0].value = text || ''; r.children[1].value = cost == null ? '' : cost;
      r.lastChild.addEventListener('click', function () { r.remove(); syncHints(); }); hints.appendChild(r); syncHints();
    }
    document.getElementById('add-hint').addEventListener('click', function () { addHint('', 30); });
    if (id === '5') addHint('Check the key size before you reach for a factoring tool.', 30);
    function cerr(name, msg) { var el2 = document.getElementById('c-' + name + '-e'), inp = $c(name); inp.classList.toggle('bad', !!msg); el2.hidden = !msg; el2.textContent = msg || ''; return !!msg; }
    cform.addEventListener('submit', function (e) {
      e.preventDefault(); var bad = [];
      if (cerr('title', !$c('title').value.trim() ? 'Enter a title.' : '')) bad.push($c('title'));
      if (cerr('category', !$c('category').value ? 'Choose a category.' : '')) bad.push($c('category'));
      if (cerr('difficulty', !$c('difficulty').value ? 'Choose a difficulty.' : '')) bad.push($c('difficulty'));
      if (cerr('points', !(+$c('points').value > 0) ? 'Points must be more than 0.' : '')) bad.push($c('points'));
      if (cerr('flag', !$c('flag').value.trim() ? 'Enter the flag.' : '')) bad.push($c('flag'));
      if (cerr('description', !$c('description').value.trim() ? 'Describe the challenge.' : '')) bad.push($c('description'));
      var al = document.getElementById('c-alert');
      if (bad.length) { al.hidden = false; al.textContent = 'Check the highlighted fields and try again.'; bad[0].focus(); return; }
      al.hidden = true; toast((data ? 'Challenge saved' : 'Challenge created') + ' (preview)');
      setTimeout(function () { location.href = 'challenges.html'; }, 900);
    });
  }

  // ---------- player: challenge board ----------
  var SOLVED_KEY = 'rootline.solved';
  function readSolved() { try { return JSON.parse(sessionStorage.getItem(SOLVED_KEY) || '[]'); } catch (_) { return []; } }
  function saveSolved(id) { try { var s = readSolved(); if (s.indexOf(id) < 0) { s.push(id); sessionStorage.setItem(SOLVED_KEY, JSON.stringify(s)); } } catch (_) {} }
  var cg = document.getElementById('cg');
  if (cg) {
    var cards = [].slice.call(cg.querySelectorAll('.cc')), cat = 'all',
        cq = document.getElementById('c-search'), cd = document.getElementById('c-diff'), cs = document.getElementById('c-state'),
        cEmpty = document.getElementById('cg-empty'), cCount = document.getElementById('cg-count');
    // challenges solved earlier in this preview session
    var extra = 0;
    readSolved().forEach(function (id) {
      var c = cards.filter(function (x) { return +x.dataset.id === id; })[0];
      if (c && c.dataset.state !== 'solved') {
        c.dataset.state = 'solved'; c.classList.add('is-solved'); extra += +c.dataset.pts;
        var o = c.querySelector('.cc__open'); if (o) { o.outerHTML = '<span class="st st--ok">solved</span>'; }
      }
    });
    var nSolved = cards.filter(function (c) { return c.dataset.state === 'solved'; }).length;
    document.getElementById('prog-n').textContent = nSolved + ' of ' + cards.length + ' solved';
    document.getElementById('prog-bar').style.setProperty('--w', Math.round(nSolved / cards.length * 100) + '%');
    document.querySelector('#prog .prog__t span').textContent = (5700 + extra).toLocaleString('en-US') + ' points';
    function applyCards() {
      var term = cq.value.trim().toLowerCase(), n = 0;
      cards.forEach(function (c) {
        var ok = (cat === 'all' || c.dataset.cat === cat) && (!cd.value || c.dataset.diff === cd.value) && (!cs.value || c.dataset.state === cs.value) && (!term || c.dataset.text.indexOf(term) > -1);
        c.hidden = !ok; if (ok) n++;
      });
      cEmpty.hidden = n > 0; cCount.textContent = 'Showing ' + n + ' of ' + cards.length + ' challenges';
    }
    document.querySelectorAll('#cat-tabs [data-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.cat;
        document.querySelectorAll('#cat-tabs [data-cat]').forEach(function (x) { x.classList.toggle('on', x === b); });
        applyCards();
      });
    });
    cq.addEventListener('input', applyCards); cd.addEventListener('change', applyCards); cs.addEventListener('change', applyCards);
  }

  // ---------- player: challenge detail + flag submission (preview) ----------
  var chal = document.getElementById('chal');
  if (chal && window.ROOTLINE_CHALLENGES) {
    var cid = +new URLSearchParams(location.search).get('id');
    var C = window.ROOTLINE_CHALLENGES.filter(function (x) { return x.id === cid; })[0];
    if (!C) {
      chal.innerHTML = '<a class="back" href="challenges.html">&larr; All challenges</a><div class="head"><h1>Challenge not found</h1><p>This challenge does not exist or is not live yet.</p></div>';
    } else {
      var $ = function (i) { return document.getElementById(i); };
      var DIFF = { easy: 'd-easy', medium: 'd-med', hard: 'd-hard' };
      var solved = !!C.solvedAt || readSolved().indexOf(C.id) > -1, solvedAt = C.solvedAt || 'just now', attempts = 0;
      document.title = C.name + ' | Rootline';
      $('chal-title').textContent = C.name; $('chal-blurb').textContent = C.blurb;
      function tags() {
        var t = $('chal-tags'); t.innerHTML = '';
        function add(txt, cls) { var s = document.createElement('span'); s.className = 'st ' + (cls || ''); s.textContent = txt; t.appendChild(s); }
        add(C.cat); add(C.diff, ''); t.lastChild.classList.add(DIFF[C.diff]); add(C.pts + ' pts'); if (solved) add('solved', 'st--ok');
      }
      tags();
      var p1 = document.createElement('p'); p1.textContent = C.desc; var p2 = document.createElement('p'); p2.textContent = 'Flags look like FLAG{...}. Submit the whole thing, braces included.';
      $('chal-desc').appendChild(p1); $('chal-desc').appendChild(p2);
      $('chal-pts').textContent = C.pts + ' pts'; $('chal-solves').textContent = C.solves + (solved && !C.solvedAt ? 1 : 0);
      $('fb-team').textContent = C.firstBlood; $('fb-time').textContent = C.fbTime;
      $('chal-diff').textContent = C.diff.charAt(0).toUpperCase() + C.diff.slice(1) + '. Points drop as more teams solve it.';
      if (C.target) { $('sec-target').hidden = false; $('chal-target').textContent = C.target; $('copy-target').dataset.copy = C.target; $('copy-target').addEventListener('click', function () { copyText(C.target).then(function (ok) { var b = $('copy-target'); b.textContent = ok ? 'Copied' : 'Press Ctrl+C'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); }); }); }
      if (C.files.length) {
        $('sec-files').hidden = false;
        C.files.forEach(function (f) {
          var r = document.createElement('div'); r.className = 'li';
          r.innerHTML = '<div class="li__t"><b></b><span></span></div><button type="button" class="btn btn--sm">Download</button>';
          r.querySelector('b').textContent = f.name; r.querySelector('span').textContent = f.size;
          r.querySelector('button').addEventListener('click', function () { toast('Download started: ' + f.name + ' (preview)'); });
          $('chal-files').appendChild(r);
        });
      }
      function renderHints() {
        var box = $('chal-hints'); box.innerHTML = '';
        C.hints.forEach(function (h, i) {
          var r = document.createElement('div'); r.className = 'hint-row';
          if (h.open) {
            r.innerHTML = '<div><b></b><span class="sub"></span><p></p></div>';
            r.querySelector('b').textContent = 'Hint ' + (i + 1); r.querySelector('.sub').textContent = 'Unlocked, cost ' + h.cost + ' points'; r.querySelector('p').textContent = h.text;
          } else {
            r.innerHTML = '<div><b></b><span class="sub"></span></div><button type="button" class="btn btn--sm">Unlock</button>';
            r.querySelector('b').textContent = 'Hint ' + (i + 1); r.querySelector('.sub').textContent = 'Costs ' + h.cost + ' points';
            r.querySelector('button').addEventListener('click', function () {
              ask({ title: 'Unlock hint ' + (i + 1) + '?', text: 'This costs ' + h.cost + ' points and cannot be undone.', ok: 'Unlock for ' + h.cost + ' pts' }, function () { h.open = true; renderHints(); toast('Hint unlocked, -' + h.cost + ' points (preview)'); });
            });
          }
          box.appendChild(r);
        });
        var n = C.hints.filter(function (h) { return h.open; }).length; $('hint-sum').textContent = n + ' of ' + C.hints.length + ' unlocked';
      }
      renderHints();
      var form = $('flag-form'), inp = $('flag-in'), res = $('flag-res'), btn = $('flag-btn'), ferr = $('flag-in-e');
      function say(kind, msg) { res.className = 'res res--' + kind; res.textContent = msg; res.hidden = false; }
      function lock() { inp.disabled = true; btn.disabled = true; btn.textContent = 'Solved'; $('flag-meta').hidden = true; form.querySelector('.demo').hidden = true; }
      if (solved && C.solvedAt) { say('ok', 'You solved this at ' + C.solvedAt + ' for +' + C.pts + ' points.'); lock(); }
      inp.addEventListener('input', function () { ferr.hidden = true; inp.classList.remove('bad'); res.hidden = true; });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var v = inp.value.trim();
        if (!v) { ferr.textContent = 'Enter a flag.'; ferr.hidden = false; inp.classList.add('bad'); inp.focus(); return; }
        if (!/^FLAG\{.+\}$/.test(v)) { ferr.textContent = 'Flags look like FLAG{...}.'; ferr.hidden = false; inp.classList.add('bad'); inp.focus(); return; }
        attempts++; $('attempts').textContent = attempts;
        if (v === 'FLAG{demo}') {
          solved = true; saveSolved(C.id); tags(); say('ok', 'Correct. +' + C.pts + ' points for your team.'); toast(C.name + ' solved, +' + C.pts + ' points (preview)'); lock(); $('chal-solves').textContent = C.solves + 1;
        } else { say('bad', 'Incorrect flag. Try again.'); inp.select(); }
      });
    }
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
