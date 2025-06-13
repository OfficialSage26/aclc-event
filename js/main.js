// Import necessary modules (assuming these are in separate files)
import { authManager } from "./authManager.js"
import { DashboardManager } from "./dashboardManager.js"
import { EventsManager } from "./eventsManager.js"
import { CalendarManager } from "./calendarManager.js"
import { AttendanceManager } from "./attendanceManager.js"
import { UsersManager } from "./usersManager.js"
import { NotificationsManager } from "./notificationsManager.js"
import { AnalyticsManager } from "./analyticsManager.js"
import { ApprovalsManager } from "./approvalsManager.js"

// Main Application Controller
class AppController {
  constructor() {
    this.currentPage = "dashboard"
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupModals()
    this.setupEventListeners()
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = link.getAttribute("data-page")
        this.navigateTo(page)
      })
    })
  }

  navigateTo(page) {
    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })
    document.querySelector(`[data-page="${page}"]`).classList.add("active")

    // Show corresponding content section
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })

    const contentSection = document.getElementById(`${page}Content`)
    if (contentSection) {
      contentSection.classList.add("active")
    }

    this.currentPage = page
    this.loadPageContent(page)
  }

  loadPageContent(page) {
    switch (page) {
      case "dashboard":
        if (window.dashboardManager) {
          window.dashboardManager.loadDashboard()
        }
        break
      case "events":
        if (window.eventsManager) {
          window.eventsManager.loadEvents()
        }
        break
      case "calendar":
        if (window.calendarManager) {
          window.calendarManager.loadCalendar()
        }
        break
      case "attendance":
        if (window.attendanceManager) {
          window.attendanceManager.loadAttendance()
        }
        break
      case "users":
        if (window.usersManager) {
          window.usersManager.loadUsers()
        }
        break
      case "create-event":
        // Already loaded in HTML
        break
      case "approvals":
        if (window.approvalsManager) {
          window.approvalsManager.loadApprovals()
        }
        break
      case "notifications":
        if (window.notificationsManager) {
          window.notificationsManager.loadNotifications()
        }
        break
      case "analytics":
        if (window.analyticsManager) {
          window.analyticsManager.loadAnalytics()
        }
        break
    }
  }

  setupModals() {
    // Close modal handlers
    document.querySelectorAll(".close, .close-modal").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        this.closeModals()
      })
    })

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        this.closeModals()
      }
    })
  }

  showModal(modalId) {
    document.getElementById(modalId).style.display = "block"
  }

  closeModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none"
    })
  }

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        await authManager.login(email, password)
      })
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        authManager.logout()
      })
    }

    // Create event form
    const createEventForm = document.getElementById("createEventForm")
    if (createEventForm) {
      createEventForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (window.eventsManager) {
          await window.eventsManager.createEvent(new FormData(createEventForm))
        }
      })
    }

    // Event filter
    const eventFilter = document.getElementById("eventFilter")
    if (eventFilter) {
      eventFilter.addEventListener("change", () => {
        if (window.eventsManager) {
          window.eventsManager.filterEvents(eventFilter.value)
        }
      })
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.appController = new AppController()

  // Initialize other managers
  window.dashboardManager = new DashboardManager()
  window.eventsManager = new EventsManager()
  window.calendarManager = new CalendarManager()
  window.attendanceManager = new AttendanceManager()
  window.usersManager = new UsersManager()
  window.notificationsManager = new NotificationsManager()
  window.analyticsManager = new AnalyticsManager()
  window.approvalsManager = new ApprovalsManager()

  // Check authentication status
  if (authManager.currentUser) {
    authManager.showDashboard()
  } else {
    authManager.showLogin()
  }
})
