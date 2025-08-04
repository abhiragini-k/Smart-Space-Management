"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Users, Eye, Settings, BarChart3, AlertCircle, Calendar } from "lucide-react"
import { format } from "date-fns"

// Types
interface Room {
  id: string
  name: string
  capacity: number
  currentOccupancy: number
  status: "available" | "occupied" | "full"
  equipment: string[]
  lastUpdate: Date
  videoFeed: string
  bookings: Booking[]
}

interface Booking {
  id: string
  roomId: string
  userName: string
  date: string
  startTime: string
  endTime: string
  purpose: string
}

export default function SmartSpaceManagement() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [userName, setUserName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  // Initialize rooms data
  useEffect(() => {
    const initialRooms: Room[] = [
      {
        id: "room-1",
        name: "Conference Room A",
        capacity: 12,
        currentOccupancy: 0,
        status: "available",
        equipment: ["Projector", "Whiteboard", "Video Conferencing"],
        lastUpdate: new Date(),
        videoFeed: "meeting_room_1.mp4",
        bookings: [],
      },
      {
        id: "room-2",
        name: "Meeting Room B",
        capacity: 8,
        currentOccupancy: 3,
        status: "occupied",
        equipment: ["TV Screen", "Whiteboard"],
        lastUpdate: new Date(),
        videoFeed: "meeting_room_2.mp4",
        bookings: [],
      },
      {
        id: "room-3",
        name: "Collaboration Space",
        capacity: 6,
        currentOccupancy: 6,
        status: "full",
        equipment: ["Interactive Display", "Comfortable Seating"],
        lastUpdate: new Date(),
        videoFeed: "meeting_room_3.mp4",
        bookings: [],
      },
      {
        id: "room-4",
        name: "Executive Boardroom",
        capacity: 16,
        currentOccupancy: 8,
        status: "occupied",
        equipment: ["Large Conference Table", "Premium AV Setup"],
        lastUpdate: new Date(),
        videoFeed: "meeting_room_4.mp4",
        bookings: [],
      },
      {
        id: "room-5",
        name: "Training Room",
        capacity: 20,
        currentOccupancy: 0,
        status: "available",
        equipment: ["Projector", "Sound System", "Flexible Seating"],
        lastUpdate: new Date(),
        videoFeed: "meeting_room_5.mp4",
        bookings: [],
      },
    ]
    setRooms(initialRooms)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          const change = Math.floor(Math.random() * 3) - 1
          const newOccupancy = Math.max(0, Math.min(room.capacity, room.currentOccupancy + change))

          let status: "available" | "occupied" | "full"
          if (newOccupancy === 0) {
            status = "available"
          } else if (newOccupancy >= room.capacity * 0.8) {
            status = "full"
          } else {
            status = "occupied"
          }

          return {
            ...room,
            currentOccupancy: newOccupancy,
            status,
            lastUpdate: new Date(),
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-yellow-500"
      case "full":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "occupied":
        return "secondary"
      case "full":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleQuickBook = (roomId: string) => {
    setSelectedRoom(roomId)
    setActiveTab("booking")
    toast({
      title: "Room Selected",
      description: `${rooms.find((r) => r.id === roomId)?.name} selected for booking.`,
    })
  }

  const handleViewDetails = (room: Room) => {
    toast({
      title: room.name,
      description: `Capacity: ${room.capacity} | Current: ${room.currentOccupancy} | Equipment: ${room.equipment.join(", ")}`,
    })
  }

  const handleBookRoom = () => {
    if (!selectedRoom || !bookingDate || !startTime || !endTime || !userName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: selectedRoom,
      userName,
      date: bookingDate,
      startTime,
      endTime,
      purpose,
    }

    setBookings((prev) => [...prev, newBooking])

    // Reset form
    setSelectedRoom("")
    setBookingDate("")
    setStartTime("")
    setEndTime("")
    setUserName("")
    setPurpose("")

    toast({
      title: "Booking Confirmed",
      description: `Room booked successfully for ${bookingDate} from ${startTime} to ${endTime}.`,
    })
  }

  const totalRooms = rooms.length
  const availableRooms = rooms.filter((r) => r.status === "available").length
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length
  const totalPeople = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Space Management</h1>
          <p className="text-gray-600">Real-time occupancy monitoring and room booking</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="booking">
              <Calendar className="h-4 w-4 mr-2" />
              Book Room
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                    </div>
                    <Badge variant={getStatusBadgeVariant(room.status)} className="w-fit">
                      {room.status.toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {room.currentOccupancy}/{room.capacity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{format(room.lastUpdate, "HH:mm:ss")}</div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(room.status)}`}
                        style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleQuickBook(room.id)}
                        disabled={room.status === "full"}
                        className="flex-1"
                      >
                        Book
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(room)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Book a Room</CardTitle>
                <CardDescription>Select room and time for your meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms
                          .filter((room) => room.status !== "full")
                          .map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} ({room.currentOccupancy}/{room.capacity})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Purpose (Optional)</Label>
                    <Input placeholder="Meeting purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                  </div>
                </div>

                <Button onClick={handleBookRoom} className="w-full">
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{totalRooms}</div>
                  <p className="text-sm text-gray-600">Total Rooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
                  <p className="text-sm text-gray-600">Available</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{occupiedRooms}</div>
                  <p className="text-sm text-gray-600">Occupied</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{totalPeople}</div>
                  <p className="text-sm text-gray-600">Total People</p>
                </CardContent>
              </Card>
            </div>

            {/* Room Utilization Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Room Utilization Analytics
                </CardTitle>
                <CardDescription>Usage patterns and occupancy trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Occupancy Chart */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Current Occupancy Distribution</h4>
                    <div className="space-y-3">
                      {rooms.map((room) => (
                        <div key={room.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{room.name}</span>
                            <span className="text-gray-500">
                              {room.currentOccupancy}/{room.capacity} (
                              {Math.round((room.currentOccupancy / room.capacity) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getStatusColor(room.status)}`}
                              style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Usage Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((availableRooms / totalRooms) * 100)}%
                        </div>
                        <p className="text-sm text-green-700">Availability Rate</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((totalPeople / rooms.reduce((sum, r) => sum + r.capacity, 0)) * 100)}%
                        </div>
                        <p className="text-sm text-blue-700">Overall Utilization</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {rooms.filter((r) => r.currentOccupancy > 0).length}
                        </div>
                        <p className="text-sm text-yellow-700">Active Rooms</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {totalPeople > 0
                            ? Math.round(totalPeople / rooms.filter((r) => r.currentOccupancy > 0).length)
                            : 0}
                        </div>
                        <p className="text-sm text-purple-700">Avg. People/Room</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
                <CardDescription>Room usage patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Morning (9AM - 12PM)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Occupancy</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "65%" }} />
                      </div>
                      <p className="text-xs text-gray-600">Peak meeting hours</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Afternoon (12PM - 5PM)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Occupancy</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "85%" }} />
                      </div>
                      <p className="text-xs text-gray-600">Highest usage period</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Evening (5PM - 8PM)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Occupancy</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: "35%" }} />
                      </div>
                      <p className="text-xs text-gray-600">Declining usage</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment & Room Analytics</CardTitle>
                <CardDescription>Popular equipment and room preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Most Popular Equipment</h4>
                    <div className="space-y-3">
                      {[
                        { name: "Projector", usage: 85, rooms: 3 },
                        { name: "Whiteboard", usage: 70, rooms: 4 },
                        { name: "Video Conferencing", usage: 60, rooms: 2 },
                        { name: "TV Screen", usage: 45, rooms: 2 },
                        { name: "Sound System", usage: 30, rooms: 1 },
                      ].map((equipment) => (
                        <div key={equipment.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{equipment.name}</span>
                            <span className="text-gray-500">{equipment.usage}% usage</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${equipment.usage}%` }} />
                          </div>
                          <p className="text-xs text-gray-600">Available in {equipment.rooms} rooms</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Room Popularity Ranking</h4>
                    <div className="space-y-3">
                      {rooms
                        .sort((a, b) => b.currentOccupancy / b.capacity - a.currentOccupancy / a.capacity)
                        .map((room, index) => (
                          <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{room.name}</p>
                                <p className="text-xs text-gray-600">Capacity: {room.capacity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {Math.round((room.currentOccupancy / room.capacity) * 100)}%
                              </p>
                              <p className="text-xs text-gray-600">utilization</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends & Insights</CardTitle>
                <CardDescription>Analysis of booking patterns and user behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Weekly Booking Pattern</h4>
                    <div className="space-y-2">
                      {[
                        { day: "Monday", bookings: 12, percentage: 85 },
                        { day: "Tuesday", bookings: 15, percentage: 100 },
                        { day: "Wednesday", bookings: 14, percentage: 95 },
                        { day: "Thursday", bookings: 13, percentage: 90 },
                        { day: "Friday", bookings: 8, percentage: 60 },
                      ].map((day) => (
                        <div key={day.day} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{day.day}</span>
                            <span className="text-gray-500">{day.bookings} bookings</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${day.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Average Meeting Duration</h4>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-blue-600">1.5</div>
                      <p className="text-sm text-gray-600">hours per meeting</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium">Short (&lt; 1hr)</div>
                          <div className="text-blue-600">35%</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="font-medium">Long (&gt; 2hr)</div>
                          <div className="text-green-600">25%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">System Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <Badge variant="default">99.9%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time</span>
                        <Badge variant="secondary">&lt; 100ms</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Detection Accuracy</span>
                        <Badge variant="default">95.2%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">User Satisfaction</span>
                        <Badge variant="default">4.8/5</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings
                      .slice(-5)
                      .reverse()
                      .map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{rooms.find((r) => r.id === booking.roomId)?.name}</p>
                            <p className="text-sm text-gray-600">
                              {booking.userName} • {booking.date} • {booking.startTime}-{booking.endTime}
                            </p>
                          </div>
                          <Badge variant="outline">Confirmed</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
