# Launch intake — real data & assets

Fill each blank, drop the files, and the site goes from placeholder to real.
Nothing here is code — the owner fills this; the maintainer wires the file
references (all mapped to exact locations). Anything still marked `// mock` or
`// TODO` in `lib/content.ts` / `lib/content-automations.ts` is a placeholder.

---

## 1. Founder

- [x] **Display name** — Syed Abdul Mukheeth Peer
- [x] **Photo** — `public/founder.webp` (hill portrait, 4:5)
- [x] **LinkedIn** — https://www.linkedin.com/in/syedmukheeth/ (wired 4×)
- [x] **X / Twitter** — removed everywhere per request

## 2. Logo  ✅ done

- [x] **Mark** — `public/logo-mark.png` (transparent S-ribbon) → nav
- [x] **Full lockup** — `public/logo-full.png` (mark + white "sampeer studio"
      + tagline, transparent) → footer. Rebuilt light-on-dark from the light
      lockup since the dark-glow file wasn't supplied.
- [x] **Favicon + square** — `app/icon.png`, `public/logo.png` (512² mark)
- [ ] Optional upgrade: send an SVG mark for infinitely-crisp scaling.

## 3. Stats — LinkedIn proof  (`lib/content.ts` `STATS`)  ✅ done

- [x] LinkedIn followers → 8.7K+
- [x] Monthly impressions → 350K+
- [x] Clients worked with → "UK & India" (text stat)
- [x] Premium client portfolio → "Growing" (text stat)

## 4. Testimonials  (`lib/content.ts` `TESTIMONIALS`)  ✅ done

- [x] Real ASRG Construction quote + proof photo (`public/asrg-client.webp`).
      Placeholder names removed. Add more clients here as quotes come in.

## 5. Automations impact numbers  (`lib/content-automations.ts` `A_IMPACT`)  ✅ done

- [x] Honest ranges: Hours saved 20–80/mo · First response <5 min ·
      Follow-ups automated 95% · Lead response 2–4× faster

## 6. Contact form delivery  (Vercel → Settings → Environment Variables)

- [x] Local: `.env.local` has RESEND_API_KEY + CONTACT_TO + CONTACT_FROM
- [ ] **Vercel: add the SAME three env vars, then redeploy** (owner action —
      local env does not apply to production)
- [x] Public email on site → sampeerstudio@gmail.com
- [ ] `CONTACT_FROM` — currently onboarding@resend.dev; upgrade after
      verifying a sending domain in Resend

## 7. Domain / SEO

- [x] Meta title + description updated (`app/layout.tsx`)
- [ ] Custom domain (not bought yet) — on `sampeer-studio.vercel.app` until
      then → swap `SITE_URL` in `app/layout.tsx`, `robots.ts`, `sitemap.ts`

## 8. Work section  (already real — 6 live client sites)

- [ ] Confirm client names / industries / one-line descriptions are accurate
      and you have permission to feature them (`lib/content.ts` `WORK`)

---

Send items 1–2 (photo + logo files) and 6 (Resend) first — those are the
highest-impact for "looks professional + actually captures leads."
