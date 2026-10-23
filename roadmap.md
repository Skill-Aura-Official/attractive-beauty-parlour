# Roadmap — Festive Campaigns, Admin & Chatbot Upgrade

## Phase 1 — Backend (Lovable Cloud)
- [x] Audit codebase, hooks, admin, chatbot
- [ ] Migration: services columns (display_name, price, duration, detailed_description, is_featured), service_categories, kc_packages, campaigns, campaign_services (+RLS, grants, triggers, seeds)
- [ ] Regenerate DB types
- [ ] Campaign helpers lib + unit tests (discount caps, 2h window)

## Phase 2 — Public site
- [ ] Karwa Chauth packages section (₹2,499 / ₹3,999 / ₹5,999)
- [ ] Happy Hours section (2h daily, call-to-confirm, ≤50%)
- [ ] Radiance Facial Offers section (≤30% selected facials)
- [ ] Wire sections into Home + Offers pages
- [ ] Services page: premium category names, display names, prices

## Phase 3 — Admin panel
- [ ] ManagePackages (Karwa Chauth CRUD)
- [ ] ManageCampaigns (Happy Hours + Facial Offers editors w/ eligible services)
- [ ] ManageServices: new fields + category meta editor
- [ ] Routes, sidebar nav, dashboard stats

## Phase 4 — Chatbot
- [ ] chat edge function: dynamic context (services, packages, campaigns, FAQs)
- [ ] Booking flow: customer type (lady/kid), notes, review step, WhatsApp handoff format
- [ ] ChatWidget: extended payload + confirmation disclaimer

## Phase 5 — Verify
- [ ] Deploy edge functions
- [ ] Build + tests pass
- [ ] Browser end-to-end: packages, campaigns, chatbot booking, admin CRUD
