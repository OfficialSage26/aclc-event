"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, X } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

interface NotificationCenterProps {
  user: User
}

export function NotificationCenter({ user }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Event Approval Required",
      message: "AI Workshop Series proposal needs your approval",
      type: "warning",
      timestamp: "2024-01-10 15:30",
      read: false,
      actionRequired: true,
    },
    {
      id: "2",
      title: "Event Registration Open",
      message: "Career Fair 2024 registration is now open for students",
      type: "info",
      timestamp: "2024-01-10 14:15",
      read: false,
    },
    {
      id: "3",
      title: "Event Reminder",
      message: "Tech Innovation Summit starts tomorrow at 9:00 AM",
      type: "info",
      timestamp: "2024-01-10 12:00",
      read: true,
    },
    {
      id: "4",
      title: "Budget Approved",
      message: "Cultural Night event budget has been approved",
      type: "success",
      timestamp: "2024-01-10 10:45",
      read: true,
    },
    {
      id: "5",
      title: "Venue Change",
      message: "Student Orientation venue changed to Main Auditorium",
      type: "warning",
      timestamp: "2024-01-10 09:30",
      read: false,
    },
  ])

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "error":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-600">Stay updated with latest activities and alerts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">New notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <div className="h-4 w-4 rounded-full bg-gray-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">All notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 rounded-lg ${getNotificationColor(notification.type)} ${
                  !notification.read ? "shadow-md" : "opacity-75"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                        {notification.actionRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark Read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
