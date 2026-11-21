
import { useMemo, useState } from "react";
import Header from "../../components/Header";
import TicketCard from "../../components/TicketCard";
import CreateTicketModal from "../../components/CreateTicketModal";
import { tickets as initialTickets } from "../../data/tickets";
import type { Ticket } from "../../data/tickets";
import "./Dashboard.css";

const STATUSES = ["Open", "Pending", "Solved", "Closed"] as const;

type TicketStatus = (typeof STATUSES)[number];
type Filter = "All tickets" | "My tickets" | "Unassigned";

const FILTERS: Filter[] = [
    "All tickets",
    "My tickets",
    "Unassigned",
];

export default function Dashboard() {
    const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets);
    const [activeFilter, setActiveFilter] =
        useState<Filter>("All tickets");
    const [showModal, setShowModal] = useState(false);

    // Apply the selected filter
    const filteredTickets = useMemo(() => {
        return ticketList.filter((ticket) => {
            if (activeFilter === "My tickets") {
                return ticket.assignee === "Alex Morgan";
            }

            if (activeFilter === "Unassigned") {
                return ticket.assignee === "Unassigned";
            }

            return true;
        });
    }, [ticketList, activeFilter]);

    // Create a new ticket
    const handleCreateTicket = (data: {
        title: string;
        description: string;
        priority: Ticket["priority"];
    }) => {
        const newTicket: Ticket = {
            id: `ticket-${Date.now()}`,
            ...data,
            status: "Open",
            assignee: "Unassigned",
            createdAt: "Just now",
        };

        setTicketList((current) => [newTicket, ...current]);
        setActiveFilter("All tickets");
        setShowModal(false);
    };

    return (
        <div className="app-shell">
            <Header />

            <main className="dashboard">
                {/* Welcome section */}
                <section className="welcome-banner">
                    <div className="welcome-content">
                        <span className="eyebrow">YOUR WORKSPACE</span>

                        <h1>Good morning, Alex</h1>

                        <p>
                            Keep your team's support moving.
                            Here's what's happening with your tickets.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => setShowModal(true)}
                    >
                        <span>+</span>
                        Create ticket
                    </button>
                </section>

                {/* Ticket board */}
                <section className="ticket-section">
                    <div className="section-heading">
                        <div>
                            <h2>Tickets</h2>
                            <p>Manage and track your team's requests.</p>
                        </div>

                        <span className="total-tickets">
              {filteredTickets.length} tickets
            </span>
                    </div>

                    {/* Quick filters */}
                    <div className="filter-bar">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                className={`filter-button ${
                                    activeFilter === filter ? "active" : ""
                                }`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Four swimlanes */}
                    <div className="swimlane-board">
                        {STATUSES.map((status: TicketStatus) => {
                            const laneTickets = filteredTickets.filter(
                                (ticket) => ticket.status === status
                            );

                            return (
                                <section
                                    className="swimlane"
                                    key={status}
                                >
                                    <div className="swimlane-header">
                                        <div className="lane-title">
                      <span
                          className={`status-indicator status-${status.toLowerCase()}`}
                      />

                                            <h3>{status}</h3>
                                        </div>

                                        <span className="lane-count">
                      {laneTickets.length}
                    </span>
                                    </div>

                                    <div className="swimlane-cards">
                                        {laneTickets.length > 0 ? (
                                            laneTickets.map((ticket) => (
                                                <TicketCard
                                                    key={ticket.id}
                                                    ticket={ticket}
                                                />
                                            ))
                                        ) : (
                                            <div className="lane-empty">
                                                No {status.toLowerCase()} tickets
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Create ticket modal */}
            {showModal && (
                <CreateTicketModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreateTicket}
                />
            )}
        </div>
    );
}
