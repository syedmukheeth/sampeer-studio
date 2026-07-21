# Launch intake — real data & assets

Fill each blank, drop the files, and the site goes from placeholder to real.
Nothing here is code — the owner fills this; the maintainer wires the file
references (all mapped to exact locations). Anything still marked `// mock` or
`// TODO` in `lib/content.ts` / `lib/content-automations.ts` is a placeholder.

---

## 1. Founder

- [ ] **Display name** — currently `Syed` → `lib/content.ts` `ABOUT.name`
      Real name: `__________`
- [ ] **Photo** — vertical portrait ~900×1100+ (3:4), clean background.
      Drop at `public/founder.webp`. Replaces the Picsum placeholder at
      `ABOUT.photo` (`lib/content.ts`).
- [ ] **LinkedIn URL** — `__________`
      (used 4×: `content.ts` branding CTA, About, footer; `layout.tsx` schema)
- [ ] **X / Twitter URL** — `__________`  (or "remove X" → footer + schema)

## 2. Logo  (light-on-dark; the site is dark only)

- [ ] **Mark only, no name** — square, transparent PNG/SVG, 512×512+.
      → `public/logo.png` (nav mark, favicon, app icon)
- [ ] **Full lockup, mark + "Sampeer Studio"** — horizontal, transparent.
      → `public/logo-full.png` (nav + footer)
- [ ] Vector (SVG) preferred for both if available — sharper at every size.

## 3. Stats — LinkedIn proof  (`lib/content.ts` `STATS`)

- [ ] LinkedIn followers (8.6K on file — still current?): `__________`
- [ ] Monthly impressions: `__________`
- [ ] Posts that landed: `__________`
- [ ] Founders in the DMs: `__________`

## 4. Testimonials  (`lib/content.ts` `TESTIMONIALS` — all 3 are placeholder)

For each: quote + name + role/company. Headshot optional.

- [ ] 1 — quote `__________`  · name `____`  · role `____`
- [ ] 2 — quote `__________`  · name `____`  · role `____`
- [ ] 3 — quote `__________`  · name `____`  · role `____`

## 5. Automations impact numbers  (`lib/content-automations.ts` `A_IMPACT` — all mock)

- [ ] Hours saved / month: `____`
- [ ] Leads multiplier (e.g. 3.4x): `____`
- [ ] First response time: `____`
- [ ] % of follow-ups sent: `____`
      (or say "use honest ranges" and these get softened)

## 6. Contact form delivery  (Vercel → Settings → Environment Variables)

- [ ] `RESEND_API_KEY` — from resend.com
- [ ] `CONTACT_TO` — inbox where leads should land: `__________`
- [ ] Public contact email shown on site — confirm real & monitored:
      `hello@sampeerstudio.com` ? → `content.ts` CTA + footer, `content-automations.ts` CTA
- [ ] `CONTACT_FROM` — after verifying a sending domain in Resend
      (until then it sends from `onboarding@resend.dev`)

## 7. Domain / SEO

- [ ] Custom domain: `__________`
      → `app/layout.tsx` `SITE_URL`, `app/robots.ts`, `app/sitemap.ts`
- [ ] Confirm meta title + description read right (`app/layout.tsx`)

## 8. Work section  (already real — 6 live client sites)

- [ ] Confirm client names / industries / one-line descriptions are accurate
      and you have permission to feature them (`lib/content.ts` `WORK`)

---

Send items 1–2 (photo + logo files) and 6 (Resend) first — those are the
highest-impact for "looks professional + actually captures leads."
