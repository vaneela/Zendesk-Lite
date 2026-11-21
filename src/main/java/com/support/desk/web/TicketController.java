package com.support.desk.web;

import com.support.desk.domain.TicketStatus;
import com.support.desk.dto.Requests.AddMessage;
import com.support.desk.dto.Requests.AssignTicket;
import com.support.desk.dto.Requests.CreateTicket;
import com.support.desk.dto.Requests.UpdateStatus;
import com.support.desk.dto.Responses.MessageDto;
import com.support.desk.dto.Responses.StatusInfoDto;
import com.support.desk.dto.Responses.TicketDetailDto;
import com.support.desk.dto.Responses.TicketSummaryDto;
import com.support.desk.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @GetMapping("/tickets")
    public List<TicketSummaryDto> list(@RequestParam(required = false) TicketStatus status,
                                       @RequestParam(required = false) Long assigneeId,
                                       @RequestParam(defaultValue = "false") boolean unassigned,
                                       @RequestParam(required = false) String q) {
        return service.search(status, assigneeId, unassigned, q);
    }

    @PostMapping("/tickets")
    @ResponseStatus(HttpStatus.CREATED)
    public TicketDetailDto create(@Valid @RequestBody CreateTicket req) {
        return service.create(req);
    }

    @GetMapping("/tickets/{id}")
    public TicketDetailDto get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/tickets/{id}/assignee")
    public TicketDetailDto assign(@PathVariable Long id, @RequestBody AssignTicket req) {
        return service.assign(id, req.agentId());
    }

    @PatchMapping("/tickets/{id}/status")
    public TicketDetailDto changeStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatus req) {
        return service.changeStatus(id, req.status(), req.agentId());
    }

    @GetMapping("/tickets/{id}/messages")
    public List<MessageDto> messages(@PathVariable Long id) {
        return service.listMessages(id);
    }

    @PostMapping("/tickets/{id}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto addMessage(@PathVariable Long id, @Valid @RequestBody AddMessage req) {
        return service.addMessage(id, req);
    }

    @GetMapping("/statuses")
    public List<StatusInfoDto> statuses() {
        return Arrays.stream(TicketStatus.values())
                .map(s -> new StatusInfoDto(s, s.allowedTransitions()))
                .toList();
    }
}
