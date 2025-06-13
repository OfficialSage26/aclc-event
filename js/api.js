// API Configuration and Helper Functions
const API_BASE_URL = "http://localhost:8080/api"

class ApiService {
  constructor() {
    this.token = localStorage.getItem("authToken")
  }

  setToken(token) {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  removeToken() {
    this.token = null
    localStorage.removeItem("authToken")
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  // Event endpoints
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/events${queryString ? "?" + queryString : ""}`)
  }

  async getEvent(id) {
    return this.request(`/events/${id}`)
  }

  async createEvent(eventData) {
    return this.request("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    })
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: "DELETE",
    })
  }

  async registerForEvent(eventId, userId) {
    return this.request(`/events/${eventId}/register?userId=${userId}`, {
      method: "POST",
    })
  }

  async unregisterFromEvent(eventId, userId) {
    return this.request(`/events/${eventId}/register?userId=${userId}`, {
      method: "DELETE",
    })
  }

  async approveEvent(eventId, approverId, comments = "") {
    return this.request(
      `/events/${eventId}/approve?approverId=${approverId}&comments=${encodeURIComponent(comments)}`,
      {
        method: "POST",
      },
    )
  }

  async rejectEvent(eventId, reviewerId, comments = "") {
    return this.request(`/events/${eventId}/reject?reviewerId=${reviewerId}&comments=${encodeURIComponent(comments)}`, {
      method: "POST",
    })
  }

  async getUpcomingEvents() {
    return this.request("/events/upcoming")
  }

  async searchEvents(keyword) {
    return this.request(`/events/search?keyword=${encodeURIComponent(keyword)}`)
  }

  async getEventsByCategory(category) {
    return this.request(`/events/category/${category}`)
  }

  async getEventsByOrganizer(organizerId) {
    return this.request(`/events/organizer/${organizerId}`)
  }

  async getEventsForCalendar(startDate, endDate) {
    return this.request(`/events/calendar?startDate=${startDate}&endDate=${endDate}`)
  }

  // Attendance endpoints
  async getEventAttendance(eventId) {
    return this.request(`/attendance/event/${eventId}`)
  }

  async getUserAttendance(userId) {
    return this.request(`/attendance/user/${userId}`)
  }

  async checkInUser(eventId, userId, method = "MANUAL") {
    return this.request("/attendance/checkin", {
      method: "POST",
      body: JSON.stringify({ eventId, userId, checkInMethod: method }),
    })
  }

  async checkOutUser(eventId, userId) {
    return this.request("/attendance/checkout", {
      method: "POST",
      body: JSON.stringify({ eventId, userId }),
    })
  }

  async generateQRCode(eventId, userId) {
    return this.request(`/attendance/qr/${eventId}/${userId}`)
  }

  async processQRScan(qrCode) {
    return this.request("/attendance/qr/scan", {
      method: "POST",
      body: JSON.stringify({ qrCode }),
    })
  }

  async getAttendanceStats(eventId) {
    return this.request(`/attendance/event/${eventId}/stats`)
  }

  // User endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/users${queryString ? "?" + queryString : ""}`)
  }

  async getUser(id) {
    return this.request(`/users/${id}`)
  }

  async createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Dashboard/Analytics endpoints
  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }

  async getEventAnalytics(eventId) {
    return this.request(`/analytics/event/${eventId}`)
  }
}

// Create global API instance
const api = new ApiService()

// Utility functions
function showError(message, containerId = "loginError") {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = message
    container.style.display = "block"
    setTimeout(() => {
      container.style.display = "none"
    }, 5000)
  } else {
    alert(message)
  }
}

function showSuccess(message, containerId = "successContainer") {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = `<div class="success-message">${message}</div>`
    container.style.display = "block"
    setTimeout(() => {
      container.style.display = "none"
    }, 5000)
  } else {
    alert(message)
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type}`
  notification.textContent = message
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.zIndex = "9999"
  notification.style.minWidth = "300px"

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateTime(dateString) {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none"
}
