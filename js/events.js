// Events Management
class EventsManager {
  constructor() {
    this.events = []
    this.filteredEvents = []
    this.currentFilter = "all"
  }

  async loadEvents() {
    try {
      showLoading()
      const response = await api.getEvents()
      this.events = response.content || response
      this.filterEvents(this.currentFilter)
    } catch (error) {
      console.error("Error loading events:", error)
      showNotification("Error loading events", "error")
    } finally {
      hideLoading()
    }
  }

  filterEvents(filter) {
    this.currentFilter = filter
    const currentUser = authManager.getCurrentUser()

    switch (filter) {
      case "upcoming":
        this.filteredEvents = this.events.filter(
          (event) => new Date(event.eventDate) > new Date() && event.status === "APPROVED",
        )
        break
      case "approved":
        this.filteredEvents = this.events.filter((event) => event.status === "APPROVED")
        break
      case "pending":
        this.filteredEvents = this.events.filter((event) => event.status === "PENDING")
        break
      case "my-events":
        if (currentUser) {
          if (currentUser.role === "STUDENT") {
            // For students, show registered events (mock for now)
            this.filteredEvents = this.events.filter((event) => event.status === "APPROVED")
          } else {
            // For organizers/faculty/admin, show their organized events
            this.filteredEvents = this.events.filter((event) => event.organizerId === currentUser.id)
          }
        }
        break
      default:
        this.filteredEvents = this.events
    }

    this.displayEvents()
  }

