"use client"

import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  variant?: "card" | "gallery" | "text" | "avatar"
  count?: number
  className?: string
}

export function LoadingSkeleton({ variant = "card", count = 1, className = "" }: LoadingSkeletonProps) {
  const shimmer = {
    initial: { backgroundPosition: "-200px 0" },
    animate: {
      backgroundPosition: "calc(200px + 100%) 0",
    },
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  }

  const skeletonBase = "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200px_100%] animate-pulse"

  const renderSkeleton = () => {
    switch (variant) {
      case "gallery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className={`h-64 rounded-lg ${skeletonBase}`}
                  style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="space-y-2">
                  <motion.div
                    className={`h-4 w-3/4 rounded ${skeletonBase}`}
                    animate={shimmer.animate}
                    transition={{ ...shimmer.transition, delay: 0.1 }}
                  />
                  <motion.div
                    className={`h-3 w-1/2 rounded ${skeletonBase}`}
                    animate={shimmer.animate}
                    transition={{ ...shimmer.transition, delay: 0.2 }}
                  />
                  <motion.div
                    className={`h-4 w-1/4 rounded ${skeletonBase}`}
                    animate={shimmer.animate}
                    transition={{ ...shimmer.transition, delay: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )

      case "text":
        return (
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-4 rounded ${skeletonBase}`}
                style={{ width: `${Math.random() * 40 + 60}%` }}
                animate={shimmer.animate}
                transition={{ ...shimmer.transition, delay: i * 0.1 }}
              />
            ))}
          </div>
        )

      case "avatar":
        return (
          <motion.div
            className={`w-12 h-12 rounded-full ${skeletonBase}`}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        )

      default:
        return (
          <motion.div className={`p-6 space-y-4 ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className={`h-48 rounded-lg ${skeletonBase}`}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <div className="space-y-2">
              <motion.div
                className={`h-4 w-3/4 rounded ${skeletonBase}`}
                animate={shimmer.animate}
                transition={{ ...shimmer.transition, delay: 0.1 }}
              />
              <motion.div
                className={`h-3 w-1/2 rounded ${skeletonBase}`}
                animate={shimmer.animate}
                transition={{ ...shimmer.transition, delay: 0.2 }}
              />
            </div>
          </motion.div>
        )
    }
  }

  return <>{renderSkeleton()}</>
}
