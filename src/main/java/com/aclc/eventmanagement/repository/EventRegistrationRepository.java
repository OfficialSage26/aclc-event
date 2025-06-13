package com.aclc.eventmanagement.repository;

import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.EventRegistration;
import com.aclc.eventmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    Optional<EventRegistration> findByEventAndUser(Event event, User user);
    
    List<EventRegistration> findByEvent(Event event);
    
    List<EventRegistration> findByUser(User user);
    
    List<EventRegistration> findByEventAndStatus(Event event, EventRegistration.RegistrationStatus status);
    
    boolean existsByEventAndUser(Event event, User user);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.event = :event AND er.status = 'REGISTERED'")
    long countRegisteredByEvent(@Param("event") Event event);
    
    @Query("SELECT er FROM EventRegistration er WHERE er.user = :user AND er.event.eventDate >= CURRENT_TIMESTAMP ORDER BY er.event.eventDate ASC")
    List<EventRegistration> findUpcomingRegistrationsByUser(@Param("user") User user);
}
