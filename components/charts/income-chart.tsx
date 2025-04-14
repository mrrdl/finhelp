"use client"

import { useEffect, useRef } from "react"

export function IncomeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const months = 12
    const data = [15000, 25000, 20000, 30000, 25000, 35000, 40000, 30000, 35000, 45000, 50000, 55000]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = 20
    const graphWidth = chartWidth - padding * 2
    const graphHeight = chartHeight - padding * 2

    // Calculate x and y positions
    const xStep = graphWidth / (months - 1)
    const maxValue = Math.max(...data) * 1.1

    // Draw the line
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight - padding - (data[0] / maxValue) * graphHeight)

    for (let i = 1; i < months; i++) {
      const x = padding + i * xStep
      const y = chartHeight - padding - (data[i] / maxValue) * graphHeight

      // Control points for curve
      const prevX = padding + (i - 1) * xStep
      const prevY = chartHeight - padding - (data[i - 1] / maxValue) * graphHeight
      const cpX1 = prevX + xStep / 3
      const cpX2 = x - xStep / 3

      ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
    }

    // Line style
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.stroke()

    // Fill area under the curve
    ctx.lineTo(padding + graphWidth, chartHeight - padding)
    ctx.lineTo(padding, chartHeight - padding)
    ctx.closePath()

    // Fill style
    const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)")
    ctx.fillStyle = gradient
    ctx.fill()
  }, [])

  return (
    <div className="w-full h-[200px]">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
