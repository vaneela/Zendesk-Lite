package com.support.desk;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TicketFlowIntegrationTest {

    @DynamicPropertySource
    static void sqlite(DynamicPropertyRegistry registry) throws IOException {
        File db = File.createTempFile("support-test", ".db");
        db.deleteOnExit();
        registry.add("spring.datasource.url", () -> "jdbc:sqlite:" + db.getAbsolutePath() + "?foreign_keys=on");
    }

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    private ResultActions send(MockHttpServletRequestBuilder req, String body) throws Exception {
        return mvc.perform(req.contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private JsonNode read(ResultActions r) throws Exception {
        return json.readTree(r.andReturn().getResponse().getContentAsString());
    }

    private long createAgent(String name, String email) throws Exception {
        return read(send(post("/api/agents"), """
                {"name":"%s","email":"%s"}""".formatted(name, email))
                .andExpect(status().isCreated())).get("id").asLong();
    }

    private long createTicket() throws Exception {
        return read(send(post("/api/tickets"), """
                {"subject":"Cannot login","description":"Password reset email never arrives",
                 "requesterName":"Dana","requesterEmail":"dana@example.com"}""")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.messages.length()").value(1))).get("id").asLong();
    }

    @Test
    void fullTicketLifecycle() throws Exception {
        long agentA = createAgent("Agent A", "a-flow@test.local");
        long agentB = createAgent("Agent B", "b-flow@test.local");
        long id = createTicket();

        send(put("/api/tickets/" + id + "/assignee"), "{\"agentId\":" + agentA + "}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignee.id").value(agentA));
        send(put("/api/tickets/" + id + "/assignee"), "{\"agentId\":" + agentB + "}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignee.id").value(agentB));

        send(post("/api/tickets/" + id + "/messages"),
                "{\"authorType\":\"AGENT\",\"agentId\":" + agentB + ",\"body\":\"Can you check spam?\"}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.authorName").value("Agent B"));

        send(patch("/api/tickets/" + id + "/status"), "{\"status\":\"PENDING\",\"agentId\":" + agentB + "}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));

        send(post("/api/tickets/" + id + "/messages"),
                "{\"authorType\":\"REQUESTER\",\"body\":\"Not in spam either\"}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.authorName").value("Dana"));

        mvc.perform(get("/api/tickets/" + id))
                .andExpect(jsonPath("$.status").value("OPEN"));

        send(patch("/api/tickets/" + id + "/status"), "{\"status\":\"CLOSED\"}")
                .andExpect(status().isConflict());
        send(patch("/api/tickets/" + id + "/status"), "{\"status\":\"SOLVED\"}")
                .andExpect(status().isOk());
        send(patch("/api/tickets/" + id + "/status"), "{\"status\":\"CLOSED\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowedTransitions.length()").value(0));

        send(post("/api/tickets/" + id + "/messages"),
                "{\"authorType\":\"REQUESTER\",\"body\":\"one more thing\"}")
                .andExpect(status().isConflict());

        JsonNode thread = read(mvc.perform(get("/api/tickets/" + id + "/messages")).andExpect(status().isOk()));
        assertThat(thread.get(0).get("body").asText()).isEqualTo("Password reset email never arrives");
        assertThat(thread.findValuesAsText("authorType")).contains("REQUESTER", "AGENT", "SYSTEM");
        long prev = Long.MIN_VALUE;
        for (JsonNode m : thread) {
            assertThat(m.get("id").asLong()).isGreaterThan(prev);
            prev = m.get("id").asLong();
        }

        mvc.perform(get("/api/tickets").param("status", "CLOSED").param("assigneeId", String.valueOf(agentB)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + id + ")]").exists());
    }

    @Test
    void validationAndNotFound() throws Exception {
        send(post("/api/tickets"), "{\"subject\":\"\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.subject").exists())
                .andExpect(jsonPath("$.fieldErrors.requesterEmail").exists());
        mvc.perform(get("/api/tickets/999999")).andExpect(status().isNotFound());

        long id = createTicket();
        send(put("/api/tickets/" + id + "/assignee"), "{\"agentId\":999999}")
                .andExpect(status().isNotFound());
        send(post("/api/tickets/" + id + "/messages"), "{\"authorType\":\"AGENT\",\"body\":\"hi\"}")
                .andExpect(status().isBadRequest());
        send(post("/api/tickets/" + id + "/messages"), "{\"authorType\":\"SYSTEM\",\"body\":\"hi\"}")
                .andExpect(status().isBadRequest());
    }
}
