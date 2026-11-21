
import { useMemo, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import Header from "../../components/Header";
import TicketCard from "../../components/TicketCard";
import CreateTicketModal from "../../components/CreateTicketModal";
import './Dashboard.css'

import {
    createTicket,
    getTickets,
    type ApiTicketPriority,
    type ApiTicketStatus,
} from "./ticketApi";

import type {
    Ticket,
    TicketStatus,
} from "../../data/tickets";

type UserRole = "Admin" | "User" | "Agent";
type TicketFilter = "all" | "mine" | "unassigned";

const currentUser = {
    name: "Alex Morgan",
    role: "Admin" as UserRole,
};

const statusMap: Record<ApiTicketStatus, TicketStatus> = {
    OPEN: "Open",
    PENDING: "Pending",
    SOLVED: "Solved",
    CLOSED: "Closed",
};

const priorityMap: Record<
    Ticket["priority"],
    ApiTicketPriority
> = {
    Low: "LOW",
    Medium: "MEDIUM",
    High: "HIGH",
    Urgent: "URGENT",
};

const lanes: TicketStatus[] = [
    "Open",
    "Pending",
    "Solved",
    "Closed",
];

function Dashboard() {
    const queryClient = useQueryClient();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeFilter, setActiveFilter] =
        useState<TicketFilter>("all");

    const isAgent = currentUser.role === "Agent";
    const canCreateTicket =
        currentUser.role === "Admin" ||
        currentUser.role === "User";

    // -----------------------------------------------
    // Fetch tickets
    // -----------------------------------------------

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
    });

    // The list API returns a plain array, not { content: [] }.
    const tickets: Ticket[] = useMemo(
        () =>
            (data ?? []).map((ticket) => ({
                id: String(ticket.id),
                title: ticket.subject,
                description: `Requested by ${ticket.requesterName} (${ticket.requesterEmail})`,
                status: statusMap[ticket.status],
                priority: "Medium",
                assignee: ticket.assignee?.name ?? "Unassigned",
                createdAt: new Date(ticket.createdAt).toLocaleString(),
            })),
        [data]
    );

    // -----------------------------------------------
    // Apply dashboard filters
    // -----------------------------------------------

    const filteredTickets = useMemo(() => {
        switch (activeFilter) {
            case "mine":
                return tickets.filter(
                    (ticket) => ticket.assignee === currentUser.name
                );

            case "unassigned":
                return tickets.filter(
                    (ticket) => ticket.assignee === "Unassigned"
                );

            default:
                return tickets;
        }
    }, [tickets, activeFilter]);

    // -----------------------------------------------
    // Create ticket
    // -----------------------------------------------

    const createMutation = useMutation({
        mutationFn: (payload: {
            title: string;
            description: string;
            priority: Ticket["priority"];
        }) =>
            createTicket({
                title: payload.title,
                description: payload.description,
                priority: priorityMap[payload.priority],
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });

            setShowCreateModal(false);
        },
    });

    const handleCreateTicket = (payload: {
        title: string;
        description: string;
        priority: Ticket["priority"];
    }) => {
        createMutation.mutate(payload);
    };

    // -----------------------------------------------
    // Render
    // -----------------------------------------------

    return (
        <div className="app-shell">
            <Header />

            <main className="dashboard">
                <section className="welcome-banner">
                    <div>
                        <h1>Good day, {currentUser.name}</h1>
                        <p>Here's what's happening with your tickets.</p>
                    </div>

                    {canCreateTicket && (
                        <button
                            className="primary-button"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Create Ticket
                        </button>
                    )}
                </section>

                {/* Filters */}
                <section className="filter-bar">
                    <button
                        className={`filter-button ${
                            activeFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveFilter("all")}
                    >
                        All Tickets
                    </button>

                    {isAgent && (
                        <button
                            className={`filter-button ${
                                activeFilter === "mine" ? "active" : ""
                            }`}
                            onClick={() => setActiveFilter("mine")}
                        >
                            My Tickets
                        </button>
                    )}

                    <button
                        className={`filter-button ${
                            activeFilter === "unassigned" ? "active" : ""
                        }`}
                        onClick={() => setActiveFilter("unassigned")}
                    >
                        Unassigned
                    </button>
                </section>

                {/* Loading */}
                {isLoading && (
                    <div className="dashboard-message">
                        Loading tickets...
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="dashboard-message error">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong while loading tickets."}
                    </div>
                )}

                {/* Swimlanes */}
                {!isLoading && !isError && (
                    <section className="swimlane-board">
                        {lanes.map((status) => {
                            const laneTickets = filteredTickets.filter(
                                (ticket) => ticket.status === status
                            );

                            return (
                                <div className="swimlane" key={status}>
                                    <div className="swimlane-header">
                                        <h2>{status}</h2>
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
                                                No tickets
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </main>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <CreateTicketModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTicket}
                />
            )}
        </div>
    );
}

export default Dashboard;
