package com.support.desk.dto;

import com.support.desk.domain.AuthorType;
import com.support.desk.domain.TicketStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class Requests {

    private Requests() {
    }

    public record CreateAgent(
            @NotBlank @Size(max = 200) String name,
            @NotBlank @Email @Size(max = 320) String email) {
    }

    public record CreateTicket(
            @NotBlank @Size(max = 300) String subject,
            @NotBlank @Size(max = 10000) String description,
            @NotBlank @Size(max = 200) String requesterName,
            @NotBlank @Email @Size(max = 320) String requesterEmail,
            Long assigneeId) {
    }

    /** agentId == null unassigns the ticket. */
    public record AssignTicket(Long agentId) {
    }

    public record UpdateStatus(@NotNull TicketStatus status, Long agentId) {
    }

    /** authorType must be REQUESTER or AGENT; agentId is required when AGENT. */
    public record AddMessage(
            @NotNull AuthorType authorType,
            Long agentId,
            @NotBlank @Size(max = 10000) String body) {
    }
}
