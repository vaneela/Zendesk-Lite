
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Header from "../../components/Header";
import TicketCard from "../../components/TicketCard";
import CreateTicketModal from "../../components/CreateTicketModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
    Ticket,
    TicketStatus,
    TicketPriority,
} from "../../data/tickets";

import { getTickets, createTicket } from "./ticketApi";
import "./Dashboard.css";

// Temporary logged-in user.
// Later, this information will come from authentication.
type UserRole = "Admin" | "User" | "Agent";

const currentUser = {
    name: "Alex Morgan",
    role: "Admin" as UserRole,
};

const statuses: TicketStatus[] = [
    "Open",
    "Pending",
    "Solved",
    "Closed",
];

type FilterType = "all" | "mine" | "unassigned";

function Dashboard() {
    const [activeFilter, setActiveFilter] =
        useState<FilterType>("all");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const createTicketMutation = useMutation({
        mutationFn: createTicket,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });

            setIsModalOpen(false);
        },
    });

    const mapStatus = (status: string): TicketStatus => {
        const statusMap: Record<string, TicketStatus> = {
            OPEN: "Open",
            PENDING: "Pending",
            SOLVED: "Solved",
            CLOSED: "Closed",
        };

        return statusMap[status] ?? "Open";
    };

    // Fetch tickets using TanStack Query.
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
    });

// Convert backend response into frontend Ticket structure.
    const apiTickets: Ticket[] = (data ?? []).map((ticket) => ({
        id: String(ticket.id),
        title: ticket.subject,
        description: `Requested by ${ticket.requesterName} (${ticket.requesterEmail})`,
        status: mapStatus(ticket.status),
        priority: "Medium",
        assignee: ticket.assignee?.name ?? "Unassigned",
        createdAt: new Date(ticket.createdAt).toLocaleString(),
    }));

// API tickets are the source of truth.
    const tickets = apiTickets;

    // Apply selected filter.
    const filteredTickets = tickets.filter((ticket) => {
        if (
            activeFilter === "mine" &&
            currentUser.role === "Agent"
        ) {
            return ticket.assignee === currentUser.name;
        }

        if (activeFilter === "unassigned") {
            return ticket.assignee === "Unassigned";
        }

        return true;
    });


    const handleCreateTicket = (ticketData: {
        title: string;
        description: string;
        priority: TicketPriority;
    }) => {
        createTicketMutation.mutate({
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority.toUpperCase() as
                | "LOW"
                | "MEDIUM"
                | "HIGH"
                | "URGENT",
        });
    };

    // Loading state.
    if (isLoading) {
        return (
            <div className="app-shell">
                <Header />
                <main className="dashboard">
                    <div className="dashboard-message">
                        Loading tickets...
                    </div>
                </main>
            </div>
        );
    }

    // Error state.
    if (isError) {
        return (
            <div className="app-shell">
                <Header />
                <main className="dashboard">
                    <div className="dashboard-message error">
                        <p>
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong while fetching tickets."}
                        </p>

                        <button
                            className="primary-button"
                            onClick={() => refetch()}
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Header />

            <main className="dashboard">
                {/* Welcome section */}
                <section className="welcome-banner">
                    <div>
                        <p className="eyebrow">SUPPORT OVERVIEW</p>
                        <h1>Welcome back, {currentUser.name}</h1>
                        <p>
                            Here's what's happening with your support tickets.
                        </p>
                    </div>

                    {(currentUser.role === "Admin" ||
                        currentUser.role === "User") && (
                        <button
                            className="primary-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Create Ticket
                        </button>
                    )}
                </section>

                {/* Ticket filters */}
                <section className="filter-bar">
                    <button
                        className={`filter-button ${
                            activeFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveFilter("all")}
                    >
                        All Tickets
                    </button>

                    {currentUser.role === "Agent" && (
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

                {/* Ticket count */}
                <p className="ticket-count">
                    Showing {filteredTickets.length} tickets
                    {data && ` of ${data.totalElements}`}
                </p>

                {/* Four horizontal swimlanes */}
                <section className="swimlane-board">
                    {statuses.map((status) => {
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
                                        <p className="lane-empty">
                                            No {status.toLowerCase()} tickets
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            {/* Create ticket modal */}
            {isModalOpen && (
                <CreateTicketModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateTicket}
                />
            )}
        </div>
    );
}

export default Dashboard;