  displayEvents() {
    const container = document.getElementById("eventsList")
    container.innerHTML = ""

    if (this.filteredEvents.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar"></i>
          <h3>No Events Found</h3>
          <p>No events match your current filter.</p>
        </div>
      `
      return
    }

    this.filteredEvents.forEach((event) => {
      const eventCard = this.createEventCard(event)
      container.appendChild(eventCard)
    })
  }

  createEventCard(event) {
    const div = document.createElement("div")
    div.className = "event-card"
    div.onclick = () => this.showEventModal(event)

    const registeredCount = event.registeredCount || 0
    const capacity = event.capacity || 100
    const progressPercentage = Math.round((registeredCount / capacity) * 100)

    div.innerHTML = `
      <div class="event-header">
        <div class="event-title">${event.title}</div>
        <div class="event-category">${event.category || "General"}</div>
      </div>
      <div class="event-body">
        <div class="event-info">
          <i class="fas fa-calendar"></i>
          <span>${formatDate(event.eventDate)}</span>
        </div>
        <div class="event-info">
          <i class="fas fa-clock"></i>
          <span>${formatTime(event.eventDate)}</span>
        </div>
        <div class="event-info">
          <i class="fas fa-map-marker-alt"></i>
          <span>${event.location}</span>
        </div>
        <div class="event-info">
          <i class="fas fa-users"></i>
          <span>${registeredCount}/${capacity} registered</span>
        </div>
        <div class="event-description">
          ${event.description ? event.description.substring(0, 100) + "..." : "No description available"}
        </div>
        <div class="event-footer">
          <span class="event-status status-${event.status.toLowerCase()}">${event.status}</span>
          <div class="progress">
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
          </div>
        </div>
      </div>
    `

    return div
  }

  showEventModal(event) {
    const modal = document.getElementById("eventModal")
    const title = document.getElementById("modalEventTitle")
    const body = document.getElementById("modalEventBody")
    const registerBtn = document.getElementById("registerEventBtn")
    const approveBtn = document.getElementById("approveEventBtn")
    const rejectBtn = document.getElementById("rejectEventBtn")
    const generateQRBtn = document.getElementById("generateQRBtn")

    title.textContent = event.title

    body.innerHTML = `
      <div class="event-details">
        <p><strong>Description:</strong> ${event.description || "No description available"}</p>
        <p><strong>Date & Time:</strong> ${formatDateTime(event.eventDate)}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Capacity:</strong> ${event.capacity} attendees</p>
        <p><strong>Organizer:</strong> ${event.organizerName || "Unknown"}</p>
        <p><strong>Category:</strong> ${event.category || "General"}</p>
        <p><strong>Status:</strong> <span class="badge badge-${this.getStatusColor(event.status)}">${event.status}</span></p>
        ${event.budget ? `<p><strong>Budget:</strong> ₱${event.budget.toLocaleString()}</p>` : ""}
        ${event.approvalComments ? `<p><strong>Comments:</strong> ${event.approvalComments}</p>` : ""}
      </div>
    `

    // Show/hide buttons based on user role and event status
    const currentUser = authManager.getCurrentUser()

    // Reset button visibility
    registerBtn.style.display = "none"
    approveBtn.style.display = "none"
    rejectBtn.style.display = "none"
    generateQRBtn.style.display = "none"

    if (currentUser) {
      if (currentUser.role === "STUDENT" && event.status === "APPROVED") {
        registerBtn.style.display = "block"
        registerBtn.onclick = () => this.registerForEvent(event.id)
      }

      if ((currentUser.role === "ADMIN" || currentUser.role === "FACULTY") && event.status === "PENDING") {
        approveBtn.style.display = "block"
        rejectBtn.style.display = "block"
        approveBtn.onclick = () => this.approveEvent(event.id)
        rejectBtn.onclick = () => this.rejectEvent(event.id)
      }

      if (event.status === "APPROVED") {
        generateQRBtn.style.display = "block"
        generateQRBtn.onclick = () => this.generateQRCode(event.id)
      }
    }

    modal.style.display = "block"
  }

  async createEvent(formData) {
    try {
      showLoading()

      const currentUser = authManager.getCurrentUser()
      if (!currentUser) {
        throw new Error("User not authenticated")
      }

      // Combine date and time
      const date = formData.get("date")
      const time = formData.get("time")
      const eventDateTime = `${date}T${time}:00`

      const eventData = {
        title: formData.get("title"),
        description: formData.get("description"),
        eventDate: eventDateTime,
        location: formData.get("location"),
        capacity: Number.parseInt(formData.get("capacity")),
        budget: formData.get("budget") ? Number.parseFloat(formData.get("budget")) : null,
        category: formData.get("category"),
        organizerId: currentUser.id,
      }

      await api.createEvent(eventData)
      showNotification("Event created successfully!", "success")

      // Reset form and reload events
      document.getElementById("createEventForm").reset()
      await this.loadEvents()

      // Navigate to events page
      window.appController.navigateTo("events")
    } catch (error) {
      console.error("Error creating event:", error)
      showNotification(error.message || "Error creating event", "error")
    } finally {
      hideLoading()
    }
  }

  async registerForEvent(eventId) {
    try {
      const currentUser = authManager.getCurrentUser()
      if (!currentUser) {
        throw new Error("User not authenticated")
      }

      await api.registerForEvent(eventId, currentUser.id)
      showNotification("Successfully registered for event!", "success")
      window.appController.closeModals()
      await this.loadEvents()
    } catch (error) {
      console.error("Error registering for event:", error)
      showNotification(error.message || "Error registering for event", "error")
    }
  }

  async approveEvent(eventId) {
    try {
      const currentUser = authManager.getCurrentUser()
      const comments = prompt("Add approval comments (optional):")

      await api.approveEvent(eventId, currentUser.id, comments || "")
      showNotification("Event approved successfully!", "success")
      window.appController.closeModals()
      await this.loadEvents()
    } catch (error) {
      console.error("Error approving event:", error)
      showNotification(error.message || "Error approving event", "error")
    }
  }

  async rejectEvent(eventId) {
    try {
      const currentUser = authManager.getCurrentUser()
      const comments = prompt("Add rejection reason:")

      if (!comments) {
        showNotification("Rejection reason is required", "warning")
        return
      }

      await api.rejectEvent(eventId, currentUser.id, comments)
      showNotification("Event rejected", "info")
      window.appController.closeModals()
      await this.loadEvents()
    } catch (error) {
      console.error("Error rejecting event:", error)
      showNotification(error.message || "Error rejecting event", "error")
    }
  }

  async generateQRCode(eventId) {
    try {
      const currentUser = authManager.getCurrentUser()
      const response = await api.generateQRCode(eventId, currentUser.id)

      const qrModal = document.getElementById("qrModal")
      const qrContainer = document.getElementById("qrCodeContainer")

      qrContainer.innerHTML = `
        <img src="data:image/png;base64,${response.qrCode}" alt="QR Code" />
        <p>Scan this QR code to check in to the event</p>
      `

      window.appController.closeModals()
      qrModal.style.display = "block"
    } catch (error) {
      console.error("Error generating QR code:", error)
      showNotification(error.message || "Error generating QR code", "error")
    }
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
}
