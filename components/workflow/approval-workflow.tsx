"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "faculty" | "student"
  department?: string
}

interface EventProposal {
  id: string
  title: string
  description: string
  proposedBy: string
  department: string
  date: string
  location: string
  expectedAttendees: number
  budget: number
  status: "pending" | "approved" | "rejected" | "revision_requested"
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  comments?: string
}

interface ApprovalWorkflowProps {
  user: User
}

export function ApprovalWorkflow({ user }: ApprovalWorkflowProps) {
  const [proposals, setProposals] = useState<EventProposal[]>([
    {
      id: "1",
      title: "AI Workshop Series",
      description: "A comprehensive workshop series on artificial intelligence and machine learning for students",
      proposedBy: "Dr. Maria Santos",
      department: "Computer Science",
      date: "2024-02-15",
      location: "Computer Lab 1",
      expectedAttendees: 50,
      budget: 15000,
      status: "pending",
      submittedAt: "2024-01-10 14:30",
    },
    {
      id: "2",
      title: "Entrepreneurship Summit",
      description: "Annual summit featuring successful entrepreneurs and startup founders",
      proposedBy: "Prof. John Cruz",
      department: "Business Administration",
      date: "2024-03-01",
      location: "Main Auditorium",
      expectedAttendees: 200,
      budget: 50000,
      status: "pending",
      submittedAt: "2024-01-12 09:15",
    },
    {
      id: "3",
      title: "Cultural Night",
      description: "Celebration of Filipino culture with performances and traditional food",
      proposedBy: "Student Council",
      department: "Student Affairs",
      date: "2024-02-28",
      location: "Gymnasium",
      expectedAttendees: 300,
      budget: 25000,
      status: "approved",
      submittedAt: "2024-01-08 16:45",
      reviewedBy: "Admin User",
      reviewedAt: "2024-01-09 10:30",
      comments: "Approved with budget adjustment",
    },
  ])

  const [selectedProposal, setSelectedProposal] = useState<EventProposal | null>(null)
  const [reviewComment, setReviewComment] = useState("")

  const handleApprove = (proposalId: string) => {
    setProposals(
      proposals.map((proposal) =>
        proposal.id === proposalId
          ? {
              ...proposal,
              status: "approved" as const,
              reviewedBy: user.name,
              reviewedAt: new Date().toISOString(),
              comments: reviewComment || "Approved",
            }
          : proposal,
      ),
    )
    setReviewComment("")
    setSelectedProposal(null)
  }

  const handleReject = (proposalId: string) => {
    setProposals(
      proposals.map((proposal) =>
        proposal.id === proposalId
          ? {
              ...proposal,
              status: "rejected" as const,
              reviewedBy: user.name,
              reviewedAt: new Date().toISOString(),
              comments: reviewComment || "Rejected",
            }
          : proposal,
      ),
    )
    setReviewComment("")
    setSelectedProposal(null)
  }

  const handleRequestRevision = (proposalId: string) => {
    setProposals(
      proposals.map((proposal) =>
        proposal.id === proposalId
          ? {
              ...proposal,
              status: "revision_requested" as const,
              reviewedBy: user.name,
              reviewedAt: new Date().toISOString(),
              comments: reviewComment || "Revision requested",
            }
          : proposal,
      ),
    )
    setReviewComment("")
    setSelectedProposal(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      case "revision_requested":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "revision_requested":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const pendingCount = proposals.filter((p) => p.status === "pending").length
  const approvedCount = proposals.filter((p) => p.status === "approved").length
  const rejectedCount = proposals.filter((p) => p.status === "rejected").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Approval Workflow</h2>
        <p className="text-gray-600">Review and approve event proposals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱
              {proposals
                .filter((p) => p.status === "approved")
                .reduce((sum, p) => sum + p.budget, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Approved events</p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle>Event Proposals</CardTitle>
          <CardDescription>Review and manage event proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{proposal.title}</h3>
                      <Badge variant={getStatusColor(proposal.status)} className="flex items-center gap-1">
                        {getStatusIcon(proposal.status)}
                        {proposal.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{proposal.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Proposed by:</span>
                        <br />
                        {proposal.proposedBy}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>
                        <br />
                        {proposal.department}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <br />
                        {proposal.date}
                      </div>
                      <div>
                        <span className="font-medium">Expected:</span>
                        <br />
                        {proposal.expectedAttendees} attendees
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <span className="font-medium">Budget:</span> ₱{proposal.budget.toLocaleString()}
                    </div>

                    {proposal.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-sm">Review Comments:</span>
                        <p className="text-sm text-gray-600 mt-1">{proposal.comments}</p>
                        {proposal.reviewedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed by {proposal.reviewedBy} on {proposal.reviewedAt}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProposal(proposal)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Proposal: {proposal.title}</DialogTitle>
                          <DialogDescription>
                            Provide your review and decision for this event proposal
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Proposed by:</strong> {proposal.proposedBy}
                            </div>
                            <div>
                              <strong>Department:</strong> {proposal.department}
                            </div>
                            <div>
                              <strong>Date:</strong> {proposal.date}
                            </div>
                            <div>
                              <strong>Location:</strong> {proposal.location}
                            </div>
                            <div>
                              <strong>Expected Attendees:</strong> {proposal.expectedAttendees}
                            </div>
                            <div>
                              <strong>Budget:</strong> ₱{proposal.budget.toLocaleString()}
                            </div>
                          </div>

                          <div>
                            <strong>Description:</strong>
                            <p className="mt-1 text-gray-600">{proposal.description}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Review Comments</label>
                            <Textarea
                              placeholder="Add your comments here..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={4}
                            />
                          </div>

                          {proposal.status === "pending" && (
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => handleRequestRevision(proposal.id)}>
                                Request Revision
                              </Button>
                              <Button variant="destructive" onClick={() => handleReject(proposal.id)}>
                                Reject
                              </Button>
                              <Button onClick={() => handleApprove(proposal.id)}>Approve</Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="text-xs text-gray-500">Submitted on {proposal.submittedAt}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
