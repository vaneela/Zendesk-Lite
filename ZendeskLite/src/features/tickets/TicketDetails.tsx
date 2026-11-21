
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MessageSquare,
    Send,
    UserRound,
} from "lucide-react";

import {
    tickets as initialTickets,
    type Ticket,
    type TicketStatus,
    type TicketPriority,
} from "../../data/tickets";

import "./TicketDetails.css";

interface TicketComment {
    id: number;
    author: string;
    message: string;
    createdAt: string;
}

const agents = [
    "Alex Morgan",
    "Sarah Wilson",
    "John Carter",
    "Unassigned",
];

const initialComments: TicketComment[] = [
    {
        id: 1,
        author: "Sarah Wilson",
        message:
            "I've started investigating this issue. Could you please share the exact error message you're receiving?",
        createdAt: "Today, 10:30 AM",
    },
    {
        id: 2,
        author: "Alex Morgan",
        message:
            "The issue appears to be related to the authentication service. I'm looking into the logs.",
        createdAt: "Today, 10:45 AM",
    },
];

export default function TicketDetails() {
    const { ticketId } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<Ticket | undefined>(() =>
        initialTickets.find((item) => item.id === ticketId)
    );

    const [comments, setComments] =
        useState<TicketComment[]>(initialComments);

    const [reply, setReply] = useState("");

    if (!ticket) {
        return (
            <div className="ticket-not-found">
                <h2>Ticket not found</h2>
                <p>This ticket may have been deleted or does not exist.</p>
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={16} />
                    Back to dashboard
                </button>
            </div>
        );
    }

    const updateTicket = <K extends keyof Ticket>(
        field: K,
        value: Ticket[K]
    ) => {
        setTicket((current) =>
            current ? { ...current, [field]: value } : current
        );
    };

    const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reply.trim()) return;

        const newComment: TicketComment = {
            id: Date.now(),
            author: "Alex Morgan",
            message: reply.trim(),
            createdAt: "Just now",
        };

        setComments((current) => [...current, newComment]);
        setReply("");
    };

    return (
        <div className="app-shell">
            {/* Header */}
            <header className="ticket-details-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={17} />
                    <span>Back to tickets</span>
                </button>

                <span className="details-brand">Zendesk Lite</span>
            </header>

            <main className="ticket-details-page">
                {/* Breadcrumb */}
                <div className="ticket-breadcrumb">
          <span onClick={() => navigate("/dashboard")}>
            Tickets
          </span>
                    <span>/</span>
                    <span>{ticket.id}</span>
                </div>

                {/* Ticket heading */}
                <section className="ticket-detail-heading">
                    <div className="ticket-heading-content">
                        <div className="ticket-detail-id">
                            <span className="detail-eyebrow">TICKET</span>
                            <span>#{ticket.id}</span>
                        </div>

                        <h1>{ticket.title}</h1>

                        <div className="ticket-heading-meta">
              <span>
                <CalendarDays size={14} />
                Created {ticket.createdAt}
              </span>

                            <span>
                <MessageSquare size={14} />
                                {comments.length} comments
              </span>
                        </div>
                    </div>
                </section>

                {/* Main content */}
                <div className="ticket-detail-layout">
                    {/* Conversation */}
                    <section className="ticket-conversation">
                        <div className="detail-section-heading">
                            <div>
                                <h2>Conversation</h2>
                                <p>Ticket description and replies</p>
                            </div>
                        </div>

                        {/* Original ticket description */}
                        <article className="conversation-card original-message">
                            <div className="conversation-author">
                                <div className="comment-avatar customer-avatar">
                                    C
                                </div>

                                <div>
                                    <h4>Customer</h4>
                                    <span>{ticket.createdAt}</span>
                                </div>
                            </div>

                            <div className="conversation-message">
                                {ticket.description}
                            </div>
                        </article>

                        {/* Comments */}
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <article className="conversation-card" key={comment.id}>
                                    <div className="conversation-author">
                                        <div className="comment-avatar">
                                            {comment.author.charAt(0)}
                                        </div>

                                        <div>
                                            <h4>{comment.author}</h4>
                                            <span>{comment.createdAt}</span>
                                        </div>
                                    </div>

                                    <div className="conversation-message">
                                        {comment.message}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Reply box */}
                        <form
                            className="reply-box"
                            onSubmit={handleAddComment}
                        >
                            <label htmlFor="ticket-reply">Add a reply</label>

                            <textarea
                                id="ticket-reply"
                                value={reply}
                                onChange={(event) => setReply(event.target.value)}
                                placeholder="Write your reply here..."
                                rows={4}
                            />

                            <div className="reply-footer">
                                <span>Replying as Alex Morgan</span>

                                <button
                                    type="submit"
                                    className="send-reply-button"
                                    disabled={!reply.trim()}
                                >
                                    <Send size={14} />
                                    Send reply
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Ticket properties */}
                    <aside className="ticket-properties">
                        <div className="properties-heading">
                            <h2>Ticket properties</h2>
                        </div>

                        <div className="property-field">
                            <label htmlFor="ticket-status">Status</label>

                            <select
                                id="ticket-status"
                                value={ticket.status}
                                onChange={(event) =>
                                    updateTicket(
                                        "status",
                                        event.target.value as TicketStatus
                                    )
                                }
                            >
                                <option value="Open">Open</option>
                                <option value="Pending">Pending</option>
                                <option value="Solved">Solved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div className="property-field">
                            <label htmlFor="ticket-priority">Priority</label>

                            <select
                                id="ticket-priority"
                                value={ticket.priority}
                                onChange={(event) =>
                                    updateTicket(
                                        "priority",
                                        event.target.value as TicketPriority
                                    )
                                }
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="property-field">
                            <label htmlFor="ticket-assignee">Assignee</label>

                            <div className="assignee-select-wrapper">
                                <UserRound size={15} />

                                <select
                                    id="ticket-assignee"
                                    value={ticket.assignee}
                                    onChange={(event) =>
                                        updateTicket("assignee", event.target.value)
                                    }
                                >
                                    {agents.map((agent) => (
                                        <option key={agent} value={agent}>
                                            {agent}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="property-divider" />

                        <div className="property-info">
                            <span>Ticket ID</span>
                            <strong>#{ticket.id}</strong>
                        </div>

                        <div className="property-info">
                            <span>Created</span>
                            <strong>{ticket.createdAt}</strong>
                        </div>

                        <div className="property-info">
                            <span>Last activity</span>
                            <strong>
                                <Clock3 size={13} />
                                {comments.length > 0
                                    ? comments[comments.length - 1].createdAt
                                    : ticket.createdAt}
                            </strong>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
