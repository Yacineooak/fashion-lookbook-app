"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"

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

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterSidebar({ isOpen, onClose, filters, onFiltersChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    categories: true,
    brands: false,
    seasons: true,
    price: true,
    special: true,
  })

  const colorOptions = [
    { name: "Black", value: "black", color: "bg-black" },
    { name: "White", value: "white", color: "bg-white border-2 border-border" },
    { name: "Gray", value: "gray", color: "bg-gray-500" },
    { name: "Beige", value: "beige", color: "bg-amber-100" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Navy", value: "navy", color: "bg-blue-900" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Pink", value: "pink", color: "bg-pink-300" },
    { name: "Emerald", value: "emerald", color: "bg-emerald-500" },
    { name: "Brown", value: "brown", color: "bg-amber-800" },
  ]

  const categoryOptions = [
    { name: "Dresses", value: "dresses" },
    { name: "Tops", value: "tops" },
    { name: "Bottoms", value: "bottoms" },
    { name: "Outerwear", value: "outerwear" },
    { name: "Shoes", value: "shoes" },
    { name: "Accessories", value: "accessories" },
  ]

  const brandOptions = [
    { name: "Atelier Luna", value: "atelier-luna" },
    { name: "Maison Noir", value: "maison-noir" },
    { name: "Cobbler & Co", value: "cobbler-co" },
    { name: "Coastal Threads", value: "coastal-threads" },
    { name: "Nordic Style", value: "nordic-style" },
    { name: "Urban Classic", value: "urban-classic" },
    { name: "Feminine Touch", value: "feminine-touch" },
  ]

  const seasonOptions = [
    { name: "Spring", value: "spring" },
    { name: "Summer", value: "summer" },
    { name: "Autumn", value: "autumn" },
    { name: "Winter", value: "winter" },
  ]

  const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
    { name: "Newest First", value: "newest" },
    { name: "Best Rating", value: "rating" },
    { name: "Most Popular", value: "popular" },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleArrayFilter = (key: "colors" | "categories" | "brands" | "seasons", value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      colors: [],
      categories: [],
      brands: [],
      seasons: [],
      priceRange: [0, 1000],
      sortBy: "featured",
      showOnSale: false,
      showNew: false,
    })
  }

  const getActiveFilterCount = () => {
    return (
      filters.colors.length +
      filters.categories.length +
      filters.brands.length +
      filters.seasons.length +
      (filters.showOnSale ? 1 : 0) +
      (filters.showNew ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)
    )
  }

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-border pb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h4 className="font-serif font-semibold text-foreground">{title}</h4>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

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
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-serif font-bold text-foreground">Filters</h3>
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {getActiveFilterCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full mb-6 bg-transparent">
                  Clear All Filters
                </Button>
              )}

              <div className="space-y-6">
                {/* Sort By */}
                <div className="border-b border-border pb-6">
                  <h4 className="font-serif font-semibold text-foreground mb-4">Sort By</h4>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Filters */}
                <FilterSection title="Special" sectionKey="special">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={filters.showOnSale}
                        onCheckedChange={(checked) => updateFilter("showOnSale", checked)}
                      />
                      <label htmlFor="on-sale" className="text-sm text-foreground cursor-pointer">
                        On Sale
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-arrivals"
                        checked={filters.showNew}
                        onCheckedChange={(checked) => updateFilter("showNew", checked)}
                      />
                      <label htmlFor="new-arrivals" className="text-sm text-foreground cursor-pointer">
                        New Arrivals
                      </label>
                    </div>
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range" sectionKey="price">
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Colors */}
                <FilterSection title="Colors" sectionKey="colors">
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => toggleArrayFilter("colors", color.value)}
                        className={`w-10 h-10 rounded-full ${color.color} border-2 transition-all ${
                          filters.colors.includes(color.value)
                            ? "border-primary scale-110"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Categories */}
                <FilterSection title="Categories" sectionKey="categories">
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={filters.categories.includes(category.value)}
                          onCheckedChange={() => toggleArrayFilter("categories", category.value)}
                        />
                        <label htmlFor={category.value} className="text-sm text-foreground cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Seasons */}
                <FilterSection title="Seasons" sectionKey="seasons">
                  <div className="grid grid-cols-2 gap-2">
                    {seasonOptions.map((season) => (
                      <Button
                        key={season.value}
                        variant={filters.seasons.includes(season.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayFilter("seasons", season.value)}
                        className="justify-start"
                      >
                        {season.name}
                      </Button>
                    ))}
                  </div>
                </FilterSection>

                {/* Brands */}
                <FilterSection title="Brands" sectionKey="brands">
                  <div className="space-y-2">
                    {brandOptions.map((brand) => (
                      <div key={brand.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand.value}
                          checked={filters.brands.includes(brand.value)}
                          onCheckedChange={() => toggleArrayFilter("brands", brand.value)}
                        />
                        <label htmlFor={brand.value} className="text-sm text-foreground cursor-pointer">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
