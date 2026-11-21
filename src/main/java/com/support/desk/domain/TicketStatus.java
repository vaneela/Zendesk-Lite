package com.support.desk.domain;

import java.util.EnumSet;
import java.util.Set;

/**
 * Lifecycle: OPEN -> PENDING -> SOLVED -> CLOSED
 * OPEN    - needs agent action.
 * PENDING - agent is waiting on the requester.
 * SOLVED  - agent believes it is resolved; requester may still reply (reopens it).
 * CLOSED  - terminal, read-only.
 */
public enum TicketStatus {
    OPEN, PENDING, SOLVED, CLOSED;

    public Set<TicketStatus> allowedTransitions() {
        return switch (this) {
            case OPEN -> EnumSet.of(PENDING, SOLVED);
            case PENDING -> EnumSet.of(OPEN, SOLVED);
            case SOLVED -> EnumSet.of(OPEN, CLOSED);
            case CLOSED -> EnumSet.noneOf(TicketStatus.class);
        };
    }

    public boolean canTransitionTo(TicketStatus target) {
        return allowedTransitions().contains(target);
    }
}
