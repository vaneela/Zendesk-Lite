
import type {
    ApiTicketListItem,
    ApiAssignee,
} from "./ticketApi";

// Mock agents
export const mockAgents: ApiAssignee[] = [
    {
        id: 12,
        name: "John",
        email: "john@support.local",
        createdAt: "2026-11-20T08:00:00.000Z",
    },
    {
        id: 13,
        name: "Alex Morgan",
        email: "alex@support.local",
        createdAt: "2026-11-20T08:00:00.000Z",
    },
    {
        id: 14,
        name: "Sarah Wilson",
        email: "sarah@support.local",
        createdAt: "2026-11-20T08:00:00.000Z",
    },
    {
        id: 15,
        name: "David Miller",
        email: "david@support.local",
        createdAt: "2026-11-20T08:00:00.000Z",
    },
];

// Mock tickets
const initialTickets: ApiTicketListItem[] = [
    {
        id: 101,
        subject: "Unable to login to account",
        requesterName: "John Doe",
        requesterEmail: "john@example.com",
        status: "OPEN",
        assignee: mockAgents[1],
        createdAt: "2026-11-21T10:00:00.000Z",
        updatedAt: "2026-11-21T10:00:00.000Z",
    },
    {
        id: 102,
        subject: "Payment not processed",
        requesterName: "Emma Wilson",
        requesterEmail: "emma@example.com",
        status: "OPEN",
        assignee: mockAgents[0],
        createdAt: "2026-11-21T09:30:00.000Z",
        updatedAt: "2026-11-21T09:30:00.000Z",
    },
    {
        id: 103,
        subject: "Dashboard loading slowly",
        requesterName: "Michael Brown",
        requesterEmail: "michael@example.com",
        status: "OPEN",
        assignee: null,
        createdAt: "2026-11-21T09:00:00.000Z",
        updatedAt: "2026-11-21T09:00:00.000Z",
    },
    {
        id: 104,
        subject: "Unable to update billing address",
        requesterName: "Sophia Davis",
        requesterEmail: "sophia@example.com",
        status: "PENDING",
        assignee: mockAgents[1],
        createdAt: "2026-11-20T15:00:00.000Z",
        updatedAt: "2026-11-20T15:00:00.000Z",
    },
    {
        id: 105,
        subject: "API integration issue",
        requesterName: "James Taylor",
        requesterEmail: "james@example.com",
        status: "PENDING",
        assignee: mockAgents[2],
        createdAt: "2026-11-20T14:00:00.000Z",
        updatedAt: "2026-11-20T14:00:00.000Z",
    },
    {
        id: 106,
        subject: "Password reset email not received",
        requesterName: "Olivia Martin",
        requesterEmail: "olivia@example.com",
        status: "PENDING",
        assignee: mockAgents[0],
        createdAt: "2026-11-20T11:00:00.000Z",
        updatedAt: "2026-11-20T12:00:00.000Z",
    },
    {
        id: 107,
        subject: "Profile image not updating",
        requesterName: "William Garcia",
        requesterEmail: "william@example.com",
        status: "PENDING",
        assignee: mockAgents[1],
        createdAt: "2026-11-19T16:00:00.000Z",
        updatedAt: "2026-11-20T10:00:00.000Z",
    },
    {
        id: 108,
        subject: "Notification preferences",
        requesterName: "Ava Rodriguez",
        requesterEmail: "ava@example.com",
        status: "SOLVED",
        assignee: mockAgents[2],
        createdAt: "2026-11-19T10:00:00.000Z",
        updatedAt: "2026-11-20T09:00:00.000Z",
    },
    {
        id: 109,
        subject: "Unable to download invoice",
        requesterName: "Noah Martinez",
        requesterEmail: "noah@example.com",
        status: "SOLVED",
        assignee: mockAgents[3],
        createdAt: "2026-11-18T12:00:00.000Z",
        updatedAt: "2026-11-19T12:00:00.000Z",
    },
    {
        id: 110,
        subject: "Account verification issue",
        requesterName: "Isabella Anderson",
        requesterEmail: "isabella@example.com",
        status: "CLOSED",
        assignee: mockAgents[0],
        createdAt: "2026-11-17T10:00:00.000Z",
        updatedAt: "2026-11-18T10:00:00.000Z",
    },
    {
        id: 111,
        subject: "Incorrect subscription amount",
        requesterName: "Lucas Thomas",
        requesterEmail: "lucas@example.com",
        status: "OPEN",
        assignee: mockAgents[2],
        createdAt: "2026-11-21T08:00:00.000Z",
        updatedAt: "2026-11-21T08:00:00.000Z",
    },
    {
        id: 112,
        subject: "Unable to change email address",
        requesterName: "Mia Jackson",
        requesterEmail: "mia@example.com",
        status: "PENDING",
        assignee: null,
        createdAt: "2026-11-20T08:00:00.000Z",
        updatedAt: "2026-11-20T08:00:00.000Z",
    },
];

// Shared in-memory mock database.
// Mutations here are visible to all API functions.
export const mockDatabase = {
    tickets: initialTickets,
    nextTicketId: 113,
};
