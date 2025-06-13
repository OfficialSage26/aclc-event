package com.aclc.eventmanagement.controller;

import com.aclc.eventmanagement.dto.AttendanceDTO;
import com.aclc.eventmanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AttendanceDTO>> getEventAttendance(@PathVariable Long eventId) {
        List<AttendanceDTO> attendance = attendanceService.getEventAttendance(eventId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AttendanceDTO>> getUserAttendance(@PathVariable Long userId) {
        List<AttendanceDTO> attendance = attendanceService.getUserAttendance(userId);
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestBody CheckInRequest request) {
        AttendanceDTO attendance = attendanceService.checkInUser(
            request.getEventId(), 
            request.getUserId(), 
            request.getCheckInMethod()
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("attendance", attendance);
        response.put("message", "Check-in successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkOut(@RequestBody CheckOutRequest request) {
        AttendanceDTO attendance = attendanceService.checkOutUser(request.getEventId(), request.getUserId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("attendance", attendance);
        response.put("message", "Check-out successful");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<Map<String, Object>> getEventAttendanceStats(@PathVariable Long eventId) {
        Map<String, Object> stats = attendanceService.getEventAttendanceStats(eventId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/qr/{eventId}/{userId}")
    public ResponseEntity<Map<String, String>> generateQRCode(@PathVariable Long eventId, @PathVariable Long userId) {
        String qrCode = attendanceService.generateQRCode(eventId, userId);
        Map<String, String> response = new HashMap<>();
        response.put("qrCode", qrCode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/qr/scan")
    public ResponseEntity<?> scanQRCode(@RequestBody QRScanRequest request) {
        AttendanceDTO attendance = attendanceService.processQRScan(request.getQrCode());
        
        Map<String, Object> response = new HashMap<>();
        response.put("attendance", attendance);
        response.put("message", "QR scan successful");
        return ResponseEntity.ok(response);
    }

    // Inner classes for request bodies
    public static class CheckInRequest {
        private Long eventId;
        private Long userId;
        private String checkInMethod;

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getCheckInMethod() { return checkInMethod; }
        public void setCheckInMethod(String checkInMethod) { this.checkInMethod = checkInMethod; }
    }

    public static class CheckOutRequest {
        private Long eventId;
        private Long userId;

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    public static class QRScanRequest {
        private String qrCode;

        public String getQrCode() { return qrCode; }
        public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    }
}
