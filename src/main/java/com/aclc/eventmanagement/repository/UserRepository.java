package com.aclc.eventmanagement.repository;

import com.aclc.eventmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByDepartment(String department);
    
    Page<User> findByIsActiveTrue(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name% OR u.email LIKE %:email%")
    List<User> findByNameContainingOrEmailContaining(@Param("name") String name, @Param("email") String email);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.Role role);
}
