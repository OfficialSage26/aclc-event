package com.aclc.eventmanagement.service;

import com.aclc.eventmanagement.model.Event;
import com.aclc.eventmanagement.model.Notification;
import com.aclc.eventmanagement.model.User;
import com.aclc.eventmanagement.repository.NotificationRepository;
import com.aclc.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void notifyForEventApproval(Event event) {
        List<User> adminsAndFaculty = userRepository.findByRole(User.Role.ADMIN);
        adminsAndFaculty.addAll(userRepository.findByRole(User.Role.FACULTY));

        for (User user : adminsAndFaculty) {
            Notification notification = new Notification(
                "New Event Approval Required",
                "Event '" + event.getTitle() + "' requires your approval",
                Notification.NotificationType.APPROVAL_REQUEST,
                user
            );
            notification.setEvent(event);
            notification.setActionRequired(true);
            notificationRepository.save(notification);
        }
    }

    public void notifyEventApproval(Event event) {
        // Notify organizer
        Notification organizerNotification = new Notification(
            "Event Approved",
            "Your event '" + event.getTitle() + "' has been approved",
            Notification.NotificationType.SUCCESS,
            event.getOrganizer()
        );
        organizerNotification.setEvent(event);
        notificationRepository.save(organizerNotification);

        // Notify all students about new approved event
        List<User> students = userRepository.findByRole(User.Role.STUDENT);
        for (User student : students) {
            Notification notification = new Notification(
                "New Event Available",
                "New event '" + event.getTitle() + "' is now available for registration",
                Notification.NotificationType.INFO,
                student
            );
            notification.setEvent(event);
            notificationRepository.save(notification);
        }
    }

    public void notifyEventRejection(Event event) {
        Notification notification = new Notification(
            "Event Rejected",
            "Your event '" + event.getTitle() + "' has been rejected. Reason: " + event.getApprovalComments(),
            Notification.NotificationType.ERROR,
            event.getOrganizer()
        );
        notification.setEvent(event);
        notificationRepository.save(notification);
    }

    public void notifyEventUpdate(Event event) {
        // Get all registered users for this event
        event.getRegistrations().forEach(registration -> {
            Notification notification = new Notification(
                "Event Updated",
                "Event '" + event.getTitle() + "' has been updated. Please check the details.",
                Notification.NotificationType.WARNING,
                registration.getUser()
            );
            notification.setEvent(event);
            notificationRepository.save(notification);
        });
    }

    public void notifyEventCancellation(Event event) {
        // Notify all registered users
        event.getRegistrations().forEach(registration -> {
            Notification notification = new Notification(
                "Event Cancelled",
                "Event '" + event.getTitle() + "' has been cancelled",
                Notification.NotificationType.ERROR,
                registration.getUser()
            );
            notification.setEvent(event);
            notificationRepository.save(notification);
        });
    }

    public void notifyEventRegistration(Event event, User user) {
        Notification notification = new Notification(
            "Registration Confirmed",
            "You have successfully registered for '" + event.getTitle() + "'",
            Notification.NotificationType.SUCCESS,
            user
        );
        notification.setEvent(event);
        notificationRepository.save(notification);
    }

    public void notifyEventUnregistration(Event event, User user) {
        Notification notification = new Notification(
            "Registration Cancelled",
            "You have cancelled your registration for '" + event.getTitle() + "'",
            Notification.NotificationType.INFO,
            user
        );
        notification.setEvent(event);
        notificationRepository.save(notification);
    }

    public void notifyEventReminder(Event event) {
        // Send reminder to all registered users
        event.getRegistrations().forEach(registration -> {
            Notification notification = new Notification(
                "Event Reminder",
                "Reminder: '" + event.getTitle() + "' is tomorrow at " + event.getEventDate(),
                Notification.NotificationType.REMINDER,
                registration.getUser()
            );
            notification.setEvent(event);
            notificationRepository.save(notification);
        });
    }
}
