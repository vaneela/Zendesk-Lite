
import {
    mockAgents,
    mockDatabase,
} from "./mockData";

export type ApiTicketStatus =
    | "OPEN"
    | "PENDING"
    | "IN_PROGRESS"
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
}

export interface ApiTicket {
    id: number;
    title: string;
    description: string;
    status: ApiTicketStatus;
    priority: ApiTicketPriority;
    assignee: ApiAssignee | null;
    createdAt: string;
    updatedAt: string;
}

export interface TicketApiResponse {
    content: ApiTicket[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface CreateTicketPayload {
    title: string;
    description: string;
    priority: ApiTicketPriority;
    assigneeId?: number;
}

export interface UpdateTicketPayload {
    status?: ApiTicketStatus;
    assigneeId?: number | null;
}

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const USE_MOCK_API = true;
const BASE_URL = "http://localhost:8080";
const MOCK_DELAY = 400;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function delay(ms = MOCK_DELAY): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function findAssignee(id: number): ApiAssignee {
    const agent = mockAgents.find((agent) => agent.id === id);

    if (!agent) {
        throw new Error(`Agent with ID ${id} not found`);
    }

    return { ...agent };
}

function findTicket(id: string | number): ApiTicket {
    const ticket = mockDatabase.tickets.find(
        (ticket) => ticket.id === Number(id)
    );

    if (!ticket) {
        throw new Error(`404: Ticket with ID ${id} not found`);
    }

    return ticket;
}

async function handleResponse<T>(
    response: Response
): Promise<T> {
    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch {
            // Keep default error message.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// --------------------------------------------------
// GET /api/tickets
// --------------------------------------------------

export async function getTickets(
    page = 0,
    size = 10
): Promise<TicketApiResponse> {
    if (USE_MOCK_API) {
        await delay();

        const allTickets = mockDatabase.tickets;
        const totalElements = allTickets.length;
        const totalPages = Math.ceil(totalElements / size);

        return {
            content: allTickets
                .slice(page * size, page * size + size)
                .map((ticket) => ({ ...ticket })),
            page,
            size,
            totalElements,
            totalPages,
        };
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets?page=${page}&size=${size}`
    );

    return handleResponse<TicketApiResponse>(response);
}

// --------------------------------------------------
// POST /api/tickets
// --------------------------------------------------

export async function createTicket(
    payload: CreateTicketPayload
): Promise<ApiTicket> {
    if (USE_MOCK_API) {
        await delay();

        const now = new Date().toISOString();

        const newTicket: ApiTicket = {
            id: mockDatabase.nextTicketId++,
            title: payload.title,
            description: payload.description,
            status: "OPEN",
            priority: payload.priority,
            assignee:
                payload.assigneeId !== undefined
                    ? findAssignee(payload.assigneeId)
                    : null,
            createdAt: now,
            updatedAt: now,
        };

        mockDatabase.tickets.unshift(newTicket);

        return { ...newTicket };
    }

    const response = await fetch(`${BASE_URL}/api/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return handleResponse<ApiTicket>(response);
}

// --------------------------------------------------
// GET /api/tickets/:id
// --------------------------------------------------

export async function getTicketById(
    id: string | number
): Promise<ApiTicket> {
    if (USE_MOCK_API) {
        await delay();

        return { ...findTicket(id) };
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}`
    );

    return handleResponse<ApiTicket>(response);
}

// --------------------------------------------------
// PATCH /api/tickets/:id
// --------------------------------------------------

export async function updateTicket(
    id: string | number,
    payload: UpdateTicketPayload
): Promise<ApiTicket> {
    if (USE_MOCK_API) {
        await delay();

        const ticket = findTicket(id);

        if (payload.status !== undefined) {
            ticket.status = payload.status;
        }

        if (payload.assigneeId !== undefined) {
            ticket.assignee =
                payload.assigneeId === null
                    ? null
                    : findAssignee(payload.assigneeId);
        }

        ticket.updatedAt = new Date().toISOString();

        return { ...ticket };
    }

    const response = await fetch(
        `${BASE_URL}/api/tickets/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    return handleResponse<ApiTicket>(response);
}
