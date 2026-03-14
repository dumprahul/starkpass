# StarkPass Frontend — Backend Integration Guide

This document describes the **StarkPass** Next.js frontend so a backend can be integrated. The app is currently **client-only** for events and passes (dummy data); all API hooks are marked below.

---

## 1. Project overview

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI, ZKPass Transgate SDK.
- **Run:** `npm install --legacy-peer-deps` then `npm run dev` (dev server: http://localhost:3000).
- **Build:** `npm run build` then `npm run start`.

---

## 2. Routes (pages)

| Route | File | Purpose |
|-------|------|--------|
| `/` | `app/page.tsx` | Landing page (hero, features, problem/solution, pricing, marquee, footer) |
| `/create` | `app/create/page.tsx` | **Create event** form — needs backend POST to create events |
| `/view` | `app/view/page.tsx` | **List events** — needs backend GET to replace dummy list |
| `/view/[eventId]` | `app/view/[eventId]/page.tsx` | **Event detail** + eligibility (ZKPass) + “Get pass” → ticket modal — needs GET by id, and backend for pass issuance |

---

## 3. Data model: Event

All event data matches this TypeScript interface (aligned with your backend struct):

```ts
// lib/types.ts
export interface Event {
  event_id: string
  organizer: string
  name: string
  location: string
  start_time: string   // ISO 8601 preferred, e.g. "2026-06-15T21:00:00"
  age_requirement: number
  max_attendees: number
  ticket_count: number
  active: boolean
}
```

---

## 4. Integration points for backend

### 4.1 Create event (`/create`)

- **File:** `app/create/page.tsx`
- **Current behavior:** Form submit calls `handleSubmit` and only logs the payload: `console.log("Create event:", form)`.
- **Form payload:** Same shape as `Event`; `event_id` can be empty (backend can generate).
- **Backend integration:**
  - Add `POST /api/events` (or your backend URL).
  - On submit: send `form` as JSON body.
  - On success: redirect to `/view` or to the new event page `/view/{event_id}`; on error show a toast or inline error.

Example payload:

```json
{
  "event_id": "",
  "organizer": "StarkZap",
  "name": "Starkzap blitz After Hours",
  "location": "Berlin, Germany",
  "start_time": "2026-06-15T21:00:00",
  "age_requirement": 18,
  "max_attendees": 500,
  "ticket_count": 0,
  "active": true
}
```

---

### 4.2 List events (`/view`)

- **File:** `app/view/page.tsx`
- **Current behavior:** Renders `dummyEvents` from `lib/dummy-events.ts` (array of `Event`).
- **Backend integration:**
  - Replace dummy source with `GET /api/events` (or your list endpoint).
  - Expect response: array of `Event` (same shape as above).
  - Handle loading and error states; keep the existing `EventCard` and grid layout.

---

### 4.3 Event detail (`/view/[eventId]`)

- **File:** `app/view/[eventId]/page.tsx`
- **Current behavior:**
  - Reads `eventId` from URL params.
  - Gets event via `getEventById(eventId)` from `lib/dummy-events.ts`; if not found, shows “Event not found”.
  - Renders event details, capacity bar, and (for organizer `"StarkZap"`) an eligibility button.
- **Backend integration:**
  - Replace `getEventById(eventId)` with `GET /api/events/{eventId}` (or your endpoint).
  - Response: single `Event` (same shape).
  - 404 → keep current “Event not found” UI.

---

### 4.4 ZKPass eligibility (“Prove that you followed Starknet on X”)

- **File:** `app/view/[eventId]/page.tsx` (button) + `lib/zkpass.ts` (logic).
- **Current behavior:**
  - Button only shown when `event.organizer === "StarkZap"`.
  - On click: calls `verify()` from `lib/zkpass.ts`, which uses **ZKPass Transgate** (`@zkpass/transgate-js-sdk`) with:
    - `appid`: `"e9779656-3ba1-4f32-b9c9-ee4747e37f20"`
    - `schemaId`: `"28a65e5b5a194646864003398bda87d8"`
  - `connector.launch(schemaId)` runs the verification flow; on success the frontend shows a toast “You successfully proved you follow Starknet on X.”
- **Backend integration:**
  - Frontend receives the result of `connector.launch(schemaId)` (proof/response). You may need to **send this proof to your backend** (e.g. `POST /api/verify-eligibility` or similar) so the backend can validate it and then allow “Get your pass” or issue a pass.
  - Backend should return success/failure so the frontend can show the right toast and optionally enable “Get your pass”.

---

### 4.5 Get your pass (ticket)

- **File:** `app/view/[eventId]/page.tsx`
- **Current behavior:**
  - “Get your pass” sets local state `hasPass = true` and opens a **modal** with a ticket-style UI (event name, location, date, “zk-verified”, QR placeholder, “Scan at gate”).
  - No API call; no real pass or QR from backend.
- **Backend integration:**
  - Add e.g. `POST /api/events/{eventId}/pass` or `POST /api/passes` with:
    - `event_id` (and optionally user/account from your auth).
    - Optionally the ZKPass verification result if you require proof before issuing.
  - Backend should:
    - Check eligibility (e.g. ZK proof), capacity, and event active.
    - Create a pass/ticket and return a **pass id** and/or **QR payload** (or URL) for the ticket.
  - Frontend: call this API when user clicks “Get your pass”; on success set `hasPass = true` and show the modal; optionally replace the QR placeholder with a real QR (e.g. from backend URL or payload).

---

## 5. Key files reference

| Path | Purpose |
|------|--------|
| `lib/types.ts` | `Event` interface — single source of truth for event shape |
| `lib/dummy-events.ts` | Dummy event list + `getEventById(id)` — replace with API calls |
| `lib/zkpass.ts` | ZKPass `verify()` — keep; optionally send result to backend |
| `app/create/page.tsx` | Create event form — wire submit to POST event |
| `app/view/page.tsx` | Events list — wire to GET events |
| `app/view/[eventId]/page.tsx` | Event detail, eligibility button, pass modal — wire to GET event + pass issuance API |
| `app/layout.tsx` | Root layout, Toaster |
| `app/page.tsx` | Landing (no backend needed) |

---

## 6. Environment / config

- No env vars are used for API base URL yet. Recommended: add e.g. `NEXT_PUBLIC_API_URL` and use it for all `fetch` calls to your backend.
- ZKPass appid/schemaId are hardcoded in `lib/zkpass.ts`; can be moved to env if you have multiple environments.

---

## 7. Suggested API contract (for your backend)

You can align your backend with this; the frontend can be adapted to your actual paths and auth.

| Method | Path | Request | Response |
|--------|------|--------|----------|
| GET | `/api/events` | — | `Event[]` |
| GET | `/api/events/:eventId` | — | `Event` or 404 |
| POST | `/api/events` | `Event` (event_id optional) | `Event` (with generated event_id) or 4xx |
| POST | `/api/events/:eventId/pass` or `/api/passes` | (optional) ZK proof / user id | `{ passId, qrPayload?: string }` or 4xx |
| POST | `/api/verify-eligibility` (optional) | ZK proof from frontend | `{ verified: boolean }` |

---

## 8. Summary checklist for backend dev

1. **Events list:** Provide `GET /api/events` → `Event[]`; frontend replaces `dummyEvents` with this.
2. **Event detail:** Provide `GET /api/events/:eventId` → `Event`; frontend replaces `getEventById()`.
3. **Create event:** Provide `POST /api/events` with body `Event`; frontend sends form data and handles redirect/error.
4. **Eligibility:** Frontend already runs ZKPass; backend can accept proof and return verified/failed so frontend can enable/disable “Get your pass” or show errors.
5. **Pass issuance:** Provide `POST` for pass/ticket; frontend calls it on “Get your pass”, then shows ticket modal (and optionally real QR from response).

Once these endpoints exist, the frontend only needs the corresponding `fetch` calls and error/loading handling in the files listed above.
