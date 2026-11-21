package com.support.desk.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "messages", indexes = @Index(name = "idx_messages_ticket", columnList = "ticket_id"))
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthorType authorType;

    @Column(nullable = false)
    private String authorName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_id")
    private Agent agent;

    @Column(nullable = false, length = 10000)
    private String body;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Message() {
    }

    public Message(Ticket ticket, AuthorType authorType, String authorName, Agent agent, String body) {
        this.ticket = ticket;
        this.authorType = authorType;
        this.authorName = authorName;
        this.agent = agent;
        this.body = body;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public Ticket getTicket() { return ticket; }
    public AuthorType getAuthorType() { return authorType; }
    public String getAuthorName() { return authorName; }
    public Agent getAgent() { return agent; }
    public String getBody() { return body; }
    public Instant getCreatedAt() { return createdAt; }
}
