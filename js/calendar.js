// Calendar Management
class CalendarManager {
  constructor() {
    this.currentDate = new Date()
    this.events = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    const prevBtn = document.getElementById("prevMonth")
    const nextBtn = document.getElementById("nextMonth")

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1)
        this.renderCalendar()
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1)
        this.renderCalendar()
      })
    }
  }

  async loadCalendar() {
    try {
      showLoading()
      await this.loadEvents()
      this.renderCalendar()
    } catch (error) {
      console.error("Error loading calendar:", error)
      showNotification("Error loading calendar", "error")
    } finally {
      hideLoading()
    }
  }

  async loadEvents() {
    try {
      // Get events for the current month
      const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
      const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)

      const startDateStr = startDate.toISOString().split("T")[0] + "T00:00:00"
      const endDateStr = endDate.toISOString().split("T")[0] + "T23:59:59"

      this.events = await api.getEventsForCalendar(startDateStr, endDateStr)
    } catch (error) {
      console.error("Error loading events for calendar:", error)
      this.events = []
    }
  }

  renderCalendar() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const currentMonthElement = document.getElementById("currentMonth")
    if (currentMonthElement) {
      currentMonthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
    }

    const calendarContainer = document.getElementById("calendar")
    if (!calendarContainer) return

    const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay()

    let calendarHTML = `
      <div class="calendar-grid">
        <div class="calendar-header-row">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
        </div>
    `

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarHTML += '<div class="calendar-day other-month"></div>'
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = this.getEventsForDate(day)
      const isToday = this.isToday(day)
      const hasEvents = dayEvents.length > 0

      let dayClass = "calendar-day"
      if (isToday) dayClass += " today"
      if (hasEvents) dayClass += " has-events"

      calendarHTML += `
        <div class="${dayClass}" onclick="window.calendarManager.showDayEvents(${day})">
          <div class="calendar-day-number">${day}</div>
          <div class="calendar-events">
            ${dayEvents
              .slice(0, 2)
              .map(
                (event) => `
              <div class="calendar-event" title="${event.title}">
                ${event.title.substring(0, 15)}${event.title.length > 15 ? "..." : ""}
              </div>
            `,
              )
              .join("")}
            ${dayEvents.length > 2 ? `<div class="calendar-event-more">+${dayEvents.length - 2} more</div>` : ""}
          </div>
        </div>
      `
    }

    calendarHTML += "</div>"
    calendarContainer.innerHTML = calendarHTML
  }

  getEventsForDate(day) {
    const dateStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return this.events.filter((event) => {
      const eventDate = new Date(event.eventDate).toISOString().split("T")[0]
      return eventDate === dateStr
    })
  }

  isToday(day) {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentDate.getMonth() &&
      today.getFullYear() === this.currentDate.getFullYear()
    )
  }

  showDayEvents(day) {
    const dayEvents = this.getEventsForDate(day)

    if (dayEvents.length === 0) {
      showNotification("No events on this day", "info")
      return
    }

    const modal = document.getElementById("eventModal")
    const title = document.getElementById("modalEventTitle")
    const body = document.getElementById("modalEventBody")

    title.textContent = `Events on ${this.currentDate.getMonth() + 1}/${day}/${this.currentDate.getFullYear()}`

    body.innerHTML = `
      <div class="day-events">
        ${dayEvents
          .map(
            (event) => `
          <div class="day-event-item" onclick="window.eventsManager.showEventModal(${JSON.stringify(event).replace(/"/g, "&quot;")})">
            <h4>${event.title}</h4>
            <p><i class="fas fa-clock"></i> ${formatTime(event.eventDate)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <span class="badge badge-${this.getStatusColor(event.status)}">${event.status}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `

    // Hide action buttons for day events view
    document.getElementById("registerEventBtn").style.display = "none"
    document.getElementById("approveEventBtn").style.display = "none"
    document.getElementById("rejectEventBtn").style.display = "none"
    document.getElementById("generateQRBtn").style.display = "none"

    modal.style.display = "block"
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
