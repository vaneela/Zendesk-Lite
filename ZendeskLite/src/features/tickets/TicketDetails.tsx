
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    ArrowLeft,
    User,
    Calendar,
    MessageSquare,
    Send,
    UserX,
} from "lucide-react";

import Header from "../../components/Header";
import './TicketDetails.css'

import {
    getTicketById,
    updateTicketStatus,
    assignTicket,
    type ApiTicketStatus,
} from "./ticketApi";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const statusLabels: Record<ApiTicketStatus, string> = {
    OPEN: "Open",
    PENDING: "Pending",
    SOLVED: "Solved",
    CLOSED: "Closed",
};

const priorityLabels: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

function formatDate(date: string): string {
    return new Date(date).toLocaleString();
}

// --------------------------------------------------
// Component
// --------------------------------------------------

function TicketDetails() {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [comment, setComment] = useState("");
    const [localComments, setLocalComments] = useState<string[]>([]);

    // -----------------------------------------------
    // Fetch ticket details
    // -----------------------------------------------

    const {
        data: ticket,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId!),
        enabled: Boolean(ticketId),
    });

    // -----------------------------------------------
    // Fetch allowed status transitions
    // -----------------------------------------------

    const statuses = [
        { status: 'OPEN', allowedTransitions: ['PENDING'] },
        { status: 'PENDING', allowedTransitions: ['SOLVED'] },
        { status: 'SOLVED', allowedTransitions: ['CLOSED', 'PENDING'] },
        { status: 'CLOSED', allowedTransitions: [] },
    ];

    const allowedTransitions =
        statuses.find((item) => item.status === ticket?.status)
            ?.allowedTransitions ?? [];

    // -----------------------------------------------
    // Update ticket status
    // -----------------------------------------------

    const statusMutation = useMutation({
        mutationFn: (status: ApiTicketStatus) =>
            updateTicketStatus(ticketId!, { status }),

        onSuccess: async (updatedTicket) => {
            queryClient.setQueryData(
                ["ticket", ticketId],
                updatedTicket
            );

            await queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
        },
    });

    // -----------------------------------------------
    // Assign / unassign ticket
    // -----------------------------------------------

    const unassignMutation = useMutation({
        mutationFn: () =>
            assignTicket(ticketId!, { agentId: null }),

        onSuccess: async (updatedTicket) => {
            queryClient.setQueryData(
                ["ticket", ticketId],
                updatedTicket
            );

            await queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
        },
    });

    // -----------------------------------------------
    // Local conversation comments
    // -----------------------------------------------

    const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedComment = comment.trim();

        if (!trimmedComment) return;

        setLocalComments((previous) => [
            ...previous,
            trimmedComment,
        ]);

        setComment("");
    };

    // -----------------------------------------------
    // Loading and error states
    // -----------------------------------------------

    if (isLoading) {
        return (
            <div className="app-shell">
                <Header />
                <main className="ticket-details-page">
                    <p>Loading ticket...</p>
                </main>
            </div>
        );
    }

    if (isError || !ticket) {
        return (
            <div className="app-shell">
                <Header />
                <main className="ticket-details-page">
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </button>

                    <p className="error-message">
                        {error instanceof Error
                            ? error.message
                            : "Ticket could not be loaded."}
                    </p>
                </main>
            </div>
        );
    }

    // -----------------------------------------------
    // Main render
    // -----------------------------------------------

    return (
        <div className="app-shell">
            <Header />

            <main className="ticket-details-page">
                {/* Back navigation */}
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={16} />
                    Back to dashboard
                </button>

                {/* Ticket heading */}
                <section className="ticket-heading">
                    <div>
            <span className="ticket-reference">
              Ticket #{ticket.id}
            </span>

                        <h1>{ticket.title}</h1>

                        <p className="ticket-created">
                            Created {formatDate(ticket.createdAt)}
                        </p>
                    </div>

                    <span
                        className={`status-badge status-${ticket.status.toLowerCase()}`}
                    >
            {statusLabels[ticket.status]}
          </span>
                </section>

                {/* Main content */}
                <div className="ticket-details-layout">
                    <section className="ticket-main-content">
                        {/* Description */}
                        <div className="details-card">
                            <h2>Description</h2>
                            <p className="ticket-description">
                                {ticket.description}
                            </p>
                        </div>

                        {/* Conversation */}
                        <div className="details-card conversation-card">
                            <div className="section-heading">
                                <MessageSquare size={18} />
                                <h2>Conversation</h2>
                            </div>

                            <div className="conversation-list">
                                {localComments.length === 0 ? (
                                    <p className="empty-conversation">
                                        No messages yet.
                                    </p>
                                ) : (
                                    localComments.map((message, index) => (
                                        <div
                                            className="conversation-message"
                                            key={`${index}-${message}`}
                                        >
                                            <div className="message-avatar">A</div>

                                            <div className="message-content">
                                                <div className="message-meta">
                                                    <strong>Alex Morgan</strong>
                                                    <span>Just now</span>
                                                </div>

                                                <p>{message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form
                                className="comment-form"
                                onSubmit={handleAddComment}
                            >
                <textarea
                    value={comment}
                    onChange={(event) =>
                        setComment(event.target.value)
                    }
                    placeholder="Write a reply..."
                    rows={3}
                />

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={!comment.trim()}
                                >
                                    <Send size={15} />
                                    Send reply
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Ticket properties */}
                    <aside className="ticket-sidebar">
                        <div className="details-card properties-card">
                            <h2>Properties</h2>

                            {/* Status */}
                            <div className="property-field">
                                <label htmlFor="ticket-status">Status</label>

                                <select
                                    id="ticket-status"
                                    value={ticket.status}
                                    disabled={
                                        statusMutation.isPending ||
                                        ticket.status === "CLOSED"
                                    }
                                    onChange={(event) =>
                                        statusMutation.mutate(
                                            event.target.value as ApiTicketStatus
                                        )
                                    }
                                >
                                    <option value={ticket.status}>
                                        {statusLabels[ticket.status]}
                                    </option>

                                    {allowedTransitions
                                        .filter(
                                            (status) => status !== ticket.status
                                        )
                                        .map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabels[status]}
                                            </option>
                                        ))}
                                </select>

                                {statusMutation.isError && (
                                    <span className="field-error">
                    {statusMutation.error.message}
                  </span>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="property-field">
                                <label>Priority</label>

                                <span
                                    className={`priority-value priority-${ticket.priority.toLowerCase()}`}
                                >
                  {priorityLabels[ticket.priority] ??
                      ticket.priority}
                </span>
                            </div>

                            {/* Assignee */}
                            <div className="property-field">
                                <label>Assignee</label>

                                <div className="assignee-value">
                                    <User size={16} />

                                    <span>
                    {ticket.assignee?.name ?? "Unassigned"}
                  </span>
                                </div>

                                {ticket.assignee && (
                                    <button
                                        type="button"
                                        className="text-button"
                                        disabled={unassignMutation.isPending}
                                        onClick={() => unassignMutation.mutate()}
                                    >
                                        <UserX size={14} />
                                        Unassign
                                    </button>
                                )}

                                {unassignMutation.isError && (
                                    <span className="field-error">
                    {unassignMutation.error.message}
                  </span>
                                )}
                            </div>

                            {/* Requester / assignee information */}
                            {ticket.assignee && (
                                <div className="property-field">
                                    <label>Assignee email</label>
                                    <span>{ticket.assignee.email}</span>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="property-field">
                                <label>
                                    <Calendar size={14} />
                                    Created
                                </label>
                                <span>{formatDate(ticket.createdAt)}</span>
                            </div>

                            <div className="property-field">
                                <label>
                                    <Calendar size={14} />
                                    Last updated
                                </label>
                                <span>{formatDate(ticket.updatedAt)}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default TicketDetails;
