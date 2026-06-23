# Executive Summary

## The Problem
Students in India looking for short, hyperlocal, part-time gigs (a few hours, walking
distance from campus) are poorly served by existing job platforms. Apna, WorkIndia, and
Internshala are built for broader gig/internship matching, not for the "2-4 hour micro-job
near campus" niche. Meanwhile job-posting scams targeting students are common, and trust
between a first-time student worker and a small local business is hard to establish.

## The Solution
JobSwipe is a **one-sided swipe app**: job providers (cafes, shops, event organizers,
small local businesses) post short, paid micro-jobs. Students browse a swipeable feed of
nearby jobs, swipe right to apply, and the provider reviews and approves applicants. The
provider always has final approval — there is no instant auto-match — which keeps the
flow safe and avoids quality/legal issues.

## Why This Can Work
- Real, underserved niche: hyperlocal micro-jobs (2-4 hrs) near campuses.
- Low cold-start cost on the provider side — they post once, the feed does the rest.
- Swipe UX genuinely fits browsing short, similar-shaped job cards quickly — unlike more
  complex decisions, this is a good fit for swipe mechanics.
- Trust-score and buddy-apply features are real differentiators competitors lack, and are
  cheap to build first.

## What Makes This Different From Apna / WorkIndian / Internshala
- Micro-job focus (hours, not weeks) — this shapes the entire posting form and filters.
- Trust score for students built from real job history and employer feedback.
- Buddy-apply — friends apply together, useful for safety and for multi-person jobs like
  event staffing.

## Biggest Open Question To Resolve First
Before investing in a full build: validate, in a single local market, whether swipe-to-apply
meaningfully outperforms a normal scrollable list. This single test (described in
`08_Development_Roadmap.md`, Phase 0) determines whether swipe is a real UX advantage or
just a stylistic choice.

## Recommended MVP Shape
- Single city or single campus cluster launch.
- Real, verified local job providers only (cafes, small retail, event organizers).
- Swipe feed + filters + trust score + buddy-apply in the MVP.
- No in-app payments in v1 — payment happens directly between provider and student, as is
  already standard for these jobs today.
- Commission-per-placement or flat per-post fee charged to providers. Students pay nothing.
