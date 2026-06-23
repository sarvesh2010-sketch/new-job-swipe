# UX Screens & User Flow

## Student Journey

1. **Splash / Welcome screen** — short value prop ("Find part-time jobs near you, swipe
   to apply"), Login/Sign up button.
2. **Phone number entry → OTP verification.**
3. **Profile setup (first-time only)** — name, age, college/area, skill tags
   (multi-select chips), profile photo upload.
4. **Home — Swipe Feed** *(core screen)*
   - Full-screen stacked cards, one job per card.
   - Card shows: job title, provider name, pay (₹ amount + per hour/day/job), duration in
     hours, distance from student, 1-line description, skill tags as small chips.
   - Swipe right = apply (with a brief confirm-toast, undo option for 3 seconds).
   - Swipe left = skip.
   - Tap card = open full Job Detail screen before deciding.
   - Filter icon (top bar) opens the Filters panel.
5. **Filters panel** — radius slider, pay range slider, max hours slider, skill-tag
   multi-select. Applies immediately to the feed, no separate "search" step.
6. **Job Detail screen** — full description, exact location on a small map, provider name
   and (once available) provider rating, full pay/hours breakdown, "Apply" and
   "Invite a buddy to apply too" buttons.
7. **Buddy invite sheet** — pick from phone contacts who are also app users (or send an
   invite link), creates a `buddy_group` tied to that application.
8. **My Applications screen** — tabs or filter chips: Pending / Approved / Rejected /
   Completed. Each row shows job title, provider, status, and date.
9. **Trust score screen** — current score, short explanation of how it's calculated,
   history of completed jobs and the ratings received for each.
10. **Notifications screen** — application status changes, new matching jobs.
11. **Profile/Settings screen** — edit profile, logout.

## Provider Journey

1. **Splash / Welcome screen** — value prop for providers ("Post a quick job, get
   reliable students in minutes").
2. **Phone number entry → OTP verification.**
3. **Business profile setup (first-time only)** — business name, type, location (auto-pin
   from GPS, adjustable), submitted for admin verification (shows "Pending verification"
   banner until approved).
4. **Provider Home / Dashboard** — list of own active job posts, quick stats (views,
   swipe-right count, pending applicants per job), "+ Post a Job" button.
5. **Post a Job form** — title, description, pay amount + type, duration (hours),
   skill tags, number of openings, expiry date. Designed to take under 2 minutes.
6. **Manage Listing screen** — edit/pause/close a specific job, see applicant count.
7. **Applicant Review screen** — swipeable or scrollable list of applicants for one job;
   each row shows student name, photo, trust score, skill tags, and Approve/Reject
   buttons. Buddy-group applications are shown grouped together, not as separate rows.
8. **Mark Complete & Rate screen** — appears once a job's expiry/duration has passed for
   an approved student; simple 1-5 star punctuality + quality rating, optional comment.

## Admin Journey (internal tool, can be minimal/un-styled for MVP)
1. **Provider verification queue** — list of pending providers, view submitted business
   info, Approve/Reject.
2. **Reports queue** — list of open scam/abuse reports, with context, mark
   reviewed/action-taken.
3. **Analytics dashboard** — active jobs, active students, applications, completion rate,
   swipe-right rate (the key metric for validating the swipe mechanic itself).

## Core Flow Diagram (described)

```
STUDENT                                         PROVIDER
--------                                         --------
Sign up (OTP) → Profile setup                    Sign up (OTP) → Business profile
       │                                                │
       ▼                                                ▼
  Swipe Feed  ←──── filtered by ────►            Post a Job
  (Home)            location/pay/hours/skills          │
       │                                                ▼
  Swipe RIGHT on a job                          Job appears in feed
       │                                                │
       ▼                                                ▼
  Application created (PENDING)  ─────────────► Applicant Review screen
       │                                                │
       │                                         Approve / Reject
       ▼                                                │
  Status updates in "My Applications"  ◄────────────────┘
       │
  (if approved, job happens in real life)
       │
       ▼
  Provider marks job COMPLETE ─────────────► Rating submitted
       │                                                │
       ▼                                                ▼
  Student's trust_score updates    Provider's record of reliable students grows
```
