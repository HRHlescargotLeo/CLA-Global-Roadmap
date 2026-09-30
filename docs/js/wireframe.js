/* ==========================================================================
   wireframe.js — shared interaction behaviour for lo-fi wireframes.

   Everything here is driven by data attributes and classes, so pages stay
   declarative and no page needs its own inline script. Keep it that way: a
   wireframe pack with five slightly different accordion implementations is
   how nav bugs get reported in a client review.

   All patterns are keyboard-operable and dismissible with Escape, because
   accessibility is cheaper to design in at wireframe stage than to retrofit.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation flyouts ------------------------------------------------
     Opened on hover AND focus. Hover alone would make the whole navigation
     unusable by keyboard, which is the single most common wireframe defect
     that survives into build. */
  function initNav() {
    var backdrop = document.querySelector('.flyout-backdrop');
    var items = document.querySelectorAll('.nav-item');

    function closeAll() {
      document.querySelectorAll('.nav-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (backdrop) backdrop.classList.remove('active');
    }

    items.forEach(function (item) {
      var flyout = item.querySelector('.nav-flyout');
      if (!flyout) return;

      var trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      function open() {
        closeAll();
        item.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
      }

      function close() {
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) close();
        }, 10);
      });

      if (trigger) {
        trigger.addEventListener('click', function (ev) {
          if (trigger.getAttribute('href') === '#') {
            ev.preventDefault();
            item.classList.contains('open') ? close() : open();
          }
        });
      }
    });

    if (backdrop) backdrop.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* --- Accordions --------------------------------------------------------
     Markup: <div class="accordion-item"><button class="accordion-title">…
     Multiple panels may be open at once unless the .accordion carries
     data-single. */
  function initAccordions() {
    document.querySelectorAll('.accordion-title').forEach(function (title) {
      var startOpen = title.closest('.accordion-item').classList.contains('open');
      title.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      title.addEventListener('click', function () {
        var item = title.closest('.accordion-item');
        var group = title.closest('.accordion');
        var willOpen = !item.classList.contains('open');

        if (group && group.hasAttribute('data-single')) {
          group.querySelectorAll('.accordion-item.open').forEach(function (o) {
            o.classList.remove('open');
            var t = o.querySelector('.accordion-title');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('open', willOpen);
        title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* --- Tabs --------------------------------------------------------------
     Markup: <button class="tab" data-tab="panel-id"> and
             <div class="tab-panel" id="panel-id"> */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var tabs = group.querySelectorAll('.tab');
      tabs.forEach(function (tab) {
        tab.setAttribute('role', 'tab');
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          var target = document.getElementById(tab.getAttribute('data-tab'));
          if (!target) return;
          var container = target.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });
          target.classList.add('active');
        });
      });
    });
  }

  /* --- Carousels ---------------------------------------------------------
     Markup: <div class="carousel" data-autoplay="6000"> containing
             .carousel-track > .carousel-item, .carousel-arrow[data-dir],
             and an empty .carousel-indicators which is populated here. */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var items = track.querySelectorAll('.carousel-item');
      var dotsHost = carousel.querySelector('.carousel-indicators');
      var index = 0;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        if (!dotsHost) return;
        dotsHost.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      function go(n) {
        index = (n + items.length) % items.length;
        render();
      }

      if (dotsHost) {
        items.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      carousel.querySelectorAll('.carousel-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          go(index + (arrow.getAttribute('data-dir') === 'prev' ? -1 : 1));
        });
      });

      var interval = parseInt(carousel.getAttribute('data-autoplay'), 10);
      if (interval > 0) {
        var start = function () { timer = window.setInterval(function () { go(index + 1); }, interval); };
        var stop = function () { window.clearInterval(timer); };
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('mouseleave', start);
      }

      render();
    });
  }

  /* --- Modals ------------------------------------------------------------
     Markup: any element with data-modal-open="modal-id", and
             <div class="wf-modal" id="modal-id"> */
  function initModals() {
    function close(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var panel = modal.querySelector('.wf-modal-panel');
        if (panel) {
          panel.setAttribute('tabindex', '-1');
          panel.focus();
        }
      });
    });

    document.querySelectorAll('.wf-modal').forEach(function (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal || ev.target.classList.contains('wf-modal-close')) close(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.wf-modal.open').forEach(close);
    });
  }

  /* --- Notes toggle -------------------------------------------------------
     A switch in the prototype navigator shows or hides everything marked
     as a note: the "what we're proposing and why" panel at the top of each
     prototype and the numbered annotations within it. Off by default; the
     choice is remembered for the session so it carries between prototypes. */
  function initNotes() {
    var hidden = true;
    try { hidden = window.sessionStorage.getItem('wf-notes-hidden') !== '0'; } catch (e) { /* private mode */ }
    var toggles = document.querySelectorAll('[data-notes-toggle]');
    if (!document.querySelector('.wf-note, .proposal')) {
      toggles.forEach(function (t) { t.hidden = true; });
      return;
    }

    function apply() {
      document.body.classList.toggle('wf-notes-hidden', hidden);
      toggles.forEach(function (t) {
        t.setAttribute('aria-checked', hidden ? 'false' : 'true');
        var l = t.querySelector('.notes-label');
        if (l) l.textContent = hidden ? 'Notes off' : 'Notes on';
      });
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        hidden = !hidden;
        try { window.sessionStorage.setItem('wf-notes-hidden', hidden ? '1' : '0'); } catch (e) { /* private mode */ }
        apply();
        if (!hidden) {
          var panel = document.querySelector('.proposal');
          if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
        }
      });
    });
    apply();
  }

  /* --- Prototype navigator: current page and previous / next ------------- */
  function initProtoNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    var links = Array.prototype.slice.call(document.querySelectorAll('.proto-links a[data-proto]'));
    var index = -1;
    links.forEach(function (a, i) {
      var match = a.getAttribute('data-proto').split(' ').indexOf(file) !== -1;
      if (match) { a.setAttribute('aria-current', 'page'); index = i; }
    });
    var current = document.querySelector('.proto-links a[aria-current]');
    if (current && current.scrollIntoView && window.innerWidth < 1024) {
      var list = current.closest('.proto-links');
      if (list) list.scrollLeft = current.offsetLeft - 16;
    }
    var pager = document.querySelector('[data-proto-pager]');
    if (!pager || index < 0) return;
    function label(a) { return a.textContent.replace(/\s+/g, ' ').trim(); }
    var html = '';
    if (index > 0) html += '<a class="prev" href="' + links[index - 1].getAttribute('href') + '"><span class="wf-meta">Previous</span>' + label(links[index - 1]) + '</a>';
    else html += '<span></span>';
    if (index < links.length - 1) html += '<a class="next" href="' + links[index + 1].getAttribute('href') + '"><span class="wf-meta">Next</span>' + label(links[index + 1]) + '</a>';
    pager.innerHTML = html;
  }

  /* ======================================================================
     CLA Global prototype behaviour (V1)
     Driven by ids and data attributes on the pages. Firm, insight and
     service data comes from data.js (sample data, see that file).
     ====================================================================== */

  var FIRMS = window.CLA_FIRMS || [];
  var INSIGHTS = window.CLA_INSIGHTS || [];
  var SERVICES = window.CLA_SERVICES || [];
  var INDUSTRIES = window.CLA_INDUSTRIES || [];
  var firmById = window.CLA_FIRM_BY_ID || function () { return null; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function slug(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function uniq(arr) { var o = []; arr.forEach(function (x) { if (o.indexOf(x) === -1) o.push(x); }); return o; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(iso) { var p = iso.split('-'); return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0]; }
  function serviceById(id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; }
  function serviceByName(n) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].name === n) return SERVICES[i]; return null; }
  function countries(list) { return uniq((list || FIRMS).map(function (f) { return f.country; })).sort(); }

  /* Query parameters carry context between prototype pages. Some hosts strip
     the query string, so the last clicked link's query is also kept for the
     page it points to. */
  function currentFile() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) return v;
    try {
      var saved = JSON.parse(window.sessionStorage.getItem('cla-q') || 'null');
      if (saved && saved.file === currentFile()) return new URLSearchParams(saved.q).get(name);
    } catch (e) { /* private mode */ }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    try {
      if (href.indexOf('?') !== -1) window.sessionStorage.setItem('cla-q', JSON.stringify({ file: href.split('?')[0].split('/').pop(), q: href.split('?')[1].split('#')[0] }));
      else if (href.charAt(0) !== '#') window.sessionStorage.removeItem('cla-q');
    } catch (err) { /* private mode */ }
  }, true);
  function setQuery(obj) {
    try {
      var p = new URLSearchParams();
      Object.keys(obj).forEach(function (k) { if (obj[k]) p.set(k, obj[k]); });
      var qs = p.toString();
      window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    } catch (e) { /* file:// in some browsers */ }
  }

  /* --- Toast ------------------------------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#wf-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wf-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 2600);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-toast]');
    if (!b) return;
    e.preventDefault();
    toast(b.getAttribute('data-toast'));
  });

  function initHeaderHeight() {
    var header = $('.site-header');
    if (!header) return;
    function set() { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    window.addEventListener('resize', set);
  }

  /* --- Drawers ------------------------------------------------------------ */
  var lastDrawerTrigger = null;
  function openDrawer(id, trigger) {
    var d = document.getElementById(id);
    if (!d) return;
    lastDrawerTrigger = trigger || null;
    d.classList.add('open');
    document.body.style.overflow = 'hidden';
    var panel = $('.drawer-panel', d);
    if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
  }
  function closeDrawer(d) {
    d.classList.remove('open');
    document.body.style.overflow = '';
    if (lastDrawerTrigger) lastDrawerTrigger.focus();
  }
  function initDrawers() {
    $all('[data-drawer-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); openDrawer(t.getAttribute('data-drawer-open'), t); });
    });
    $all('.drawer').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target === d || e.target.closest('.drawer-close') || e.target.closest('[data-drawer-close]')) closeDrawer(d);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $all('.drawer.open').forEach(closeDrawer);
    });
  }

  /* --- Shared form validation ------------------------------------------- */
  function validateForm(form) {
    var first = null;
    $all('[required]', form).forEach(function (input) {
      if (input.closest('[hidden]')) return;
      var field = input.closest('.field') || input.closest('fieldset');
      var ok = input.type === 'email' ? /.+@.+\..+/.test(input.value)
        : input.type === 'checkbox' ? (input.hasAttribute('data-group') ? !!$('[name="' + input.name + '"]:checked', form) : input.checked)
        : input.type === 'radio' ? !!$('[name="' + input.name + '"]:checked', form)
        : input.value.trim() !== '';
      if (field) {
        field.classList.toggle('has-error', !ok);
        var err = $('.field-error', field);
        if (err) err.hidden = ok;
      }
      if (!ok && !first) first = input;
    });
    if (first) { first.focus(); return false; }
    return true;
  }
  function fillSelect(sel, values, allLabel) {
    if (!sel) return;
    sel.innerHTML = '<option value="">' + esc(allLabel) + '</option>' + values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('');
  }

  /* --- Firm card markup (R10, R13) -------------------------------------- */
  function firmCard(f, opts) {
    opts = opts || {};
    var place = f.city === f.country ? f.country : f.city + ', ' + f.country;
    return '' +
      '<article class="firm-card" data-firm="' + f.id + '">' +
        '<div class="firm-card-top"><span class="badge' + (f.type === 'Network' ? ' solid' : '') + '">' + f.type + '</span><span class="wf-meta">' + esc(place) + '</span></div>' +
        '<h3><a href="' + (opts.base || '') + 'firm.html?firm=' + f.id + '">' + esc(f.name) + '</a></h3>' +
        '<ul class="tag-list" aria-label="Services">' + f.services.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '<div class="firm-contact"><div class="wf-placeholder avatar" aria-hidden="true">Photo</div><div><b>' + esc(f.contact.name) + '</b><span>' + esc(f.contact.role) + '</span><span class="email">' + esc(f.contact.email) + '</span></div></div>' +
        '<div class="row firm-actions"><a class="btn btn-sm" href="' + (opts.base || '') + 'enquiry.html?firm=' + f.id + '">Ask this firm</a><a class="btn btn-sm btn-secondary" href="' + (opts.base || '') + 'firm.html?firm=' + f.id + '">View profile</a></div>' +
      '</article>';
  }

  /* --- Map pin position (simple equirectangular, cropped 80N to 60S) ---- */
  function mapPos(lat, lon) {
    return { x: Math.max(1, Math.min(99, (lon + 170) / 350 * 100)), y: Math.max(2, Math.min(98, (80 - lat) / 140 * 100)) };
  }

  /* --- Prototype 1: Find a firm (R10–R17) -------------------------------- */
  function initFinder() {
    var app = $('#finder-app');
    if (!app) return;
    var q = $('#ff-q'), region = $('#ff-region'), service = $('#ff-service'), industry = $('#ff-industry');
    var list = $('#ff-results'), count = $('#ff-count'), active = $('#ff-active'), map = $('#ff-map');
    var datalist = $('#ff-countries');
    fillSelect(region, window.CLA_REGIONS || [], 'All regions');
    fillSelect(service, SERVICES.map(function (s) { return s.name; }), 'All services');
    fillSelect(industry, INDUSTRIES, 'All industries');
    if (datalist) datalist.innerHTML = countries().map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');

    var state = { q: param('q') || param('country') || '', region: param('region') || '', service: param('service') || '', industry: param('industry') || '', type: param('type') || '', view: param('view') || 'list' };
    if (state.service && serviceById(state.service)) state.service = serviceById(state.service).name;
    q.value = state.q; region.value = state.region; service.value = state.service; industry.value = state.industry;

    function matches(f) {
      var t = state.q.trim().toLowerCase();
      if (t && (f.name + ' ' + f.country + ' ' + f.city + ' ' + f.contact.name).toLowerCase().indexOf(t) === -1) return false;
      if (state.region && f.region !== state.region) return false;
      if (state.service && f.services.indexOf(state.service) === -1) return false;
      if (state.industry && f.industries.indexOf(state.industry) === -1) return false;
      if (state.type && f.type !== state.type) return false;
      return true;
    }

    function renderActive() {
      var chips = [];
      if (state.q) chips.push(['q', '"' + state.q + '"']);
      if (state.region) chips.push(['region', state.region]);
      if (state.service) chips.push(['service', state.service]);
      if (state.industry) chips.push(['industry', state.industry]);
      if (state.type) chips.push(['type', state.type + ' firms']);
      active.innerHTML = chips.map(function (c) { return '<button type="button" class="chip" data-clear="' + c[0] + '" aria-label="Remove filter ' + esc(c[1]) + '">' + esc(c[1]) + ' <span aria-hidden="true">×</span></button>'; }).join('') +
        (chips.length > 1 ? '<button type="button" class="btn-link" data-clear="all">Clear all</button>' : '');
    }

    function renderMap(res) {
      if (!map) return;
      var byCountry = {};
      res.forEach(function (f) {
        if (!byCountry[f.country]) byCountry[f.country] = { n: 0, lat: 0, lon: 0 };
        var c = byCountry[f.country]; c.n += 1; c.lat += f.lat; c.lon += f.lon;
      });
      var keys = Object.keys(byCountry);
      /* Fit the map to the results, so a region or service filter zooms in
         and crowded areas such as Europe spread out. */
      var lats = keys.map(function (k) { return byCountry[k].lat / byCountry[k].n; });
      var lons = keys.map(function (k) { return byCountry[k].lon / byCountry[k].n; });
      var b = { n: Math.max.apply(null, lats.concat([-90])), s: Math.min.apply(null, lats.concat([90])), w: Math.min.apply(null, lons.concat([180])), e: Math.max.apply(null, lons.concat([-180])) };
      var spanLon = Math.max(30, b.e - b.w), spanLat = Math.max(18, b.n - b.s);
      var cLon = (b.e + b.w) / 2, cLat = (b.n + b.s) / 2;
      b.w = cLon - spanLon * 0.58; b.e = cLon + spanLon * 0.58; b.n = cLat + spanLat * 0.62; b.s = cLat - spanLat * 0.62;
      var html = '';
      keys.forEach(function (k) {
        var c = byCountry[k];
        var x = ((c.lon / c.n) - b.w) / (b.e - b.w) * 100, y = (b.n - (c.lat / c.n)) / (b.n - b.s) * 100;
        var on = state.q.toLowerCase() === k.toLowerCase();
        html += '<button type="button" class="map-pin map-dot" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%" data-country="' + esc(k) + '" aria-pressed="' + on + '" aria-label="' + esc(k) + ', ' + c.n + ' firm' + (c.n === 1 ? '' : 's') + '" title="' + esc(k) + '">' + c.n + '<span class="dot-label" aria-hidden="true">' + esc(k) + '</span></button>';
      });
      $('.map-pins', map).innerHTML = html;
      var legend = $('#ff-map-countries');
      if (legend) legend.innerHTML = keys.sort().map(function (k) { return '<button type="button" class="chip map-pin-alt" data-country="' + esc(k) + '" aria-pressed="' + (state.q.toLowerCase() === k.toLowerCase()) + '">' + esc(k) + ' (' + byCountry[k].n + ')</button>'; }).join('');
    }

    function render() {
      var res = FIRMS.filter(matches);
      res.sort(function (a, b) { return a.country === b.country ? (a.type === b.type ? a.name.localeCompare(b.name) : (a.type === 'Network' ? -1 : 1)) : a.country.localeCompare(b.country); });
      var nC = countries(res).length;
      count.textContent = 'Showing ' + res.length + ' of ' + FIRMS.length + ' firms in ' + nC + ' ' + (nC === 1 ? 'country' : 'countries');
      $all('[data-type]', app).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-type') === state.type ? 'true' : 'false'); });
      $all('[data-view]', app).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === state.view ? 'true' : 'false'); });
      app.classList.toggle('show-map', state.view === 'map');
      $all('[data-zoom]', app).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-zoom') === state.region ? 'true' : 'false'); });
      if (!res.length) {
        list.innerHTML = '<div class="empty-state"><h3>No member firm matches those filters</h3><p>CLA Global is still growing. Tell us where you need help and the global office will find the right firm, inside or outside the network.</p><a class="btn" href="enquiry.html">Tell us where you need help</a></div>';
      } else {
        var html = '', last = '';
        res.forEach(function (f) {
          if (f.country !== last) { html += '<h2 class="country-head">' + esc(f.country) + '</h2>'; last = f.country; }
          html += firmCard(f);
        });
        list.innerHTML = html;
      }
      renderMap(res);
      renderActive();
      var nf = [state.region, state.service, state.industry, state.type].filter(Boolean).length;
      if (ft) ft.textContent = nf ? 'Filters (' + nf + ')' : 'Filters';
      setQuery({ q: state.q, region: state.region, service: state.service, industry: state.industry, type: state.type, view: state.view === 'map' ? 'map' : '' });
    }

    var ft = $('#ff-filter-toggle');
    if (ft) ft.addEventListener('click', function () {
      var open = ft.getAttribute('aria-expanded') !== 'true';
      ft.setAttribute('aria-expanded', open ? 'true' : 'false');
      $('#ff-filters').classList.toggle('open', open);
    });
    var timer = null;
    q.addEventListener('input', function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.q = q.value; render(); }, 150); });
    $('#ff-form').addEventListener('submit', function (e) { e.preventDefault(); state.q = q.value; render(); list.setAttribute('tabindex', '-1'); count.focus && count.focus(); });
    region.addEventListener('change', function () { state.region = region.value; render(); });
    service.addEventListener('change', function () { state.service = service.value; render(); });
    industry.addEventListener('change', function () { state.industry = industry.value; render(); });
    app.addEventListener('click', function (e) {
      var t = e.target.closest('[data-type]');
      if (t) { state.type = t.getAttribute('data-type'); render(); return; }
      var v = e.target.closest('[data-view]');
      if (v) { state.view = v.getAttribute('data-view'); render(); return; }
      var z = e.target.closest('[data-zoom]');
      if (z) { state.region = z.getAttribute('data-zoom'); region.value = state.region; render(); return; }
      var c = e.target.closest('[data-clear]');
      if (c) {
        var k = c.getAttribute('data-clear');
        if (k === 'all') { state.q = state.region = state.service = state.industry = state.type = ''; }
        else state[k] = '';
        q.value = state.q; region.value = state.region; service.value = state.service; industry.value = state.industry;
        render(); return;
      }
      var pin = e.target.closest('.map-pin, .map-pin-alt');
      if (pin) {
        var country = pin.getAttribute('data-country');
        state.q = state.q.toLowerCase() === country.toLowerCase() ? '' : country;
        q.value = state.q; render();
      }
    });
    render();
  }

  /* --- Prototype 1b: Firm profile (R14–R17) ----------------------------- */
  function initFirm() {
    var app = $('#firm-app');
    if (!app) return;
    var f = firmById(param('firm') || '') || firmById('cla-malta');
    document.title = f.name + ' (' + f.country + ') — CLA Global prototype';
    $all('[data-f]', app).forEach(function (el) {
      var k = el.getAttribute('data-f');
      if (k === 'place') el.textContent = f.city === f.country ? f.country : f.city + ', ' + f.country;
      else if (k === 'type') el.textContent = f.type + ' member';
      else if (k === 'guide-title') el.textContent = 'Doing business in ' + f.country;
      else if (k === 'guide-country') el.textContent = f.country;
      else if (f[k] != null) el.textContent = f[k];
    });
    $all('[data-f-href]', app).forEach(function (el) { el.setAttribute('href', el.getAttribute('data-f-href') + f.id); });
    $('#firm-contacts').innerHTML = [f.contact, { name: '[Second contact]', role: '[Role, e.g. Audit Partner]', email: '[email]' }].map(function (c) {
      return '<div class="person"><div class="wf-placeholder avatar" aria-hidden="true">Photo</div><div><b>' + esc(c.name) + '</b><span>' + esc(c.role) + '</span><span class="email">' + esc(c.email) + '</span><a href="#" class="wf-meta">LinkedIn</a></div></div>';
    }).join('');
    $('#firm-services').innerHTML = f.services.map(function (s) { var sv = serviceByName(s); return '<li><a class="tag-link" href="service.html?service=' + (sv ? sv.id : '') + '">' + esc(s) + '</a></li>'; }).join('');
    $('#firm-industries').innerHTML = f.industries.map(function (s) { return '<li><a class="tag-link" href="find-a-firm.html?industry=' + encodeURIComponent(s) + '">' + esc(s) + '</a></li>'; }).join('');
    var ins = INSIGHTS.filter(function (i) { return i.firm === f.id; });
    $('#firm-insights').innerHTML = ins.length ? ins.map(insightRow).join('') : '<p class="muted">No insights from ' + esc(f.name) + ' yet. The page shows the latest three automatically when they publish.</p>';
    var others = FIRMS.filter(function (o) { return o.country === f.country && o.id !== f.id; });
    var near = $('#firm-others');
    if (near) {
      near.innerHTML = others.length ? '<h3>Other CLA Global firms in ' + esc(f.country) + '</h3><ul class="plain-list">' + others.map(function (o) { return '<li><a href="firm.html?firm=' + o.id + '">' + esc(o.name) + '</a> <span class="wf-meta">' + esc(o.city) + ' · ' + o.type + '</span></li>'; }).join('') + '</ul>' : '';
      near.hidden = !others.length;
    }
  }

  /* --- Insight row markup (R50) ----------------------------------------- */
  function insightRow(i) {
    var f = firmById(i.firm);
    var href = i.href || ('article.html?id=' + i.id);
    return '<article class="insight-row">' +
      '<div class="wf-placeholder ratio-16-9" aria-hidden="true">Image</div>' +
      '<div class="insight-body"><div class="insight-meta"><span class="badge">' + esc(i.type) + '</span><span>' + fmtDate(i.date) + '</span>' + (i.sample ? '<span class="badge sample">Sample</span>' : '') + '</div>' +
      '<h3><a href="' + href + '">' + esc(i.title) + '</a></h3>' +
      '<p class="wf-meta">' + (f ? esc(f.name) + ' · ' + esc(i.country) : esc(i.author)) + (i.service ? ' · ' + esc(i.service) : '') + '</p></div>' +
    '</article>';
  }

  /* --- Prototype 2: Homepage, service and industry (R20–R29) ------------- */
  function initHome() {
    var el = $('#home-latest');
    if (el) el.innerHTML = INSIGHTS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).filter(function (i) { return i.type !== 'Report'; }).slice(0, 3).map(insightRow).join('');
    var dl = $('#home-countries');
    if (dl) dl.innerHTML = countries().map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    $all('[data-country-count]').forEach(function (nc) { nc.textContent = countries().length; });
    var form = $('#home-find');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#home-q').value.trim();
      var s = $('#home-service').value;
      window.location.href = 'find-a-firm.html' + (v || s ? '?' + (v ? 'q=' + encodeURIComponent(v) : '') + (v && s ? '&' : '') + (s ? 'service=' + s : '') : '');
    });
  }

  var SERVICE_COPY = {
    tax: {
      intro: 'Tax advice for businesses and owners with interests in more than one country, from member firms in each jurisdiction working to one plan.',
      subs: {
        'Corporate tax': 'Structuring, tax exposure, reliefs and incentives, restructuring and transactions. One lead adviser coordinates the local firms.',
        'Cross-border tax': 'Advice when profits, people or assets move between countries, including permanent establishment and withholding tax questions.',
        'Transfer pricing': 'Policies, benchmarking and documentation for intra-group transactions, and support when a tax authority opens a review.',
        'Indirect tax': 'VAT, GST and sales tax registration and compliance when selling into new markets, including e-invoicing changes such as ViDA.',
        'Global mobility': 'Tax, payroll and immigration support when people are seconded, relocated or working remotely across borders.'
      }
    }
  };
  function initService() {
    var app = $('#service-app');
    if (!app) return;
    var s = serviceById(param('service') || '') || serviceById('tax');
    var copy = SERVICE_COPY[s.id] || { intro: '[Short introduction to ' + s.name + ' across the network, written with the service line lead.]', subs: {} };
    document.title = s.name + ' — CLA Global prototype';
    $all('[data-s="name"]', app).forEach(function (e) { e.textContent = s.name; });
    $('#service-intro').textContent = copy.intro;
    $('#service-nav').innerHTML = s.subs.map(function (x) { return '<li><a href="#sub-' + slug(x) + '">' + esc(x) + '</a></li>'; }).join('');
    $('#service-subs').innerHTML = s.subs.map(function (x) {
      return '<section class="sub-service" id="sub-' + slug(x) + '"><h2>' + esc(x) + '</h2><p>' + esc(copy.subs[x] || '[Two or three sentences on what member firms do, and the problem it solves for a mid-market business.]') + '</p><p class="wf-meta"><a href="find-a-firm.html?service=' + s.id + '">Firms offering ' + esc(x.toLowerCase()) + '</a> · <a href="insights.html?service=' + encodeURIComponent(s.name) + '">Insights</a></p></section>';
    }).join('');
    var ex = (window.CLA_EXPERTS || {})[s.id] || [];
    $('#service-experts').innerHTML = (ex.length ? ex : [{ name: '[Service lead]', role: '[Role]', firm: '[Member firm]', country: '[Country]', id: '' }, { name: '[Service lead]', role: '[Role]', firm: '[Member firm]', country: '[Country]', id: '' }, { name: '[Service lead]', role: '[Role]', firm: '[Member firm]', country: '[Country]', id: '' }]).map(function (p) {
      return '<div class="person card"><div class="wf-placeholder avatar" aria-hidden="true">Photo</div><div><b>' + esc(p.name) + '</b><span>' + esc(p.role) + '</span><span class="wf-meta">' + esc(p.firm) + ', ' + esc(p.country) + '</span>' + (p.id ? '<a class="btn btn-sm" href="enquiry.html?firm=' + p.id + '&amp;service=' + s.id + '">Contact</a>' : '') + '</div></div>';
    }).join('');
    var offering = FIRMS.filter(function (f) { return f.services.indexOf(s.name) !== -1; });
    $('#service-firms').innerHTML = '<b>' + offering.length + '</b> firms in <b>' + countries(offering).length + '</b> countries offer ' + esc(s.name.toLowerCase()) + '. <a href="find-a-firm.html?service=' + s.id + '">See them in the firm finder</a>';
    var ins = INSIGHTS.filter(function (i) { return i.service === s.name; }).sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 3);
    $('#service-insights').innerHTML = ins.map(insightRow).join('');
    $all('[data-s-href]', app).forEach(function (e) { e.setAttribute('href', e.getAttribute('data-s-href') + s.id); });
    $all('.service-switch a', app).forEach(function (a) { if (a.getAttribute('href').indexOf('service=' + s.id) !== -1) a.setAttribute('aria-current', 'page'); });
  }

  var INDUSTRY_ISSUES = {
    'Manufacturing and distribution': [
      ['Tariffs and supply chains', 'Tariff changes and new sourcing routes push transfer pricing, customs and indirect tax up the agenda.'],
      ['Setting up abroad', 'Opening a plant, warehouse or sales entity in a new country: entity choice, payroll, VAT registration and local audit.'],
      ['Succession and sale', 'Family-owned manufacturers planning a handover or a sale, often with shareholders in more than one country.']
    ]
  };
  function initIndustry() {
    var app = $('#industry-app');
    if (!app) return;
    var name = param('industry') || 'Manufacturing and distribution';
    if (INDUSTRIES.indexOf(name) === -1) name = 'Manufacturing and distribution';
    document.title = name + ' — CLA Global prototype';
    $all('[data-i="name"]', app).forEach(function (e) { e.textContent = name; });
    var issues = INDUSTRY_ISSUES[name] || [['[Issue one]', '[What mid-market businesses in this sector face across borders.]'], ['[Issue two]', '[Short description.]'], ['[Issue three]', '[Short description.]']];
    $('#industry-issues').innerHTML = issues.map(function (x) { return '<div class="card"><h3 class="card-title">' + esc(x[0]) + '</h3><p class="card-text">' + esc(x[1]) + '</p></div>'; }).join('');
    var firms = FIRMS.filter(function (f) { return f.industries.indexOf(name) !== -1; });
    $('#industry-count').innerHTML = '<b>' + firms.length + '</b> firms in <b>' + countries(firms).length + '</b> countries list ' + esc(name.toLowerCase()) + ' as a specialism.';
    $('#industry-firms').innerHTML = firms.filter(function (f) { return f.type === 'Network'; }).slice(0, 6).map(function (f) { return firmCard(f); }).join('');
    $('#industry-all').setAttribute('href', 'find-a-firm.html?industry=' + encodeURIComponent(name));
    var ins = INSIGHTS.filter(function (i) { return i.industry === name; });
    $('#industry-insights').innerHTML = ins.length ? ins.map(insightRow).join('') : '<p class="muted">[Insights and case studies tagged with this industry appear here.]</p>';
    var sel = $('#industry-switch');
    if (sel) {
      fillSelect(sel, INDUSTRIES, 'Choose an industry');
      sel.value = name;
      sel.addEventListener('change', function () { if (sel.value) window.location.href = 'industry.html?industry=' + encodeURIComponent(sel.value); });
    }
  }

  /* --- Prototype 3: Enquiry and RFP (R30–R36) ---------------------------- */
  function initEnquiry() {
    var app = $('#enq-app');
    if (!app) return;
    var step = 1, started = false;
    var chosen = [];
    var target = null;
    var pre = firmById(param('firm') || '');
    var preService = serviceById(param('service') || '');
    var chipsHost = $('#enq-country-chips');
    var all = countries();

    function renderChips() {
      chipsHost.innerHTML = chosen.map(function (c) { return '<button type="button" class="chip" aria-pressed="true" data-remove="' + esc(c) + '">' + esc(c) + ' <span aria-hidden="true">×</span></button>'; }).join('') ||
        '<span class="wf-meta">No countries chosen yet</span>';
    }
    function addCountry(c) {
      c = c.trim(); if (!c) return;
      var match = all.filter(function (x) { return x.toLowerCase() === c.toLowerCase(); })[0] || c;
      if (chosen.indexOf(match) === -1) chosen.push(match);
      renderChips();
      $('#enq-country').value = '';
      var f = $('#enq-country').closest('.field'); f.classList.remove('has-error'); $('.field-error', f).hidden = true;
    }
    $('#enq-countries').innerHTML = all.map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    $('#enq-add').addEventListener('click', function () { addCountry($('#enq-country').value); });
    $('#enq-country').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCountry($('#enq-country').value); } });
    $('#enq-country').addEventListener('change', function () { if (all.indexOf($('#enq-country').value) !== -1) addCountry($('#enq-country').value); });
    chipsHost.addEventListener('click', function (e) { var b = e.target.closest('[data-remove]'); if (!b) return; chosen.splice(chosen.indexOf(b.getAttribute('data-remove')), 1); renderChips(); });
    $all('[data-quick]', app).forEach(function (b) { b.addEventListener('click', function () { addCountry(b.getAttribute('data-quick')); }); });

    if (pre) { chosen.push(pre.country); target = pre.id; var ctx = $('#enq-context'); ctx.hidden = false; $('span', ctx).textContent = pre.name + ', ' + pre.country; }
    if (preService) { var cb = $('input[name="enq-service"][value="' + preService.name + '"]'); if (cb) cb.checked = true; }
    renderChips();

    function kind() { var r = $('input[name="enq-kind"]:checked'); return r ? r.value : 'question'; }
    function services() { return $all('input[name="enq-service"]:checked').map(function (i) { return i.value; }); }

    function renderMatches() {
      var sv = services();
      var html = '';
      chosen.forEach(function (c) {
        var inC = FIRMS.filter(function (f) { return f.country === c; });
        var fit = inC.filter(function (f) { return !sv.length || sv.every(function (s) { return f.services.indexOf(s) !== -1; }); });
        var pick = (fit.length ? fit : inC).slice().sort(function (a, b) { return a.type === b.type ? 0 : (a.type === 'Network' ? -1 : 1); });
        html += '<div class="match-country"><h3>' + esc(c) + '</h3>';
        if (!inC.length) {
          html += '<p class="muted">No member firm is listed in ' + esc(c) + ' yet. The global office will find you a trusted adviser there.</p>';
        } else {
          pick.slice(0, 2).forEach(function (f) {
            html += '<label class="option-card"><input type="radio" name="enq-target" value="' + f.id + '"' + (target === f.id ? ' checked' : '') + '><strong>' + esc(f.name) + ' <span class="badge' + (f.type === 'Network' ? ' solid' : '') + '">' + f.type + '</span></strong><span>' + esc(f.contact.name) + ', ' + esc(f.contact.role) + ' · ' + esc(f.city) + '</span><span>' + esc(f.contact.email) + '</span>' + (fit.length ? '' : '<span class="warn-line">Does not list every service you picked</span>') + '</label>';
          });
          if (inC.length > 2) html += '<p class="wf-meta"><a href="find-a-firm.html?q=' + encodeURIComponent(c) + '">See all ' + inC.length + ' firms in ' + esc(c) + '</a></p>';
        }
        html += '</div>';
      });
      html += '<label class="option-card"><input type="radio" name="enq-target" value="global"' + (!target || chosen.length > 1 && target === 'global' ? ' checked' : '') + '><strong>Coordinate it through CLA Global</strong><span>The global office passes your enquiry to the right firms and names one lead contact for you.' + (chosen.length > 1 ? ' Suggested for enquiries covering more than one country.' : '') + '</span></label>';
      $('#enq-matches').innerHTML = html;
      $('#enq-match-lead').textContent = chosen.length > 1 ? 'These firms cover the ' + chosen.length + ' countries you chose. Contact one directly, or let CLA Global coordinate.' : 'This firm covers the country you chose. Contact them directly, or let CLA Global coordinate.';
    }

    function show(n) {
      step = n;
      $all('.step-panel', app).forEach(function (p) { p.hidden = parseInt(p.getAttribute('data-step'), 10) !== n; });
      $all('.stepper li', app).forEach(function (li, i) { li.className = i + 1 < n ? 'done' : (i + 1 === n ? 'current' : ''); if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      var rfp = kind() === 'proposal';
      $all('[data-rfp]', app).forEach(function (el) { el.hidden = !rfp; });
      $all('[data-question]', app).forEach(function (el) { el.hidden = rfp; });
      var h = $('.step-panel[data-step="' + n + '"] h2', app);
      if (h && started) { h.setAttribute('tabindex', '-1'); h.focus(); }
      started = true;
    }

    $('#enq-next-1').addEventListener('click', function () {
      var ok = true;
      var cf = $('#enq-country').closest('.field');
      if (!chosen.length) { cf.classList.add('has-error'); $('.field-error', cf).hidden = false; ok = false; $('#enq-country').focus(); }
      var sf = $('#enq-service-set');
      if (!services().length) { sf.classList.add('has-error'); $('.field-error', sf).hidden = false; if (ok) $('input', sf).focus(); ok = false; } else { sf.classList.remove('has-error'); $('.field-error', sf).hidden = true; }
      if (!ok) return;
      renderMatches();
      show(2);
    });
    $('#enq-next-2').addEventListener('click', function () {
      var r = $('input[name="enq-target"]:checked');
      target = r ? r.value : 'global';
      var f = firmById(target);
      $('#enq-to').textContent = f ? f.contact.name + ' at ' + f.name : 'the CLA Global office in London';
      show(3);
    });
    $all('[data-back]', app).forEach(function (b) { b.addEventListener('click', function () { show(step - 1); }); });
    var file = $('#enq-file');
    if (file) file.addEventListener('change', function () { $('#enq-file-name').textContent = file.files.length ? file.files[0].name : 'No file chosen'; });

    $('#enq-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm($('#enq-form'))) return;
      var f = firmById(target);
      $('#enq-done-name').textContent = $('#enq-first').value;
      $('#enq-done-kind').textContent = kind() === 'proposal' ? 'proposal request' : 'enquiry';
      $('#enq-done-who').textContent = f ? f.contact.name + ', ' + f.contact.role + ' at ' + f.name : 'a coordinator in the CLA Global office';
      $('#enq-done-where').textContent = chosen.join(', ');
      $('#enq-done-services').textContent = services().join(', ');
      show(4);
    });
    show(1);
  }

  /* --- Prototype 4: Join (R40–R49) --------------------------------------- */
  function initJoin() {
    var f = $('#eoi-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(f)) return;
      f.hidden = true;
      var done = $('#eoi-done'); done.hidden = false;
      $('#eoi-done-firm').textContent = $('#eoi-firm').value;
      var route = $('input[name="eoi-route"]:checked');
      $('#eoi-done-route').textContent = route && route.value !== 'Not sure yet' ? route.value.toLowerCase() + ' membership' : 'the right route for your firm';
      var h = $('h3', done); h.setAttribute('tabindex', '-1'); h.focus();
    });
  }

  function initApplication() {
    var app = $('#app-app');
    if (!app) return;
    var step = 1, started = false, total = $all('.step-panel', app).length - 1;
    var firm = param('firm');
    if (firm) { var n = $('#app-firmname'); if (n) n.value = firm; }
    function show(n) {
      step = n;
      $all('.step-panel', app).forEach(function (p) { p.hidden = parseInt(p.getAttribute('data-step'), 10) !== n; });
      $all('.stepper li', app).forEach(function (li, i) { li.className = i + 1 < n ? 'done' : (i + 1 === n ? 'current' : ''); });
      var prog = $('#app-progress'); if (prog) prog.textContent = n > total ? 'Submitted' : 'Section ' + n + ' of ' + total;
      var h = $('.step-panel[data-step="' + n + '"] h2', app); if (h && started) { h.setAttribute('tabindex', '-1'); h.focus(); }
      started = true;
      if (n === total) renderReview();
    }
    function sumSplit() {
      var t = 0;
      $all('[data-split]', app).forEach(function (r) { var v = parseInt(r.value, 10) || 0; t += v; var o = $('#' + r.id + '-v'); if (o) o.textContent = v + '%'; });
      var out = $('#split-total');
      out.textContent = t + '%';
      out.parentElement.classList.toggle('bad', t !== 100);
      return t;
    }
    $all('[data-split]', app).forEach(function (r) { r.addEventListener('input', sumSplit); });
    sumSplit();
    function renderReview() {
      var rows = [];
      $all('[data-review]', app).forEach(function (el) {
        var v = el.type === 'radio' || el.type === 'checkbox' ? null : el.value;
        if (el.tagName === 'SELECT') v = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
        if (v !== null) rows.push('<dt>' + esc(el.getAttribute('data-review')) + '</dt><dd>' + esc(v || '—') + '</dd>');
      });
      var svc = $all('input[name="app-services"]:checked').map(function (i) { return i.value; }).join(', ');
      rows.push('<dt>Services</dt><dd>' + esc(svc || '—') + '</dd>');
      rows.push('<dt>Revenue split</dt><dd>' + $all('[data-split]', app).map(function (r) { return r.getAttribute('data-split') + ' ' + r.value + '%'; }).join(', ') + '</dd>');
      $('#app-review').innerHTML = rows.join('');
    }
    $all('[data-next]', app).forEach(function (b) {
      b.addEventListener('click', function () {
        var panel = b.closest('.step-panel');
        if (!validateForm(panel)) return;
        if (panel.querySelector('[data-split]') && sumSplit() !== 100) { toast('The revenue split needs to add up to 100%'); $('[data-split]', panel).focus(); return; }
        show(step + 1);
      });
    });
    $all('[data-back]', app).forEach(function (b) { b.addEventListener('click', function () { show(step - 1); }); });
    $('#app-save').addEventListener('click', function () { toast('Progress saved. We have emailed you a link to come back to it.'); });
    $('#app-submit').addEventListener('click', function () { show(total + 1); });
    show(1);
  }

  /* --- Prototype 5: Insights, article and report (R50–R59) --------------- */
  function initInsights() {
    var app = $('#ins-app');
    if (!app) return;
    var q = $('#ins-q'), service = $('#ins-service'), industry = $('#ins-industry'), country = $('#ins-country');
    fillSelect(service, SERVICES.map(function (s) { return s.name; }), 'All services');
    fillSelect(industry, INDUSTRIES, 'All industries');
    fillSelect(country, uniq(INSIGHTS.map(function (i) { return i.country; }).filter(Boolean)).sort(), 'All countries');
    var PAGE = 6;
    var state = { q: param('q') || '', type: param('type') || '', service: param('service') || '', industry: param('industry') || '', country: param('country') || '', shown: PAGE };
    q.value = state.q; service.value = state.service; industry.value = state.industry; country.value = state.country;
    function matches(i) {
      var t = state.q.trim().toLowerCase();
      var f = firmById(i.firm);
      if (t && (i.title + ' ' + i.country + ' ' + (f ? f.name : '') + ' ' + i.author).toLowerCase().indexOf(t) === -1) return false;
      if (state.type && i.type !== state.type) return false;
      if (state.service && i.service !== state.service) return false;
      if (state.industry && i.industry !== state.industry) return false;
      if (state.country && i.country !== state.country) return false;
      return true;
    }
    function render() {
      var res = INSIGHTS.filter(matches).sort(function (a, b) { return b.date.localeCompare(a.date); });
      $('#ins-count').textContent = res.length + ' result' + (res.length === 1 ? '' : 's');
      $('#ins-results').innerHTML = res.length ? res.slice(0, state.shown).map(insightRow).join('') : '<div class="empty-state"><h3>Nothing matches yet</h3><p>Try fewer filters, or get new insights on this topic by email.</p><button type="button" class="btn" data-modal-open-js="signup">Get email updates</button></div>';
      var more = $('#ins-more');
      more.hidden = res.length <= state.shown;
      more.textContent = 'Show more (' + Math.max(0, res.length - state.shown) + ' left)';
      $all('[data-itype]', app).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-itype') === state.type ? 'true' : 'false'); });
      setQuery({ q: state.q, type: state.type, service: state.service, industry: state.industry, country: state.country });
    }
    var timer = null;
    q.addEventListener('input', function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.q = q.value; state.shown = PAGE; render(); }, 150); });
    $('#ins-form').addEventListener('submit', function (e) { e.preventDefault(); state.q = q.value; render(); });
    [['service', service], ['industry', industry], ['country', country]].forEach(function (p) { p[1].addEventListener('change', function () { state[p[0]] = p[1].value; state.shown = PAGE; render(); }); });
    app.addEventListener('click', function (e) {
      var t = e.target.closest('[data-itype]');
      if (t) { state.type = t.getAttribute('data-itype'); state.shown = PAGE; render(); }
    });
    $('#ins-more').addEventListener('click', function () { state.shown += PAGE; render(); });
    $('#ins-clear').addEventListener('click', function () { state.q = state.type = state.service = state.industry = state.country = ''; q.value = ''; service.value = ''; industry.value = ''; country.value = ''; state.shown = PAGE; render(); });
    render();
  }

  function initSignup() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-modal-open-js]');
      if (!t) return;
      e.preventDefault();
      var m = document.getElementById(t.getAttribute('data-modal-open-js'));
      if (!m) return;
      m.classList.add('open');
      var p = $('.wf-modal-panel', m); if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
    });
    $all('.signup-form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(f)) return;
        var topics = $all('input[name="topic"]:checked', f).map(function (i) { return i.value; });
        f.hidden = true;
        var done = f.parentElement.querySelector('.signup-done');
        if (done) {
          done.hidden = false;
          var t = $('[data-topics]', done); if (t) t.textContent = topics.length ? topics.join(', ') : 'all topics';
        }
      });
    });
  }

  var ARTICLE_BODY = {
    'malta-vida': ["Closing Malta's 24.2% VAT gap", 'Practical steps to prepare for operational readiness', 'Defining the electronic invoice', 'Avoid the compliance bottleneck', 'The definitive ViDA timescales']
  };
  function initArticle() {
    var app = $('#article-app');
    if (!app) return;
    var a = null;
    var id = param('id') || 'malta-vida';
    INSIGHTS.forEach(function (i) { if (i.id === id) a = i; });
    if (!a || a.type === 'Report') INSIGHTS.forEach(function (i) { if (i.id === 'malta-vida') a = i; });
    var f = firmById(a.firm);
    document.title = a.title + ' — CLA Global prototype';
    $('#art-title').textContent = a.title;
    $('#art-type').textContent = a.type;
    $('#art-date').textContent = fmtDate(a.date);
    $('#art-tags').innerHTML = [a.service, a.industry, a.country].filter(Boolean).map(function (t) { return '<li><a class="tag-link" href="insights.html?' + (t === a.service ? 'service' : t === a.industry ? 'industry' : 'country') + '=' + encodeURIComponent(t) + '">' + esc(t) + '</a></li>'; }).join('');
    var heads = ARTICLE_BODY[a.id] || ['[Section heading]', '[Section heading]', '[Section heading]'];
    $('#art-body').innerHTML = '<p class="lead">[Standfirst: one or two sentences on what changed and who it affects.]</p>' + heads.map(function (h) { return '<h2>' + esc(h) + '</h2><p>[Article body copy as published on claglobal.com. Not reproduced in the prototype.]</p>'; }).join('');
    if (f) {
      $('#art-author').innerHTML = '<div class="wf-placeholder avatar" aria-hidden="true">Photo</div><div><b>' + esc(a.author) + '</b><span>' + esc(f.contact.name === a.author ? f.contact.role : 'Partner') + ', ' + esc(f.name) + '</span><span class="wf-meta">' + esc(f.city) + ', ' + esc(f.country) + '</span><div class="row"><a class="btn btn-sm" href="enquiry.html?firm=' + f.id + '">Talk to ' + esc(f.name) + '</a><a class="btn btn-sm btn-secondary" href="firm.html?firm=' + f.id + '">Firm profile</a></div></div>';
    } else {
      $('#art-author').innerHTML = '<div><b>' + esc(a.author) + '</b></div>';
    }
    var rel = INSIGHTS.filter(function (i) { return i.id !== a.id && i.service && i.service === a.service; }).sort(function (x, y) { return y.date.localeCompare(x.date); }).slice(0, 3);
    $('#art-related').innerHTML = rel.map(insightRow).join('');
  }

  var REPORT_DATA = {
    'All respondents': [62, 48, 41, 37, 29],
    'Europe': [58, 52, 44, 35, 31],
    'Americas': [66, 41, 38, 40, 27],
    'Middle East and Africa': [71, 45, 36, 33, 25],
    'Asia Pacific': [64, 50, 43, 39, 30]
  };
  var REPORT_LABELS = ['Plan to enter a new country in the next two years', 'Say tax and regulation is the biggest barrier', 'Want one adviser across all their markets', 'Have delayed expansion because of tariffs', 'Are planning a change of ownership'];
  function initReport() {
    var sel = $('#rep-cut');
    if (!sel) return;
    fillSelect(sel, Object.keys(REPORT_DATA).slice(1), 'All respondents');
    function render() {
      var d = REPORT_DATA[sel.value || 'All respondents'];
      $('#rep-bars').innerHTML = d.map(function (v, i) { return '<div class="rbar"><span class="rbar-label">' + esc(REPORT_LABELS[i]) + '</span><span class="rbar-track"><span class="rbar-fill" style="width:' + v + '%"></span></span><b>' + v + '%</b></div>'; }).join('');
      $('#rep-cut-label').textContent = sel.value || 'All respondents';
    }
    sel.addEventListener('change', render);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAccordions();
    initTabs();
    initCarousels();
    initModals();
    initNotes();
    initProtoNav();
    initHeaderHeight();
    initDrawers();
    initFinder();
    initFirm();
    initHome();
    initService();
    initIndustry();
    initEnquiry();
    initJoin();
    initApplication();
    initInsights();
    initSignup();
    initArticle();
    initReport();
  });
})();
