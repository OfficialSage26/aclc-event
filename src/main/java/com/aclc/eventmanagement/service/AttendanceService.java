package com.aclc.eventmanagement.service;

import com.aclc.eventmanagement.dto.AttendanceDTO;
import com.aclc.eventmanagement.model.Attendance;
import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.User;
import com.aclc.eventmanagement.repository.AttendanceRepository;
import com.aclc.eventmanagement.repository.EventRepository;
import com.aclc.eventmanagement.repository.EventRegistrationRepository;
import com.aclc.eventmanagement.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    public List<AttendanceDTO> getEventAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Attendance> attendanceList = attendanceRepository.findByEvent(event);
        return attendanceList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<AttendanceDTO> getUserAttendance(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Attendance> attendanceList = attendanceRepository.findByUser(user);
        return attendanceList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public AttendanceDTO checkInUser(Long eventId, Long userId, String checkInMethod) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is registered for the event
        if (!registrationRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("User is not registered for this event");
        }

        // Check if already checked in
        if (attendanceRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("User already checked in for this event");
        }

        Attendance attendance = new Attendance(event, user, LocalDateTime.now());
        attendance.setCheckInMethod(checkInMethod);
        attendance.setStatus(Attendance.AttendanceStatus.PRESENT);

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToDTO(savedAttendance);
    }

    public AttendanceDTO checkOutUser(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Attendance attendance = attendanceRepository.findByEventAndUser(event, user)
            .orElseThrow(() -> new RuntimeException("User has not checked in for this event"));

        attendance.setCheckOutTime(LocalDateTime.now());
        Attendance savedAttendance = attendanceRepository.save(attendance);

        return convertToDTO(savedAttendance);
    }

    public Map<String, Object> getEventAttendanceStats(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        long totalRegistered = registrationRepository.countRegisteredByEvent(event);
        long totalPresent = attendanceRepository.countPresentByEvent(event);
        double attendanceRate = totalRegistered > 0 ? (double) totalPresent / totalRegistered * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRegistered", totalRegistered);
        stats.put("totalPresent", totalPresent);
        stats.put("totalAbsent", totalRegistered - totalPresent);
        stats.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);

        return stats;
    }

    public String generateQRCode(Long eventId, Long userId) {
        try {
            String qrData = eventId + ":" + userId + ":" + System.currentTimeMillis();
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 200, 200);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            byte[] qrCodeBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qrCodeBytes);
            
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public AttendanceDTO processQRScan(String qrCode) {
        try {
            // Decode QR code data
            String[] parts = qrCode.split(":");
            if (parts.length != 3) {
                throw new RuntimeException("Invalid QR code format");
            }

            Long eventId = Long.parseLong(parts[0]);
            Long userId = Long.parseLong(parts[1]);

            return checkInUser(eventId, userId, "QR_CODE");

        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid QR code data", e);
        }
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setEventId(attendance.getEvent().getId());
        dto.setEventTitle(attendance.getEvent().getTitle());
        dto.setUserId(attendance.getUser().getId());
        dto.setUserName(attendance.getUser().getName());
        dto.setStudentId(attendance.getUser().getStudentId());
        dto.setCheckInTime(attendance.getCheckInTime());
        dto.setCheckOutTime(attendance.getCheckOutTime());
        dto.setStatus(attendance.getStatus());
        dto.setCheckInMethod(attendance.getCheckInMethod());
        dto.setCreatedAt(attendance.getCreatedAt());
        return dto;
    }
}
