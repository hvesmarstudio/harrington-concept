/* Harrington landing concept · vanilla JS interactions */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const CIRC = 169.65;
  const ICON = (id) => `<svg><use href="#${id}"/></svg>`;

  /* Sticky nav shadow */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }));

  /* Score rings */
  function setRing(ring, score) {
    const val = $('.val', ring);
    requestAnimationFrame(() => { val.style.strokeDashoffset = CIRC * (1 - score / 100); });
  }

  /* Reveal on scroll */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  setTimeout(() => $$('.ring[data-score]').forEach(r => setRing(r, +r.dataset.score)), 400);

  /* Grade tabs */
  $$('[data-tabs]').forEach(card => {
    const tabs = $$('.tab', card);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', t === tab));
      $$('.panel', card).forEach(p => p.classList.toggle('active', p.id === tab.dataset.panel));
    }));
  });

  /* FAQ accordion */
  const items = $$('.acc__item');
  const setH = (it) => { const a = $('.acc__a', it); a.style.height = it.classList.contains('open') ? a.scrollHeight + 'px' : '0px'; };
  items.forEach(it => {
    setH(it);
    $('.acc__q', it).addEventListener('click', () => {
      const willOpen = !it.classList.contains('open');
      items.forEach(o => { o.classList.remove('open'); $('.acc__q', o).setAttribute('aria-expanded', false); setH(o); });
      if (willOpen) { it.classList.add('open'); $('.acc__q', it).setAttribute('aria-expanded', true); setH(it); }
    });
  });
  window.addEventListener('resize', () => items.forEach(setH));

  /* ---------- Score ID lookup (demo data) ---------- */
  const REPORTS = {
    'HC-2610-04821': {
      device: 'Kindle Paperwhite', meta: '11th Gen · 16GB · Black · Serial ending 7Q2K', score: 94, label: 'Excellent',
      func: 'A', cos: 'Pristine', battery: '96%', date: '02 Oct 2026', tech: 'Tech 07', checks: '52/52',
      rows: [
        ['Battery health', '96% · 41 cycles', 'ok'], ['E-ink display', 'No dead pixels', 'ok'],
        ['Frontlight', '24/24 levels even', 'ok'], ['Touch grid', '100% response', 'ok'],
        ['Power button', 'Pass', 'ok'], ['USB-C port', 'Charge + data', 'ok'],
        ['Wi-Fi', '2.4 / 5 GHz', 'ok'], ['Storage', '16 GB · healthy', 'ok'],
        ['Water exposure', 'None detected', 'ok'], ['Cameras', 'Not applicable', 'na'],
        ['Account lock', 'Deregistered', 'ok'], ['Data wipe', 'Certified erase', 'ok']
      ]
    },
    'HC-2609-11357': {
      device: 'iPhone 14', meta: '128GB · Starlight · Serial ending M4XD', score: 88, label: 'Great',
      func: 'A', cos: 'Clean', battery: '89%', date: '28 Sep 2026', tech: 'Tech 03', checks: '58/58',
      rows: [
        ['Battery health', '89% · 312 cycles', 'ok'], ['OLED display', 'No burn-in', 'ok'],
        ['Face ID', 'Pass', 'ok'], ['Touch grid', '100% response', 'ok'],
        ['Cameras', 'Main · UW · Front', 'ok'], ['Speakers & mics', '4 / 4 pass', 'ok'],
        ['Buttons & switch', 'Side · Vol · Mute', 'ok'], ['Lightning port', 'Charge + data', 'ok'],
        ['5G · Wi-Fi · BT', 'All pass', 'ok'], ['Sensors', 'Prox · Gyro · Compass', 'ok'],
        ['Parts check', 'All original', 'ok'], ['iCloud lock', 'Off · wiped', 'ok']
      ]
    },
    'HC-2610-00762': {
      device: 'MacBook Air M2', meta: '13.6" · 8GB / 256GB · Midnight · Serial ending 9VNF', score: 81, label: 'Good',
      func: 'B', cos: 'Clean', battery: '86%', date: '03 Oct 2026', tech: 'Tech 11', checks: '61/62',
      rows: [
        ['Battery health', '86% · 212 cycles', 'ok'], ['Retina display', 'No pressure marks', 'ok'],
        ['Keyboard', '78 / 78 keys', 'ok'], ['Trackpad', 'Force Touch pass', 'ok'],
        ['MagSafe', 'Charging pass', 'ok'], ['USB-C ports', 'Left port slightly loose', 'warn'],
        ['Camera & mics', 'Pass', 'ok'], ['Speakers', 'Pass', 'ok'],
        ['SSD', '256 GB · health 98%', 'ok'], ['Thermal stress', '30 min · stable', 'ok'],
        ['Wi-Fi & BT', 'Pass', 'ok'], ['Activation lock', 'Off · wiped', 'ok']
      ]
    }
  };
  const gColor = { A: 'a', B: 'b', C: 'c' };
  const report = $('#report'), input = $('#idInput'), msg = $('#idMsg');

  function renderReport(id) {
    const r = REPORTS[id];
    const rows = r.rows.map(([k, m, s]) => `<li><span>${k}</span><span class="m">${m}</span><span class="${s}">${s === 'ok' ? ICON('i-check') : s === 'warn' ? ICON('i-warn') : '–'}</span></li>`).join('');
    report.innerHTML = `
      <div class="report__head">
        <div>
          <div class="report__kicker">Inspection report <span class="ver">${ICON('i-check')}Verified</span></div>
          <div class="report__title">${r.device}</div>
          <div class="report__meta">${r.meta}</div>
          <div class="report__id">${id}</div>
        </div>
        <div class="report__score">
          <div class="ring" data-score="${r.score}"><svg viewBox="0 0 64 64"><circle class="trk" cx="32" cy="32" r="27"/><circle class="val" cx="32" cy="32" r="27" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/></svg><b>${r.score}</b></div>
          <small>Harrington Score · ${r.label}</small>
        </div>
      </div>
      <div class="report__grades">
        <div><label>Functional grade</label><strong><span class="gchip gchip--${gColor[r.func]}">${r.func}</span>Grade ${r.func}</strong></div>
        <div><label>Cosmetic grade</label><strong>${r.cos}</strong></div>
        <div><label>Checks passed</label><strong class="mono">${r.checks}</strong></div>
      </div>
      <ul class="checks">${rows}</ul>
      <div class="report__foot"><span>Inspected ${r.date} · KL Lab · ${r.tech} · Warranty to ${r.date.replace('2026', '2027')}</span><a href="#products">View this device →</a></div>`;
    setRing($('.ring', report), r.score);
  }

  function lookup(raw) {
    const id = raw.trim().toUpperCase();
    input.value = id;
    $$('.idhint button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    if (!/^HC-\d{4}-\d{5}$/.test(id)) { msg.textContent = 'Score IDs look like HC-2610-04821. Check the box or your invoice.'; return; }
    if (!REPORTS[id]) { msg.textContent = 'Demo mode: try one of the sample IDs above to see a full report.'; return; }
    msg.textContent = '';
    report.classList.add('loading');
    setTimeout(() => { renderReport(id); report.classList.remove('loading'); }, 260);
  }
  $('#idForm').addEventListener('submit', e => { e.preventDefault(); lookup(input.value); });
  $$('.idhint button').forEach(b => b.addEventListener('click', () => lookup(b.dataset.id)));
  input.addEventListener('input', () => {
    let v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.startsWith('HC')) v = v.slice(2);
    v = v.replace(/\D/g, '').slice(0, 9);
    input.value = 'HC-' + v.slice(0, 4) + (v.length > 4 ? '-' + v.slice(4) : '');
  });
  $$('[data-id]').forEach(a => { if (a.tagName === 'A') a.addEventListener('click', () => lookup(a.dataset.id)); });
  renderReport('HC-2610-04821');

  /* ---------- Product filters ---------- */
  const chips = $$('.chip');
  function filter(f) {
    chips.forEach(c => c.classList.toggle('on', c.dataset.f === f));
    $$('.card').forEach(card => card.classList.toggle('hide', f !== 'all' && card.dataset.cat !== f));
  }
  chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.f)));
  $$('.cat[data-filter]').forEach(c => c.addEventListener('click', () => filter(c.dataset.filter)));
  $$('.card__fav').forEach(b => b.addEventListener('click', () => b.classList.toggle('on')));

  /* ---------- Trade-in quote widget (illustrative pricing) ---------- */
  const MODELS = {
    'Phone': [['iPhone 15 Pro · 128GB', 3200], ['iPhone 14 · 128GB', 1900], ['iPhone 13 · 128GB', 1350], ['Samsung Galaxy S23 · 256GB', 1500]],
    'Tablet': [['iPad Air (5th Gen) · 64GB', 1350], ['iPad Pro 11" M2 · 128GB', 2600], ['iPad (9th Gen) · 64GB', 650], ['Galaxy Tab S9 · 128GB', 1500]],
    'E-reader': [['Kindle Paperwhite (11th Gen)', 250], ['Kindle Oasis (10th Gen)', 380], ['Kobo Libra 2', 300], ['Kobo Clara 2E', 240]],
    'Laptop': [['MacBook Air M2 · 8/256GB', 2600], ['MacBook Air M1 · 8/256GB', 1800], ['MacBook Pro 14" M3', 4800], ['Dell XPS 13 (2023)', 1500]],
    'Camera & drone': [['DJI Mini 3 · with RC', 1100], ['DJI Mini 4 Pro', 2200], ['Sony A7 III · body', 3200], ['Fujifilm X-T30 II · body', 1800]],
    'Audio': [['Sony WH-1000XM5', 520], ['AirPods Pro (2nd Gen)', 420], ['Bose QC45', 380]],
    'Gaming': [['Nintendo Switch OLED', 650], ['PlayStation 5 · Disc', 1200], ['Steam Deck OLED · 512GB', 1500]]
  };
  const qCat = $('#qCat'), qModel = $('#qModel'), qOffer = $('#qOffer'), qNote = $('#qNote');
  qCat.innerHTML = Object.keys(MODELS).map(k => `<option>${k}</option>`).join('');
  const fillModels = () => { qModel.innerHTML = MODELS[qCat.value].map(([n, p]) => `<option value="${p}">${n}</option>`).join(''); };
  qCat.value = 'Phone'; fillModels(); qModel.selectedIndex = 1;
  const fmt = n => 'RM ' + n.toLocaleString('en-MY');
  let shown = 0;
  function animateTo(target) {
    const start = shown, t0 = performance.now(), dur = 500;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      shown = Math.round(start + (target - start) * e);
      qOffer.textContent = fmt(Math.round(shown / 10) * 10);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function quote() {
    const base = +qModel.value;
    const m = +$('#qCond .on').dataset.m;
    const b = +$('#qPay .on').dataset.b;
    const cash = Math.round(base * m / 10) * 10;
    const total = Math.round(cash * (1 + b) / 10) * 10;
    animateTo(total);
    qNote.innerHTML = b > 0 ? `Includes ${fmt(total - cash)} credit bonus · <i>Sebut harga dijamin 7 hari</i>` : `<i>Sebut harga dijamin 7 hari</i> · quote locked for 7 days`;
  }
  qCat.addEventListener('change', () => { fillModels(); quote(); });
  qModel.addEventListener('change', quote);
  ['#qCond', '#qPay'].forEach(sel => $$(sel + ' button').forEach(btn => btn.addEventListener('click', () => {
    $$(sel + ' button').forEach(x => x.classList.toggle('on', x === btn)); quote();
  })));
  quote();

  /* Newsletter */
  $('#newsForm').addEventListener('submit', e => {
    e.preventDefault();
    $('#newsMsg').innerHTML = '<b>Terima kasih!</b> You\'re on the list. First dibs incoming.';
    e.target.reset();
  });
})();
