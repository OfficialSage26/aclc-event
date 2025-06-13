"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Search, Download, Users, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface AttendanceRecord {
  id: string
  eventId: string
  eventTitle: string
  studentId: string
  studentName: string
  checkInTime: string
  status: "present" | "absent"
}

interface AttendanceTrackerProps {
  user: User
}

export function AttendanceTracker({ user }: AttendanceTrackerProps) {
  const [selectedEvent, setSelectedEvent] = useState<string>("1")
  const [searchTerm, setSearchTerm] = useState("")
  const [qrScannerActive, setQrScannerActive] = useState(false)

  const events = [
    { id: "1", title: "Tech Innovation Summit", date: "2024-01-15" },
    { id: "2", title: "Career Fair 2024", date: "2024-01-20" },
    { id: "3", title: "Student Orientation", date: "2024-01-25" },
  ]

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      eventId: "1",
      eventTitle: "Tech Innovation Summit",
      studentId: "ST001",
      studentName: "John Doe",
      checkInTime: "2024-01-15 09:15",
      status: "present",
    },
    {
      id: "2",
      eventId: "1",
      eventTitle: "Tech Innovation Summit",
      studentId: "ST002",
      studentName: "Jane Smith",
      checkInTime: "2024-01-15 09:20",
      status: "present",
    },
    {
      id: "3",
      eventId: "1",
      eventTitle: "Tech Innovation Summit",
      studentId: "ST003",
      studentName: "Mike Johnson",
      checkInTime: "",
      status: "absent",
    },
    {
      id: "4",
      eventId: "1",
      eventTitle: "Tech Innovation Summit",
      studentId: "ST004",
      studentName: "Sarah Wilson",
      checkInTime: "2024-01-15 09:30",
      status: "present",
    },
  ]

  const registeredStudents = [
    { id: "ST001", name: "John Doe", email: "john.doe@student.aclc.edu.ph", course: "BSIT" },
    { id: "ST002", name: "Jane Smith", email: "jane.smith@student.aclc.edu.ph", course: "BSCS" },
    { id: "ST003", name: "Mike Johnson", email: "mike.johnson@student.aclc.edu.ph", course: "BSIT" },
    { id: "ST004", name: "Sarah Wilson", email: "sarah.wilson@student.aclc.edu.ph", course: "BSCS" },
  ]

  const currentEventRecords = attendanceRecords.filter((record) => record.eventId === selectedEvent)
  const filteredRecords = currentEventRecords.filter(
    (record) =>
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const presentCount = currentEventRecords.filter((record) => record.status === "present").length
  const totalRegistered = registeredStudents.length
  const attendanceRate = Math.round((presentCount / totalRegistered) * 100)

  const handleQRScan = () => {
    setQrScannerActive(!qrScannerActive)
    // In a real implementation, this would activate the camera for QR scanning
  }

  const handleManualCheckIn = (studentId: string) => {
    // In a real implementation, this would update the attendance record
    console.log(`Manual check-in for student: ${studentId}`)
  }

  const exportAttendance = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    console.log("Exporting attendance data...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-gray-600">Track and manage event attendance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportAttendance}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleQRScan}>
            <QrCode className="mr-2 h-4 w-4" />
            {qrScannerActive ? "Stop Scanner" : "QR Scanner"}
          </Button>
        </div>
      </div>

      {/* Event Selection and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Event</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Students checked in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistered}</div>
            <p className="text-xs text-muted-foreground">Expected attendees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner */}
      {qrScannerActive && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Scan student QR codes for quick check-in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">QR Scanner Active</p>
                <p className="text-sm text-gray-400">Point camera at student QR code</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                {events.find((e) => e.id === selectedEvent)?.title} - {events.find((e) => e.id === selectedEvent)?.date}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {record.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{record.studentName}</h4>
                    <p className="text-sm text-gray-600">ID: {record.studentId}</p>
                    {record.checkInTime && <p className="text-xs text-gray-500">Checked in: {record.checkInTime}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={record.status === "present" ? "default" : "secondary"}>{record.status}</Badge>
                  {record.status === "absent" && (
                    <Button size="sm" onClick={() => handleManualCheckIn(record.studentId)}>
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
