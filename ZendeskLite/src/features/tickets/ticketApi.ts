
import { mockAgents, mockDatabase } from "./mockData";

// ==================================================
// API TYPES
// ==================================================

export type ApiTicketStatus =
    | "OPEN"
    | "PENDING"
    | "SOLVED"
    | "CLOSED";

export type ApiTicketPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

export interface ApiAssignee {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

// GET /api/tickets
export interface ApiTicketSummary {
    id: number;
    subject: string;
    requesterName: string;
    requesterEmail: string;
    status: ApiTicketStatus;
    assignee: ApiAssignee | null;
    createdAt: string;
    updatedAt: string;
}

// GET /api/tickets/:id
// POST /api/tickets
// Response: TicketDetailDto
export interface ApiTicketDetail {
    id: number;
    title: string;
    description: string;
    status: ApiTicketStatus;
    priority: ApiTicketPriority;
    assignee: ApiAssignee | null;
    createdAt: string;
    updatedAt: string;
}

// POST /api/tickets
// Request: CreateTicket
export interface CreateTicketPayload {
    title: string;
    description: string;
    priority: ApiTicketPriority;
    assigneeId?: number;
}

// PUT /api/tickets/:id/assignee
// Request: AssignTicket
export interface AssignTicketPayload {
    agentId: number | null;
}

// PATCH /api/tickets/:id/status
// Request: UpdateStatus
export interface UpdateStatusPayload {
    status: ApiTicketStatus;
    agentId?: number;
}

// GET /api/tickets
// Query parameters
export interface TicketFilters {
    status?: ApiTicketStatus;
    assigneeId?: number;
    unassigned?: boolean;
    q?: string;
}

// GET /api/tickets/:id/messages
// POST /api/tickets/:id/messages
// DTO fields need confirmation from MessageDto.java and AddMessage.java.
export type ApiMessage = Record<string, unknown>;
export type AddMessagePayload = Record<string, unknown>;

// GET /api/statuses
export interface ApiStatusInfo {
    status: ApiTicketStatus;
    allowedTransitions: ApiTicketStatus[];
}

// ==================================================
// CONFIGURATION
// ==================================================

const USE_MOCK_API = true;
const BASE_URL = "http://localhost:8080";
const MOCK_DELAY = 400;

// ==================================================
// MOCK DATA HELPERS
// ==================================================

function delay(ms = MOCK_DELAY): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function findAssignee(id: number): ApiAssignee {
    const agent = mockAgents.find((item) => item.id === id);

    if (!agent) {
        throw new Error(`Agent with ID ${id} not found`);
    }

    return { ...agent };
}

function findTicket(id: string | number): ApiTicketSummary {
    const ticket = mockDatabase.tickets.find(
        (item) => item.id === Number(id)
    );

    if (!ticket) {
        throw new Error(`404: Ticket with ID ${id} not found`);
    }

    return ticket;
}

// The list endpoint doesn't return description or priority.
// These defaults are only for mock detail responses.
function toTicketDetail(ticket: ApiTicketSummary): ApiTicketDetail {
    return {
        id: ticket.id,
        title: ticket.subject,
        description: `Requested by ${ticket.requesterName} (${ticket.requesterEmail})`,
        status: ticket.status,
        priority: "MEDIUM",
        assignee: ticket.assignee ? { ...ticket.assignee } : null,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
    };
}

// ==================================================
// HTTP HELPERS
// ==================================================

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const errorData: { message?: string } = await response.json();
            message = errorData.message ?? message;
        } catch {
            // Use the default error message.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

function jsonHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
    };
}

// ==================================================
// GET /api/tickets
// Returns TicketSummaryDto[]
// ==================================================

export async function getTickets(
    filters: TicketFilters = {}
): Promise<ApiTicketSummary[]> {
    if (USE_MOCK_API) {
        await delay();

        let tickets = [...mockDatabase.tickets];

        if (filters.status) {
            tickets = tickets.filter(
                (ticket) => ticket.status === filters.status
            );
        }

        if (filters.assigneeId !== undefined) {
            tickets = tickets.filter(
                (ticket) => ticket.assignee?.id === filters.assigneeId
            );
        }

        if (filters.unassigned) {
            tickets = tickets.filter((ticket) => ticket.assignee === null);
        }

        if (filters.q) {
            const query = filters.q.toLowerCase();

            tickets = tickets.filter(
                (ticket) =>
                    ticket.subject.toLowerCase().includes(query) ||
                    ticket.requesterName.toLowerCase().includes(query) ||
                    ticket.requesterEmail.toLowerCase().includes(query)
            );
        }

        return tickets.map((ticket) => ({ ...ticket }));
    }

   /* const params = new URLSearchParams();

    if (filters.status) {
        params.set("status", filters.status);
    }

    if (filters.assigneeId !== undefined) {
        params.set("assigneeId", String(filters.assigneeId));
    }

    if (filters.unassigned !== undefined) {
        params.set("unassigned", String(filters.unassigned));
    }

    if (filters.q) {
        params.set("q", filters.q);
    }

    const queryString = params.toString();
    const url = queryString
        ? `${BASE_URL}/api/tickets?${queryString}`
        : `${BASE_URL}/api/tickets`;*/

    const response = await fetch(`${BASE_URL}/api/tickets`);

    return handleResponse<ApiTicketSummary[]>(response);
}

