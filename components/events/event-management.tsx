"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Users, Calendar, MapPin } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  status: "draft" | "pending" | "approved" | "rejected" | "completed"
  organizer: string
  category: string
}

interface EventManagementProps {
  user: User
}

export function EventManagement({ user }: EventManagementProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Innovation Summit",
      description: "Annual technology summit featuring latest innovations",
      date: "2024-01-15",
      time: "09:00",
      location: "Main Auditorium",
      capacity: 200,
      registered: 45,
      status: "approved",
      organizer: "IT Department",
      category: "Academic",
    },
    {
      id: "2",
      title: "Career Fair 2024",
      description: "Connect with top employers and explore career opportunities",
      date: "2024-01-20",
      time: "10:00",
      location: "Gymnasium",
      capacity: 300,
      registered: 120,
      status: "approved",
      organizer: "Career Services",
      category: "Career",
    },
    {
      id: "3",
      title: "Student Orientation",
      description: "Welcome new students to ACLC College",
      date: "2024-01-25",
      time: "08:00",
      location: "Conference Hall",
      capacity: 150,
      registered: 80,
      status: "pending",
      organizer: "Student Affairs",
      category: "Orientation",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    category: "",
  })

  const canCreateEvent = user.role === "admin" || user.role === "organizer" || user.role === "faculty"
  const canApproveEvent = user.role === "admin" || user.role === "faculty"

  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      capacity: Number.parseInt(newEvent.capacity),
      registered: 0,
      status: user.role === "admin" ? "approved" : "pending",
      organizer: user.name,
      category: newEvent.category,
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      category: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleApproveEvent = (eventId: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, status: "approved" as const } : event)))
  }

  const handleRejectEvent = (eventId: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, status: "rejected" as const } : event)))
  }

  const handleRegisterForEvent = (eventId: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, registered: event.registered + 1 } : event)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600">Create, manage, and track events</p>
        </div>
        {canCreateEvent && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Fill in the details to create a new event</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Orientation">Orientation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter event description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                      placeholder="Max attendees"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {event.title}
                    <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                  </CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  {canApproveEvent && event.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleApproveEvent(event.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectEvent(event.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  {user.role === "student" && event.status === "approved" && (
                    <Button size="sm" onClick={() => handleRegisterForEvent(event.id)}>
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.date} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.registered}/{event.capacity} registered
                  </span>
                </div>
                <div className="text-gray-600">
                  <span>Organizer: {event.organizer}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((event.registered / event.capacity) * 100)}% capacity
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
