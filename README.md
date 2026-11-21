# Support Backend (Spring Boot + SQLite)

## Run
```
mvn spring-boot:run          # http://localhost:8080, creates ./support.db
mvn test                     # end-to-end integration tests (temp SQLite file)
```
Env overrides: `SUPPORT_DB_PATH` (SQLite file path), `CORS_ORIGINS` (default `http://localhost:5173`).
Three agents are seeded on first start.

## Status lifecycle
`OPEN -> PENDING -> SOLVED -> CLOSED`

| From    | Allowed to       |
|---------|------------------|
| OPEN    | PENDING, SOLVED  |
| PENDING | OPEN, SOLVED     |
| SOLVED  | OPEN, CLOSED     |
| CLOSED  | (terminal)       |

- OPEN: needs agent action. PENDING: waiting on requester. SOLVED: resolved but can be reopened. CLOSED: read-only.
- A requester reply on a PENDING/SOLVED ticket automatically reopens it (OPEN).
- Status changes and (re)assignments are appended to the thread as `SYSTEM` messages so they are visible in the UI.
- Closed tickets reject new messages and assignment (409).

## API (base `/api`)
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/agents` | | list agents |
| POST | `/agents` | `{name, email}` | 201 |
| GET | `/agents/{id}` | | |
| GET | `/tickets?status=&assigneeId=&unassigned=&q=` | | summaries, newest activity first |
| POST | `/tickets` | `{subject, description, requesterName, requesterEmail, assigneeId?}` | 201, description becomes first message |
| GET | `/tickets/{id}` | | detail incl. `allowedTransitions` and `messages` |
| PUT | `/tickets/{id}/assignee` | `{agentId}` (`null` = unassign) | assign / reassign |
| PATCH | `/tickets/{id}/status` | `{status, agentId?}` | 409 on invalid transition |
| GET | `/tickets/{id}/messages` | | thread in chronological order |
| POST | `/tickets/{id}/messages` | `{authorType: REQUESTER\|AGENT, agentId?, body}` | 201, `agentId` required for AGENT |
| GET | `/statuses` | | statuses with allowed transitions |

Errors: `{timestamp, status, error, message, fieldErrors?}` with 400 / 404 / 409.

## Vite proxy (optional, instead of CORS)
```js
// vite.config.js
server: { proxy: { '/api': 'http://localhost:8080' } }
```
