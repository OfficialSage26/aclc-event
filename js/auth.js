// Authentication Management
class AuthManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken")
    if (token) {
      this.validateToken()
    }
  }

  async validateToken() {
    try {
      const user = await api.getCurrentUser()
      this.currentUser = user
      this.showDashboard()
    } catch (error) {
      console.error("Token validation failed:", error)
      this.logout()
    }
  }

  async login(email, password) {
    try {
      showLoading()
      const response = await api.login(email, password)

      if (response.token) {
        api.setToken(response.token)
        this.currentUser = response.user
        this.showDashboard()
        return true
      } else {
        throw new Error("Invalid login response")
      }
    } catch (error) {
      console.error("Login failed:", error)
      showError(error.message || "Login failed. Please check your credentials.")
      return false
    } finally {
      hideLoading()
    }
  }

  logout() {
    api.removeToken()
    this.currentUser = null
    this.showLogin()
  }

  showLogin() {
    document.getElementById("loginPage").classList.add("active")
    document.getElementById("dashboardPage").classList.remove("active")
  }

  showDashboard() {
    document.getElementById("loginPage").classList.remove("active")
    document.getElementById("dashboardPage").classList.add("active")

    // Update user info in navbar
    if (this.currentUser) {
      document.getElementById("userName").textContent = `Welcome, ${this.currentUser.name}`
      document.getElementById("userRole").textContent = this.currentUser.role
      this.setupRoleBasedAccess()
    }

    // Load dashboard data
    if (window.dashboardManager) {
      window.dashboardManager.loadDashboard()
    }
  }

  setupRoleBasedAccess() {
    const userRole = this.currentUser.role

    // Show/hide menu items based on role
    const adminMenu = document.getElementById("adminMenu")
    const organizerMenu = document.getElementById("organizerMenu")
    const approvalMenu = document.getElementById("approvalMenu")
    const analyticsMenu = document.getElementById("analyticsMenu")
    const createEventBtn = document.getElementById("createEventBtn")

    if (userRole === "ADMIN") {
      adminMenu.style.display = "block"
      organizerMenu.style.display = "block"
      approvalMenu.style.display = "block"
      analyticsMenu.style.display = "block"
      if (createEventBtn) createEventBtn.style.display = "block"
    } else if (userRole === "ORGANIZER") {
      adminMenu.style.display = "none"
      organizerMenu.style.display = "block"
      approvalMenu.style.display = "none"
      analyticsMenu.style.display = "block"
      if (createEventBtn) createEventBtn.style.display = "block"
    } else if (userRole === "FACULTY") {
      adminMenu.style.display = "none"
      organizerMenu.style.display = "block"
      approvalMenu.style.display = "block"
      analyticsMenu.style.display = "none"
      if (createEventBtn) createEventBtn.style.display = "block"
    } else {
      adminMenu.style.display = "none"
      organizerMenu.style.display = "none"
      approvalMenu.style.display = "none"
      analyticsMenu.style.display = "none"
      if (createEventBtn) createEventBtn.style.display = "none"
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role
  }

  hasAnyRole(roles) {
    return this.currentUser && roles.includes(this.currentUser.role)
  }
}

// Demo login function
function demoLogin(role) {
  const demoUsers = {
    admin: { email: "admin@aclc.edu.ph", password: "password" },
    organizer: { email: "organizer@aclc.edu.ph", password: "password" },
    faculty: { email: "maria.santos@aclc.edu.ph", password: "password" },
    student: { email: "john.doe@student.aclc.edu.ph", password: "password" },
  }

  const user = demoUsers[role]
  if (user) {
    document.getElementById("email").value = user.email
    document.getElementById("password").value = user.password
    document.getElementById("loginForm").dispatchEvent(new Event("submit"))
  }
}

// Initialize auth manager
const authManager = new AuthManager()

// Mock functions for API and UI updates (replace with your actual implementations)
const api = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { token: "dummy_token", user: { name: "Test User", role: "ADMIN" } }
  },
  getCurrentUser: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { name: "Test User", role: "ADMIN" }
  },
  setToken: (token) => {
    localStorage.setItem("authToken", token)
  },
  removeToken: () => {
    localStorage.removeItem("authToken")
  },
}

function showLoading() {
  console.log("Loading...")
}

function hideLoading() {
  console.log("Loading complete.")
}

function showError(message) {
  console.error(message)
}
