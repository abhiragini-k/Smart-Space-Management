"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Video } from "lucide-react"

interface VideoProcessorProps {
  roomId: string
  roomName: string
  onDetectionUpdate: (roomId: string, peopleCount: number, status: string) => void
}

export function VideoProcessor({ roomId, roomName, onDetectionUpdate }: VideoProcessorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectionResults, setDetectionResults] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const startProcessing = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const processFrame = async () => {
      if (!isProcessing) return

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to base64 for sending to backend
      const frameData = canvas.toDataURL("image/jpeg", 0.8)

      try {
        // Send frame to YOLOv5 detection endpoint
        const response = await fetch("/api/detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            frameData,
            roomId,
          }),
        })

        if (response.ok) {
          const results = await response.json()
          setDetectionResults(results)
          onDetectionUpdate(roomId, results.peopleCount, results.status)

          // Draw bounding boxes on canvas
          ctx.strokeStyle = "#00ff00"
          ctx.lineWidth = 2
          ctx.font = "12px Arial"
          ctx.fillStyle = "#00ff00"

          results.boundingBoxes.forEach((box: any, index: number) => {
            ctx.strokeRect(box.x, box.y, box.width, box.height)
            ctx.fillText(`Person ${box.confidence.toFixed(2)}`, box.x, box.y - 5)
          })
        }
      } catch (error) {
        console.error("Detection error:", error)
      }

      // Process next frame
      setTimeout(processFrame, 1000) // Process every second
    }

    processFrame()
  }

  const stopProcessing = () => {
    setIsProcessing(false)
  }

  const togglePlayback = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      stopProcessing()
    } else {
      videoRef.current.play()
      startProcessing()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          {roomName}
        </CardTitle>
        <CardDescription>Live video processing with YOLOv5 person detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video ref={videoRef} className="w-full rounded-lg" style={{ display: "none" }} loop muted>
            <source src={`/placeholder.svg?height=240&width=320`} type="video/mp4" />
          </video>

          <canvas ref={canvasRef} width={320} height={240} className="w-full border rounded-lg bg-gray-900" />

          {detectionResults && (
            <div className="absolute top-2 right-2 space-y-1">
              <Badge variant="secondary">{detectionResults.peopleCount} people detected</Badge>
              <Badge
                variant={
                  detectionResults.status === "available"
                    ? "default"
                    : detectionResults.status === "occupied"
                      ? "secondary"
                      : "destructive"
                }
              >
                {detectionResults.status}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={togglePlayback} className="flex items-center gap-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Stop" : "Start"} Processing
          </Button>

          {detectionResults && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Last update: {new Date(detectionResults.timestamp).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
