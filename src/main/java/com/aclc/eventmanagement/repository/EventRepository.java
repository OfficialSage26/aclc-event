package com.aclc.eventmanagement.repository;

import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByStatus(Event.EventStatus status);
    
    List<Event> findByCategory(Event.EventCategory category);
    
    List<Event> findByOrganizer(User organizer);
    
    Page<Event> findByStatusOrderByEventDateAsc(Event.EventStatus status, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN :startDate AND :endDate ORDER BY e.eventDate ASC")
    List<Event> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :currentDate AND e.status = 'APPROVED' ORDER BY e.eventDate ASC")
    List<Event> findUpcomingApprovedEvents(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword% OR e.description LIKE %:keyword%")
    List<Event> searchEvents(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = :status")
    long countByStatus(@Param("status") Event.EventStatus status);
    
    @Query("SELECT e.category, COUNT(e) FROM Event e GROUP BY e.category")
    List<Object[]> getEventCountByCategory();
    
    @Query("SELECT MONTH(e.eventDate), COUNT(e) FROM Event e WHERE YEAR(e.eventDate) = :year GROUP BY MONTH(e.eventDate)")
    List<Object[]> getMonthlyEventCount(@Param("year") int year);
}
