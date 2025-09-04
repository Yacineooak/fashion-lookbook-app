"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PerformanceMetrics {
  fps: number
  loadTime: number
  memoryUsage: number
  networkSpeed: string
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    loadTime: 0,
    memoryUsage: 0,
    networkSpeed: "4g",
  })
  const [showMonitor, setShowMonitor] = useState(false)

  useEffect(() => {
    // Performance monitoring
    const startTime = performance.now()

    // FPS monitoring
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime)),
        }))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)

    // Load time measurement
    window.addEventListener("load", () => {
      const loadTime = performance.now() - startTime
      setMetrics((prev) => ({
        ...prev,
        loadTime: Math.round(loadTime),
      }))
    })

    // Memory usage (if available)
    if ("memory" in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        }))
      }

      const memoryInterval = setInterval(updateMemory, 2000)
      return () => clearInterval(memoryInterval)
    }

    // Network speed detection
    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      setMetrics((prev) => ({
        ...prev,
        networkSpeed: connection.effectiveType || "4g",
      }))
    }

    // Show monitor in development
    if (process.env.NODE_ENV === "development") {
      const timer = setTimeout(() => setShowMonitor(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Auto-hide in production or when performance is good
  useEffect(() => {
    if (metrics.fps >= 55 && metrics.loadTime < 2000) {
      const timer = setTimeout(() => setShowMonitor(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [metrics.fps, metrics.loadTime])

  if (!showMonitor) return null

  const getPerformanceColor = () => {
    if (metrics.fps >= 55 && metrics.loadTime < 2000) return "text-green-500"
    if (metrics.fps >= 30 && metrics.loadTime < 5000) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-3 bg-background/90 backdrop-blur-sm border shadow-lg">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Activity className={`h-4 w-4 ${getPerformanceColor()}`} />
              <span className="font-mono">{metrics.fps} FPS</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{metrics.loadTime}ms</span>
            </div>

            {metrics.memoryUsage > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{metrics.memoryUsage}MB</span>
              </div>
            )}

            <Badge variant="outline" className="text-xs">
              {metrics.networkSpeed.toUpperCase()}
            </Badge>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
