# Risk Register

Every risk below traces back to the original concept doc, with a concrete mitigation
mapped to a specific feature or process in this plan.

| # | Risk | Source | Mitigation in This Plan |
|---|---|---|---|
| 1 | Existing competitors (Apna, WorkIndia, Internshala) occupy adjacent space | Concept doc | Narrow positioning on micro-jobs (2-4 hrs) + trust score + buddy-apply, not a general job board — see `09_Monetization_And_GTM.md` competitive positioning |
| 2 | Job-posting scams targeting students (fake jobs, "pay a fee first" schemes) | Concept doc | Manual provider verification queue before any job goes live (Phase 1 MVP), `is_verified` flag on `provider_profiles`, plus a reports/moderation system |
| 3 | Swipe feed becomes noise without good filtering | Concept doc | Filters (radius, pay, hours, skill tags) are explicitly part of MVP scope, built alongside the swipe feed, not after it |
| 4 | Cold-start: need real jobs and real students simultaneously, in the same area | Concept doc | Phase 0 validation + Stage 1 GTM both deliberately start in a single campus/area, with manual provider recruitment before any public launch |
| 5 | Age/labor law considerations for part-time student work | Concept doc | Age field captured at signup; explicit action item to get a one-time legal check before launch (see Technical Architecture, Security & Compliance Notes) |
| 6 | Swipe mechanic might be a stylistic choice, not a real UX advantage | Concept doc | Phase 0 is built specifically to test swipe vs. plain list before committing further build time |
| 7 | Payment/payout complexity (UPI, escrow, RBI compliance) | Concept doc | Deliberately deferred to Phase 3, after real job volume justifies the legal/technical investment; MVP has no in-app payments |
| 8 | Provider trust in an unverified marketplace (will they post real jobs?) | Derived | Manual, in-person/WhatsApp-based provider recruitment in Stage 1 GTM builds trust faster than a cold self-serve signup flow would |
| 9 | Low initial job volume makes the feed feel empty, hurting first impressions | Derived | Single campus/area pilot sized to actual recruited job volume, rather than a broad launch that exposes an empty feed to many users at once |
| 10 | Student safety concerns (parents, students themselves) for in-person gigs | Concept doc | Buddy-apply feature, trust score visible to students, provider verification all combine to address safety, not just convenience |
| 11 | Manual processes (verification, moderation) won't scale past one city | Derived | Explicitly scoped as a Phase 1/2 limitation; Phase 2 includes moving to automated/document-based provider verification before multi-city expansion |

## Ongoing Risk Monitoring (Post-Launch)
- Track report volume and resolution time as a leading indicator of trust/safety issues.
- Track provider repeat-posting rate — a drop here often signals either trust issues or
  poor-quality student applicants getting through.
- Revisit the minimum-age/labor-law check whenever expanding to a new state, since rules
  can vary.
