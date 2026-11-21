package com.support.desk.dto;

import com.support.desk.domain.Agent;
import com.support.desk.domain.AuthorType;
import com.support.desk.domain.Message;
import com.support.desk.domain.Ticket;
import com.support.desk.domain.TicketStatus;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public final class Responses {

    private Responses() {
    }

    public record AgentDto(Long id, String name, String email, Instant createdAt) {
        public static AgentDto from(Agent a) {
            return a == null ? null : new AgentDto(a.getId(), a.getName(), a.getEmail(), a.getCreatedAt());
        }
    }

    public record MessageDto(Long id, Long ticketId, AuthorType authorType, String authorName,
                             Long agentId, String body, Instant createdAt) {
        public static MessageDto from(Message m) {
            return new MessageDto(m.getId(), m.getTicket().getId(), m.getAuthorType(), m.getAuthorName(),
                    m.getAgent() == null ? null : m.getAgent().getId(), m.getBody(), m.getCreatedAt());
        }
    }

    public record TicketSummaryDto(Long id, String subject, String requesterName, String requesterEmail,
                                   TicketStatus status, AgentDto assignee, Instant createdAt, Instant updatedAt) {
        public static TicketSummaryDto from(Ticket t) {
            return new TicketSummaryDto(t.getId(), t.getSubject(), t.getRequesterName(), t.getRequesterEmail(),
                    t.getStatus(), AgentDto.from(t.getAssignee()), t.getCreatedAt(), t.getUpdatedAt());
        }
    }

    public record TicketDetailDto(Long id, String subject, String description, String requesterName,
                                  String requesterEmail, TicketStatus status, Set<TicketStatus> allowedTransitions,
                                  AgentDto assignee, Instant createdAt, Instant updatedAt,
                                  List<MessageDto> messages) {
        public static TicketDetailDto from(Ticket t, List<Message> messages) {
            return new TicketDetailDto(t.getId(), t.getSubject(), t.getDescription(), t.getRequesterName(),
                    t.getRequesterEmail(), t.getStatus(), t.getStatus().allowedTransitions(),
                    AgentDto.from(t.getAssignee()), t.getCreatedAt(), t.getUpdatedAt(),
                    messages.stream().map(MessageDto::from).toList());
        }
    }

    public record StatusInfoDto(TicketStatus status, Set<TicketStatus> allowedTransitions) {
    }
}
