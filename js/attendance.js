// Attendance Management
class AttendanceManager {
  constructor() {
    this.currentEventId = null
    this.attendanceRecords = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    const eventSelect = document.getElementById("attendanceEventSelect")
    const scanQRBtn = document.getElementById("scanQRBtn")
    const manualCheckInBtn = document.getElementById("manualCheckInBtn")
    const exportBtn = document.getElementById("exportAttendanceBtn")

    if (eventSelect) {
      eventSelect.addEventListener("change", (e) => {
        this.currentEventId = e.target.value
        if (this.currentEventId) {
          this.loadAttendanceForEvent(this.currentEventId)
        }
      })
    }

    if (scanQRBtn) {
      scanQRBtn.addEventListener("click", () => this.startQRScanner())
    }

    if (manualCheckInBtn) {
      manualCheckInBtn.addEventListener("click", () => this.showManualCheckIn())
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportAttendance())
    }
  }

  async loadAttendance() {
    try {
      showLoading()
      await this.loadEvents()
    } catch (error) {
      console.error("Error loading attendance:", error)
      showNotification("Error loading attendance data", "error")
    } finally {
      hideLoading()
    }
  }

  async loadEvents() {
    try {
      const events = await api.getEvents()
      const eventSelect = document.getElementById("attendanceEventSelect")

      if (eventSelect) {
        eventSelect.innerHTML = '<option value="">Select Event</option>'

        const eventList = events.content || events
        eventList.forEach((event) => {
          const option = document.createElement("option")
          option.value = event.id
          option.textContent = `${event.title} - ${formatDate(event.eventDate)}`
          eventSelect.appendChild(option)
        })
      }
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  async loadAttendanceForEvent(eventId) {
    try {
      showLoading()

      // Load attendance records
      this.attendanceRecords = await api.getEventAttendance(eventId)

      // Load attendance stats
      const stats = await api.getAttendanceStats(eventId)

      this.updateAttendanceStats(stats)
      this.displayAttendanceRecords()
    } catch (error) {
      console.error("Error loading attendance for event:", error)
      showNotification("Error loading attendance data", "error")
    } finally {
      hideLoading()
    }
  }

  updateAttendanceStats(stats) {
    document.getElementById("presentCount").textContent = stats.totalPresent || 0
    document.getElementById("registeredCount").textContent = stats.totalRegistered || 0
    document.getElementById("attendanceRate").textContent = `${stats.attendanceRate || 0}%`
  }

  displayAttendanceRecords() {
    const container = document.getElementById("attendanceList")

    if (this.attendanceRecords.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No Attendance Records</h3>
          <p>No attendance records found for this event.</p>
        </div>
      `
      return
    }

    container.innerHTML = `
      <div class="data-table">
        <div class="data-table-header">
          <div class="data-table-title">Attendance Records</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.attendanceRecords
              .map(
                (record) => `
              <tr>
                <td>
                  <div class="attendance-info">
                    <div class="attendance-avatar">
                      ${record.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div class="attendance-details">
                      <h4>${record.userName}</h4>
                    </div>
                  </div>
                </td>
                <td>${record.studentId || "N/A"}</td>
                <td>${record.checkInTime ? formatDateTime(record.checkInTime) : "Not checked in"}</td>
                <td>${record.checkOutTime ? formatDateTime(record.checkOutTime) : "Not checked out"}</td>
                <td>
                  <span class="status-badge status-${record.status.toLowerCase()}">
                    ${record.status}
                  </span>
                </td>
                <td>${record.checkInMethod || "N/A"}</td>
                <td>
                  <div class="action-buttons">
                    ${
                      !record.checkInTime
                        ? `
                      <button class="btn btn-sm btn-primary" onclick="window.attendanceManager.checkInUser(${record.userId})">
                        Check In
                      </button>
                    `
                        : !record.checkOutTime
                          ? `
                      <button class="btn btn-sm btn-secondary" onclick="window.attendanceManager.checkOutUser(${record.userId})">
                        Check Out
                      </button>
                    `
                          : ""
                    }
                  </div>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  }

  async checkInUser(userId) {
    try {
      if (!this.currentEventId) {
        showNotification("Please select an event first", "warning")
        return
      }

      await api.checkInUser(this.currentEventId, userId, "MANUAL")
      showNotification("User checked in successfully!", "success")
      await this.loadAttendanceForEvent(this.currentEventId)
    } catch (error) {
      console.error("Error checking in user:", error)
      showNotification(error.message || "Error checking in user", "error")
    }
  }

  async checkOutUser(userId) {
    try {
      if (!this.currentEventId) {
        showNotification("Please select an event first", "warning")
        return
      }

      await api.checkOutUser(this.currentEventId, userId)
      showNotification("User checked out successfully!", "success")
      await this.loadAttendanceForEvent(this.currentEventId)
    } catch (error) {
      console.error("Error checking out user:", error)
      showNotification(error.message || "Error checking out user", "error")
    }
  }

  startQRScanner() {
    // Simulate QR scanner for demo
    const qrCode = prompt("Enter QR code data (format: eventId:userId:timestamp):")

    if (qrCode) {
      this.processQRCode(qrCode)
    }
  }

  async processQRCode(qrCode) {
    try {
      const result = await api.processQRScan(qrCode)
      showNotification("QR code scanned successfully! User checked in.", "success")

      if (this.currentEventId) {
        await this.loadAttendanceForEvent(this.currentEventId)
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      showNotification(error.message || "Invalid QR code", "error")
    }
  }

  showManualCheckIn() {
    const studentId = prompt("Enter Student ID:")

    if (studentId) {
      // In a real implementation, you would look up the user by student ID
      // For demo purposes, we'll use a mock user ID
      this.checkInUser(5) // Mock user ID
    }
  }

  exportAttendance() {
    if (!this.currentEventId || this.attendanceRecords.length === 0) {
      showNotification("No attendance data to export", "warning")
      return
    }

    // Create CSV content
    const headers = ["Student Name", "Student ID", "Check-in Time", "Check-out Time", "Status", "Method"]
    const csvContent = [
      headers.join(","),
      ...this.attendanceRecords.map((record) =>
        [
          `"${record.userName}"`,
          record.studentId || "",
          record.checkInTime || "",
          record.checkOutTime || "",
          record.status,
          record.checkInMethod || "",
        ].join(","),
      ),
    ].join("\n")

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance_${this.currentEventId}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showNotification("Attendance data exported successfully!", "success")
  }
}
