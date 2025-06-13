// Dashboard Management
class DashboardManager {
  constructor() {
    this.stats = {
      totalEvents: 0,
      upcomingEvents: 0,
      totalAttendees: 0,
      myAttendance: 0,
    }
  }

  async loadDashboard() {
    try {
      showLoading()
      await this.loadStats()
      await this.loadRecentEvents()
    } catch (error) {
      console.error("Error loading dashboard:", error)
      showNotification("Error loading dashboard data", "error")
    } finally {
      hideLoading()
    }
  }

  async loadStats() {
    try {
      // Load events
      const events = await api.getEvents()
      const upcomingEvents = await api.getUpcomingEvents()

      this.stats.totalEvents = events.content ? events.content.length : events.length
      this.stats.upcomingEvents = upcomingEvents.length

      // Calculate total attendees (mock data for now)
      this.stats.totalAttendees = this.stats.totalEvents * 45 // Average attendees

      // Get user's events/attendance
      const currentUser = authManager.getCurrentUser()
      if (currentUser) {
        if (currentUser.role === "STUDENT") {
          // For students, show their registered events
          this.stats.myAttendance = Math.floor(this.stats.upcomingEvents * 0.6)
        } else {
          // For organizers/faculty/admin, show events they organized
          this.stats.myAttendance = Math.floor(this.stats.totalEvents * 0.3)
        }
      }

      this.updateStatsDisplay()
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  updateStatsDisplay() {
    document.getElementById("totalEvents").textContent = this.stats.totalEvents
    document.getElementById("upcomingEvents").textContent = this.stats.upcomingEvents
    document.getElementById("totalAttendees").textContent = this.stats.totalAttendees
    document.getElementById("myAttendance").textContent = this.stats.myAttendance
  }

  async loadRecentEvents() {
    try {
      const events = await api.getUpcomingEvents()
      const recentEvents = events.slice(0, 5) // Show only 5 recent events

      const container = document.getElementById("recentEventsList")
      container.innerHTML = ""

      if (recentEvents.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-calendar"></i>
            <h3>No Recent Events</h3>
            <p>No events found. Create your first event to get started.</p>
          </div>
        `
        return
      }

      recentEvents.forEach((event) => {
        const eventElement = this.createEventListItem(event)
        container.appendChild(eventElement)
      })
    } catch (error) {
      console.error("Error loading recent events:", error)
    }
  }

  createEventListItem(event) {
    const div = document.createElement("div")
    div.className = "event-list-item"
    div.onclick = () => this.showEventDetails(event)

    div.innerHTML = `
      <div class="event-list-info">
        <h4>${event.title}</h4>
        <p><i class="fas fa-calendar"></i> ${formatDate(event.eventDate)}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
      </div>
      <div class="event-list-meta">
        <div class="event-date">${formatTime(event.eventDate)}</div>
        <span class="badge badge-${this.getStatusColor(event.status)}">${event.status}</span>
      </div>
    `

    return div
  }

  getStatusColor(status) {
    switch (status) {
      case "APPROVED":
        return "success"
      case "PENDING":
        return "warning"
      case "REJECTED":
        return "danger"
      case "COMPLETED":
        return "info"
      default:
        return "secondary"
    }
  }

  showEventDetails(event) {
    if (window.eventsManager) {
      window.eventsManager.showEventModal(event)
    }
  }
}
