package com.support.desk.service;

import com.support.desk.domain.Agent;
import com.support.desk.dto.Requests.CreateAgent;
import com.support.desk.error.ApiException;
import com.support.desk.repository.AgentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AgentService {

    private final AgentRepository agents;

    public AgentService(AgentRepository agents) {
        this.agents = agents;
    }

    @Transactional(readOnly = true)
    public List<Agent> list() {
        return agents.findAll();
    }

    @Transactional(readOnly = true)
    public Agent get(Long id) {
        return agents.findById(id).orElseThrow(() -> ApiException.notFound("Agent " + id + " not found"));
    }

    @Transactional
    public Agent create(CreateAgent req) {
        String email = req.email().trim();
        if (agents.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Agent with email " + email + " already exists");
        }
        return agents.save(new Agent(req.name().trim(), email));
    }
}
