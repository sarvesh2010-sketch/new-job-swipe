# Database Schema (PostgreSQL via Prisma)

Below is the MVP schema in text-ERD form. Field types are illustrative (Prisma syntax
style) — adjust precision as needed during implementation.

## users
Core identity table for both students and providers.
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| phone | String, unique | Used for OTP login |
| role | Enum: STUDENT, PROVIDER, ADMIN | |
| name | String | |
| created_at | DateTime | |
| is_verified | Boolean | True once OTP-verified |

## student_profiles
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK -> users.id) | |
| college_or_area | String | |
| age | Int | For minimum-age checks |
| skills | String[] | Tags: "serving", "data entry", "event staff", etc. |
| photo_url | String | |
| trust_score | Float, default 0 | Computed/aggregated from ratings |
| created_at | DateTime | |

## provider_profiles
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK -> users.id) | |
| business_name | String | |
| business_type | String | Cafe, retail, event organizer, etc. |
| location_lat | Float | |
| location_lng | Float | |
| address | String | |
| is_verified | Boolean, default false | Set true by admin after manual check |
| created_at | DateTime | |

## jobs
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| provider_id | UUID (FK -> provider_profiles.id) | |
| title | String | |
| description | Text | |
| pay_amount | Decimal | |
| pay_type | Enum: PER_HOUR, PER_JOB, PER_DAY | |
| duration_hours | Float | E.g. 2, 3, 4 — core to the micro-job niche |
| location_lat | Float | |
| location_lng | Float | |
| skill_tags | String[] | Used for filter matching |
| openings | Int | Number of students needed |
| status | Enum: DRAFT, ACTIVE, PAUSED, CLOSED, EXPIRED | |
| expires_at | DateTime | |
| created_at | DateTime | |

## swipes
Logs every swipe for analytics (this is the data that answers "does swipe beat a list").
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| student_id | UUID (FK -> student_profiles.id) | |
| job_id | UUID (FK -> jobs.id) | |
| direction | Enum: RIGHT, LEFT | |
| created_at | DateTime | |

## applications
Created automatically when a student swipes right.
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| job_id | UUID (FK -> jobs.id) | |
| student_id | UUID (FK -> student_profiles.id) | |
| status | Enum: PENDING, APPROVED, REJECTED, COMPLETED | |
| applied_at | DateTime | |
| decided_at | DateTime, nullable | |

## buddy_groups
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| job_id | UUID (FK -> jobs.id) | |
| leader_student_id | UUID (FK -> student_profiles.id) | |
| member_student_ids | UUID[] | Friends invited to apply together |
| created_at | DateTime | |

## ratings
Created by provider after marking a job complete; feeds student's trust_score.
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| job_id | UUID (FK -> jobs.id) | |
| rated_student_id | UUID (FK -> student_profiles.id) | |
| rated_by_provider_id | UUID (FK -> provider_profiles.id) | |
| punctuality_score | Int (1-5) | |
| quality_score | Int (1-5) | |
| comment | Text, nullable | |
| created_at | DateTime | |

## reports (anti-scam / moderation)
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| reported_job_id | UUID, nullable | |
| reported_user_id | UUID, nullable | |
| reported_by_user_id | UUID | |
| reason | Text | |
| status | Enum: OPEN, REVIEWED, ACTION_TAKEN | |
| created_at | DateTime | |

## Relationships Summary
- One `user` → one `student_profiles` OR one `provider_profiles` (role-dependent).
- One `provider_profiles` → many `jobs`.
- One `jobs` → many `swipes`, many `applications`, optional `buddy_groups`, one `ratings`
  per completed application.
- `trust_score` on `student_profiles` is a derived/cached value, recalculated whenever a
  new `ratings` row is added for that student.
