"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Bell, BarChart3, QrCode, CheckCircle } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { Dashboard } from "@/components/dashboard/dashboard"
import { EventCalendar } from "@/components/events/event-calendar"
import { EventManagement } from "@/components/events/event-management"
import { AttendanceTracker } from "@/components/attendance/attendance-tracker"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Analytics } from "@/components/analytics/analytics"
import { ApprovalWorkflow } from "@/components/workflow/approval-workflow"

type UserRole = "admin" | "organizer" | "faculty" | "student"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<string>("dashboard")

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("dashboard")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ACLC College of Ormoc</h1>
            <p className="text-lg text-gray-600">Event Management System</p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, roles: ["admin", "organizer", "faculty", "student"] },
    { id: "events", label: "Events", icon: Calendar, roles: ["admin", "organizer", "faculty", "student"] },
    { id: "calendar", label: "Calendar", icon: Calendar, roles: ["admin", "organizer", "faculty", "student"] },
    { id: "attendance", label: "Attendance", icon: QrCode, roles: ["admin", "organizer", "faculty"] },
    { id: "approvals", label: "Approvals", icon: CheckCircle, roles: ["admin", "faculty"] },
    { id: "notifications", label: "Notifications", icon: Bell, roles: ["admin", "organizer", "faculty", "student"] },
    { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "organizer"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(currentUser.role))

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard user={currentUser} />
      case "events":
        return <EventManagement user={currentUser} />
      case "calendar":
        return <EventCalendar user={currentUser} />
      case "attendance":
        return <AttendanceTracker user={currentUser} />
      case "approvals":
        return <ApprovalWorkflow user={currentUser} />
      case "notifications":
        return <NotificationCenter user={currentUser} />
      case "analytics":
        return <Analytics user={currentUser} />
      default:
        return <Dashboard user={currentUser} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ACLC Event Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{currentUser.role.toUpperCase()}</Badge>
              <span className="text-sm text-gray-700">{currentUser.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === item.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderCurrentView()}</main>
      </div>
    </div>
  )
}
