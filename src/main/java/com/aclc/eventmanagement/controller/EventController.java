package com.aclc.eventmanagement.controller;

import com.aclc.eventmanagement.dto.EventDTO;
import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventDTO>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Event.EventStatus status) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDTO> events;
        
        if (status != null) {
            events = eventService.getEventsByStatus(status, pageable);
        } else {
            events = eventService.getAllEvents(pageable);
        }
        
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        EventDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO eventDTO) {
        EventDTO createdEvent = eventService.createEvent(eventDTO);
        return ResponseEntity.ok(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDTO eventDTO) {
        EventDTO updatedEvent = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Event deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<EventDTO>> getEventsForCalendar(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<EventDTO> events = eventService.getEventsBetweenDates(start, end);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchEvents(@RequestParam String keyword) {
        List<EventDTO> events = eventService.searchEvents(keyword);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EventDTO>> getEventsByCategory(@PathVariable Event.EventCategory category) {
        List<EventDTO> events = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<EventDTO>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<EventDTO> events = eventService.getEventsByOrganizer(organizerId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EventDTO> approveEvent(
            @PathVariable Long id,
            @RequestParam Long approverId,
            @RequestParam(required = false) String comments) {
        
        EventDTO approvedEvent = eventService.approveEvent(id, approverId, comments);
        return ResponseEntity.ok(approvedEvent);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<EventDTO> rejectEvent(
            @PathVariable Long id,
            @RequestParam Long reviewerId,
            @RequestParam(required = false) String comments) {
        
        EventDTO rejectedEvent = eventService.rejectEvent(id, reviewerId, comments);
        return ResponseEntity.ok(rejectedEvent);
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long id, @RequestParam Long userId) {
        eventService.registerUserForEvent(id, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully registered for event");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<?> unregisterFromEvent(@PathVariable Long id, @RequestParam Long userId) {
        eventService.unregisterUserFromEvent(id, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully unregistered from event");
        return ResponseEntity.ok(response);
    }
}
