# Product Requirements

## 1. User Types

### A. Student (Job Seeker)
Browses jobs, swipes to apply, manages applications, builds a trust score over time.

### B. Provider (Job Poster)
Posts micro-jobs, reviews applicants, approves/rejects, rates students after job completion.

### C. Admin (Internal, you/your team)
Verifies providers, moderates job posts, handles disputes/scam reports, views platform
analytics.

---

## 2. MVP Feature List (Phase 1 — Build First)

### Student-facing
1. **Sign up / login** — phone number + OTP (no email needed; OTP is the norm in India).
2. **Profile setup** — name, college/area, skills (tags), profile photo, age (for legal
   minimum-age checks).
3. **Swipe feed (Home)** — card-based feed of nearby jobs. Swipe right = apply, swipe
   left = skip. Each card shows: job title, pay, hours, distance, provider name, 1-line
   description.
4. **Filters** — location radius, pay range, hours per week, job/skill type. These must
   exist *before* the swipe layer is useful, not as an afterthought.
5. **Job detail view** — tap a card (or after swiping right) to see full details before
   confirming application.
6. **My Applications** — list of applied jobs with status (pending / approved / rejected).
7. **Buddy-apply** — invite a friend (via phone contact or in-app friend) to apply to the
   same job together.
8. **Trust score (view own)** — simple score + history, built from completed jobs and
   provider ratings.
9. **Push notifications** — application approved/rejected, new job matching filters.

### Provider-facing
1. **Sign up / login** — phone OTP, plus business name and basic business detail (this
   is also where "provider verification" starts, even if manual at first).
2. **Post a job** — title, description, pay (amount + type: per hour/per job/per day),
   hours/duration, location (auto-detected or manually pinned), skill tags, number of
   openings, expiry.
3. **Manage listings** — edit, pause, close, or delete posted jobs.
4. **Review applicants** — see everyone who swiped right, view each student's profile and
   trust score, approve or reject.
5. **Mark job complete & rate student** — after the job is done, rate the student
   (punctuality, quality) — this rating feeds the student's trust score.

### Admin (internal, minimal for MVP)
1. **Provider verification queue** — manually approve new providers before their jobs go
   live (this is the main anti-scam control for v1, before automated verification exists).
2. **Job moderation** — flag/remove suspicious postings (e.g. "pay registration fee" scams).
3. **Basic analytics** — number of active jobs, students, applications, completion rate.

---

## 3. Phase 2 Features (Post-MVP, after validating Phase 1)
- Ratings shown publicly on provider's profile too (two-sided trust, not just student-side).
- In-app chat between provider and approved student.
- Automated provider verification (GST/business doc upload + check).
- Richer analytics dashboard for providers (repeat-hire suggestions, etc.).
- Referral system (student invites student, provider invites provider).

## 4. Phase 3 Features (Later, after real job volume exists)
- Instant/fast UPI payout for completed jobs, with escrow — this is **deliberately held
  back** from MVP because it requires payment gateway integration, escrow handling, and
  compliance with RBI payment regulations. Building this too early adds large legal/
  technical overhead before there's real volume to justify it.
- Pan-India expansion beyond the first city/campus cluster.
- Native mobile apps (if the PWA/web app shows strong retention and a dedicated app is
  justified by usage data).

---

## 5. Key User Stories

**Student**
- As a student, I want to see only jobs within walking/short commute distance, so I don't
  waste time on jobs I can't realistically take.
- As a student, I want to apply with one swipe so applying feels as fast as scrolling.
- As a student, I want to invite a friend to apply with me, so it feels safer and we can
  do event jobs together.
- As a student, I want my trust score visible to providers, so a clean job history helps
  me get approved faster next time.

**Provider**
- As a provider, I want to post a job in under 2 minutes, so I don't abandon the flow.
- As a provider, I want to see a student's trust score and history before approving, so I
  can avoid unreliable hires.
- As a provider, I want to rate the student after the job, so the trust system stays
  meaningful for future postings.

**Admin**
- As an admin, I want to approve new providers before their posts go live, so the
  platform doesn't become a vector for job scams from day one.

---

## 6. Explicit Non-Goals for MVP
- No in-app payments/escrow.
- No full-time job listings — micro-jobs (2-4 hrs) only, by design.
- No two-sided swipe (providers do not swipe on students — this is a one-sided model).
- No native apps in v1 — start as a installable web app (PWA) to move faster and cheaper.
