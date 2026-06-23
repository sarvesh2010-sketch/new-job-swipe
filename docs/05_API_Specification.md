# API Specification (REST, Next.js API Routes)

All endpoints prefixed with `/api`. Auth via session token (issued after OTP verification),
sent as `Authorization: Bearer <token>`.

## Auth
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/request-otp` | Send OTP to phone number |
| POST | `/api/auth/verify-otp` | Verify OTP, create session, return token |
| POST | `/api/auth/logout` | Invalidate session |

## Student Profile
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/students/profile` | Create student profile after signup |
| GET | `/api/students/profile` | Get own profile (incl. trust_score) |
| PUT | `/api/students/profile` | Update profile (skills, photo, college/area) |
| GET | `/api/students/:id/public` | Public view of a student (for provider review) |

## Provider Profile
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/providers/profile` | Create provider profile, triggers admin verification queue |
| GET | `/api/providers/profile` | Get own profile + verification status |
| PUT | `/api/providers/profile` | Update business info |

## Jobs
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/jobs` | Create a job post (provider only, requires verified provider) |
| GET | `/api/jobs/feed` | Get swipeable feed for the logged-in student — params: `lat`, `lng`, `radius`, `pay_min`, `pay_max`, `hours_max`, `skill_tags` |
| GET | `/api/jobs/:id` | Get full job detail |
| PUT | `/api/jobs/:id` | Edit job (provider, owner only) |
| PATCH | `/api/jobs/:id/status` | Pause/close/reopen a job |
| GET | `/api/jobs/provider/mine` | List all jobs posted by the logged-in provider |

## Swipes & Applications
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/swipes` | Record a swipe (`job_id`, `direction`). If `RIGHT`, auto-creates an `application` |
| GET | `/api/applications/mine` | Student: list of own applications with status |
| GET | `/api/applications/job/:job_id` | Provider: list of applicants for a specific job |
| PATCH | `/api/applications/:id/decision` | Provider approves/rejects an application |
| PATCH | `/api/applications/:id/complete` | Provider marks an approved application as job-completed |

## Buddy-Apply
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/buddy-groups` | Create a buddy group for a job (`job_id`, `member_student_ids`) |
| GET | `/api/buddy-groups/job/:job_id` | List buddy groups applied to a job (provider view) |

## Ratings
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/ratings` | Provider rates a student after job completion |
| GET | `/api/ratings/student/:id` | Get a student's rating history (feeds trust_score) |

## Reports / Moderation
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/reports` | Report a job or user (scam, abuse, etc.) |
| GET | `/api/admin/reports` | Admin: list open reports |
| PATCH | `/api/admin/reports/:id` | Admin: resolve a report |

## Admin
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/providers/pending` | List providers awaiting verification |
| PATCH | `/api/admin/providers/:id/verify` | Approve/reject a provider |
| GET | `/api/admin/analytics` | Platform metrics: active jobs, students, applications, completion rate, swipe-right rate |

## Notifications
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/notifications/register-device` | Register device token for push notifications |
| GET | `/api/notifications/mine` | List in-app notifications |

---

### Key Business Logic Notes
- `POST /api/jobs/feed` excludes jobs the student has already swiped on, and only returns
  jobs from `is_verified = true` providers.
- `POST /api/swipes` with `direction = RIGHT` should be a single transaction that also
  creates the `applications` row, to avoid duplicate/partial states.
- `PATCH /api/applications/:id/complete` is the trigger point that unlocks
  `POST /api/ratings` for that job/student pair.
