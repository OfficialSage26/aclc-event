package com.aclc.eventmanagement.repository;

import com.aclc.eventmanagement.model.Attendance;
import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    Optional<Attendance> findByEventAndUser(Event event, User user);
    
    List<Attendance> findByEvent(Event event);
    
    List<Attendance> findByUser(User user);
    
    List<Attendance> findByEventAndStatus(Event event, Attendance.AttendanceStatus status);
    
    boolean existsByEventAndUser(Event event, User user);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.event = :event AND a.status = 'PRESENT'")
    long countPresentByEvent(@Param("event") Event event);
    
    @Query("SELECT a.event.id, COUNT(a) FROM Attendance a WHERE a.status = 'PRESENT' GROUP BY a.event.id")
    List<Object[]> getAttendanceCountByEvent();
    
    @Query("SELECT AVG(CAST((SELECT COUNT(a2) FROM Attendance a2 WHERE a2.event = a.event AND a2.status = 'PRESENT') AS DOUBLE) / " +
           "CAST((SELECT COUNT(er) FROM EventRegistration er WHERE er.event = a.event) AS DOUBLE) * 100) " +
           "FROM Attendance a")
    Double getAverageAttendanceRate();
}
