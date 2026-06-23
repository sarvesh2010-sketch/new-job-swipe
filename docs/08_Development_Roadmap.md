# Development Roadmap — Phase-Gated Plan

Each phase ends with a confirmation checkpoint. Don't start the next phase until the
current one is reviewed and confirmed — this avoids scope-creep and keeps the build
focused, the same approach already used on your other web projects.

---

## Phase 0 — Validate the Core Assumption (1–2 weeks, no/low code)
**Goal:** Find out whether swipe-to-apply actually beats a normal scrollable list for this
use case, before investing in the full build.

- Build (or fake) two minimal versions of a job feed: one swipeable, one a plain scroll
  list — even a clickable prototype (Figma) or a bare-bones single page is enough.
- Manually onboard 10-20 real local job providers in one campus/area and get 10-20 real
  micro-job postings (even via WhatsApp/manual entry into a spreadsheet behind the
  prototype).
- Get 30-50 real students to try both versions, track which one produces more completed
  applications and which one they say they'd rather use.
- **Gate:** Move to Phase 1 only if swipe clearly outperforms (or is at least equally good
  and clearly preferred) — otherwise reconsider the swipe mechanic before building it into
  the real product.

## Phase 1 — MVP Build (6–8 weeks)
**Goal:** A working, installable web app (PWA) for one city/campus cluster, covering the
full MVP feature list from `02_Product_Requirements.md`.

Suggested build order within the phase:
1. Project setup — repo, Next.js + TypeScript + Tailwind, Prisma + Postgres, deploy
   skeleton to Vercel (get "hello world" deployed early).
2. Auth — phone OTP signup/login for both student and provider roles.
3. Profile setup — student profile, provider profile + admin verification flag.
4. Job posting — provider's "Post a Job" form + listing management.
5. Swipe feed — the core card UI, swipe gestures, filters (radius/pay/hours/skill).
6. Applications — swipe-right creates application; provider's Applicant Review screen;
   approve/reject.
7. Trust score (basic) — rating model + simple aggregated score, surfaced to providers.
8. Buddy-apply.
9. Push notifications for status changes.
10. Admin: provider verification queue + basic reports queue (manual moderation tools).

**Gate:** Internal QA pass + a small closed pilot (the same local providers/students from
Phase 0 if possible) before opening more broadly.

## Phase 2 — Strengthen Trust & Retention (3–4 weeks, after MVP is live and used)
- Two-sided ratings (students can also rate providers).
- In-app chat between approved student and provider.
- Automated/document-based provider verification (replacing fully-manual admin review).
- Referral system for both sides.
- Improved provider analytics (repeat-hire suggestions, applicant quality trends).

**Gate:** Confirm retention/usage numbers justify continued investment before Phase 3.

## Phase 3 — Scale & Monetize Further (after real job volume exists)
- Instant/fast UPI payout with escrow — payment gateway integration + compliance work.
- Expansion to additional cities/campuses.
- Evaluate native mobile apps (React Native/Flutter) if usage data justifies the extra cost
  over the PWA.

---

## Suggested Team & Time Estimate (Phase 1 MVP)
- 1 full-stack developer (or you + 1 AI coding agent, phase-gated as above): ~6-8 weeks
  for Phase 1 working solo with AI-assisted development.
- 1 person handling manual provider verification/outreach in parallel (can be you).
- No dedicated designer required for MVP if using Tailwind + a simple, clean component
  set — polish can come in Phase 2.

## Success Metrics To Track From Day One
- Swipe-right rate (applications per 100 cards viewed).
- Application → approval rate.
- Approval → completed-job rate (this is the real proof the model works end to end).
- Provider repeat-posting rate (do providers come back to post a second job).
- Student trust-score growth over time (proxy for whether the trust system is working).
