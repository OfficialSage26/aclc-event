"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, TrendingUp, Bell, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const stats = {
    totalEvents: 24,
    upcomingEvents: 8,
    activeUsers: 156,
    pendingApprovals: user.role === "admin" || user.role === "faculty" ? 3 : 0,
    myEvents: user.role === "student" ? 5 : 12,
    attendance: 89,
  }

  const recentEvents = [
    { id: 1, title: "Tech Innovation Summit", date: "2024-01-15", status: "upcoming", attendees: 45 },
    { id: 2, title: "Career Fair 2024", date: "2024-01-20", status: "approved", attendees: 120 },
    { id: 3, title: "Student Orientation", date: "2024-01-25", status: "pending", attendees: 80 },
    { id: 4, title: "Alumni Homecoming", date: "2024-02-01", status: "upcoming", attendees: 200 },
  ]

  const notifications = [
    { id: 1, message: "New event 'Tech Innovation Summit' requires approval", time: "2 hours ago", type: "approval" },
    { id: 2, message: "Career Fair 2024 registration is now open", time: "4 hours ago", type: "info" },
    { id: 3, message: "Reminder: Student Orientation tomorrow at 9 AM", time: "1 day ago", type: "reminder" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h2>
        <p className="text-gray-600">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === "admin" || user.role === "faculty" ? "Pending Approvals" : "My Events"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.role === "admin" || user.role === "faculty" ? stats.pendingApprovals : stats.myEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.role === "admin" || user.role === "faculty" ? "Require attention" : "Registered events"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest events in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.attendees} attendees</p>
                  </div>
                  <Badge
                    variant={
                      event.status === "approved" ? "default" : event.status === "pending" ? "secondary" : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with latest activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {notification.type === "approval" && <CheckCircle className="h-5 w-5 text-orange-500" />}
                    {notification.type === "info" && <Bell className="h-5 w-5 text-blue-500" />}
                    {notification.type === "reminder" && <Clock className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
