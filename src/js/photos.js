/* ==========================================================================
   photos.js — CLA Global photography for the design layer (V2)

   Swaps illustrated placeholders for CLA Global's own photography, loaded
   directly from claglobal.com. Each image is applied only once it has
   loaded, so where an image can't be reached the illustrated placeholder
   from theme.css stays in place. Runs only when theme.css is present, so
   removing theme.css still returns the pack to greyscale.
   Photography © CLA Global, used to show how the proposals would look.
   ========================================================================== */

(function () {
  'use strict';

  var BASE = 'https://www.claglobal.com/media/';
  function u(path, w) { return BASE + path + '?width=' + (w || 1280) + '&quality=75'; }

  var IMG = {
    skyline: u('1qohr140/network-firms.jpg', 1920),
    network: u('y2cpxzba/network-firms.jpg'),
    alliance: u('rwwbhs3a/alliance-firms.jpg'),
    about: u('5cipdlwe/about-62.jpg'),
    whatWeDo: u('0ujhtosj/what-we-do.jpg'),
    audit: u('53pceomv/audit.jpg'),
    tax: u('puqkgugt/tax.jpg'),
    advisory: u('yj0fqwjv/advisory.jpg'),
    outsourcing: u('q5bhufu1/outsourcing.jpg'),
    insights: u('3ernzbt1/insights-website.jpg'),
    media: u('utxbkl4h/media.jpg'),
    forum: u('1otdhlwf/forum-of-firms-website_16-jan-2026.jpg', 800)
  };

  /* Country photography published with "welcomes new member" news. */
  var COUNTRY = {
    'Spain': u('2ufdls4f/spain-website.jpg'),
    'Bulgaria': u('nyzje44z/bulgaria-website.jpg'),
    'Italy': u('htnpzf4w/italy-website.jpg'),
    'Hong Kong': u('zi3ozgcv/website_hong-kong.jpg'),
    'United States': u('lfwdijlm/united-states.jpg')
  };

  /* Article images from claglobal.com, keyed by insight id in data.js. */
  var INSIGHT = {
    'malta-vida': u('ryrbopoa/e-invoicing-in-malta-update-web.jpg', 800),
    'uae-us-residency': u('mdsphmha/cla-emirates-article-clarifying-uaeus-tax-residency-laws-and-reporting-rules_3-aug-2026-website.jpg', 800),
    'brazil-cyber': u('ro4ott3y/brazils-new-financial-cybersecurity-rules-align-to-global-standards_website.jpg', 800),
    'succession': u('b5seo5gk/succession-planning-report-cla-global-ts-sw-updates_9-july-2026-web.jpg', 800),
    'cyber-resilience': u('aqcnicy2/building-cyber-resilience-website-2.jpg', 800),
    'pillar-two': u('fajbawjo/implementation-of-pillar-two-global-tax-system-accelerates-website.jpg', 800),
    'report-2026': IMG.whatWeDo
  };
  var BY_SERVICE = { 'Tax': IMG.tax, 'Audit': IMG.audit, 'Advisory': IMG.advisory, 'Outsourcing': IMG.outsourcing };

  /* Prototype thumbnails on the landing page, matched on label. */
  var LABEL = {
    'find a firm': IMG.network,
    'for clients': IMG.skyline,
    'enquiry and rfp': IMG.media,
    'join cla global': IMG.about,
    'insights': IMG.insights,
    'report cover 16:9': IMG.whatWeDo
  };

  function file() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }

  /* Apply a photo once it has loaded; leave the illustration if it fails. */
  function apply(el, src, opts) {
    if (!el || !src || el.getAttribute('data-photo') === src) return;
    el.setAttribute('data-photo', src);
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = (opts && opts.overlay ? opts.overlay + ', ' : '') + 'url("' + src + '")';
      el.classList.add(opts && opts.cls ? opts.cls : 'has-photo');
      if (!(opts && opts.decorative) && el.classList.contains('wf-placeholder') && !el.hasAttribute('role')) {
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', (el.textContent || 'Photo').trim());
      }
    };
    img.src = src;
  }
  var SHADE = 'linear-gradient(90deg, rgba(30,42,57,0.94) 0%, rgba(46,51,78,0.86) 45%, rgba(46,51,78,0.55) 100%)';

  function pageHeadPhoto() {
    var f = file();
    var src = null;
    if (f === 'find-a-firm.html') src = IMG.network;
    else if (f === 'firm.html') {
      var firm = window.CLA_FIRM_BY_ID && window.CLA_FIRM_BY_ID(param('firm') || 'cla-malta');
      src = (firm && COUNTRY[firm.country]) || (firm && firm.type === 'Alliance' ? IMG.alliance : IMG.network);
    }
    else if (f === 'service.html') src = IMG[param('service') || 'tax'] || IMG.tax;
    else if (f === 'industry.html') src = IMG.whatWeDo;
    else if (f === 'enquiry.html') src = IMG.media;
    else if (f === 'join.html' || f === 'application.html') src = IMG.about;
    else if (f === 'insights.html' || f === 'report.html') src = IMG.insights;
    else if (f === 'article.html') {
      var id = param('id') || 'malta-vida';
      src = INSIGHT[id] || IMG.insights;
    }
    var head = document.querySelector('.page-head');
    if (head && src) apply(head, src, { overlay: SHADE, cls: 'has-photo', decorative: true });
    var hero = document.querySelector('.home-hero');
    if (hero) apply(hero, IMG.skyline, { overlay: 'linear-gradient(180deg, rgba(30,42,57,0.55) 0%, rgba(46,51,78,0.88) 70%)', cls: 'has-photo', decorative: true });
    var hub = document.querySelector('.hub-hero');
    if (hub) apply(hub, IMG.skyline, { overlay: SHADE, cls: 'has-photo', decorative: true });
  }

  function applyAll(root) {
    root = root || document;
    root.querySelectorAll('.insight-row').forEach(function (row) {
      var ph = row.querySelector('.wf-placeholder');
      var id = row.getAttribute('data-insight');
      apply(ph, INSIGHT[id] || BY_SERVICE[row.getAttribute('data-service')] || IMG.insights);
    });
    root.querySelectorAll('.wf-placeholder').forEach(function (el) {
      if (el.classList.contains('avatar') || el.classList.contains('logo') || el.closest('.map-canvas') || el.closest('.insight-row') || el.closest('.proof-strip')) return;
      var l = (el.textContent || '').trim().toLowerCase();
      if (LABEL[l]) { apply(el, LABEL[l]); return; }
      var item = el.closest('.carousel-item');
      if (item) {
        var link = item.querySelector('a[href*="id="]');
        var text = (item.textContent || '').toLowerCase();
        if (link) {
          var id = link.getAttribute('href').split('id=')[1];
          var svc = /payroll/.test(text) ? 'Outsourcing' : /audit/.test(text) ? 'Audit' : 'Tax';
          apply(el, INSIGHT[id] || BY_SERVICE[svc]);
        } else {
          apply(el, IMG.about);
        }
        return;
      }
      if (el.closest('article') && file() === 'article.html') {
        apply(el, INSIGHT[param('id') || 'malta-vida'] || IMG.insights);
      }
    });
  }

  function themed() {
    return (getComputedStyle(document.documentElement).getPropertyValue('--cla-theme') || '').trim() === '1';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!themed()) return;
    document.documentElement.classList.add('cla-photos');
    pageHeadPhoto();
    applyAll();
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; applyAll(); });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
