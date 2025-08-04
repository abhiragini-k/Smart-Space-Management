"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapData {
  hour: number
  day: string
  intensity: number
}

export function UsageHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8AM to 7PM

  // Generate mock heatmap data
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = []
    days.forEach((day) => {
      hours.forEach((hour) => {
        // Simulate higher usage during business hours
        let intensity = 0
        if (hour >= 9 && hour <= 17) {
          intensity = Math.random() * 0.8 + 0.2 // 20-100% intensity
          if (hour >= 13 && hour <= 15) {
            intensity = Math.min(intensity + 0.3, 1) // Peak hours
          }
        } else {
          intensity = Math.random() * 0.3 // Low intensity outside business hours
        }

        // Weekend adjustment
        if (day === "Sat" || day === "Sun") {
          intensity *= 0.3
        }

        data.push({ hour, day, intensity })
      })
    })
    return data
  }

  const heatmapData = generateHeatmapData()

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.2) return "bg-gray-100"
    if (intensity < 0.4) return "bg-blue-200"
    if (intensity < 0.6) return "bg-blue-400"
    if (intensity < 0.8) return "bg-blue-600"
    return "bg-blue-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Heatmap</CardTitle>
        <CardDescription>Room usage intensity throughout the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Hour labels */}
          <div className="flex">
            <div className="w-12"></div>
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {days.map((day) => (
            <div key={day} className="flex items-center">
              <div className="w-12 text-xs text-gray-500 text-right pr-2">{day}</div>
              {hours.map((hour) => {
                const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hour)
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`flex-1 h-6 mx-0.5 rounded-sm ${getIntensityColor(dataPoint?.intensity || 0)}`}
                    title={`${day} ${hour}:00 - ${Math.round((dataPoint?.intensity || 0) * 100)}% usage`}
                  />
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-800 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
