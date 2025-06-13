"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  status: "approved" | "pending" | "completed"
  category: string
}

interface EventCalendarProps {
  user: User
}

export function EventCalendar({ user }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Tech Innovation Summit",
      date: "2024-01-15",
      time: "09:00",
      status: "approved",
      category: "Academic",
    },
    { id: "2", title: "Career Fair 2024", date: "2024-01-20", time: "10:00", status: "approved", category: "Career" },
    {
      id: "3",
      title: "Student Orientation",
      date: "2024-01-25",
      time: "08:00",
      status: "pending",
      category: "Orientation",
    },
    { id: "4", title: "Alumni Homecoming", date: "2024-02-01", time: "14:00", status: "approved", category: "Social" },
    { id: "5", title: "Sports Festival", date: "2024-02-05", time: "08:00", status: "approved", category: "Sports" },
  ]

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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Event Calendar</h2>
        <p className="text-gray-600">View and manage upcoming events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-24"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const dayEvents = getEventsForDate(day)
                  const isToday =
                    new Date().toDateString() ===
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                  return (
                    <div
                      key={day}
                      className={`p-1 h-24 border rounded-lg ${isToday ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getStatusColor(event.status)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next events in your calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant={event.status === "approved" ? "default" : "secondary"} className="text-xs">
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {event.date} at {event.time}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{event.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-medium text-green-600">
                    {events.filter((e) => e.status === "approved").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">
                    {events.filter((e) => e.status === "pending").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
