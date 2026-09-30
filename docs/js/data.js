/* ==========================================================================
   data.js — sample data for the CLA Global prototypes

   Firm names, countries and cities come from the network and alliance lists
   on claglobal.com (30 September 2026). Everything else here is SAMPLE data
   for the prototypes: contact names and emails (all @example.com), the
   services and industries each firm offers, office and people figures,
   insight metadata and case studies. None of it should be read as fact.
   ========================================================================== */

(function () {
  'use strict';

  var ALL = ['Audit', 'Tax', 'Advisory', 'Outsourcing'];

  window.CLA_SERVICES = [
    { id: 'audit', name: 'Audit', subs: ['Statutory audit', 'Assurance', 'IFRS reporting', 'ESG assurance'] },
    { id: 'tax', name: 'Tax', subs: ['Corporate tax', 'Cross-border tax', 'Transfer pricing', 'Indirect tax', 'Global mobility'] },
    { id: 'advisory', name: 'Advisory', subs: ['Digital and cyber', 'ESG', 'Transactions and valuation', 'Restructuring', 'Forensics'] },
    { id: 'outsourcing', name: 'Outsourcing', subs: ['Accounting services', 'Payroll', 'HR services', 'IT services'] }
  ];

  window.CLA_INDUSTRIES = [
    'Consumer products', 'Education', 'Energy and natural resources', 'Financial services',
    'Fintech', 'Government and public sector', 'Hospitality and leisure',
    'Life sciences and healthcare', 'Manufacturing and distribution',
    'Professional services', 'Technology', 'Telecommunications'
  ];

  window.CLA_REGIONS = ['Americas', 'Europe', 'Middle East and Africa', 'Asia Pacific'];

  /* type: n = network member, a = alliance member
     Figures (offices / partners / people) are sample values except where noted. */
  function F(id, name, country, city, region, type, lat, lon, services, industries, contact, role, figs) {
    return {
      id: id, name: name, country: country, city: city, region: region,
      type: type === 'n' ? 'Network' : 'Alliance',
      lat: lat, lon: lon, services: services, industries: industries,
      contact: { name: contact, role: role, email: contact.toLowerCase().replace(/[^a-z ]/g, '').replace(/ +/g, '.') + '@example.com' },
      offices: figs[0], partners: figs[1], people: figs[2]
    };
  }

  window.CLA_FIRMS = [
    /* Network member firms (23) */
    F('cla-brazil', 'CLA Brazil', 'Brazil', 'São Paulo', 'Americas', 'n', -23.5, -46.6, ALL, ['Manufacturing and distribution', 'Consumer products', 'Fintech'], 'Rafael Monteiro', 'Managing Partner', [3, 18, 240]),
    F('cla-bulgaria', 'CLA Bulgaria', 'Bulgaria', 'Sofia', 'Europe', 'n', 42.7, 23.3, ['Audit', 'Tax', 'Outsourcing'], ['Technology', 'Manufacturing and distribution'], 'Elena Petrova', 'Managing Partner', [1, 5, 60]),
    F('cla-global-ts-cn', 'CLA Global TS', 'China', 'Shanghai', 'Asia Pacific', 'n', 31.2, 121.5, ALL, ['Manufacturing and distribution', 'Consumer products', 'Technology'], 'Wei Chen', 'Partner, Inbound Services', [6, 40, 900]),
    F('cla-czech-republic', 'CLA Czech Republic', 'Czech Republic', 'Prague', 'Europe', 'n', 50.1, 14.4, ALL, ['Manufacturing and distribution', 'Technology', 'Professional services'], 'Tomáš Novák', 'Tax Partner', [2, 9, 150]),
    F('dhpg', 'dhpg', 'Germany', 'Bonn', 'Europe', 'n', 50.7, 7.1, ALL, ['Manufacturing and distribution', 'Life sciences and healthcare', 'Financial services', 'Technology'], 'Katrin Weber', 'Partner, Transfer Pricing', [11, 90, 1300]),
    F('cla-hong-kong', 'CLA Hong Kong', 'Hong Kong', 'Hong Kong', 'Asia Pacific', 'n', 22.3, 114.2, ['Audit', 'Tax', 'Advisory'], ['Financial services', 'Fintech', 'Professional services'], 'Grace Lam', 'Managing Director', [1, 6, 80]),
    F('cla-indus', 'CLA Indus Value Consulting', 'India', 'Mumbai', 'Asia Pacific', 'n', 19.1, 72.9, ['Tax', 'Advisory', 'Outsourcing'], ['Technology', 'Professional services', 'Fintech'], 'Arjun Mehta', 'Director', [3, 12, 200]),
    F('sw-ie', 'S&W', 'Ireland', 'Dublin', 'Europe', 'n', 53.3, -6.3, ALL, ['Financial services', 'Technology', 'Life sciences and healthcare'], 'Niamh Byrne', 'Partner', [2, 14, 180]),
    F('cla-ctp', 'CLA CT&P', 'Italy', 'Milan', 'Europe', 'n', 45.5, 9.2, ['Audit', 'Tax', 'Advisory'], ['Manufacturing and distribution', 'Consumer products', 'Hospitality and leisure'], 'Luca Bianchi', 'Partner', [2, 8, 90]),
    F('cla-global-ts-my', 'CLA Global TS', 'Malaysia', 'Kuala Lumpur', 'Asia Pacific', 'n', 3.1, 101.7, ALL, ['Manufacturing and distribution', 'Energy and natural resources'], 'Siti Rahman', 'Partner', [2, 10, 150]),
    F('cla-malta', 'CLA Malta', 'Malta', 'Valletta', 'Europe', 'n', 35.9, 14.5, ALL, ['Consumer products', 'Education', 'Energy and natural resources', 'Fintech', 'Manufacturing and distribution', 'Professional services', 'Telecommunications'], 'Mark Vella', 'Partner', [2, 4, 129]),
    F('cla-mexico', 'CLA Mexico', 'Mexico', 'Mexico City', 'Americas', 'n', 19.4, -99.1, ALL, ['Manufacturing and distribution', 'Consumer products'], 'Ana Lucía Torres', 'Transfer Pricing Partner', [3, 15, 210]),
    F('cla-expact', 'CLA Expact', 'Morocco', 'Casablanca', 'Middle East and Africa', 'n', 33.6, -7.6, ['Audit', 'Tax', 'Advisory'], ['Energy and natural resources', 'Manufacturing and distribution'], 'Youssef Alaoui', 'Managing Partner', [1, 5, 70]),
    F('cla-qatar', 'CLA Qatar', 'Qatar', 'Doha', 'Middle East and Africa', 'n', 25.3, 51.5, ['Audit', 'Tax', 'Advisory'], ['Energy and natural resources', 'Government and public sector'], 'Omar Haddad', 'Partner', [1, 4, 55]),
    F('cla-romania', 'CLA Romania', 'Romania', 'Bucharest', 'Europe', 'n', 44.4, 26.1, ALL, ['Technology', 'Manufacturing and distribution'], 'Andrei Popescu', 'Managing Partner', [2, 7, 110]),
    F('cla-saudi-arabia', 'CLA Saudi Arabia', 'Saudi Arabia', 'Riyadh', 'Middle East and Africa', 'n', 24.7, 46.7, ['Audit', 'Tax', 'Advisory'], ['Energy and natural resources', 'Government and public sector', 'Hospitality and leisure'], 'Faisal Al-Harbi', 'Partner', [3, 12, 190]),
    F('cla-global-ts-sg', 'CLA Global TS', 'Singapore', 'Singapore', 'Asia Pacific', 'n', 1.35, 103.8, ALL, ['Financial services', 'Technology', 'Professional services'], 'Daniel Tan', 'Partner', [2, 16, 300]),
    F('cla-slovakia', 'CLA Slovakia', 'Slovakia', 'Bratislava', 'Europe', 'n', 48.1, 17.1, ALL, ['Manufacturing and distribution', 'Technology'], 'Martin Horváth', 'Managing Partner', [2, 6, 85]),
    F('cla-spain', 'CLA Spain', 'Spain', 'Barcelona', 'Europe', 'n', 41.4, 2.2, ALL, ['Consumer products', 'Manufacturing and distribution', 'Professional services', 'Technology'], 'Laura Serra', 'Managing Partner', [6, 14, 170]),
    F('cla-turkey', 'CLA Turkey', 'Turkey', 'Istanbul', 'Europe', 'n', 41.0, 29.0, ['Audit', 'Tax', 'Advisory'], ['Manufacturing and distribution', 'Energy and natural resources'], 'Emre Yılmaz', 'Partner', [2, 8, 120]),
    F('cla-emirates', 'CLA Emirates', 'United Arab Emirates', 'Dubai', 'Middle East and Africa', 'n', 25.2, 55.3, ALL, ['Financial services', 'Hospitality and leisure', 'Professional services'], 'Sara Khalil', 'Tax Director', [2, 9, 140]),
    F('sw-uk', 'S&W', 'United Kingdom', 'London', 'Europe', 'n', 51.5, -0.1, ALL, ['Energy and natural resources', 'Financial services', 'Fintech', 'Government and public sector', 'Hospitality and leisure', 'Life sciences and healthcare', 'Manufacturing and distribution', 'Professional services', 'Technology'], 'James Carter', 'Partner, International', [22, 140, 2100]),
    F('cliftonlarsonallen', 'CliftonLarsonAllen LLP', 'United States', 'Minneapolis', 'Americas', 'n', 44.98, -93.3, ALL, ['Manufacturing and distribution', 'Life sciences and healthcare', 'Financial services', 'Government and public sector', 'Education', 'Technology'], 'Megan Olson', 'Principal, International Tax', [130, 900, 9000]),

    /* Alliance member firms (34) */
    F('cora', 'Cora Consulting', 'Georgia', 'Tbilisi', 'Europe', 'a', 41.7, 44.8, ['Tax', 'Advisory'], ['Professional services'], 'Nino Beridze', 'Director', [1, 3, 25]),
    F('bswp', 'BSWP', 'Germany', 'Bocholt', 'Europe', 'a', 51.8, 6.6, ['Audit', 'Tax'], ['Manufacturing and distribution'], 'Jan Hoffmann', 'Partner', [1, 4, 45]),
    F('rtw', 'RTW Revisions', 'Germany', 'Bremen', 'Europe', 'a', 53.1, 8.8, ['Audit', 'Tax'], ['Manufacturing and distribution', 'Energy and natural resources'], 'Birgit Schulz', 'Partner', [1, 5, 50]),
    F('cordes', 'Cordes + Partner', 'Germany', 'Hamburg', 'Europe', 'a', 53.55, 10.0, ['Audit', 'Tax', 'Advisory'], ['Consumer products', 'Professional services'], 'Stefan Krüger', 'Partner', [1, 6, 70]),
    F('se-unit', 'SE Unit', 'Germany', 'Hanover', 'Europe', 'a', 52.4, 9.7, ['Tax', 'Advisory'], ['Technology'], 'Julia Wagner', 'Partner', [1, 3, 30]),
    F('lts', 'LTS', 'Germany', 'Herford', 'Europe', 'a', 52.1, 8.7, ['Audit', 'Tax'], ['Manufacturing and distribution'], 'Thomas Becker', 'Partner', [1, 4, 40]),
    F('btr-sumus', 'BTR Sumus', 'Germany', 'Lübeck', 'Europe', 'a', 53.9, 10.7, ['Audit', 'Tax', 'Advisory'], ['Life sciences and healthcare'], 'Anna Meyer', 'Partner', [1, 5, 55]),
    F('muenchener-treuhand', 'Münchener Treuhand', 'Germany', 'Munich', 'Europe', 'a', 48.1, 11.6, ['Audit', 'Tax'], ['Technology', 'Professional services'], 'Markus Huber', 'Partner', [1, 4, 45]),
    F('ludwig-maldener', 'Ludwig & Maldener', 'Luxembourg', 'Luxembourg', 'Europe', 'a', 49.6, 6.1, ['Audit', 'Tax'], ['Financial services'], 'Claire Muller', 'Partner', [1, 3, 30]),
    F('gonzalez-espinosa', 'Gonzalez Espinosa y Asociados', 'Mexico', 'Monterrey', 'Americas', 'a', 25.7, -100.3, ['Audit', 'Tax'], ['Manufacturing and distribution'], 'Jorge Gonzalez', 'Partner', [1, 4, 40]),
    F('riedweg', 'Riedweg & Partner AG', 'Switzerland', 'Zurich', 'Europe', 'a', 47.4, 8.5, ['Audit', 'Tax', 'Advisory'], ['Financial services', 'Professional services'], 'Lukas Meier', 'Partner', [1, 4, 35]),
    F('tys', 'TYS', 'United States', 'California', 'Americas', 'a', 34.1, -118.2, ['Audit', 'Tax'], ['Technology', 'Consumer products'], 'Kevin Park', 'Partner', [1, 5, 60]),
    F('nicola-yester', 'Nicola Yester & Company', 'United States', 'Connecticut', 'Americas', 'a', 41.6, -72.7, ['Audit', 'Tax'], ['Professional services'], 'Laura Nicola', 'Partner', [1, 3, 25]),
    F('kmh', 'KMH', 'United States', 'Hawaii', 'Americas', 'a', 21.3, -157.9, ['Audit', 'Tax', 'Advisory'], ['Hospitality and leisure'], 'Keoni Kahale', 'Partner', [1, 6, 80]),
    F('clh', 'CLH, CPAs & Consultants', 'United States', 'Indiana', 'Americas', 'a', 39.8, -86.2, ['Audit', 'Tax'], ['Manufacturing and distribution'], 'Brian Collins', 'Partner', [1, 4, 40]),
    F('henjes', 'Henjes, Conner & Williams', 'United States', 'Iowa', 'Americas', 'a', 41.6, -93.6, ['Audit', 'Tax'], ['Consumer products'], 'Sarah Henjes', 'Partner', [1, 3, 25]),
    F('tdt', 'TDT CPAs and Advisors', 'United States', 'Iowa', 'Americas', 'a', 41.9, -91.7, ['Audit', 'Tax', 'Advisory'], ['Manufacturing and distribution'], 'David Thompson', 'Partner', [1, 5, 45]),
    F('christianson', 'Christianson PLLP', 'United States', 'Minnesota', 'Americas', 'a', 45.1, -95.0, ['Audit', 'Tax', 'Advisory'], ['Consumer products', 'Government and public sector'], 'Erik Christianson', 'Partner', [1, 6, 70]),
    F('enestvedt', 'Enestvedt & Christensen', 'United States', 'Minnesota', 'Americas', 'a', 44.0, -92.5, ['Audit', 'Tax'], ['Consumer products'], 'Karen Enestvedt', 'Partner', [1, 3, 20]),
    F('harrington-langer', 'Harrington Langer & Associates', 'United States', 'Minnesota', 'Americas', 'a', 44.3, -94.4, ['Audit', 'Tax'], ['Professional services'], 'Paul Harrington', 'Partner', [1, 3, 25]),
    F('myslajek', 'Myslajek, Kemp & Spencer', 'United States', 'Minnesota', 'Americas', 'a', 46.8, -92.1, ['Audit', 'Tax'], ['Government and public sector'], 'Linda Kemp', 'Partner', [1, 3, 20]),
    F('rohloff', 'Rohloff Associates', 'United States', 'Minnesota', 'Americas', 'a', 45.6, -94.2, ['Tax', 'Outsourcing'], ['Professional services'], 'Mark Rohloff', 'Partner', [1, 2, 15]),
    F('iwta', 'International Wealth Tax Advisors', 'United States', 'New York', 'Americas', 'a', 40.7, -74.0, ['Tax'], ['Financial services'], 'Rachel Stein', 'Principal', [1, 4, 30]),
    F('wojeski', 'Wojeski & Associates', 'United States', 'New York', 'Americas', 'a', 42.7, -73.8, ['Audit', 'Tax'], ['Government and public sector'], 'Thomas Wojeski', 'Partner', [1, 3, 25]),
    F('trp-sumner', 'TRP Sumner PLLC', 'United States', 'North Carolina', 'Americas', 'a', 35.8, -78.6, ['Audit', 'Tax'], ['Life sciences and healthcare'], 'Amy Sumner', 'Partner', [1, 3, 25]),
    F('vrs', 'VRS', 'United States', 'South Dakota', 'Americas', 'a', 43.5, -96.7, ['Audit', 'Tax'], ['Consumer products'], 'Josh Vander', 'Partner', [1, 3, 20]),
    F('kellogg-sovereign', 'Kellogg & Sovereign Consulting', 'United States', 'Texas', 'Americas', 'a', 32.4, -99.7, ['Audit', 'Tax', 'Advisory'], ['Energy and natural resources'], 'Chris Kellogg', 'Partner', [1, 4, 35]),
    F('mcclanahan-holmes', 'McClanahan and Holmes', 'United States', 'Texas', 'Americas', 'a', 29.8, -95.4, ['Audit', 'Tax'], ['Energy and natural resources'], 'Beth Holmes', 'Partner', [1, 4, 35]),
    F('sgc', 'SGC CPAs', 'United States', 'Texas', 'Americas', 'a', 32.8, -96.8, ['Audit', 'Tax'], ['Professional services'], 'Greg Sanders', 'Partner', [1, 3, 25]),
    F('smdw', 'Steward, Martin, Dudley & Webb', 'United States', 'Texas', 'Americas', 'a', 31.5, -97.1, ['Audit', 'Tax'], ['Manufacturing and distribution'], 'Holly Webb', 'Partner', [1, 4, 40]),
    F('bluocean', 'BluOcean Cyber', 'United States', 'Virginia', 'Americas', 'a', 38.9, -77.4, ['Advisory'], ['Technology', 'Government and public sector'], 'Ryan Blake', 'Principal', [1, 2, 20]),
    F('rogers', 'Rogers & Company', 'United States', 'Virginia', 'Americas', 'a', 37.5, -77.4, ['Audit', 'Tax'], ['Government and public sector'], 'Megan Rogers', 'Partner', [1, 3, 25]),
    F('ritzholman', 'RitzHolman', 'United States', 'Wisconsin', 'Americas', 'a', 43.0, -87.9, ['Audit', 'Tax', 'Advisory'], ['Manufacturing and distribution'], 'Nick Holman', 'Partner', [1, 5, 50]),
    F('smart-solutions', 'Smart Solutions', 'United States', 'Wisconsin', 'Americas', 'a', 44.5, -88.0, ['Outsourcing'], ['Professional services'], 'Tara Smart', 'Director', [1, 2, 15])
  ];

  /* Service experts shown on service pages (sample people). */
  window.CLA_EXPERTS = {
    tax: [
      { name: 'Katrin Weber', role: 'Partner, Transfer Pricing', firm: 'dhpg', country: 'Germany', id: 'dhpg' },
      { name: 'Sara Khalil', role: 'Tax Director', firm: 'CLA Emirates', country: 'United Arab Emirates', id: 'cla-emirates' },
      { name: 'Megan Olson', role: 'Principal, International Tax', firm: 'CliftonLarsonAllen LLP', country: 'United States', id: 'cliftonlarsonallen' }
    ]
  };

  /* Insights. Titles and dates of the real articles are from claglobal.com;
     the service, industry and country tags are sample metadata. Items marked
     sample: true are invented to show the case study and report formats. */
  window.CLA_INSIGHTS = [
    { id: 'malta-vida', type: 'Article', date: '2026-09-21', title: 'Adopting digital VAT: How Malta is navigating ViDA and its domestic VAT gap', service: 'Tax', industry: '', country: 'Malta', firm: 'cla-malta', author: 'Mark Vella' },
    { id: 'uae-us-residency', type: 'Article', date: '2026-08-17', title: 'Clarifying UAE/U.S. tax residency laws and reporting rules', service: 'Tax', industry: '', country: 'United Arab Emirates', firm: 'cla-emirates', author: 'Sara Khalil' },
    { id: 'report-2026', type: 'Report', date: '2026-08-05', title: 'Mid-Market Crossings 2026: how privately owned businesses are growing across borders', service: '', industry: '', country: '', firm: '', author: 'CLA Global', sample: true, href: 'report.html' },
    { id: 'brazil-cyber', type: 'Article', date: '2026-07-28', title: "Brazil's New Financial Cybersecurity Rules Align to Global Standards", service: 'Advisory', industry: 'Financial services', country: 'Brazil', firm: 'cla-brazil', author: 'Rafael Monteiro' },
    { id: 'case-mx-us', type: 'Case study', date: '2026-07-20', title: 'Setting up a US subsidiary for a Mexican manufacturer in five months', service: 'Tax', industry: 'Manufacturing and distribution', country: 'Mexico', firm: 'cla-mexico', author: 'CLA Mexico and CliftonLarsonAllen', sample: true },
    { id: 'succession', type: 'Article', date: '2026-07-13', title: 'Succession Planning: Ownership-Focused Continuity and Legacy Preservation', service: 'Advisory', industry: '', country: 'Singapore', firm: 'cla-global-ts-sg', author: 'Daniel Tan' },
    { id: 'case-uk-es', type: 'Case study', date: '2026-06-12', title: 'One audit timetable for a UK retailer with subsidiaries in Spain and Ireland', service: 'Audit', industry: 'Consumer products', country: 'United Kingdom', firm: 'sw-uk', author: 'S&W and CLA Spain', sample: true },
    { id: 'cyber-resilience', type: 'Article', date: '2026-05-28', title: 'Building Cyber Resilience: A Robust Roadmap for the Future', service: 'Advisory', industry: 'Technology', country: 'United States', firm: 'cliftonlarsonallen', author: 'Megan Olson' },
    { id: 'pillar-two', type: 'Article', date: '2026-03-30', title: 'Implementation of Pillar Two global tax system accelerates', service: 'Tax', industry: '', country: 'Germany', firm: 'dhpg', author: 'Katrin Weber' },
    { id: 'case-sg-my', type: 'Case study', date: '2026-02-18', title: 'Outsourced payroll for a fintech hiring in Singapore and Malaysia', service: 'Outsourcing', industry: 'Fintech', country: 'Singapore', firm: 'cla-global-ts-sg', author: 'CLA Global TS', sample: true },
    { id: 'tp-tariffs', type: 'Article', date: '2026-01-27', title: 'Transfer Pricing: How Multinational Companies Can Use it to Manage Tariffs', service: 'Tax', industry: 'Manufacturing and distribution', country: 'Mexico', firm: 'cla-mexico', author: 'Ana Lucía Torres' },
    { id: 'de-tp-docs', type: 'Article', date: '2025-05-22', title: 'Has Germany solved Transfer Pricing documentation bureaucracy?', service: 'Tax', industry: '', country: 'Germany', firm: 'dhpg', author: 'Katrin Weber' },
    { id: 'irs-campaign', type: 'Article', date: '2024-09-11', title: 'Coordinated IRS campaign keeps close watch on US subsidiaries', service: 'Tax', industry: '', country: 'Germany', firm: 'dhpg', author: 'Katrin Weber' },
    { id: 'esg-healthcare', type: 'Article', date: '2023-12-12', title: 'Should Health Care and Life Sciences Consider ESG? Explore Pros and Cons', service: 'Advisory', industry: 'Life sciences and healthcare', country: 'United States', firm: 'cliftonlarsonallen', author: 'Megan Olson' },
    { id: 'esg-succession', type: 'Article', date: '2023-12-12', title: 'Strategies to Incorporate Sustainability in Business Succession Planning', service: 'Advisory', industry: '', country: 'United States', firm: 'cliftonlarsonallen', author: 'Megan Olson' },
    { id: 'hr-tune-up', type: 'Article', date: '2023-12-08', title: 'The HR Tune-Up: Why Regular Review is Critical for Your Business', service: 'Outsourcing', industry: '', country: 'United States', firm: 'cliftonlarsonallen', author: 'Megan Olson' }
  ];

  window.CLA_FIRM_BY_ID = function (id) {
    for (var i = 0; i < window.CLA_FIRMS.length; i++) if (window.CLA_FIRMS[i].id === id) return window.CLA_FIRMS[i];
    return null;
  };
})();
