package com.aclc.eventmanagement.dto;

import com.aclc.eventmanagement.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventDTO {
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    private String description;
    
    @NotNull
    private LocalDateTime eventDate;
    
    @NotBlank
    @Size(max = 100)
    private String location;
    
    @Positive
    private Integer capacity;
    
    private BigDecimal budget;
    
    private Event.EventStatus status;
    
    private Event.EventCategory category;
    
    private Long organizerId;
    
    private String organizerName;
    
    private Long approvedById;
    
    private String approvedByName;
    
    private String approvalComments;
    
    private LocalDateTime approvedAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Integer registeredCount;
    
    private Integer attendanceCount;

    // Constructors
    public EventDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public Event.EventStatus getStatus() { return status; }
    public void setStatus(Event.EventStatus status) { this.status = status; }

    public Event.EventCategory getCategory() { return category; }
    public void setCategory(Event.EventCategory category) { this.category = category; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public Long getApprovedById() { return approvedById; }
    public void setApprovedById(Long approvedById) { this.approvedById = approvedById; }

    public String getApprovedByName() { return approvedByName; }
    public void setApprovedByName(String approvedByName) { this.approvedByName = approvedByName; }

    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }

    public Integer getAttendanceCount() { return attendanceCount; }
    public void setAttendanceCount(Integer attendanceCount) { this.attendanceCount = attendanceCount; }
}
