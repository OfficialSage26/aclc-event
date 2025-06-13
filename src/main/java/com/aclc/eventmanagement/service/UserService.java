package com.aclc.eventmanagement.service;

import com.aclc.eventmanagement.model.User;
import com.aclc.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if student ID already exists (for students)
        if (user.getStudentId() != null && userRepository.existsByStudentId(user.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setName(userDetails.getName());
        user.setDepartment(userDetails.getDepartment());
        
        // Only update email if it's different and not taken
        if (!user.getEmail().equals(userDetails.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(userDetails.getEmail());
        }

        // Only update student ID if it's different and not taken
        if (userDetails.getStudentId() != null && !userDetails.getStudentId().equals(user.getStudentId())) {
            if (userRepository.existsByStudentId(userDetails.getStudentId())) {
                throw new RuntimeException("Student ID already exists");
            }
            user.setStudentId(userDetails.getStudentId());
        }

        return userRepository.save(user);
    }

    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(true);
        userRepository.save(user);
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = getUserById(id);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<User> searchUsers(String searchTerm) {
        return userRepository.findByNameContainingOrEmailContaining(searchTerm, searchTerm);
    }
}
