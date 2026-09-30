# CLA Global — prototype requirements (V1)

Source: ClerksWell phase 1 review of claglobal.com and five comparator networks (30 Sep 2026).
Idea numbers (#nn) refer to the internal Opportunities page. These are ClerksWell proposals, not
client requirements; CLA Global has not yet reviewed them.

## Global
- R01 CLA Global's own header and footer are replaced by a prototype navigator and a previous/next pager.
- R02 Every template works at 320px, 768px and 1024px+.
- R03 All interactive components are keyboard operable and dismissible with Escape (WCAG 2.2 AA target) (#47).
- R04 Context (firm, service, industry, filters) carries between pages via query parameters, with a session fallback.

## Prototype 1 — Find a firm (ideas #1–#9)
- R10 One search box matches country, city, firm and contact name, with country autocomplete (#1).
- R11 Network and alliance firms appear in one list, labelled, with filters for membership, region, service and industry (#1, #2).
- R12 A map shows countries with member firms; a pin filters the list to that country (#3).
- R13 Each result shows firm, place, services and a named contact with email, plus "Ask this firm" (#4, #5).
- R14 One profile template: figures, contacts, services, industries, website and "Ask this firm" (#6).
- R15 Contacts are edited by each firm and confirmed every six months (#7).
- R16 Services and industries on a profile link to the service page and filtered finder (#6).
- R17 A "Doing business in [country]" guide and the firm's own insights sit on the profile (#8, #28).

## Prototype 2 — A front door for clients (ideas #10–#13, #15, #35)
- R20 The homepage offers two routes: find a firm (country + service) and join the network (#10).
- R21 Headline figures are rendered in the HTML, with a country count (#35).
- R22 The four services link to service pages (#12).
- R23 Industries are listed on the homepage and each has a page built from one template (#11).
- R24 Client case studies appear on the homepage (#15).
- R25 The homepage shows the latest three insights, newest first (#24).
- R26 A recognition strip shows memberships and rankings with source and date (#37).
- R27 Service pages list specialisms as headed sections, and say how many firms offer the service (#12).
- R28 Service pages name three specialists from member firms (#13).
- R29 Service and industry pages show related insights and firms (#11, #12).

## Prototype 3 — Enquiry and RFP (ideas #14, #31–#34)
- R30 A stepped enquiry asks for countries and services before any personal details (#31).
- R31 A client can ask a question or request a proposal (#14).
- R32 Matching firms and contacts are shown per country; the client can pick one or ask CLA Global to coordinate (#31).
- R33 An enquiry started from a firm carries that firm and its country through (#6, #31).
- R34 Five required fields for a question; proposals add deadline, start and optional upload (#32, #14).
- R35 Client, membership and media enquiries have separate forms (#34).
- R36 The confirmation says who will reply and by when (#33).

## Prototype 4 — Join CLA Global (ideas #17–#22)
- R40 The join page summarises member benefits (#17).
- R41 Network and alliance membership are compared side by side (#18).
- R42 The page says who the network looks for and names a membership contact (#17).
- R43 The joining process is shown with indicative timings (#17).
- R44 Member stories with video (#20).
- R45 The network's growth is shown as a timeline (#22).
- R46 Network events, past and upcoming (#21).
- R47 FAQs for prospective members (#17).
- R48 A seven-field expression of interest replaces the 21-field form (#19).
- R49 The detailed questionnaire is a separate, saveable, sectioned form using bands, with a revenue split that must total 100% (#19).

## Prototype 5 — Insights and research (ideas #23–#30)
- R50 Insights list type, date, firm, country and service on every item (#23, #28).
- R51 Search and filters for type, service, industry and country, kept in the URL; featured content appears once (#23, #25).
- R52 Articles show an author card linked to the firm, topic tags, related insights and a folded disclaimer (#28).
- R53 A flagship research report page with key findings, a regional chart and chapters (#26).
- R54 Email sign-up with topic and region preferences (#27).

## Technical
- T01 Vanilla JS and CSS only; no build dependencies beyond Node for includes.
- T02 Built to docs/ for GitHub Pages; docs/.nojekyll present.
- T03 validate.js passes: balanced tags, defined handlers, internal links resolve.
