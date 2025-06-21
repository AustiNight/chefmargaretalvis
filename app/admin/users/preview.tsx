"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Search, Trash2, Mail, ChevronDown, Calendar, CheckCircle, RefreshCw, Filter, Download } from "lucide-react"

export default function AdminUsersPreview() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterSubscribed, setFilterSubscribed] = useState(false)

  const users = [
    {
      id: "1",
      fullName: "John Smith",
      email: "john@example.com",
      subscribeNewsletter: true,
      signupDate: "2023-04-15T10:30:00Z",
      lastContactedDate: "2023-05-10T14:20:00Z",
      lastContactedEventName: "Summer Gala Dinner",
    },
    {
      id: "2",
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      subscribeNewsletter: true,
      signupDate: "2023-04-20T09:15:00Z",
      lastContactedDate: null,
      lastContactedEventName: null,
    },
    {
      id: "3",
      fullName: "Michael Brown",
      email: "michael@example.com",
      subscribeNewsletter: false,
      signupDate: "2023-05-05T16:45:00Z",
      lastContactedDate: null,
      lastContactedEventName: null,
    },
  ]

  const handleSelectUser = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUserIds((prev) => [...prev, userId])
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    setSelectAll(isSelected)
    if (isSelected) {
      setSelectedUserIds(users.map((user) => user.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleSendEventNotification = () => {
    if (selectedUserIds.length === 0) {
      alert("Please select at least one user to send notifications.")
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Notification sent to ${selectedUserIds.length} users!`)
    }, 1500)
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">User Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="text-gray-400" />
            <Input placeholder="Search users..." className="max-w-md" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setFilterSubscribed(!filterSubscribed)}
            >
              <Filter className="h-4 w-4" />
              {filterSubscribed ? "Show All" : "Show Subscribed Only"}
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export Users
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" disabled={selectedUserIds.length === 0 || isProcessing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
                  Bulk Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSendEventNotification}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send "Summer Gala Dinner" Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSendEventNotification}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send "Independence Day BBQ" Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableCaption>Showing {users.length} users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectAll && users.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={users.length === 0}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Last Contacted</TableHead>
              <TableHead>Last Event</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </TableCell>
                <TableCell>
                  {user.subscribeNewsletter ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.signupDate)}</TableCell>
                <TableCell>{formatDate(user.lastContactedDate)}</TableCell>
                <TableCell>
                  {user.lastContactedEventName ? (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                      <span className="truncate max-w-[150px]" title={user.lastContactedEventName}>
                        {user.lastContactedEventName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
