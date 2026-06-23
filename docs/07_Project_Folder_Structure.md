# Project Folder Structure

This is the recommended codebase layout for the Next.js (App Router) + TypeScript +
Prisma stack described in the Technical Architecture doc. A matching empty skeleton of
these folders/files is included in `project-structure/` in this package, ready to drop
into a new repo.

```
jobswipe/
├── PROJECT_BRIEF.md              # Context file for AI coding agent (Antigravity-style),
│                                  # phase-gated scope, confirmed before each phase begins
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js                # next-pwa config lives here
├── prisma/
│   ├── schema.prisma              # Full schema from 04_Database_Schema.md
│   └── migrations/
├── public/
│   ├── icons/                     # PWA install icons
│   └── manifest.json               # PWA manifest
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── otp/page.tsx
│   │   ├── (student)/
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── home/page.tsx               # Swipe feed
│   │   │   ├── job/[id]/page.tsx           # Job detail
│   │   │   ├── applications/page.tsx
│   │   │   ├── trust-score/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── (provider)/
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── post-job/page.tsx
│   │   │   ├── listing/[id]/page.tsx
│   │   │   ├── listing/[id]/applicants/page.tsx
│   │   │   └── listing/[id]/complete/page.tsx
│   │   ├── (admin)/
│   │   │   ├── providers/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── request-otp/route.ts
│   │   │   │   ├── verify-otp/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── students/
│   │   │   │   └── profile/route.ts
│   │   │   ├── providers/
│   │   │   │   └── profile/route.ts
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts
│   │   │   │   ├── feed/route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── swipes/route.ts
│   │   │   ├── applications/
│   │   │   │   ├── mine/route.ts
│   │   │   │   ├── job/[job_id]/route.ts
│   │   │   │   └── [id]/decision/route.ts
│   │   │   ├── buddy-groups/route.ts
│   │   │   ├── ratings/route.ts
│   │   │   ├── reports/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── providers/pending/route.ts
│   │   │   │   ├── reports/route.ts
│   │   │   │   └── analytics/route.ts
│   │   │   └── notifications/
│   │   │       ├── register-device/route.ts
│   │   │       └── mine/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── swipe/
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── SwipeDeck.tsx
│   │   │   └── FiltersPanel.tsx
│   │   ├── jobs/
│   │   │   ├── JobDetailCard.tsx
│   │   │   └── PostJobForm.tsx
│   │   ├── applications/
│   │   │   └── ApplicantRow.tsx
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   ├── BottomTabBar.tsx
│   │   │   └── TrustScoreBadge.tsx
│   │   └── ui/                       # Buttons, inputs, modals (small reusable pieces)
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── auth.ts                   # Session/token helpers
│   │   ├── otp.ts                    # MSG91/Twilio integration
│   │   ├── push.ts                   # OneSignal/FCM integration
│   │   ├── geo.ts                    # Distance calculation helpers
│   │   └── trustScore.ts             # Trust score calculation logic
│   ├── hooks/
│   │   ├── useSwipeFeed.ts
│   │   └── useAuth.ts
│   └── types/
│       └── index.ts                  # Shared TypeScript types/interfaces
└── tests/
    ├── api/
    └── components/
```

## Notes on Structure
- The `(student)`, `(provider)`, `(admin)` route groups keep each user type's screens
  cleanly separated while sharing the same Next.js app and auth system.
- `lib/trustScore.ts` is isolated on purpose — it's the most important, most-changed piece
  of business logic and should not be buried inside a route handler.
- `PROJECT_BRIEF.md` at the root is meant to carry the phase-gated scope/context for an AI
  coding agent, the same pattern already used in your other web build — each phase's exact
  scope gets written there and confirmed before the agent starts it.
