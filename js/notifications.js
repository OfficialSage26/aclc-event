// Notifications Management
class NotificationsManager {
  constructor() {
    this.notifications = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    const markAllReadBtn = document.getElementById("markAllReadBtn")

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", () => this.markAllAsRead())
    }
  }

  async loadNotifications() {
    try {
      showLoading()

      // Mock notifications data since we don't have the notification API endpoint
      this.notifications = this.getMockNotifications()
      this.displayNotifications()
      this.updateNotificationStats()
    } catch (error) {
      console.error("Error loading notifications:", error)
      showNotification("Error loading notifications", "error")
    } finally {
      hideLoading()
    }
  }

  getMockNotifications() {
    const currentUser = authManager.getCurrentUser()
    if (!currentUser) return []

    const baseNotifications = [
      {
        id: 1,
        title: "Event Registration Confirmed",
        message: "You have successfully registered for Tech Innovation Summit",
        type: "success",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: false,
      },
      {
        id: 2,
        title: "Event Reminder",
        message: "Career Fair 2024 starts tomorrow at 10:00 AM",
        type: "info",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: false,
      },
      {
        id: 3,
        title: "Event Updated",
        message: "Student Orientation venue has been changed to Main Auditorium",
        type: "warning",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionRequired: false,
      },
    ]

    // Add role-specific notifications
    if (currentUser.role === "ADMIN" || currentUser.role === "FACULTY") {
      baseNotifications.unshift({
        id: 4,
        title: "Event Approval Required",
        message: "New event 'AI Workshop Series' requires your approval",
        type: "warning",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
      })
    }

    return baseNotifications
  }

  displayNotifications() {
    const container = document.getElementById("notificationsList")

    if (this.notifications.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-bell"></i>
          <h3>No Notifications</h3>
          <p>You're all caught up! No new notifications.</p>
        </div>
      `
      return
    }

    container.innerHTML = this.notifications
      .map(
        (notification) => `
      <div class="notification-item ${!notification.read ? "unread" : ""}" data-id="${notification.id}">
        <div class="notification-icon ${notification.type}">
          <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${this.formatTimeAgo(notification.timestamp)}</div>
          ${notification.actionRequired ? '<span class="badge badge-danger">Action Required</span>' : ""}
        </div>
        <div class="notification-actions">
          ${
            !notification.read
              ? `
            <button class="btn btn-sm btn-primary" onclick="window.notificationsManager.markAsRead(${notification.id})">
              Mark Read
            </button>
          `
              : ""
          }
          <button class="btn btn-sm btn-secondary" onclick="window.notificationsManager.deleteNotification(${notification.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }

  updateNotificationStats() {
    const unreadCount = this.notifications.filter((n) => !n.read).length
    const actionRequiredCount = this.notifications.filter((n) => n.actionRequired && !n.read).length

    document.getElementById("unreadCount").textContent = unreadCount
    document.getElementById("actionRequiredCount").textContent = actionRequiredCount
  }

  getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "check-circle"
      case "warning":
        return "exclamation-triangle"
      case "error":
        return "times-circle"
      case "info":
        return "info-circle"
      default:
        return "bell"
    }
  }

  formatTimeAgo(timestamp) {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.displayNotifications()
      this.updateNotificationStats()
      showNotification("Notification marked as read", "success")
    }
  }

  markAllAsRead() {
    this.notifications.forEach((notification) => {
      notification.read = true
    })
    this.displayNotifications()
    this.updateNotificationStats()
    showNotification("All notifications marked as read", "success")
  }

  deleteNotification(notificationId) {
    const index = this.notifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      this.notifications.splice(index, 1)
      this.displayNotifications()
      this.updateNotificationStats()
      showNotification("Notification deleted", "info")
    }
  }
}
