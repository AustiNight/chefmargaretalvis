"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import HelpGuide from "@/components/HelpGuide"
import {
  getAllUsersAction,
  deleteUserAction,
  getUsersByIdsAction,
  updateUserLastContactedAction,
} from "@/app/actions/users"
import { getAllEvents } from "@/lib/db/events"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import {
  Search,
  Trash2,
  Mail,
  ChevronDown,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Download,
  Filter,
} from "lucide-react"
import type { User, Event } from "@/types"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filterSubscribed, setFilterSubscribed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch users and events on component mount
    loadUsers()
    loadEvents()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const allUsers = await getAllUsersAction()
      // Sort by signup date, newest first
      allUsers.sort((a, b) => new Date(b.signup_date).getTime() - new Date(a.signup_date).getTime())
      setUsers(allUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const allEvents = await getAllEvents()
      // Sort by date, newest first
      allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setEvents(allEvents)
    } catch (error) {
      console.error("Error loading events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const result = await deleteUserAction(id)
        if (result.success) {
          // Remove the deleted user from the state
          setUsers((prev) => prev.filter((user) => user.id !== id))
          toast({
            title: "User deleted",
            description: "The user has been permanently deleted.",
          })
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

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
      setSelectedUserIds(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleSendEventNotification = async (eventId: string) => {
    if (selectedUserIds.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to send notifications.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const selectedEvent = events.find((event) => event.id === eventId)

      if (!selectedEvent) {
        throw new Error("Event not found")
      }

      const selectedUsers = await getUsersByIdsAction(selectedUserIds)

      toast({
        title: "Sending notifications",
        description: `Sending event notification to ${selectedUsers.length} users...`,
      })

      // Update last contacted info for each user
      const updatePromises = selectedUserIds.map((userId) =>
        updateUserLastContactedAction(userId, eventId, selectedEvent.description),
      )

      await Promise.all(updatePromises)

      toast({
        title: "Notifications sent",
        description: `Successfully sent to ${selectedUsers.length} users.`,
      })

      // Refresh user list to update last contacted info
      loadUsers()
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast({
        title: "Error",
        description: "There was a problem sending the notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const exportUsersToCsv = () => {
    const usersToExport = selectedUserIds.length > 0 ? users.filter((user) => selectedUserIds.includes(user.id)) : users

    if (usersToExport.length === 0) {
      toast({
        title: "No users to export",
        description: "There are no users to export.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["Full Name", "Email", "Address", "Subscribed", "Signup Date", "Last Contacted", "Last Event"]
    const csvRows = [
      headers.join(","),
      ...usersToExport.map((user) =>
        [
          `"${user.full_name}"`,
          `"${user.email}"`,
          `"${user.address || ""}"`,
          user.subscribe_newsletter ? "Yes" : "No",
          new Date(user.signup_date).toLocaleDateString(),
          user.last_contacted_date ? new Date(user.last_contacted_date).toLocaleDateString() : "Never",
          `"${user.last_contacted_event_name || ""}"`,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `users-export-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter users based on search term and subscription filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterSubscribed) {
      return matchesSearch && user.subscribe_newsletter
    }

    return matchesSearch
  })

  const formatDate = (dateString?: string | Date) => {
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
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">User Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="relative">
        <HelpGuide title="User Management">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Understanding User Management</h4>
              <p>
                <strong>What:</strong> The User Management section allows you to view, search, edit, and manage your
                newsletter subscribers and website members.
              </p>
              <p>
                <strong>Where:</strong> Users are added when they sign up through the website's sign-up form or register
                for events.
              </p>
              <p>
                <strong>When:</strong> Access this section when you need to communicate with users, manage your mailing
                list, or review subscriber information.
              </p>
              <p>
                <strong>Why:</strong> Maintaining an organized subscriber list helps you effectively communicate with
                interested clients and promote your services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Features</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Search:</strong> Quickly find specific users by typing their name or email in the search box.
                </li>
                <li>
                  <strong>Filter:</strong> Show only subscribed users to focus on your active audience.
                </li>
                <li>
                  <strong>Bulk Selection:</strong> Select multiple users to perform actions like sending event
                  notifications.
                </li>
                <li>
                  <strong>Communication History:</strong> See when users were last contacted and which event was shared
                  with them.
                </li>
                <li>
                  <strong>Export:</strong> Download your user list as a CSV file for backup or external use.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Sending Event Notifications</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Select users by checking the boxes next to their names.</li>
                <li>Click the "Bulk Actions" dropdown and choose "Send Event Notification".</li>
                <li>Select which event you want to share with the selected users.</li>
                <li>The system will send emails and update the contact history automatically.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Regular Maintenance:</strong> Review your user list monthly to ensure it's up-to-date.
                </li>
                <li>
                  <strong>Respect Privacy:</strong> Only collect and store information that users have willingly
                  provided.
                </li>
                <li>
                  <strong>Communication Frequency:</strong> Avoid overwhelming users with too many emails. Aim for
                  quality over quantity.
                </li>
                <li>
                  <strong>Segmentation:</strong> Use the search and filter features to target specific groups of users
                  for more relevant communications.
                </li>
              </ul>
            </div>
          </div>
        </HelpGuide>

        <h2 className="text-2xl font-bold mb-6">User Management</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
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

            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportUsersToCsv}>
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
                {events.length > 0 ? (
                  events.map((event) => (
                    <DropdownMenuItem key={event.id} onClick={() => handleSendEventNotification(event.id)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send "{event.description}" Event
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    No events available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <Table>
            <TableCaption>
              {filteredUsers.length === 0
                ? "No users found matching your search criteria."
                : `Showing ${filteredUsers.length} of ${users.length} users`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                    disabled={filteredUsers.length === 0}
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {user.subscribe_newsletter ? (
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
                  <TableCell>{formatDate(user.signup_date)}</TableCell>
                  <TableCell>{formatDate(user.last_contacted_date)}</TableCell>
                  <TableCell>
                    {user.last_contacted_event_name ? (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="truncate max-w-[150px]" title={user.last_contacted_event_name}>
                          {user.last_contacted_event_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your search criteria.</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters, or wait for users to sign up through your website.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