// ==================================================
// POST /api/tickets
// Request: CreateTicket
// Response: TicketDetailDto
// ==================================================

export async function createTicket(
    payload: CreateTicketPayload
): Promise<ApiTicketDetail> {
    if (USE_MOCK_API) {
        await delay();

        const now = new Date().toISOString();

        const newTicket: ApiTicketSummary = {
            id: mockDatabase.nextTicketId++,
            subject: payload.title,
            requesterName: "Current User",
            requesterEmail: "user@example.com",
            status: "OPEN",
            assignee:
                payload.assigneeId !== undefined
                    ? findAssignee(payload.assigneeId)
                    : null,
            createdAt: now,
            updatedAt: now,
        };

        mockDatabase.tickets.unshift(newTicket);

        return {
            ...toTicketDetail(newTicket),
            description: payload.description,
            priority: payload.priority,
        };
    }

    const response = await fetch(`${BASE_URL}/api/tickets`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
    });

    return handleResponse<ApiTicketDetail>(response);
}

// ==================================================
// GET /api/tickets/:id
// Response: TicketDetailDto
// ==================================================

export async function getTicketById(
    id: string | number
): Promise<ApiTicketDetail> {
    if (USE_MOCK_API) {
        await delay();

        return toTicketDetail(findTicket(id));
    }

    const response = await fetch(`${BASE_URL}/api/tickets/${id}`);

    return handleResponse<ApiTicketDetail>(response);
}

// ==================================================
// PUT /api/tickets/:id/assignee
// Request: AssignTicket
// Response: TicketDetailDto
// ==================================================

export async function assignTicket(
    id: string | number,
    payload: AssignTicketPayload
): Promise<ApiTicketDetail> {
    if (USE_MOCK_API) {
        await delay();

        const ticket = findTicket(id);

        ticket.assignee =
            payload.agentId === null
                ? null
                : findAssignee(payload.agentId);

        ticket.updatedAt = new Date().toISOString();

        return toTicketDetail(ticket);
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}/assignee`,
        {
            method: "PUT",
            headers: jsonHeaders(),
            body: JSON.stringify(payload),
        }
    );

    return handleResponse<ApiTicketDetail>(response);
}

// ==================================================
// PATCH /api/tickets/:id/status
// Request: UpdateStatus
// Response: TicketDetailDto
// ==================================================

export async function updateTicketStatus(
    id: string | number,
    payload: UpdateStatusPayload
): Promise<ApiTicketDetail> {
    if (USE_MOCK_API) {
        await delay();

        const ticket = findTicket(id);

        ticket.status = payload.status;
        ticket.updatedAt = new Date().toISOString();

        return toTicketDetail(ticket);
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}/status`,
        {
            method: "PATCH",
            headers: jsonHeaders(),
            body: JSON.stringify(payload),
        }
    );

    return handleResponse<ApiTicketDetail>(response);
}

// ==================================================
// GET /api/tickets/:id/messages
// Response: MessageDto[]
// ==================================================

export async function getTicketMessages(
    id: string | number
): Promise<ApiMessage[]> {
    if (USE_MOCK_API) {
        await delay();

        findTicket(id);

        return [];
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}/messages`
    );

    return handleResponse<ApiMessage[]>(response);
}

// ==================================================
// POST /api/tickets/:id/messages
// Request: AddMessage
// Response: MessageDto
// ==================================================

export async function addTicketMessage(
    id: string | number,
    payload: AddMessagePayload
): Promise<ApiMessage> {
    if (USE_MOCK_API) {
        await delay();

        findTicket(id);

        return {
            ...payload,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        };
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}/messages`,
        {
            method: "POST",
            headers: jsonHeaders(),
            body: JSON.stringify(payload),
        }
    );

    return handleResponse<ApiMessage>(response);
}