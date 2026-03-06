

## Comprehensive System Audit & Repair Plan

### Issues Identified

**1. CRITICAL: All RLS Policies Are RESTRICTIVE (Root Cause of Production Failure)**

Every single table has `Permissive: No` on ALL its RLS policies. In PostgreSQL, when multiple RESTRICTIVE policies exist, they are AND-ed together. This means:
- The "public read" policy (e.g., `is_active = true`) AND the "admin manage" policy (e.g., `EXISTS(SELECT 1 FROM admin_users...)`) must BOTH pass.
- For **public/anonymous users**: The admin check fails, so even SELECT for public data is blocked.
- For **admin users**: The admin check passes, but the public filter (e.g., `is_active = true`) also applies, meaning admins can only see active items -- and INSERT/UPDATE/DELETE fail because the public SELECT policy doesn't cover those commands, creating an implicit AND with a missing policy that defaults to deny.

This is why:
- The admin panel loads but CRUD operations silently fail
- In production, the auth initialization race condition combined with restrictive policies causes the loading spinner to hang indefinitely

**2. Auth Hook Race Condition**

In `useAuth.ts`, the `onAuthStateChange` listener makes an async Supabase query inside the callback. During the async gap, another auth event can fire, causing state inconsistencies. The `getSession()` call also runs in parallel, potentially setting `loading = false` before the admin check completes. In production (where network latency is higher), this race condition is more pronounced, causing the admin panel to get stuck on the loading spinner.

**3. Services Page Uses Static Data (Not Connected to DB)**

`src/pages/Services.tsx` uses a hardcoded `services` array instead of fetching from the database. Admin changes to services won't reflect on this page.

**4. No `updated_at` Triggers Exist**

The database has the `update_updated_at_column()` function defined but the triggers section shows "There are no triggers in the database." This means `updated_at` columns never auto-update.

**5. Storage RLS May Block Uploads**

The `media` bucket exists and is public, but we need to verify storage policies allow authenticated admin uploads.

---

### Implementation Plan

#### Step 1: Fix All RLS Policies (Database Migration)

Drop all existing RESTRICTIVE policies and recreate them as PERMISSIVE for all 10 tables:
- `services`, `offers`, `testimonials`, `blog_posts`, `contact_settings`, `media`, `admin_users`, `hero_slides`, `faq_items`, `page_sections`
- Public read policies: PERMISSIVE SELECT with appropriate filters
- Admin write policies: PERMISSIVE ALL for authenticated users in `admin_users`
- Add storage.objects policies for the `media` bucket (SELECT for all, INSERT/UPDATE/DELETE for authenticated admins)

#### Step 2: Add Missing `updated_at` Triggers

Create triggers on all tables that have `updated_at` columns:
`services`, `offers`, `testimonials`, `blog_posts`, `contact_settings`, `media`, `hero_slides`, `faq_items`, `page_sections`

#### Step 3: Fix Auth Hook Race Condition

Rewrite `useAuth.ts` to:
- Set up `onAuthStateChange` BEFORE calling `getSession()` (already done, good)
- Use `setTimeout` wrapper for the Supabase query inside `onAuthStateChange` to avoid blocking the callback
- Add a dedicated `authReady` state that only becomes true after the initial session check completes
- Handle the case where `getSession` fails gracefully
- Ensure `loading` always resolves to `false` even on errors

#### Step 4: Connect Services Page to Database

Update `src/pages/Services.tsx` to use the `useServices()` hook, falling back to static data. Keep the category filter working with live data.

#### Step 5: UI/UX Layout Improvements

- **Navbar**: Ensure consistent padding and proper mobile menu z-index
- **Homepage sections**: Verify consistent `section-padding` usage and spacing between sections
- **Footer**: Already well-structured, minor alignment checks
- **About, Blog, Contact, FAQ, Kids, Offers pages**: Ensure consistent hero section height and spacing
- **Admin panel**: Already clean, no major issues

#### Step 6: Performance & Polish

- Add `loading="lazy"` to all non-hero images across public pages
- Ensure all carousel images have proper aspect ratios to prevent layout shift

---

### Summary of Root Causes

| Issue | Root Cause | Impact |
|-------|-----------|--------|
| Admin panel stuck in production | RESTRICTIVE RLS + auth race condition | Complete admin failure |
| CRUD operations fail | RESTRICTIVE policies AND-ed together | No data can be written |
| Public data may not load | RESTRICTIVE public SELECT policies | Empty pages for visitors |
| Services page ignores DB | Hardcoded static array | Admin edits don't appear |
| `updated_at` never updates | Missing triggers | Stale timestamps |

