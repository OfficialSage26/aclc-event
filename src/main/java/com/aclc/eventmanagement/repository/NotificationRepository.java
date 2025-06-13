package com.aclc.eventmanagement.repository;

import com.aclc.eventmanagement.model.Notification;
import com.aclc.eventmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndActionRequiredTrueAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    long countUnreadByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.actionRequired = true AND n.isRead = false")
    long countActionRequiredByUser(@Param("user") User user);
}
