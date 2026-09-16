/* Walk Korea — page interactions. No dependencies.
   Language switch · mobile menu · purpose picker · journey filter · Stage Planner · passport · beta form */
(() => {
  'use strict';

  const D = window.WK_DATA || {};
  const KO = (window.WK_I18N && window.WK_I18N.ko) || {};
  const UI = D.ui || {};
  const ROUTE = D.route || [];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = { lang: 'en', purpose: 'rest', days: 5, pace: 20, plan: [], day: 0, stamps: 3 };

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  const t = (entry, vars = {}) => (entry ? fill(entry[state.lang] ?? entry.en, vars) : '');
  const km = (n) => Number(n).toFixed(1);
  const restartAnimation = (el, cls) => {
    if (!el || reduceMotion) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  /* ---------- Language ---------- */
  const enText = new Map();
  const enAttr = new Map();
  const metaDesc = $('meta[name="description"]');
  const enMeta = metaDesc ? metaDesc.content : '';

  const attrPairs = (el) => el.dataset.i18nAttr.split(';').map((p) => p.split(':').map((s) => s.trim()));

  function cacheEnglish() {
    $$('[data-i18n]').forEach((el) => enText.set(el, el.innerHTML));
    $$('[data-i18n-attr]').forEach((el) => {
      const saved = {};
      attrPairs(el).forEach(([attr]) => { saved[attr] = el.getAttribute(attr); });
      enAttr.set(el, saved);
    });
  }

  function initialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'ko' || fromUrl === 'en') return fromUrl;
    try {
      const saved = window.localStorage.getItem('wk-lang');
      if (saved === 'ko' || saved === 'en') return saved;
    } catch (e) { /* storage unavailable */ }
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^ko\b/i.test(first) ? 'ko' : 'en';
  }

  function applyLang(lang) {
    state.lang = lang === 'ko' ? 'ko' : 'en';
    const ko = state.lang === 'ko';
    root.lang = state.lang;

    enText.forEach((en, el) => {
      const key = el.dataset.i18n;
      el.innerHTML = ko && KO[key] != null ? KO[key] : en;
    });
    enAttr.forEach((saved, el) => {
      attrPairs(el).forEach(([attr, key]) => {
        const value = ko && KO[key] != null ? KO[key] : saved[attr];
        if (value != null) el.setAttribute(attr, value);
      });
    });
    if (metaDesc) metaDesc.content = ko && KO['meta.description'] ? KO['meta.description'] : enMeta;

    $$('.lang-switch__btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    try { window.localStorage.setItem('wk-lang', state.lang); } catch (e) { /* storage unavailable */ }

    renderPicker(false);
    renderPlanner(false);
    renderPassport();
    labelCompare();
    updateMenuLabel();
  }

  $$('.lang-switch__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== state.lang) applyLang(btn.dataset.lang);
    });
  });

  /* ---------- Header & mobile menu ---------- */
  const header = $('#site-header');
  const nav = $('#site-nav');
  const toggle = $('#menu-toggle');

  function updateMenuLabel() {
    if (!toggle) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    const label = $('.sr-only', toggle);
    if (label) label.textContent = t(open ? UI.menuClose : UI.menuOpen);
  }

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  }

  if (toggle) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (mq) => { if (mq.matches) setMenu(false); });
  }

  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero: purpose picker ---------- */
  const picker = $('#purpose-picker');
  const suggestion = $('#picker-result');

  function renderPicker(animate) {
    if (!suggestion) return;
    const purpose = (D.purposes || {})[state.purpose];
    if (!purpose) return;
    const slot = (name) => $(`[data-slot="${name}"]`, suggestion);
    const link = slot('link');

    if (purpose.journey) {
      const card = document.getElementById(`journey-${purpose.journey}`);
      if (!card) return;
      slot('title').textContent = $('.journey__title', card).textContent;
      slot('meta').textContent = $('.journey__meta', card).textContent;
      slot('why').textContent = $('.journey__desc', card).textContent;
      link.setAttribute('href', `#${card.id}`);
      link.dataset.journey = purpose.journey;
      delete link.dataset.preset;
      slot('linktext').textContent = t(UI.seeJourney);
    } else if (purpose.planner) {
      const { days, pace } = purpose.planner;
      const stops = planStages(days, pace);
      const n = stops.length - 1;
      slot('title').textContent = t(UI.eastTitle, { days: n });
      slot('meta').textContent = t(UI.planMeta, { days: n, km: km(ROUTE[stops[n]].km), level: t(UI.level[purpose.level]) });
      slot('why').textContent = t(purpose.why);
      link.setAttribute('href', '#planner');
      link.dataset.preset = `${days}-${pace}`;
      delete link.dataset.journey;
      slot('linktext').textContent = t(UI.openPlanner);
    }
    if (animate) restartAnimation(suggestion, 'is-updating');
  }

  if (picker) {
    picker.addEventListener('change', (e) => {
      if (e.target.name !== 'purpose') return;
      state.purpose = e.target.value;
      renderPicker(true);
    });
    picker.addEventListener('submit', (e) => e.preventDefault());
  }

  /* ---------- Journeys: filter & highlight ---------- */
  function setFilter(filter) {
    $$('.filter__btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    $$('.journey').forEach((card) => {
      card.hidden = filter !== 'all' && !card.dataset.purposes.split(' ').includes(filter);
    });
  }
  $$('.filter__btn').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));

  function highlightJourney(id) {
    const card = document.getElementById(`journey-${id}`);
    if (!card) return;
    if (card.hidden) setFilter('all');
    const list = card.parentElement;
    if (list.scrollWidth > list.clientWidth) {
      const pad = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      const offset = card.getBoundingClientRect().left - list.getBoundingClientRect().left - pad;
      list.scrollBy({ left: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    card.classList.add('is-highlight');
    window.setTimeout(() => card.classList.remove('is-highlight'), 2600);
  }

  /* Shared link behaviours: planner presets, journey highlight, partner interest */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-preset], a[data-journey], a[data-interest]');
    if (!a) return;
    if (a.dataset.preset) {
      const [days, pace] = a.dataset.preset.split('-').map(Number);
      setPlanner(days, pace);
    }
    if (a.dataset.journey) highlightJourney(a.dataset.journey);
    if (a.dataset.interest) {
      const box = document.getElementById(`int-${a.dataset.interest}`);
      if (box) box.checked = true;
    }
  });

  /* ---------- Stage Planner ---------- */
  const plannerForm = $('#planner-form');
  const daysEl = $('#planner-days');
  const detailEl = $('#planner-detail');
  const summaryEl = $('#planner-summary');
  const mapEl = $('#planner-map');

  /* Split the route into `days` stages that end at stops with beds, keeping each
     day close to `pace` km (overshooting costs more than falling short). */
  function planStages(days, pace) {
    const n = ROUTE.length;
    const cap = pace * 1.35;
    const minDay = 5;
    for (let d = Math.min(days, n - 1); d >= 1; d--) {
      const best = Array.from({ length: d + 1 }, () => new Array(n).fill(null));
      best[0][0] = { cost: 0, prev: -1 };
      for (let k = 1; k <= d; k++) {
        for (let j = 1; j < n; j++) {
          if (!ROUTE[j].stays) continue;
          for (let i = 0; i < j; i++) {
            const from = best[k - 1][i];
            if (!from) continue;
            const dist = ROUTE[j].km - ROUTE[i].km;
            if (dist < minDay || dist > cap) continue;
            const dev = (dist - pace) / pace;
            const cost = from.cost + dev * dev * (dist > pace ? 2 : 1) - 0.0015 * dist;
            if (!best[k][j] || cost < best[k][j].cost) best[k][j] = { cost, prev: i };
          }
        }
      }
      let end = -1;
      let endCost = Infinity;
      for (let j = 1; j < n; j++) {
        if (!best[d][j]) continue;
        const cost = best[d][j].cost - (j === n - 1 ? 0.05 : 0);
        if (cost < endCost) { endCost = cost; end = j; }
      }
      if (end < 0) continue;
      const stops = [end];
      for (let k = d, j = end; k > 0; k--) {
        j = best[k][j].prev;
        stops.unshift(j);
      }
      return stops;
    }
    return [0, n - 1];
  }

  function buildStages(stops) {
    return stops.slice(1).map((to, i) => {
      const from = stops[i];
      const passed = ROUTE.slice(from + 1, to + 1);
      const terrains = [];
      passed.forEach((s) => {
        if (s.terrain && !terrains.some((x) => x.en === s.terrain.en)) terrains.push(s.terrain);
      });
      return {
        from: ROUTE[from],
        to: ROUTE[to],
        dist: ROUTE[to].km - ROUTE[from].km,
        terrains: terrains.slice(0, 2),
        storyStop: ROUTE[to].story ? ROUTE[to] : passed.find((s) => s.story),
        question: D.questions[i % D.questions.length]
      };
    });
  }

  function setPlanner(days, pace) {
    state.days = days;
    state.pace = pace;
    state.day = 0;
    if (plannerForm) {
      plannerForm.elements.days.value = String(days);
      plannerForm.elements.pace.value = String(pace);
    }
    renderPlanner(true);
  }

  function renderPlanner(animate) {
    if (!daysEl || !detailEl || !ROUTE.length) return;
    const stops = planStages(state.days, state.pace);
    state.plan = buildStages(stops);
    if (state.day >= state.plan.length) state.day = 0;

    const n = state.plan.length;
    const last = stops[stops.length - 1];
    const total = ROUTE[last].km;
    let extra = '';
    if (last !== ROUTE.length - 1) extra = t(UI.partial, { km: km(total) });
    else if (total / n < state.pace * 0.85) extra = t(UI.spread, { days: n });

    if (summaryEl) {
      summaryEl.innerHTML =
        `<span class="mono">${esc(t(UI.summary, { days: n, km: km(total) }))}</span> ` +
        `${esc(t(ROUTE[0].name))} → ${esc(t(ROUTE[last].name))}` +
        (extra ? `<span class="planner__spread">${esc(extra)}</span>` : '');
    }

    daysEl.setAttribute('role', 'tablist');
    daysEl.setAttribute('aria-label', t(UI.daysLabel));
    daysEl.innerHTML = state.plan.map((s, i) => `
      <button type="button" class="day-tab" role="tab" id="day-tab-${i}" aria-controls="planner-detail" data-day="${i}">
        <span class="day-tab__day">${esc(t(UI.dayN, { n: i + 1 }))}</span>
        <span class="day-tab__route">${esc(t(s.from.short))} → ${esc(t(s.to.short))}</span>
        <span class="day-tab__km">${km(s.dist)} km</span>
      </button>`).join('');

    drawMap(stops);
    selectDay(state.day, animate);
  }

  function selectDay(index, animate) {
    state.day = index;
    $$('.day-tab', daysEl).forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    renderDay(animate);
    highlightMap(animate);
  }

  function renderDay(animate) {
    const s = state.plan[state.day];
    if (!s) return;
    const n = state.plan.length;
    const mins = Math.max(5, Math.round(((s.dist / 3.6) * 60) / 5) * 5);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const time = t(UI.timeVal, { h, m: state.lang === 'en' ? String(m).padStart(2, '0') : m });
    const note = s.dist > state.pace * 1.12 ? t(UI.longer) : s.dist < state.pace * 0.7 ? t(UI.shorter) : '';
    const to = s.to;

    detailEl.setAttribute('role', 'tabpanel');
    detailEl.setAttribute('aria-labelledby', `day-tab-${state.day}`);
    detailEl.innerHTML = `
      <div class="detail__head">
        <p class="detail__day">${esc(t(UI.dayOf, { n: state.day + 1, total: n }))}</p>
        <h3 class="detail__route">${esc(t(s.from.name))} → ${esc(t(to.name))}</h3>
      </div>
      <dl class="detail__stats">
        <div><dt>${esc(t(UI.distance))}</dt><dd>${km(s.dist)} km</dd></div>
        <div><dt>${esc(t(UI.time))}</dt><dd>${esc(time)}</dd></div>
        <div><dt>${esc(t(UI.terrain))}</dt><dd class="detail__terrain">${esc(s.terrains.map((x) => t(x)).join(' · '))}</dd></div>
      </dl>
      ${note ? `<p class="detail__note">${esc(note)}</p>` : ''}
      <div class="detail__block">
        <p class="label">${esc(t(UI.tonight, { place: t(to.short) }))}</p>
        <div class="detail__counts">
          <p class="count count--stays"><b>${to.stays}</b><span>${esc(t(UI.stays))}</span></p>
          <p class="count"><b>${to.eats}</b><span>${esc(t(UI.eats))}</span></p>
          <p class="count"><b>${to.stores}</b><span>${esc(t(UI.stores))}</span></p>
        </div>
        <p class="amenities">
          <span class="amenity${to.laundry ? '' : ' amenity--no'}">${esc(t(to.laundry ? UI.laundry : UI.noLaundry))}</span>
          <span class="amenity${to.bath ? '' : ' amenity--no'}">${esc(t(to.bath ? UI.bath : UI.noBath))}</span>
        </p>
      </div>
      <div class="detail__block">
        <p class="detail__row"><svg class="icon" aria-hidden="true"><use href="#i-train"/></svg><span><span class="sr-only">${esc(t(UI.transit))}: </span>${esc(t(to.transit))}</span></p>
        ${s.storyStop ? `<p class="detail__row"><svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg><span><span class="sr-only">${esc(t(UI.story))}: </span>${esc(t(s.storyStop.story))}</span></p>` : ''}
      </div>
      <div class="detail__block">
        <p class="label">${esc(t(UI.question))}</p>
        <p class="detail__question">${esc(t(s.question))}</p>
      </div>`;
    if (animate) restartAnimation(detailEl, 'is-updating');
  }

  if (plannerForm) {
    plannerForm.addEventListener('change', () => {
      state.days = Number(plannerForm.elements.days.value);
      state.pace = Number(plannerForm.elements.pace.value);
      state.day = 0;
      renderPlanner(true);
    });
    plannerForm.addEventListener('submit', (e) => e.preventDefault());
  }

  if (daysEl) {
    daysEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (tab) selectDay(Number(tab.dataset.day), true);
    });
    daysEl.addEventListener('keydown', (e) => {
      const tab = e.target.closest('.day-tab');
      if (!tab) return;
      const n = state.plan.length;
      let i = Number(tab.dataset.day);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + n) % n;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = n - 1;
      else return;
      e.preventDefault();
      selectDay(i, true);
      const next = document.getElementById(`day-tab-${i}`);
      if (next) {
        next.focus();
        next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }

  /* Schematic map drawn from approximate stop coordinates */
  function drawMap(stops) {
    if (!mapEl) return;
    const lats = ROUTE.map((s) => s.lat);
    const lons = ROUTE.map((s) => s.lon);
    const latTop = Math.max(...lats);
    const latBottom = Math.min(...lats);
    const lonLeft = Math.min(...lons);
    const lonRight = Math.max(...lons);
    const KX = 88.3; /* km per degree of longitude near 37.5°N */
    const KY = 111.0; /* km per degree of latitude */
    const W = 300, padL = 104, padR = 44, padT = 36, padB = 58;
    const scale = (W - padL - padR) / ((lonRight - lonLeft) * KX);
    const H = Math.round(padT + (latTop - latBottom) * KY * scale + padB);
    const pt = (s) => [padL + (s.lon - lonLeft) * KX * scale, padT + (latTop - s.lat) * KY * scale];
    const xy = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    const pts = ROUTE.map(pt);
    const first = pts[0];
    const last = pts[pts.length - 1];
    const out = [];

    const sea = [[first[0] - 12, 0], ...pts.map((p) => [p[0] + 5, p[1]]), [last[0] + 18, H], [W, H], [W, 0]];
    out.push(`<polygon class="map-sea" points="${sea.map(xy).join(' ')}"/>`);
    out.push(`<text class="map-sea-label" x="${W - 12}" y="${padT + 12}" text-anchor="end">${esc(t(UI.seaLabel))}</text>`);
    out.push(`<polyline class="map-coast" points="${pts.map(xy).join(' ')}"/>`);

    for (let d = 0; d < stops.length - 1; d++) {
      const seg = pts.slice(stops[d], stops[d + 1] + 1);
      out.push(`<path class="map-stage" data-day="${d}" pathLength="1" d="M${seg.map(xy).join(' L')}"/>`);
    }
    pts.forEach((p, i) => {
      if (!stops.includes(i)) out.push(`<circle class="map-stop" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6"/>`);
    });
    out.push(`<circle class="map-start" cx="${first[0].toFixed(1)}" cy="${first[1].toFixed(1)}" r="5.5"/>`);

    let lastY = -Infinity;
    stops.forEach((stopIndex, d) => {
      const p = pts[stopIndex];
      const y = Math.max(p[1] + 3.5, lastY + 12);
      lastY = y;
      out.push(`<text class="map-label${d === 0 ? ' map-label--strong' : ''}" x="${(p[0] - 14).toFixed(1)}" y="${y.toFixed(1)}" text-anchor="end">${esc(t(ROUTE[stopIndex].short))}</text>`);
    });
    stops.slice(1).forEach((stopIndex, d) => {
      const [x, y] = pts[stopIndex];
      out.push(`<circle class="map-night" data-day="${d}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5"/>`);
      out.push(`<text class="map-night-num" data-day="${d}" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${d + 1}</text>`);
    });

    const bar = 10 * scale;
    const by = H - 22;
    out.push(`<path class="map-scale" fill="none" d="M16 ${by - 4}V${by}H${(16 + bar).toFixed(1)}V${by - 4}"/>`);
    out.push(`<text class="map-scale-text" x="16" y="${by + 13}">10 km</text>`);
    out.push(`<path class="map-scale" fill="none" d="M${W - 18} ${H - 14}V${H - 34}M${W - 22} ${H - 29}L${W - 18} ${H - 34}L${W - 14} ${H - 29}"/>`);
    out.push(`<text class="map-scale-text" x="${W - 18}" y="${H - 39}" text-anchor="middle">N</text>`);

    mapEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    mapEl.innerHTML = out.join('');
  }

  function highlightMap(animate) {
    if (!mapEl) return;
    $$('.map-stage', mapEl).forEach((path) => {
      const on = Number(path.dataset.day) === state.day;
      path.classList.toggle('is-active', on);
      if (!on) return;
      path.style.animation = 'none';
      if (animate && !reduceMotion) {
        void path.getBoundingClientRect();
        path.style.animation = '';
      }
      path.parentNode.appendChild(path);
    });
    $$('.map-night, .map-night-num', mapEl).forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.day) === state.day);
    });
    $$('.map-night, .map-night-num, .map-stop, .map-start', mapEl).forEach((el) => el.parentNode.appendChild(el));
  }

  if (mapEl) {
    mapEl.addEventListener('click', (e) => {
      const dot = e.target.closest('.map-night');
      if (dot) selectDay(Number(dot.dataset.day), true);
    });
  }

  /* ---------- Digital Pilgrim Passport ---------- */
  const stampsEl = $('#stamps');
  const stampBtn = $('#stamp-btn');
  const passStatus = $('#passport-status');
  const TILTS = [-6, 4, -3, 7, -5];

  function renderPassport(pressed) {
    const list = D.passport || [];
    if (!stampsEl || !list.length) return;
    stampsEl.innerHTML = list.map((s, i) => {
      const done = i < state.stamps;
      const place = state.lang === 'ko' ? s.ko : s.roman;
      return `
        <li class="stamp${done ? '' : ' is-empty'}${i === pressed ? ' is-pressed' : ''}" style="--tilt:${TILTS[i % TILTS.length]}deg">
          <div class="stamp__seal" aria-hidden="true">
            <span class="stamp__day">DAY ${i + 1}</span>
            <span class="stamp__place" lang="ko">${esc(s.ko)}</span>
            <span class="stamp__roman">${esc(s.roman)}</span>
            <span class="stamp__km">${km(s.km)} km</span>
          </div>
          <p class="stamp__line"><span class="sr-only">${esc(t(UI.dayN, { n: i + 1 }))} · ${esc(place)}: </span>${esc(done ? t(s.line) : t(UI.notYet))}</p>
        </li>`;
    }).join('');

    let cert = $('#certificate');
    if (state.stamps >= list.length) {
      if (!cert) {
        cert = document.createElement('div');
        cert.id = 'certificate';
        cert.className = 'certificate';
        stampsEl.after(cert);
        if (pressed != null) restartAnimation(cert, 'is-new');
      }
      cert.innerHTML = `
        <svg class="brand__mark" aria-hidden="true"><use href="#i-mark"/></svg>
        <div>
          <p class="label">${esc(t(UI.complete))}</p>
          <p class="certificate__title">${esc(t(UI.certTitle))}</p>
          <p class="certificate__meta">${esc(t(UI.certMeta))}</p>
          <p class="stamp__line">${esc(t(UI.certLine))}</p>
        </div>`;
    } else if (cert) {
      cert.remove();
    }

    if (stampBtn) {
      stampBtn.textContent = state.stamps >= list.length ? t(UI.stampReset) : t(UI.stampNext, { n: state.stamps + 1 });
    }
  }

  if (stampBtn) {
    stampBtn.addEventListener('click', () => {
      const list = D.passport || [];
      if (state.stamps >= list.length) {
        state.stamps = 0;
        if (passStatus) passStatus.textContent = '';
        renderPassport();
        return;
      }
      const i = state.stamps;
      state.stamps += 1;
      renderPassport(i);
      if (passStatus) passStatus.textContent = t(UI.stamped, { n: i + 1, place: state.lang === 'ko' ? list[i].ko : list[i].roman });
    });
  }

  /* ---------- Comparison table: screen-reader labels for the dots ---------- */
  function labelCompare() {
    const labels = {};
    $$('.cmp-legend [data-i18n^="cmp.v"]').forEach((el) => { labels[el.dataset.i18n.slice(-1)] = el.textContent; });
    $$('.cmp td[data-v]').forEach((td) => { td.innerHTML = `<span class="sr-only">${esc(labels[td.dataset.v] || '')}</span>`; });
  }

  /* ---------- Beta form (preview: nothing is sent) ---------- */
  const betaForm = $('#beta-form');
  if (betaForm) {
    const email = $('#beta-email');
    const consent = $('#beta-consent');
    const emailErr = $('#beta-email-error');
    const consentErr = $('#beta-consent-error');
    const success = $('#beta-success');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const showError = (input, el, msg) => {
      el.textContent = msg;
      el.hidden = !msg;
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    };
    const emailMessage = () => {
      const v = email.value.trim();
      if (!v) return t(UI.errEmpty);
      return EMAIL_RE.test(v) ? '' : t(UI.errFormat);
    };

    email.addEventListener('input', () => {
      if (email.getAttribute('aria-invalid') === 'true') showError(email, emailErr, emailMessage());
    });
    consent.addEventListener('change', () => {
      if (consent.checked) showError(consent, consentErr, '');
    });

    betaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      success.hidden = true;
      const emailMsg = emailMessage();
      const consentMsg = consent.checked ? '' : t(UI.errConsent);
      showError(email, emailErr, emailMsg);
      showError(consent, consentErr, consentMsg);
      if (emailMsg) { email.focus(); return; }
      if (consentMsg) { consent.focus(); return; }
      success.hidden = false;
    });
  }

  /* ---------- Mobile sticky actions ---------- */
  const mobileCta = $('#mobile-cta');
  const heroActions = $('.hero__actions');
  const betaSection = $('#beta');
  if (mobileCta && heroActions && betaSection && 'IntersectionObserver' in window) {
    let aboveFold = true;
    let atBeta = false;
    const update = () => mobileCta.classList.toggle('is-away', aboveFold || atBeta);
    mobileCta.hidden = false;
    update();
    new IntersectionObserver(([entry]) => {
      aboveFold = entry.isIntersecting || entry.boundingClientRect.top > 0;
      update();
    }).observe(heroActions);
    new IntersectionObserver(([entry]) => {
      atBeta = entry.isIntersecting;
      update();
    }, { rootMargin: '0px 0px -20% 0px' }).observe(betaSection);
  }

  /* ---------- Glyph walker: stay still for reduced motion ---------- */
  const glyph = $('.glyph');
  if (glyph && reduceMotion && typeof glyph.pauseAnimations === 'function') {
    glyph.pauseAnimations();
    glyph.setCurrentTime(0);
  }

  /* ---------- Init ---------- */
  cacheEnglish();
  applyLang(initialLang());
})();
