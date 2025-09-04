"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Filter, Grid, Eye, Sparkles, Search, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import { FashionGallery } from "@/components/fashion-gallery"
import { FilterSidebar } from "@/components/filter-sidebar"
import { AIStyleRecommender } from "@/components/ai-style-recommender"
import { AdvancedSearch } from "@/components/advanced-search"
import { WishlistManager } from "@/components/wishlist-manager"
import { PerformanceMonitor } from "@/components/performance-monitor"

interface FilterState {
  colors: string[]
  categories: string[]
  brands: string[]
  seasons: string[]
  priceRange: [number, number]
  sortBy: string
  showOnSale: boolean
  showNew: boolean
}

export default function TrendifyHome() {
  const { theme, setTheme } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "lookbook">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [isAIRecommenderOpen, setIsAIRecommenderOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    categories: [],
    brands: [],
    seasons: [],
    priceRange: [0, 1000],
    sortBy: "featured",
    showOnSale: false,
    showNew: false,
  })

  const collections = [
    { id: "spring", name: "Spring Essentials", count: 24, color: "bg-emerald-500", season: "spring" },
    { id: "summer", name: "Summer Vibes", count: 18, color: "bg-cyan-500", season: "summer" },
    { id: "autumn", name: "Autumn Luxe", count: 32, color: "bg-amber-500", season: "autumn" },
    { id: "winter", name: "Winter Elegance", count: 28, color: "bg-slate-500", season: "winter" },
  ]

  const colorFilters = [
    { name: "All", value: "all", color: "bg-gradient-to-r from-primary to-secondary" },
    { name: "Black", value: "black", color: "bg-black" },
    { name: "White", value: "white", color: "bg-white border-2 border-border" },
    { name: "Beige", value: "beige", color: "bg-amber-100" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
  ]

  const handleCollectionSelect = (collection: (typeof collections)[0]) => {
    setActiveCollection(collection.id)
    setFilters((prev) => ({
      ...prev,
      seasons: [collection.season],
    }))
    setActiveFilter("all")
  }

  const handleQuickColorFilter = (color: string) => {
    if (color === "all") {
      setActiveFilter("all")
      setFilters((prev) => ({ ...prev, colors: [] }))
    } else {
      setActiveFilter(color)
      setFilters((prev) => ({ ...prev, colors: [color] }))
    }
    setActiveCollection(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-3xl font-serif font-bold text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Trendify
            </motion.h1>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full"
                title="Advanced Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlistOpen(true)}
                className="rounded-full"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAIRecommenderOpen(true)}
                className="rounded-full"
                title="AI Style Recommender"
              >
                <Sparkles className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-full"
              >
                <Grid className="h-5 w-5" />
              </Button>

              <Button
                variant={viewMode === "lookbook" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("lookbook")}
                className="rounded-full"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-6xl md:text-8xl font-serif font-bold text-foreground mb-6 text-balance">
              Fashion
              <span className="text-primary block">Redefined</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Discover curated collections that blend timeless elegance with contemporary innovation. Your personal
              style journey begins here.
            </p>
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              Explore Collections
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Collections Overview */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-4xl font-serif font-bold text-foreground">Seasonal Collections</h3>
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => setIsFilterOpen(true)}>
              <Filter className="h-4 w-4" />
              Filter
              {filters.colors.length +
                filters.categories.length +
                filters.brands.length +
                filters.seasons.length +
                (filters.showOnSale ? 1 : 0) +
                (filters.showNew ? 1 : 0) >
                0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.colors.length +
                    filters.categories.length +
                    filters.brands.length +
                    filters.seasons.length +
                    (filters.showOnSale ? 1 : 0) +
                    (filters.showNew ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 hover:shadow-lg transition-all cursor-pointer group ${
                    activeCollection === collection.id ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => handleCollectionSelect(collection)}
                >
                  <div
                    className={`w-full h-32 ${collection.color} rounded-lg mb-4 group-hover:scale-105 transition-transform`}
                  />
                  <h4 className="text-xl font-serif font-semibold mb-2">{collection.name}</h4>
                  <p className="text-muted-foreground">{collection.count} pieces</p>
                  {activeCollection === collection.id && (
                    <Badge className="mt-2 bg-primary text-primary-foreground">Selected</Badge>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Color Filters */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-muted-foreground">Quick color filter:</span>
            <div className="flex gap-2">
              {colorFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleQuickColorFilter(filter.value)}
                  className={`w-8 h-8 rounded-full ${filter.color} border-2 transition-all ${
                    activeFilter === filter.value ? "border-primary scale-110" : "border-transparent"
                  }`}
                  title={filter.name}
                />
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeCollection ||
            filters.colors.length > 0 ||
            filters.categories.length > 0 ||
            filters.brands.length > 0 ||
            filters.seasons.length > 0 ||
            filters.showOnSale ||
            filters.showNew) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {activeCollection && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {collections.find((c) => c.id === activeCollection)?.name}
                  <button onClick={() => setActiveCollection(null)} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </Badge>
              )}
              {filters.colors.map((color) => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== category) }))
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.showOnSale && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  On Sale
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, showOnSale: false }))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.showNew && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  New Arrivals
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, showNew: false }))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Fashion Gallery Grid */}
          <FashionGallery
            activeFilter={activeFilter}
            viewMode={viewMode}
            filters={filters}
            activeCollection={activeCollection}
          />
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <Badge variant="default" className="text-sm bg-primary text-primary-foreground">
                Now Available
              </Badge>
            </div>
            <h3 className="text-4xl font-serif font-bold text-foreground mb-6">AI Style Curator</h3>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Get personalized style recommendations powered by advanced AI. Discover looks that match your unique
              aesthetic and lifestyle.
            </p>
            <Button size="lg" className="rounded-full px-8 py-6 text-lg" onClick={() => setIsAIRecommenderOpen(true)}>
              <Sparkles className="h-5 w-5 mr-2" />
              Try AI Stylist
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <AIStyleRecommender
        isOpen={isAIRecommenderOpen}
        onClose={() => setIsAIRecommenderOpen(false)}
        userPreferences={{
          favoriteColors: ["black", "white", "beige"],
          preferredStyle: "minimalist",
          budget: 500,
        }}
      />

      {/* Advanced UX Components */}
      <AdvancedSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(query) => {
          console.log("Search query:", query)
          setIsSearchOpen(false)
        }}
      />

      <WishlistManager isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Performance Monitoring */}
      <PerformanceMonitor />
    </div>
  )
}
