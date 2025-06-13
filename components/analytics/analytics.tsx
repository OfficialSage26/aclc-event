"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Calendar, Target } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface AnalyticsProps {
  user: User
}

export function Analytics({ user }: AnalyticsProps) {
  const monthlyEventData = [
    { month: "Jan", events: 12, attendance: 450 },
    { month: "Feb", events: 8, attendance: 320 },
    { month: "Mar", events: 15, attendance: 680 },
    { month: "Apr", events: 10, attendance: 420 },
    { month: "May", events: 18, attendance: 750 },
    { month: "Jun", events: 14, attendance: 580 },
  ]

  const eventCategoryData = [
    { name: "Academic", value: 35, color: "#3b82f6" },
    { name: "Career", value: 25, color: "#10b981" },
    { name: "Social", value: 20, color: "#f59e0b" },
    { name: "Sports", value: 15, color: "#ef4444" },
    { name: "Other", value: 5, color: "#8b5cf6" },
  ]

  const attendanceRateData = [
    { event: "Tech Summit", rate: 85 },
    { event: "Career Fair", rate: 92 },
    { event: "Cultural Night", rate: 78 },
    { event: "Sports Fest", rate: 88 },
    { event: "Orientation", rate: 95 },
  ]

  const departmentParticipation = [
    { department: "Computer Science", events: 8, participants: 120 },
    { department: "Business Admin", events: 6, participants: 95 },
    { department: "Engineering", events: 5, participants: 80 },
    { department: "Liberal Arts", events: 4, participants: 65 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Event participation and activity trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,200</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.6%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Events and Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Events & Attendance</CardTitle>
            <CardDescription>Event count and total attendance by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                events: {
                  label: "Events",
                  color: "hsl(var(--chart-1))",
                },
                attendance: {
                  label: "Attendance",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEventData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="events" fill="var(--color-events)" name="Events" />
                  <Bar dataKey="attendance" fill="var(--color-attendance)" name="Attendance" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Event Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Distribution of events by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                academic: { label: "Academic", color: "#3b82f6" },
                career: { label: "Career", color: "#10b981" },
                social: { label: "Social", color: "#f59e0b" },
                sports: { label: "Sports", color: "#ef4444" },
                other: { label: "Other", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Attendance Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rates by Event</CardTitle>
            <CardDescription>Percentage of registered attendees who showed up</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Attendance Rate",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceRateData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="event" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" fill="var(--color-rate)" name="Attendance Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Participation */}
        <Card>
          <CardHeader>
            <CardTitle>Department Participation</CardTitle>
            <CardDescription>Events organized and participants by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentParticipation.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{dept.department}</h4>
                    <p className="text-sm text-gray-600">{dept.events} events organized</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{dept.participants}</div>
                    <p className="text-xs text-gray-500">participants</p>
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
