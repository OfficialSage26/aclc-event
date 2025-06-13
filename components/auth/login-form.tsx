"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Demo users for different roles
  const demoUsers: User[] = [
    { id: "1", name: "Admin User", email: "admin@aclc.edu.ph", role: "admin" },
    {
      id: "2",
      name: "Event Organizer",
      email: "organizer@aclc.edu.ph",
      role: "organizer",
      department: "Student Affairs",
    },
    { id: "3", name: "Faculty Member", email: "faculty@aclc.edu.ph", role: "faculty", department: "Computer Science" },
    { id: "4", name: "Student User", email: "student@aclc.edu.ph", role: "student", department: "BSIT" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Find user by role for demo purposes
    const user = demoUsers.find((u) => u.role === selectedRole)
    if (user) {
      onLogin(user)
    }
  }

  const handleDemoLogin = (role: string) => {
    const user = demoUsers.find((u) => u.role === role)
    if (user) {
      onLogin(user)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Access the Event Management System</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@aclc.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="organizer">Event Organizer</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={!selectedRole}>
            Sign In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Demo Access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin")}>
            Admin Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("organizer")}>
            Organizer Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("faculty")}>
            Faculty Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin("student")}>
            Student Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
