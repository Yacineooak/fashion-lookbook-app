"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Camera, Mic, X, TrendingUp, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  title: string
  category: string
  price: number
  image: string
  trending?: boolean
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

export function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recentSearches] = useState([
    "Black midi dress",
    "Vintage denim jacket",
    "Minimalist accessories",
    "Summer collection",
  ])
  const [trendingSearches] = useState([
    "Sustainable fashion",
    "Y2K revival",
    "Cottagecore aesthetic",
    "Gender-neutral clothing",
  ])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Elegant Black Midi Dress",
      category: "Dresses",
      price: 189,
      image: "/elegant-silk-midi-dress-in-emerald-green.jpg",
      trending: true,
    },
    {
      id: "2",
      title: "Vintage Denim Jacket",
      category: "Outerwear",
      price: 129,
      image: "/vintage-style-denim-jacket-in-medium-wash.jpg",
    },
    {
      id: "3",
      title: "Minimalist Gold Necklace",
      category: "Accessories",
      price: 89,
      image: "/luxury-silk-scarf-with-abstract-pattern.jpg",
    },
  ]

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchResults(mockResults)
      onSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }

  const handleVoiceSearch = () => {
    setIsListening(true)
    // Mock voice search - in real app, would use Web Speech API
    setTimeout(() => {
      setIsListening(false)
      setQuery("Black midi dress")
      handleSearch("Black midi dress")
    }, 2000)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock visual search - in real app, would process image
      setQuery("Similar to uploaded image")
      handleSearch("Similar to uploaded image")
    }
  }

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
        className="fixed top-0 left-0 right-0 bg-background border-b border-border shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                placeholder="Search for fashion items, brands, or styles..."
                className="pl-10 pr-20 py-3 text-lg"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceSearch}
                  className={`p-2 ${isListening ? "text-red-500" : ""}`}
                  title="Voice search"
                >
                  <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleImageUpload} className="p-2" title="Visual search">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Suggestions */}
          {!query && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Now
                </h3>
                <div className="space-y-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="h-3 w-3 text-primary" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="relative mb-3">
                        <img
                          src={result.image || "/placeholder.svg"}
                          alt={result.title}
                          className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        {result.trending && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="font-medium mb-1">{result.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{result.category}</p>
                      <p className="font-semibold">${result.price}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {isListening && (
            <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                className="inline-flex items-center gap-3 text-red-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <Mic className="h-6 w-6" />
                <span className="text-lg">Listening...</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </motion.div>
    </motion.div>
  )
}
