package com.aclc.eventmanagement.dto;

import com.aclc.eventmanagement.model.Attendance;

import java.time.LocalDateTime;

public class AttendanceDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private String studentId;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Attendance.AttendanceStatus status;
    private String checkInMethod;
    private LocalDateTime createdAt;

    // Constructors
    public AttendanceDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public Attendance.AttendanceStatus getStatus() { return status; }
    public void setStatus(Attendance.AttendanceStatus status) { this.status = status; }

    public String getCheckInMethod() { return checkInMethod; }
    public void setCheckInMethod(String checkInMethod) { this.checkInMethod = checkInMethod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
