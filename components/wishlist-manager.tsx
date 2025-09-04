"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, Share2, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  id: string
  title: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
  addedAt: Date
}

interface WishlistManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function WishlistManager({ isOpen, onClose }: WishlistManagerProps) {
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Mock wishlist data
  useEffect(() => {
    const mockItems: WishlistItem[] = [
      {
        id: "1",
        title: "Elegant Silk Midi Dress",
        brand: "Luxury Brand",
        price: 189,
        originalPrice: 249,
        image: "/elegant-silk-midi-dress-in-emerald-green.jpg",
        category: "Dresses",
        inStock: true,
        addedAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "2",
        title: "Cashmere Blazer",
        brand: "Premium Co.",
        price: 299,
        image: "/luxury-cashmere-blazer-in-charcoal-gray.jpg",
        category: "Outerwear",
        inStock: false,
        addedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        id: "3",
        title: "Leather Ankle Boots",
        brand: "Artisan Shoes",
        price: 159,
        image: "/premium-leather-ankle-boots-in-cognac-brown.jpg",
        category: "Shoes",
        inStock: true,
        addedAt: new Date(Date.now() - 259200000), // 3 days ago
      },
    ]
    setWishlistItems(mockItems)
  }, [])

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    })
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Fashion Wishlist",
        text: "Check out my curated fashion wishlist on Trendify!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Wishlist link copied to clipboard.",
      })
    }
  }

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = wishlistItems.reduce(
    (sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0),
    0,
  )

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-xl overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold">My Wishlist</h2>
              <p className="text-sm text-muted-foreground">
                {wishlistItems.length} items • ${totalValue.toFixed(2)} total
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {totalSavings > 0 && (
            <Card className="p-4 mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Total Savings</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalSavings.toFixed(2)}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {Math.round((totalSavings / (totalValue + totalSavings)) * 100)}% off
                </Badge>
              </div>
            </Card>
          )}

          <div className="flex gap-2 mb-6">
            <Button onClick={shareWishlist} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Buy All
            </Button>
          </div>

          <AnimatePresence>
            {wishlistItems.length === 0 ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground">Start adding items you love to keep track of them!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 group hover:shadow-md transition-all">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-medium">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-semibold">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added {item.addedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" disabled={!item.inStock} className="text-xs px-2">
                            {item.inStock ? "Add to Cart" : "Notify Me"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
