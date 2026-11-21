
import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MessageSquare,
    Send,
    Ticket as TicketIcon,
    UserRound,
} from "lucide-react";

import {
    getTicketById,
    updateTicket,
    type ApiTicketStatus,
} from "./ticketApi";

import "./TicketDetails.css";

interface Comment {
    id: number;
    author: string;
    message: string;
    createdAt: string;
}

const statusOptions: {
    label: string;
    value: ApiTicketStatus;
}[] = [
    { label: "Open", value: "OPEN" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Solved", value: "SOLVED" },
    { label: "Closed", value: "CLOSED" },
];

const priorityLabels: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function TicketDetails() {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [reply, setReply] = useState("");

    // Temporary local comments until comments API is connected.
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            author: "Alex Morgan",
            message: "We are looking into this issue.",
            createdAt: "Today",
        },
    ]);

    // Fetch ticket details.
    const {
        data: ticket,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId!),
        enabled: Boolean(ticketId),
        retry: false,
    });

    // Update ticket.
    const updateMutation = useMutation({
        mutationFn: (payload: {
            status?: ApiTicketStatus;
            assigneeId?: number | null;
        }) => updateTicket(ticketId!, payload),

        onSuccess: (updatedTicket) => {
            queryClient.setQueryData(
                ["ticket", ticketId],
                updatedTicket
            );

            queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
        },
    });

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        updateMutation.mutate({
            status: event.target.value as ApiTicketStatus,
        });
    };

    const handleReply = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reply.trim()) return;

        const newComment: Comment = {
            id: Date.now(),
            author: "Alex Morgan",
            message: reply.trim(),
            createdAt: "Just now",
        };

        setComments((previous) => [...previous, newComment]);
        setReply("");
    };

    // Loading state.
    if (isLoading) {
        return (
            <div className="ticket-details-page">
                <div className="details-loading">
                    Loading ticket details...
                </div>
            </div>
        );
    }

    // Error state.
    if (isError) {
        const isNotFound =
            error instanceof Error &&
            error.message.toLowerCase().includes("404");

        return (
            <div className="ticket-details-page">
                <div className="details-error">
                    <h2>
                        {isNotFound
                            ? "Ticket not found"
                            : "Unable to load ticket"}
                    </h2>

                    <p>
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong."}
                    </p>

                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={16} />
                        Back to tickets
                    </button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    return (
        <div className="ticket-details-page">
            {/* Header */}
            <header className="details-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={17} />
                    Back to tickets
                </button>

                <div className="details-brand">
          <span className="brand-icon">
            <TicketIcon size={19} />
          </span>
                    <span>Zendesk Lite</span>
                </div>
            </header>

            <main className="ticket-details-container">
                {/* Breadcrumb */}
                <div className="details-breadcrumb">
          <span
              onClick={() => navigate("/dashboard")}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                  if (event.key === "Enter") {
                      navigate("/dashboard");
                  }
              }}
          >
            Tickets
          </span>
                    <span>/</span>
                    <span>{`#${ticket.id}`}</span>
                </div>

                {/* Ticket heading */}
                <section className="ticket-details-heading">
                    <div>
                        <p className="ticket-reference">
                            TICKET #{ticket.id}
                        </p>

                        <h1>{ticket.title}</h1>

                        <div className="ticket-meta">
              <span>
                <CalendarDays size={15} />
                Created {formatDate(ticket.createdAt)}
              </span>

                            <span>
                <Clock3 size={15} />
                Updated {formatDate(ticket.updatedAt)}
              </span>
                        </div>
                    </div>

                    <span
                        className={`priority-badge ${ticket.priority.toLowerCase()}`}
                    >
            {priorityLabels[ticket.priority] ?? ticket.priority}
          </span>
                </section>

                {/* Main content and properties */}
                <div className="ticket-details-layout">
                    <div className="ticket-details-main">
                        {/* Description */}
                        <section className="details-card">
                            <div className="details-card-heading">
                                <h2>Description</h2>
                            </div>

                            <div className="ticket-description">
                                {ticket.description || "No description provided."}
                            </div>
                        </section>

                        {/* Conversation */}
                        <section className="details-card conversation-card">
                            <div className="details-card-heading">
                                <h2>
                                    <MessageSquare size={18} />
                                    Conversation
                                </h2>

                                <span>{comments.length} comments</span>
                            </div>

                            <div className="comments-list">
                                {comments.map((comment) => (
                                    <div className="comment-item" key={comment.id}>
                                        <div className="comment-avatar">
                                            {comment.author.charAt(0)}
                                        </div>

                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <strong>{comment.author}</strong>
                                                <span>{comment.createdAt}</span>
                                            </div>

                                            <p>{comment.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply form */}
                            <form
                                className="reply-form"
                                onSubmit={handleReply}
                            >
                <textarea
                    value={reply}
                    onChange={(event) =>
                        setReply(event.target.value)
                    }
                    placeholder="Write a reply..."
                    rows={3}
                />

                                <div className="reply-actions">
                                    <button
                                        type="submit"
                                        className="reply-button"
                                        disabled={!reply.trim()}
                                    >
                                        <Send size={15} />
                                        Send reply
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Ticket properties */}
                    <aside className="ticket-properties">
                        <section className="details-card">
                            <div className="details-card-heading">
                                <h2>Ticket properties</h2>
                            </div>

                            {/* Status */}
                            <div className="property-field">
                                <label htmlFor="ticket-status">Status</label>

                                <select
                                    id="ticket-status"
                                    value={ticket.status}
                                    onChange={handleStatusChange}
                                    disabled={updateMutation.isPending}
                                >
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {updateMutation.isPending && (
                                    <span className="property-hint">
                    Updating status...
                  </span>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="property-field">
                                <label>Priority</label>

                                <div
                                    className={`property-value priority-text ${ticket.priority.toLowerCase()}`}
                                >
                                    {priorityLabels[ticket.priority] ??
                                        ticket.priority}
                                </div>
                            </div>

                            {/* Assignee */}
                            <div className="property-field">
                                <label>Assignee</label>

                                <div className="property-value assignee-value">
                                    <UserRound size={16} />
                                    {ticket.assignee?.name ?? "Unassigned"}
                                </div>
                            </div>

                            {/* Assignee ID */}
                            {ticket.assignee && (
                                <div className="property-field">
                                    <label>Assignee ID</label>
                                    <div className="property-value">
                                        {ticket.assignee.id}
                                    </div>
                                </div>
                            )}

                            {updateMutation.isError && (
                                <p className="property-error">
                                    {updateMutation.error instanceof Error
                                        ? updateMutation.error.message
                                        : "Unable to update ticket."}
                                </p>
                            )}

                            {updateMutation.isSuccess && (
                                <p className="property-success">
                                    Ticket updated successfully.
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default TicketDetails;
