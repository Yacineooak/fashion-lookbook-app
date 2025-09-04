"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Sparkles, X, Heart, ShoppingBag, RefreshCw, User, Wand2, TrendingUp } from "lucide-react"

interface StyleRecommendation {
  id: string
  title: string
  description: string
  confidence: number
  items: {
    id: string
    title: string
    brand: string
    price: number
    image: string
    category: string
  }[]
  styleProfile: string
  occasion: string
}

interface AIStyleRecommenderProps {
  isOpen: boolean
  onClose: () => void
  userPreferences?: {
    favoriteColors: string[]
    preferredStyle: string
    budget: number
  }
}

export function AIStyleRecommender({ isOpen, onClose, userPreferences }: AIStyleRecommenderProps) {
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [likedRecommendations, setLikedRecommendations] = useState<Set<string>>(new Set())

  const recommendations: StyleRecommendation[] = [
    {
      id: "1",
      title: "Sophisticated Minimalist",
      description:
        "Clean lines and neutral tones create an effortlessly elegant look perfect for professional settings.",
      confidence: 94,
      styleProfile: "Minimalist Chic",
      occasion: "Business Casual",
      items: [
        {
          id: "2",
          title: "Cashmere Blazer",
          brand: "Maison Noir",
          price: 520,
          image: "/luxury-cashmere-blazer-in-charcoal-gray.jpg",
          category: "outerwear",
        },
        {
          id: "4",
          title: "Linen Shirt",
          brand: "Coastal Threads",
          price: 125,
          image: "/crisp-white-linen-shirt-minimalist-design.jpg",
          category: "tops",
        },
        {
          id: "3",
          title: "Leather Ankle Boots",
          brand: "Cobbler & Co",
          price: 340,
          image: "/premium-leather-ankle-boots-in-cognac-brown.jpg",
          category: "shoes",
        },
      ],
    },
    {
      id: "2",
      title: "Romantic Elegance",
      description: "Flowing fabrics and soft colors create a dreamy, feminine aesthetic perfect for special occasions.",
      confidence: 89,
      styleProfile: "Romantic Feminine",
      occasion: "Date Night",
      items: [
        {
          id: "1",
          title: "Silk Midi Dress",
          brand: "Atelier Luna",
          price: 285,
          image: "/elegant-silk-midi-dress-in-emerald-green.jpg",
          category: "dresses",
        },
        {
          id: "6",
          title: "Silk Scarf",
          brand: "Atelier Luna",
          price: 95,
          image: "/luxury-silk-scarf-with-abstract-pattern.jpg",
          category: "accessories",
        },
        {
          id: "8",
          title: "Pleated Skirt",
          brand: "Feminine Touch",
          price: 165,
          image: "/elegant-pleated-midi-skirt-in-blush-pink.jpg",
          category: "bottoms",
        },
      ],
    },
    {
      id: "3",
      title: "Urban Explorer",
      description: "Comfortable yet stylish pieces that transition seamlessly from day to night in the city.",
      confidence: 87,
      styleProfile: "Contemporary Casual",
      occasion: "Weekend Casual",
      items: [
        {
          id: "7",
          title: "Denim Jacket",
          brand: "Urban Classic",
          price: 180,
          image: "/vintage-style-denim-jacket-in-medium-wash.jpg",
          category: "outerwear",
        },
        {
          id: "4",
          title: "Linen Shirt",
          brand: "Coastal Threads",
          price: 125,
          image: "/crisp-white-linen-shirt-minimalist-design.jpg",
          category: "tops",
        },
        {
          id: "3",
          title: "Leather Ankle Boots",
          brand: "Cobbler & Co",
          price: 340,
          image: "/premium-leather-ankle-boots-in-cognac-brown.jpg",
          category: "shoes",
        },
      ],
    },
  ]

  const generateNewRecommendations = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setCurrentRecommendation((prev) => (prev + 1) % recommendations.length)
      setIsGenerating(false)
    }, 2000)
  }

  const toggleLike = (recommendationId: string) => {
    const newLiked = new Set(likedRecommendations)
    if (newLiked.has(recommendationId)) {
      newLiked.delete(recommendationId)
    } else {
      newLiked.add(recommendationId)
    }
    setLikedRecommendations(newLiked)
  }

  const currentRec = recommendations[currentRecommendation]
  const totalPrice = currentRec?.items.reduce((sum, item) => sum + item.price, 0) || 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 h-full w-96 bg-background border-r border-border z-50 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-serif font-bold text-foreground">AI Style Curator</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* AI Assistant Avatar */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Wand2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">Sophia</p>
                  <p className="text-sm text-muted-foreground">Your AI Style Assistant</p>
                </div>
              </div>

              {/* Style Profile */}
              <Card className="p-4 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Your Style Profile</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Based on your preferences and browsing history</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Minimalist</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Elegant</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Contemporary</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </Card>

              {/* Current Recommendation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRecommendation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {currentRec?.confidence}% Match
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleLike(currentRec?.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedRecommendations.has(currentRec?.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>

                    <h4 className="font-serif font-semibold text-lg mb-2">{currentRec?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{currentRec?.description}</p>

                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {currentRec?.styleProfile}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {currentRec?.occasion}
                      </Badge>
                    </div>

                    {/* Recommended Items */}
                    <div className="space-y-3 mb-4">
                      <h5 className="font-medium text-sm text-foreground">Recommended Items:</h5>
                      {currentRec?.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <p className="text-sm font-semibold text-primary">${item.price}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <ShoppingBag className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-4">
                      <span className="font-medium text-sm">Complete Look</span>
                      <span className="font-bold text-lg text-primary">${totalPrice}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-full" size="sm">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add All to Cart
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        Save Look
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Generate New Recommendations */}
              <Button
                variant="outline"
                className="w-full rounded-full mb-4 bg-transparent"
                onClick={generateNewRecommendations}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate New Look
                  </>
                )}
              </Button>

              {/* Recommendation Navigation */}
              <div className="flex justify-center gap-2 mb-6">
                {recommendations.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentRecommendation ? "bg-primary w-6" : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setCurrentRecommendation(index)}
                  />
                ))}
              </div>

              {/* AI Insights */}
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">AI Insights</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  "Based on your recent activity, you seem to prefer versatile pieces that can transition from day to
                  evening. Consider investing in quality basics that can be styled multiple ways."
                </p>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Versatile
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Quality
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Timeless
                  </Badge>
                </div>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
