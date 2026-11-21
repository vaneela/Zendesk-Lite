# Zendesk Lite

A lightweight ticket management application built with **React, TypeScript, and Vite**. Zendesk Lite provides a simple interface for managing support tickets, tracking their status, assigning agents, and handling ticket creation and updates.

## Features

- **Dashboard**
    - View support tickets organized into four swimlanes: Open, Pending, Solved, and Closed.
    - Filter tickets by All Tickets, My Tickets, and Unassigned.
    - View ticket priority, assignee, and creation date.
    - Horizontally scrollable swimlane layout.

- **Role-based UI**
    - **Admin:** Can view all tickets and create tickets.
    - **User:** Can view all tickets and create tickets.
    - **Agent:** Can view all tickets and filter their assigned tickets using My Tickets.

- **Ticket Management**
    - Create new support tickets.
    - View detailed ticket information.
    - Update ticket status.
    - View ticket description, priority, assignee, and timestamps.

- **API Integration**
    - Fetch tickets with pagination support.
    - Create tickets.
    - Fetch individual ticket details.
    - Update ticket information using PATCH.

- **Data Fetching**
    - TanStack Query for server-state management.
    - Query caching and automatic refetching.
    - Loading and error states.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| TypeScript | Type safety |
| Vite | Development server and build tooling |
| React Router | Client-side routing |
| TanStack Query | Server-state management and API caching |
| Lucide React | Icons |
| CSS | Styling |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Backend API running locally or on a configured server

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd zendesk-lite
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

### Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Redirects to the dashboard |
| `/dashboard` | Ticket management dashboard |
| `/ticket/:ticketId` | Individual ticket details |

## API Endpoints

The frontend communicates with the backend through REST APIs.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Fetch paginated tickets |
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets/:id` | Fetch ticket details |
| PATCH | `/api/tickets/:id` | Update ticket information |
| GET | `/api/agents` | Fetch available agents (planned) |
| GET | `/api/tickets/:id/comments` | Fetch ticket comments (planned) |
| POST | `/api/tickets/:id/comments` | Add a ticket comment (planned) |

### Create Ticket Example

```json
{
  "title": "Unable to login",
  "description": "Login fails with 401 error",
  "priority": "HIGH",
  "assigneeId": 12
}
```

The backend is responsible for generating the ticket ID, timestamps, and initial status.

### Update Ticket Example

```json
{
  "status": "IN_PROGRESS"
}
```

Only the fields being updated need to be included in the PATCH request.

## Project Structure

```text
src/
├── app/
│   └── router.tsx
│
├── components/
│   ├── Header.tsx
│   ├── Header.css
│   ├── TicketCard.tsx
│   ├── TicketCard.css
│   ├── CreateTicketModal.tsx
│   └── CreateTicketModal.css
│
├── features/
│   └── tickets/
│       ├── Dashboard.tsx
│       ├── Dashboard.css
│       ├── TicketDetails.tsx
│       ├── TicketDetails.css
│       └── ticketApi.ts
│
├── data/
│   └── tickets.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

## Role Configuration

Currently, the logged-in user and role are configured in the dashboard as mock data.

```tsx
const currentUser = {
  name: "Alex Morgan",
  role: "Admin" as UserRole,
};
```

Supported roles:

- `Admin`
- `User`
- `Agent`

This can later be replaced with user information from an authentication service.

**Note:** Frontend role-based visibility is for UI behavior only. Actual authorization must also be enforced by the backend.

## Future Enhancements

- Authentication and authorization.
- Dynamic agent assignment.
- Ticket comments and conversation history.
- Server-side pagination, sorting, and filtering.
- Search tickets by title or ID.
- Ticket statistics and dashboard analytics.
- Improved form validation and notifications.
- Automated unit and integration tests.

## License

This project is intended for learning and demonstration purposes.