
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

// Common API response handler
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

// GET /api/tickets
export async function getTickets(
    page = 0,
    size = 10
): Promise<TicketApiResponse> {
    const response = await fetch(
        `/api/tickets?page=${page}&size=${size}`
    );

    return handleResponse<TicketApiResponse>(response);
}

// POST /api/tickets
export async function createTicket(
    payload: CreateTicketPayload
): Promise<ApiTicket> {
    const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return handleResponse<ApiTicket>(response);
}

// GET /api/tickets/:id
export async function getTicketById(
    id: string | number
): Promise<ApiTicket> {
    const response = await fetch(`/api/tickets/${id}`);

    return handleResponse<ApiTicket>(response);
}

// PATCH /api/tickets/:id
export async function updateTicket(
    id: string | number,
    payload: UpdateTicketPayload
): Promise<ApiTicket> {
    const response = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return handleResponse<ApiTicket>(response);
}
