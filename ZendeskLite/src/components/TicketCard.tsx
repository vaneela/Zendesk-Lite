
import { useNavigate } from "react-router-dom";
import { CalendarDays, UserRound, ArrowUpRight } from "lucide-react";
import type { Ticket } from "../data/tickets";
import "./TicketCard.css";

interface TicketCardProps {
    ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const navigate = useNavigate();

    return (
        <article
            className="ticket-card"
            onClick={() => navigate(`/ticket/${ticket.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/ticket/${ticket.id}`);
                }
            }}
        >
            <div className="ticket-card-top">
        <span className="ticket-id">
          #{ticket.id}
        </span>

                <ArrowUpRight size={15} className="ticket-open-icon" />
            </div>

            <h4 className="ticket-title">{ticket.title}</h4>

            <p className="ticket-description">
                {ticket.description}
            </p>

            <div className="ticket-card-footer">
        <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
          <span className="priority-dot" />
            {ticket.priority}
        </span>
            </div>

            <div className="ticket-card-meta">
                <div className="ticket-assignee">
                    <UserRound size={13} />
                    <span>{ticket.assignee}</span>
                </div>

                <div className="ticket-date">
                    <CalendarDays size={13} />
                    <span>{ticket.createdAt}</span>
                </div>
            </div>
        </article>
    );
}
