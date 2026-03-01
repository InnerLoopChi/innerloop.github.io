# InnerLoop CHANGELOG

## 2026-03-01 — Critical Fix: Posts Disappearing on New Post

### Root Cause
`serverTimestamp()` writes `null` locally before server resolves. `orderBy('postTime', 'desc')` excludes docs with null values. Result: creating a new post caused ALL posts to vanish from the feed.

### Fix
- **CreatePost**: `Timestamp.now()` replaces `serverTimestamp()` — instant non-null value
- **All queries**: Single `orderBy('postTime', 'desc')`, no `where` clauses
- **All filtering**: Done client-side (isInnerOnly, taskCapacity, authorID)

### Rule Going Forward
All Firestore queries MUST use only `orderBy('postTime', 'desc')`. All filtering must be done client-side with `.filter()`. Compound queries (`where + orderBy` on different fields) require composite indexes which silently fail without manual setup.

## 2026-03-01 — Schedule System (Single Day / Date Range / Ongoing)

Stored in `post.schedule` object with: type, startDate, endDate, startTime, endTime, ongoing.

## 2026-03-01 — Requirements + Applicant Management

Inner adds requirements → Looper applies with checklist → Inner accepts/rejects in Tasks tab.
