package com.support.desk.repository;

import com.support.desk.domain.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    boolean existsByEmailIgnoreCase(String email);
}
