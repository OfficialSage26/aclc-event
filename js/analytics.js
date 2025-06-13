// Analytics Management
class AnalyticsManager {
  constructor() {
    this.analyticsData = {}
  }

  async loadAnalytics() {
    try {
      showLoading()
      await this.loadAnalyticsData()
      this.displayAnalytics()
      this.renderCharts()
    } catch (error) {
      console.error("Error loading analytics:", error)
      showNotification("Error loading analytics", "error")
    } finally {
      hideLoading()
    }
  }

  async loadAnalyticsData() {
    try {
      // Mock analytics data since we don't have the analytics API endpoint
      this.analyticsData = {
        totalEvents: 77,
        totalAttendance: 3200,
        averageAttendanceRate: 87.6,
        activeUsers: 156,
        monthlyData: [
          { month: "Jan", events: 12, attendance: 450 },
          { month: "Feb", events: 8, attendance: 320 },
          { month: "Mar", events: 15, attendance: 680 },
          { month: "Apr", events: 10, attendance: 420 },
          { month: "May", events: 18, attendance: 750 },
          { month: "Jun", events: 14, attendance: 580 },
        ],
        categoryData: [
          { name: "Academic", value: 35, color: "#3b82f6" },
          { name: "Career", value: 25, color: "#10b981" },
          { name: "Social", value: 20, color: "#f59e0b" },
          { name: "Sports", value: 15, color: "#ef4444" },
          { name: "Other", value: 5, color: "#8b5cf6" },
        ],
      }
    } catch (error) {
      console.error("Error loading analytics data:", error)
    }
  }

  displayAnalytics() {
    document.getElementById("analyticsEvents").textContent = this.analyticsData.totalEvents
    document.getElementById("analyticsAttendance").textContent = this.analyticsData.totalAttendance.toLocaleString()
    document.getElementById("analyticsRate").textContent = `${this.analyticsData.averageAttendanceRate}%`
    document.getElementById("analyticsUsers").textContent = this.analyticsData.activeUsers
  }

  renderCharts() {
    this.renderMonthlyChart()
    this.renderCategoryChart()
  }

  renderMonthlyChart() {
    const canvas = document.getElementById("monthlyChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.analyticsData.monthlyData

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - 2 * padding
    const chartHeight = canvas.height - 2 * padding

    // Find max values
    const maxEvents = Math.max(...data.map((d) => d.events))
    const maxAttendance = Math.max(...data.map((d) => d.attendance))

    // Draw axes
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = chartWidth / data.length / 2 - 10
    data.forEach((item, index) => {
      const x = padding + (index * chartWidth) / data.length + 10

      // Events bar
      const eventsHeight = (item.events / maxEvents) * chartHeight * 0.8
      ctx.fillStyle = "#667eea"
      ctx.fillRect(x, canvas.height - padding - eventsHeight, barWidth, eventsHeight)

      // Attendance bar (scaled down)
      const attendanceHeight = (item.attendance / maxAttendance) * chartHeight * 0.4
      ctx.fillStyle = "#f093fb"
      ctx.fillRect(x + barWidth + 5, canvas.height - padding - attendanceHeight, barWidth, attendanceHeight)

      // Month labels
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.month, x + barWidth, canvas.height - padding + 20)
    })

    // Legend
    ctx.fillStyle = "#667eea"
    ctx.fillRect(padding, 10, 15, 15)
    ctx.fillStyle = "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Events", padding + 20, 22)

    ctx.fillStyle = "#f093fb"
    ctx.fillRect(padding + 80, 10, 15, 15)
    ctx.fillText("Attendance", padding + 105, 22)
  }

  renderCategoryChart() {
    const canvas = document.getElementById("categoryChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.analyticsData.categoryData

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let currentAngle = 0
    const total = data.reduce((sum, item) => sum + item.value, 0)

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20)
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20)

      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${item.name} (${item.value}%)`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }
}

// Approvals Management
class ApprovalsManager {
  constructor() {
    this.approvals = []
  }

  async loadApprovals() {
    try {
      showLoading()

      // Load pending events for approval
      const events = await api.getEvents({ status: "PENDING" })
      this.approvals = events.content || events

      this.displayApprovals()
      this.updateApprovalStats()
    } catch (error) {
      console.error("Error loading approvals:", error)
      showNotification("Error loading approvals", "error")
    } finally {
      hideLoading()
    }
  }

  updateApprovalStats() {
    const pendingCount = this.approvals.filter((a) => a.status === "PENDING").length

    // Mock data for approved and rejected counts
    document.getElementById("pendingApprovals").textContent = pendingCount
    document.getElementById("approvedCount").textContent = "24"
    document.getElementById("rejectedCount").textContent = "3"
  }

  displayApprovals() {
    const container = document.getElementById("approvalsList")

    if (this.approvals.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-check-square"></i>
          <h3>No Pending Approvals</h3>
          <p>All events have been reviewed.</p>
        </div>
      `
      return
    }

    container.innerHTML = this.approvals
      .map(
        (event) => `
      <div class="approval-item">
        <div class="approval-header">
          <div>
            <div class="approval-title">${event.title}</div>
            <div class="approval-meta">
              Submitted by ${event.organizerName || "Unknown"} • ${formatDate(event.createdAt)}
            </div>
          </div>
          <div class="approval-actions">
            <button class="btn btn-success" onclick="window.approvalsManager.approveEvent(${event.id})">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger" onclick="window.approvalsManager.rejectEvent(${event.id})">
              <i class="fas fa-times"></i> Reject
            </button>
          </div>
        </div>
        <div class="approval-description">${event.description}</div>
        <div class="approval-details">
          <div class="approval-detail">
            <strong>Date & Time</strong>
            ${formatDateTime(event.eventDate)}
          </div>
          <div class="approval-detail">
            <strong>Location</strong>
            ${event.location}
          </div>
          <div class="approval-detail">
            <strong>Capacity</strong>
            ${event.capacity} attendees
          </div>
          <div class="approval-detail">
            <strong>Category</strong>
            ${event.category}
          </div>
          ${
            event.budget
              ? `
            <div class="approval-detail">
              <strong>Budget</strong>
              ₱${event.budget.toLocaleString()}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `,
      )
      .join("")
  }

  async approveEvent(eventId) {
    try {
      const currentUser = authManager.getCurrentUser()
      const comments = prompt("Add approval comments (optional):")

      await api.approveEvent(eventId, currentUser.id, comments || "")
      showNotification("Event approved successfully!", "success")
      await this.loadApprovals()
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
      await this.loadApprovals()
    } catch (error) {
      console.error("Error rejecting event:", error)
      showNotification(error.message || "Error rejecting event", "error")
    }
  }
}

// Mock functions to resolve undeclared variables. In a real application, these would be properly defined.
function showLoading() {}
function showNotification(message, type) {}
function hideLoading() {}
const api = {
  getEvents: async () => {
    return { content: [] }
  },
  approveEvent: async () => {},
  rejectEvent: async () => {},
}
function formatDate(date) {
  return date
}
function formatDateTime(date) {
  return date
}
const authManager = {
  getCurrentUser: () => {
    return { id: 1 }
  },
}
