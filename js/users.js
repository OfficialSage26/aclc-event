// Users Management
class UsersManager {
  constructor() {
    this.users = []
    this.filteredUsers = []
    this.setupEventListeners()
  }

  setupEventListeners() {
    const addUserBtn = document.getElementById("addUserBtn")
    const roleFilter = document.getElementById("roleFilter")
    const userSearch = document.getElementById("userSearch")
    const saveUserBtn = document.getElementById("saveUserBtn")

    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => this.showUserModal())
    }

    if (roleFilter) {
      roleFilter.addEventListener("change", () => this.filterUsers())
    }

    if (userSearch) {
      userSearch.addEventListener(
        "input",
        debounce(() => this.filterUsers(), 300),
      )
    }

    if (saveUserBtn) {
      saveUserBtn.addEventListener("click", () => this.saveUser())
    }
  }

  async loadUsers() {
    try {
      showLoading()
      const response = await api.getUsers()
      this.users = response.content || response
      this.filterUsers()
    } catch (error) {
      console.error("Error loading users:", error)
      showNotification("Error loading users", "error")
    } finally {
      hideLoading()
    }
  }

  filterUsers() {
    const roleFilter = document.getElementById("roleFilter").value
    const searchTerm = document.getElementById("userSearch").value.toLowerCase()

    this.filteredUsers = this.users.filter((user) => {
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.studentId && user.studentId.toLowerCase().includes(searchTerm))

      return matchesRole && matchesSearch
    })

    this.displayUsers()
  }

  displayUsers() {
    const container = document.getElementById("usersTable")

    if (this.filteredUsers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No Users Found</h3>
          <p>No users match your current filter.</p>
        </div>
      `
      return
    }

    container.innerHTML = `
      <div class="data-table">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredUsers
              .map(
                (user) => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                  <span class="badge badge-${this.getRoleColor(user.role)}">
                    ${user.role}
                  </span>
                </td>
                <td>${user.department || "N/A"}</td>
                <td>${user.studentId || "N/A"}</td>
                <td>
                  <span class="badge badge-${user.isActive ? "success" : "danger"}">
                    ${user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div class="user-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.usersManager.editUser(${user.id})">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${user.isActive ? "warning" : "success"}" 
                            onclick="window.usersManager.toggleUserStatus(${user.id})">
                      <i class="fas fa-${user.isActive ? "ban" : "check"}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.usersManager.deleteUser(${user.id})">
                      <i class="fas fa-trash"></i>
                    </button>
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

  showUserModal(user = null) {
    const modal = document.getElementById("userModal")
    const title = document.getElementById("userModalTitle")
    const form = document.getElementById("userForm")

    title.textContent = user ? "Edit User" : "Add User"

    if (user) {
      document.getElementById("userName").value = user.name
      document.getElementById("userEmail").value = user.email
      document.getElementById("userPassword").value = ""
      document.getElementById("userRole").value = user.role
      document.getElementById("userDepartment").value = user.department || ""
      document.getElementById("userStudentId").value = user.studentId || ""

      // Store user ID for editing
      form.dataset.userId = user.id
    } else {
      form.reset()
      delete form.dataset.userId
    }

    modal.style.display = "block"
  }

  async saveUser() {
    try {
      const form = document.getElementById("userForm")
      const formData = new FormData(form)

      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        department: formData.get("department") || null,
        studentId: formData.get("studentId") || null,
      }

      if (form.dataset.userId) {
        // Edit existing user
        await api.updateUser(form.dataset.userId, userData)
        showNotification("User updated successfully!", "success")
      } else {
        // Create new user
        await api.createUser(userData)
        showNotification("User created successfully!", "success")
      }

      window.appController.closeModals()
      await this.loadUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      showNotification(error.message || "Error saving user", "error")
    }
  }

  editUser(userId) {
    const user = this.users.find((u) => u.id === userId)
    if (user) {
      this.showUserModal(user)
    }
  }

  async toggleUserStatus(userId) {
    try {
      const user = this.users.find((u) => u.id === userId)
      if (!user) return

      const action = user.isActive ? "deactivate" : "activate"
      const confirmed = confirm(`Are you sure you want to ${action} this user?`)

      if (confirmed) {
        // Update user status
        await api.updateUser(userId, { ...user, isActive: !user.isActive })
        showNotification(`User ${action}d successfully!`, "success")
        await this.loadUsers()
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
      showNotification(error.message || "Error updating user status", "error")
    }
  }

  async deleteUser(userId) {
    try {
      const confirmed = confirm("Are you sure you want to delete this user? This action cannot be undone.")

      if (confirmed) {
        await api.deleteUser(userId)
        showNotification("User deleted successfully!", "success")
        await this.loadUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      showNotification(error.message || "Error deleting user", "error")
    }
  }

  getRoleColor(role) {
    switch (role) {
      case "ADMIN":
        return "danger"
      case "ORGANIZER":
        return "warning"
      case "FACULTY":
        return "info"
      case "STUDENT":
        return "primary"
      default:
        return "secondary"
    }
  }
}
