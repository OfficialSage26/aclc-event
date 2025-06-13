-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, student_id, role, department, year_level, phone_number) VALUES
('admin@aclc.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Administrator', NULL, 'ADMIN', 'IT Department', NULL, '09123456789'),
('organizer@aclc.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Event', 'Organizer', 'ORG001', 'ORGANIZER', 'Student Affairs', NULL, '09123456790'),
('maria.santos@aclc.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria', 'Santos', 'FAC001', 'FACULTY', 'Computer Science', NULL, '09123456791'),
('john.doe@student.aclc.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '2024-001', 'STUDENT', 'Computer Science', '4th Year', '09123456792'),
('jane.smith@student.aclc.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', '2024-002', 'STUDENT', 'Information Technology', '3rd Year', '09123456793');

-- Insert sample events
INSERT INTO events (title, description, event_date, end_date, location, max_participants, status, event_type, organizer_id, approved_by, approval_date) VALUES
('Tech Summit 2024', 'Annual technology summit featuring latest trends in IT', '2024-07-15 09:00:00', '2024-07-15 17:00:00', 'ACLC Auditorium', 200, 'APPROVED', 'SEMINAR', 2, 1, NOW()),
('Cultural Night', 'Showcase of Filipino culture and traditions', '2024-07-20 18:00:00', '2024-07-20 22:00:00', 'ACLC Gymnasium', 300, 'APPROVED', 'CULTURAL', 2, 1, NOW()),
('Programming Workshop', 'Hands-on workshop on modern web development', '2024-07-25 13:00:00', '2024-07-25 17:00:00', 'Computer Lab 1', 30, 'PENDING', 'WORKSHOP', 2, NULL, NULL),
('Sports Fest Opening', 'Opening ceremony for annual sports festival', '2024-08-01 08:00:00', '2024-08-01 10:00:00', 'ACLC Sports Complex', 500, 'DRAFT', 'SPORTS', 2, NULL, NULL);

-- Insert sample registrations
INSERT INTO event_registrations (event_id, user_id, status) VALUES
(1, 4, 'REGISTERED'),
(1, 5, 'REGISTERED'),
(2, 4, 'REGISTERED'),
(2, 5, 'REGISTERED'),
(3, 4, 'REGISTERED');

-- Insert sample attendance
INSERT INTO attendance (event_id, user_id, check_in_time, status, check_in_method) VALUES
(1, 4, '2024-07-15 09:15:00', 'PRESENT', 'QR_CODE'),
(1, 5, '2024-07-15 09:30:00', 'LATE', 'MANUAL'),
(2, 4, '2024-07-20 18:05:00', 'PRESENT', 'QR_CODE');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, related_event_id) VALUES
(4, 'Event Registration Confirmed', 'You have successfully registered for Tech Summit 2024', 'REGISTRATION_CONFIRMED', 1),
(5, 'Event Registration Confirmed', 'You have successfully registered for Tech Summit 2024', 'REGISTRATION_CONFIRMED', 1),
(4, 'Event Reminder', 'Tech Summit 2024 starts tomorrow at 9:00 AM', 'EVENT_REMINDER', 1),
(2, 'Event Approved', 'Your event "Tech Summit 2024" has been approved', 'EVENT_APPROVED', 1);

COMMIT;
