
import type {
    ApiTicket,
    ApiAssignee,
} from "./ticketApi";

// Mock agents
export const mockAgents: ApiAssignee[] = [
    { id: 12, name: "John" },
    { id: 13, name: "Alex Morgan" },
    { id: 14, name: "Sarah Wilson" },
    { id: 15, name: "David Miller" },
];

// Mock tickets
const initialTickets: ApiTicket[] = [
    {
        id: 101,
        title: "Unable to login to account",
        description:
            "Login fails with a 401 error when trying to access the account.",
        status: "OPEN",
        priority: "URGENT",
        assignee: mockAgents[1],
        createdAt: "2026-11-21T10:00:00",
        updatedAt: "2026-11-21T10:00:00",
    },
    {
        id: 102,
        title: "Payment not processed",
        description:
            "Customer completed the payment but the transaction is still showing as pending.",
        status: "OPEN",
        priority: "HIGH",
        assignee: mockAgents[0],
        createdAt: "2026-11-21T09:30:00",
        updatedAt: "2026-11-21T09:30:00",
    },
    {
        id: 103,
        title: "Dashboard loading slowly",
        description:
            "Dashboard takes more than 15 seconds to load.",
        status: "OPEN",
        priority: "MEDIUM",
        assignee: null,
        createdAt: "2026-11-21T09:00:00",
        updatedAt: "2026-11-21T09:00:00",
    },
    {
        id: 104,
        title: "Unable to update billing address",
        description:
            "The billing address form is not saving the updated information.",
        status: "PENDING",
        priority: "LOW",
        assignee: mockAgents[1],
        createdAt: "2026-11-20T15:00:00",
        updatedAt: "2026-11-20T15:00:00",
    },
    {
        id: 105,
        title: "API integration issue",
        description:
            "Third-party API integration returns intermittent 500 errors.",
        status: "PENDING",
        priority: "HIGH",
        assignee: mockAgents[2],
        createdAt: "2026-11-20T14:00:00",
        updatedAt: "2026-11-20T14:00:00",
    },
    {
        id: 106,
        title: "Password reset email not received",
        description:
            "Customer is not receiving password reset emails.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: mockAgents[0],
        createdAt: "2026-11-20T11:00:00",
        updatedAt: "2026-11-20T12:00:00",
    },
    {
        id: 107,
        title: "Profile image not updating",
        description:
            "Uploaded profile image does not appear after saving.",
        status: "IN_PROGRESS",
        priority: "LOW",
        assignee: mockAgents[1],
        createdAt: "2026-11-19T16:00:00",
        updatedAt: "2026-11-20T10:00:00",
    },
    {
        id: 108,
        title: "Notification preferences",
        description:
            "Customer wants to disable promotional notifications.",
        status: "SOLVED",
        priority: "LOW",
        assignee: mockAgents[2],
        createdAt: "2026-11-19T10:00:00",
        updatedAt: "2026-11-20T09:00:00",
    },
    {
        id: 109,
        title: "Unable to download invoice",
        description:
            "Invoice download returns an empty PDF file.",
        status: "SOLVED",
        priority: "HIGH",
        assignee: mockAgents[3],
        createdAt: "2026-11-18T12:00:00",
        updatedAt: "2026-11-19T12:00:00",
    },
    {
        id: 110,
        title: "Account verification issue",
        description:
            "Verification link has expired and cannot be regenerated.",
        status: "CLOSED",
        priority: "MEDIUM",
        assignee: mockAgents[0],
        createdAt: "2026-11-17T10:00:00",
        updatedAt: "2026-11-18T10:00:00",
    },
    {
        id: 111,
        title: "Incorrect subscription amount",
        description:
            "The subscription renewal amount is different from the expected amount.",
        status: "OPEN",
        priority: "URGENT",
        assignee: mockAgents[2],
        createdAt: "2026-11-21T08:00:00",
        updatedAt: "2026-11-21T08:00:00",
    },
    {
        id: 112,
        title: "Unable to change email address",
        description:
            "Email update fails during account verification.",
        status: "PENDING",
        priority: "MEDIUM",
        assignee: null,
        createdAt: "2026-11-20T08:00:00",
        updatedAt: "2026-11-20T08:00:00",
    },
];

// Shared in-memory mock database.
// Mutations here are visible to all API functions.
export const mockDatabase = {
    tickets: initialTickets,
    nextTicketId: 113,
};
