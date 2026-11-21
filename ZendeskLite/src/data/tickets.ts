
export type TicketStatus =
| "Open"
| "Pending"
| "Solved"
| "Closed";

export type TicketPriority =
| "Low"
| "Medium"
| "High"
| "Urgent";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignee: string;
    createdAt: string;
}

export const tickets: Ticket[] = [
    {
        id: "TKT-1001",
        title: "Unable to login to account",
        description:
            "Customer receives an authentication error while trying to sign in.",
        status: "Open",
        priority: "Urgent",
        assignee: "Alex Morgan",
        createdAt: "10 min ago",
    },
    {
        id: "TKT-1002",
        title: "Payment not processed",
        description:
            "Payment fails during checkout despite a successful bank transaction.",
        status: "Open",
        priority: "High",
        assignee: "Sarah Wilson",
        createdAt: "25 min ago",
    },
    {
        id: "TKT-1003",
        title: "Dashboard loading slowly",
        description:
            "The analytics dashboard takes more than 15 seconds to load.",
        status: "Open",
        priority: "Medium",
        assignee: "Unassigned",
        createdAt: "1 hour ago",
    },
    {
        id: "TKT-1004",
        title: "Update billing address",
        description:
            "Customer wants to change the billing address on their account.",
        status: "Pending",
        priority: "Low",
        assignee: "Alex Morgan",
        createdAt: "2 hours ago",
    },
    {
        id: "TKT-1005",
        title: "API integration issue",
        description:
            "Third-party API integration returns intermittent 500 errors.",
        status: "Pending",
        priority: "High",
        assignee: "John Carter",
        createdAt: "3 hours ago",
    },
    {
        id: "TKT-1006",
        title: "Password reset email",
        description:
            "Customer is not receiving password reset emails.",
        status: "Solved",
        priority: "Medium",
        assignee: "Sarah Wilson",
        createdAt: "Yesterday",
    },
    {
        id: "TKT-1007",
        title: "Profile image not updating",
        description:
            "Profile image upload issue resolved after clearing cached data.",
        status: "Solved",
        priority: "Low",
        assignee: "Alex Morgan",
        createdAt: "Yesterday",
    },
    {
        id: "TKT-1008",
        title: "Notification preferences",
        description:
            "Customer requested changes to notification preferences.",
        status: "Closed",
        priority: "Low",
        assignee: "John Carter",
        createdAt: "2 days ago",
    },
];
