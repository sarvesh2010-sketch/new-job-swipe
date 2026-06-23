# Technical Architecture

## 1. Build Approach: Web App (PWA) First, Not Native
For an MVP validating a niche idea, a single codebase **installable Progressive Web App
(PWA)** is the right call over building separate iOS/Android native apps:
- One codebase, one team, faster iteration.
- Works on any phone via browser, installable to home screen, supports push notifications.
- Swipe gestures (the core mechanic) work perfectly fine with touch + Framer Motion —
  native is not required for this to feel good.
- Native apps (React Native / Flutter) become worth the extra cost only after the
  validation step in Phase 0 proves the model works and you have real usage data.

## 2. Recommended Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js 14 (App Router) + TypeScript** | Single codebase for web + PWA, fast, SEO-friendly for provider-facing public job pages |
| Styling | **Tailwind CSS** | Fast to build consistent UI, easy to theme |
| Swipe/animation | **Framer Motion** | Smooth drag/swipe gesture handling for the card feed |
| PWA support | **next-pwa** | Installable app, offline shell, push notification support |
| Backend | **Next.js API Routes** (or a separate Node/Express service if it grows) | Avoids running two servers for MVP; can be split out later if needed |
| ORM | **Prisma** | Type-safe DB access, easy migrations |
| Database | **PostgreSQL** (hosted on **Supabase** or **Railway**) | Relational data (users, jobs, applications) fits relational DB well; Supabase also gives auth/storage if useful |
| Auth | **Phone number + OTP** via **MSG91** or **Twilio Verify** | OTP login is the norm in India; avoids password friction |
| File storage | **Cloudinary** or **AWS S3** | Profile photos, job photos |
| Push notifications | **OneSignal** or **Firebase Cloud Messaging** | Application status updates, new job alerts |
| Location / maps | **Google Maps Platform** (Geocoding + Distance) or **OpenStreetMap/Mapbox** for lower cost | Distance-based filtering for the swipe feed |
| Hosting | **Vercel** (frontend + API routes) | Pairs naturally with Next.js, generous free tier for MVP traffic |
| Analytics | **PostHog** or **Mixpanel** (free tier) | Track swipe-right rate, application-to-approval rate — critical for validating the model |

This stack overlaps closely with the Next.js/TypeScript/Tailwind approach already used on
your other web projects, so the same workflow and tooling carries over.

## 3. High-Level System Diagram (described)

```
                    ┌─────────────────────────┐
                    │   Student / Provider     │
                    │   Browser (PWA, mobile)  │
                    └───────────┬──────────────┘
                                │ HTTPS
                    ┌───────────▼──────────────┐
                    │   Next.js App (Vercel)    │
                    │  - Pages/UI (App Router)  │
                    │  - API Routes (REST)      │
                    └──────┬───────────┬────────┘
                            │           │
              ┌─────────────▼──┐   ┌────▼─────────────┐
              │ PostgreSQL DB   │   │ 3rd-party services│
              │ (Supabase/      │   │ - OTP (MSG91)     │
              │  Railway)       │   │ - Push (OneSignal)│
              │ via Prisma ORM  │   │ - Storage (S3/    │
              └─────────────────┘   │   Cloudinary)     │
                                    │ - Maps (Google/   │
                                    │   Mapbox)         │
                                    └───────────────────┘
```

## 4. Why Not Microservices / Separate Backend for MVP
A single Next.js app handling both frontend and API routes is enough for the traffic an
MVP in one city/campus will see. Splitting into separate services adds deployment
complexity with no real benefit at this stage — this can be revisited in Phase 3 if scale
demands it.

## 5. Security & Compliance Notes
- OTP-based auth avoids storing passwords.
- Student age field captured at signup to support minimum-working-age checks flagged in
  the original concept doc — this needs a one-time legal check on applicable labor law
  before launch (varies depending on job type and state).
- Provider verification (manual queue in MVP) is the primary anti-scam control, addressing
  the job-posting-scam risk called out in the concept doc.
- No payment data handled in MVP (no PCI/RBI payment compliance burden in v1).
