import { type NextRequest, NextResponse } from "next/server"

// Mock room data storage (in production, this would be a database)
const rooms = [
  {
    id: "room-1",
    name: "Conference Room A",
    capacity: 12,
    currentOccupancy: 0,
    status: "available",
    equipment: ["Projector", "Whiteboard", "Video Conferencing"],
    lastUpdate: new Date().toISOString(),
    videoFeed: "stock_video_1.mp4",
  },
  {
    id: "room-2",
    name: "Meeting Room B",
    capacity: 8,
    currentOccupancy: 3,
    status: "occupied",
    equipment: ["TV Screen", "Whiteboard"],
    lastUpdate: new Date().toISOString(),
    videoFeed: "stock_video_2.mp4",
  },
  {
    id: "room-3",
    name: "Collaboration Space",
    capacity: 6,
    currentOccupancy: 6,
    status: "full",
    equipment: ["Interactive Display", "Comfortable Seating"],
    lastUpdate: new Date().toISOString(),
    videoFeed: "stock_video_3.mp4",
  },
  {
    id: "room-4",
    name: "Executive Boardroom",
    capacity: 16,
    currentOccupancy: 8,
    status: "occupied",
    equipment: ["Large Conference Table", "Premium AV Setup", "Video Conferencing"],
    lastUpdate: new Date().toISOString(),
    videoFeed: "stock_video_4.mp4",
  },
  {
    id: "room-5",
    name: "Training Room",
    capacity: 20,
    currentOccupancy: 0,
    status: "available",
    equipment: ["Projector", "Sound System", "Flexible Seating"],
    lastUpdate: new Date().toISOString(),
    videoFeed: "stock_video_5.mp4",
  },
]

export async function GET() {
  return NextResponse.json(rooms)
}

export async function PUT(request: NextRequest) {
  try {
    const { roomId, occupancy } = await request.json()

    const roomIndex = rooms.findIndex((room) => room.id === roomId)
    if (roomIndex === -1) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const room = rooms[roomIndex]
    room.currentOccupancy = occupancy
    room.lastUpdate = new Date().toISOString()

    // Update status based on occupancy
    if (occupancy === 0) {
      room.status = "available"
    } else if (occupancy >= room.capacity * 0.8) {
      room.status = "full"
    } else {
      room.status = "occupied"
    }

    rooms[roomIndex] = room

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}
