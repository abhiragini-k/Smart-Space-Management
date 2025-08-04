import { type NextRequest, NextResponse } from "next/server"

// Simulated YOLOv5 detection endpoint
export async function POST(request: NextRequest) {
  try {
    const { frameData, roomId } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Simulate YOLOv5 detection results
    const peopleCount = Math.floor(Math.random() * 10)
    const boundingBoxes = Array.from({ length: peopleCount }, (_, i) => ({
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 60 + Math.random() * 40,
      height: 80 + Math.random() * 60,
      confidence: 0.7 + Math.random() * 0.3,
    }))

    let status: "available" | "occupied" | "full"
    if (peopleCount === 0) {
      status = "available"
    } else if (peopleCount >= 8) {
      status = "full"
    } else {
      status = "occupied"
    }

    const result = {
      roomId,
      peopleCount,
      boundingBoxes,
      status,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Detection processing failed" }, { status: 500 })
  }
}
