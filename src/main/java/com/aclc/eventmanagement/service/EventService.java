package com.aclc.eventmanagement.service;

import com.aclc.eventmanagement.dto.EventDTO;
import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.EventRegistration;
import com.aclc.eventmanagement.model.User;
import com.aclc.eventmanagement.repository.EventRepository;
import com.aclc.eventmanagement.repository.EventRegistrationRepository;
import com.aclc.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private NotificationService notificationService;

    public Page<EventDTO> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Page<EventDTO> getEventsByStatus(Event.EventStatus status, Pageable pageable) {
        return eventRepository.findByStatusOrderByEventDateAsc(status, pageable).map(this::convertToDTO);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }

    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        
        // Set status based on organizer role
        User organizer = userRepository.findById(eventDTO.getOrganizerId())
            .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        if (organizer.getRole() == User.Role.ADMIN) {
            event.setStatus(Event.EventStatus.APPROVED);
        } else {
            event.setStatus(Event.EventStatus.PENDING);
        }
        
        Event savedEvent = eventRepository.save(event);
        
        // Send notification to admins/faculty for approval if needed
        if (savedEvent.getStatus() == Event.EventStatus.PENDING) {
            notificationService.notifyForEventApproval(savedEvent);
        }
        
        return convertToDTO(savedEvent);
    }

    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        Event existingEvent = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Update fields
        existingEvent.setTitle(eventDTO.getTitle());
        existingEvent.setDescription(eventDTO.getDescription());
        existingEvent.setEventDate(eventDTO.getEventDate());
        existingEvent.setLocation(eventDTO.getLocation());
        existingEvent.setCapacity(eventDTO.getCapacity());
        existingEvent.setBudget(eventDTO.getBudget());
        existingEvent.setCategory(eventDTO.getCategory());
        
        Event savedEvent = eventRepository.save(existingEvent);
        
        // Notify registered users about changes
        notificationService.notifyEventUpdate(savedEvent);
        
        return convertToDTO(savedEvent);
    }

    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Notify registered users about cancellation
        notificationService.notifyEventCancellation(event);
        
        eventRepository.delete(event);
    }

    public List<EventDTO> getUpcomingEvents() {
        List<Event> events = eventRepository.findUpcomingApprovedEvents(LocalDateTime.now());
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        List<Event> events = eventRepository.findEventsBetweenDates(startDate, endDate);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> searchEvents(String keyword) {
        List<Event> events = eventRepository.searchEvents(keyword);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCategory(Event.EventCategory category) {
        List<Event> events = eventRepository.findByCategory(category);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByOrganizer(Long organizerId) {
        User organizer = userRepository.findById(organizerId)
            .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        List<Event> events = eventRepository.findByOrganizer(organizer);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public EventDTO approveEvent(Long eventId, Long approverId, String comments) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User approver = userRepository.findById(approverId)
            .orElseThrow(() -> new RuntimeException("Approver not found"));
        
        event.setStatus(Event.EventStatus.APPROVED);
        event.setApprovedBy(approver);
        event.setApprovedAt(LocalDateTime.now());
        event.setApprovalComments(comments);
        
        Event savedEvent = eventRepository.save(event);
        
        // Notify organizer and interested users
        notificationService.notifyEventApproval(savedEvent);
        
        return convertToDTO(savedEvent);
    }

    public EventDTO rejectEvent(Long eventId, Long reviewerId, String comments) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User reviewer = userRepository.findById(reviewerId)
            .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        
        event.setStatus(Event.EventStatus.REJECTED);
        event.setApprovedBy(reviewer);
        event.setApprovedAt(LocalDateTime.now());
        event.setApprovalComments(comments);
        
        Event savedEvent = eventRepository.save(event);
        
        // Notify organizer
        notificationService.notifyEventRejection(savedEvent);
        
        return convertToDTO(savedEvent);
    }

    public void registerUserForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already registered
        if (registrationRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("User already registered for this event");
        }
        
        // Check capacity
        long currentRegistrations = registrationRepository.countRegisteredByEvent(event);
        if (currentRegistrations >= event.getCapacity()) {
            throw new RuntimeException("Event is at full capacity");
        }
        
        EventRegistration registration = new EventRegistration(event, user);
        registrationRepository.save(registration);
        
        // Send confirmation notification
        notificationService.notifyEventRegistration(event, user);
    }

    public void unregisterUserFromEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        EventRegistration registration = registrationRepository.findByEventAndUser(event, user)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registrationRepository.delete(registration);
        
        // Send cancellation notification
        notificationService.notifyEventUnregistration(event, user);
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setBudget(event.getBudget());
        dto.setStatus(event.getStatus());
        dto.setCategory(event.getCategory());
        dto.setOrganizerId(event.getOrganizer().getId());
        dto.setOrganizerName(event.getOrganizer().getName());
        
        if (event.getApprovedBy() != null) {
            dto.setApprovedById(event.getApprovedBy().getId());
            dto.setApprovedByName(event.getApprovedBy().getName());
        }
        
        dto.setApprovalComments(event.getApprovalComments());
        dto.setApprovedAt(event.getApprovedAt());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        
        // Set counts
        dto.setRegisteredCount((int) registrationRepository.countRegisteredByEvent(event));
        
        return dto;
    }

    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setLocation(dto.getLocation());
        event.setCapacity(dto.getCapacity());
        event.setBudget(dto.getBudget());
        event.setCategory(dto.getCategory());
        
        User organizer = userRepository.findById(dto.getOrganizerId())
            .orElseThrow(() -> new RuntimeException("Organizer not found"));
        event.setOrganizer(organizer);
        
        return event;
    }
}
