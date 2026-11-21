package com.support.desk.config;

import com.support.desk.domain.Agent;
import com.support.desk.repository.AgentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed-agents", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final AgentRepository agents;

    public DataSeeder(AgentRepository agents) {
        this.agents = agents;
    }

    @Override
    public void run(String... args) {
        if (agents.count() == 0) {
            agents.save(new Agent("Alice Johnson", "alice@support.local"));
            agents.save(new Agent("Bob Smith", "bob@support.local"));
            agents.save(new Agent("Carol Lee", "carol@support.local"));
        }
    }
}
