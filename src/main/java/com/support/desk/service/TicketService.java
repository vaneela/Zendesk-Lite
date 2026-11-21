package com.support.desk.service;

import com.support.desk.domain.Agent;
import com.support.desk.domain.AuthorType;
import com.support.desk.domain.Message;
import com.support.desk.domain.Ticket;
import com.support.desk.domain.TicketStatus;
import com.support.desk.dto.Requests.AddMessage;
import com.support.desk.dto.Requests.CreateTicket;
import com.support.desk.dto.Responses.MessageDto;
import com.support.desk.dto.Responses.TicketDetailDto;
import com.support.desk.dto.Responses.TicketSummaryDto;
import com.support.desk.error.ApiException;
import com.support.desk.repository.AgentRepository;
import com.support.desk.repository.MessageRepository;
import com.support.desk.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class TicketService {

    private static final String SYSTEM_AUTHOR = "System";

    private final TicketRepository tickets;
    private final MessageRepository messages;
    private final AgentRepository agents;

    public TicketService(TicketRepository tickets, MessageRepository messages, AgentRepository agents) {
        this.tickets = tickets;
        this.messages = messages;
        this.agents = agents;
    }

    @Transactional(readOnly = true)
    public List<TicketSummaryDto> search(TicketStatus status, Long assigneeId, boolean unassigned, String q) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        return tickets.search(status, assigneeId, unassigned, query).stream()
                .map(TicketSummaryDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketDetailDto get(Long id) {
        return detail(load(id));
    }

    @Transactional
    public TicketDetailDto create(CreateTicket req) {
        Ticket ticket = new Ticket(req.subject().trim(), req.description().trim(),
                req.requesterName().trim(), req.requesterEmail().trim());
        if (req.assigneeId() != null) {
            ticket.setAssignee(loadAgent(req.assigneeId()));
        }
        ticket = tickets.save(ticket);
        messages.save(new Message(ticket, AuthorType.REQUESTER, ticket.getRequesterName(), null,
                ticket.getDescription()));
        if (ticket.getAssignee() != null) {
            systemMessage(ticket, "Assigned to " + ticket.getAssignee().getName());
        }
        return detail(ticket);
    }

    @Transactional
    public TicketDetailDto assign(Long ticketId, Long agentId) {
        Ticket ticket = load(ticketId);
        ensureNotClosed(ticket);
        Agent current = ticket.getAssignee();
        Agent next = agentId == null ? null : loadAgent(agentId);
        Long currentId = current == null ? null : current.getId();
        Long nextId = next == null ? null : next.getId();
        if (Objects.equals(currentId, nextId)) {
            return detail(ticket);
        }
        ticket.setAssignee(next);
        ticket.touch();
        if (next == null) {
            systemMessage(ticket, "Unassigned from " + current.getName());
        } else if (current == null) {
            systemMessage(ticket, "Assigned to " + next.getName());
        } else {
            systemMessage(ticket, "Reassigned from " + current.getName() + " to " + next.getName());
        }
        return detail(ticket);
    }

    @Transactional
    public TicketDetailDto changeStatus(Long ticketId, TicketStatus target, Long actorAgentId) {
        Ticket ticket = load(ticketId);
        TicketStatus from = ticket.getStatus();
        if (from == target) {
            return detail(ticket);
        }
        if (!from.canTransitionTo(target)) {
            throw ApiException.conflict("Cannot change status from " + from + " to " + target
                    + ". Allowed: " + from.allowedTransitions());
        }
        String actor = actorAgentId == null ? "" : " by " + loadAgent(actorAgentId).getName();
        ticket.setStatus(target);
        ticket.touch();
        systemMessage(ticket, "Status changed from " + from + " to " + target + actor);
        return detail(ticket);
    }

    @Transactional(readOnly = true)
    public List<MessageDto> listMessages(Long ticketId) {
        load(ticketId);
        return messages.findByTicketIdOrderByCreatedAtAscIdAsc(ticketId).stream()
                .map(MessageDto::from)
                .toList();
    }

    @Transactional
    public MessageDto addMessage(Long ticketId, AddMessage req) {
        Ticket ticket = load(ticketId);
        ensureNotClosed(ticket);

        Message message = switch (req.authorType()) {
            case REQUESTER -> new Message(ticket, AuthorType.REQUESTER, ticket.getRequesterName(), null,
                    req.body().trim());
            case AGENT -> {
                if (req.agentId() == null) {
                    throw ApiException.badRequest("agentId is required when authorType is AGENT");
                }
                Agent agent = loadAgent(req.agentId());
                yield new Message(ticket, AuthorType.AGENT, agent.getName(), agent, req.body().trim());
            }
            case SYSTEM -> throw ApiException.badRequest("authorType must be REQUESTER or AGENT");
        };
        message = messages.save(message);
        ticket.touch();

        if (req.authorType() == AuthorType.REQUESTER
                && (ticket.getStatus() == TicketStatus.PENDING || ticket.getStatus() == TicketStatus.SOLVED)) {
            TicketStatus from = ticket.getStatus();
            ticket.setStatus(TicketStatus.OPEN);
            systemMessage(ticket, "Status changed from " + from + " to OPEN (requester replied)");
        }
        return MessageDto.from(message);
    }

    private void systemMessage(Ticket ticket, String text) {
        messages.save(new Message(ticket, AuthorType.SYSTEM, SYSTEM_AUTHOR, null, text));
    }

    private void ensureNotClosed(Ticket ticket) {
        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw ApiException.conflict("Ticket " + ticket.getId() + " is closed");
        }
    }

    private TicketDetailDto detail(Ticket ticket) {
        return TicketDetailDto.from(ticket, messages.findByTicketIdOrderByCreatedAtAscIdAsc(ticket.getId()));
    }

    private Ticket load(Long id) {
        return tickets.findById(id).orElseThrow(() -> ApiException.notFound("Ticket " + id + " not found"));
    }

    private Agent loadAgent(Long id) {
        return agents.findById(id).orElseThrow(() -> ApiException.notFound("Agent " + id + " not found"));
    }
}
