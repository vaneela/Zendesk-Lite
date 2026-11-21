package com.support.desk.web;

import com.support.desk.dto.Requests.CreateAgent;
import com.support.desk.dto.Responses.AgentDto;
import com.support.desk.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService service;

    public AgentController(AgentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AgentDto> list() {
        return service.list().stream().map(AgentDto::from).toList();
    }

    @GetMapping("/{id}")
    public AgentDto get(@PathVariable Long id) {
        return AgentDto.from(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgentDto create(@Valid @RequestBody CreateAgent req) {
        return AgentDto.from(service.create(req));
    }
}
